import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = `${import.meta.env.VITE_API_KEY}/ws`;
let stompClient = null;
let connectPromise = null;

export const connectWebSocket = () => {
  if (stompClient?.connected) {
    return Promise.resolve(stompClient);
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = new Promise((resolve, reject) => {
    try {
      stompClient = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => console.debug(str)
      });

      stompClient.onConnect = () => {
        console.log('Connected to WebSocket');
        resolve(stompClient);
      };

      stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        reject(new Error('STOMP connection error'));
      };

      stompClient.activate();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      reject(error);
      connectPromise = null;
    }
  });

  return connectPromise;
};

export const subscribeTopic = async (topic, callback) => {
  try {
    await connectWebSocket();

    if (!stompClient?.connected) {
      throw new Error('WebSocket not connected');
    }

    console.log(`Subscribing to ${topic}`);
    return stompClient.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
  } catch (error) {
    console.error('Subscription error:', error);
    throw error; // Để component có thể xử lý lỗi
  }
};

export const disconnectWebSocket = () => {
  if (stompClient?.connected) {
    stompClient.deactivate();
  }
  stompClient = null;
  connectPromise = null;
};
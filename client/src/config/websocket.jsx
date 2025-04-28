import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = `${import.meta.env.VITE_API_KEY}/ws`;
let stompClient = null;

export const connectWebSocket = (onConnect) => {
  if (stompClient && stompClient.connected) {
    if (onConnect) onConnect();
    return stompClient;
  }

  stompClient = new Client({
    // Instead of setting webSocket directly, use webSocketFactory
    webSocketFactory: () => new SockJS(SOCKET_URL),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('Connected to WebSocket');
      if (onConnect) onConnect();
    },
    onDisconnect: () => {
      console.log('Disconnected from WebSocket');
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame);
    },
    // Add debug mode
    debug: (str) => {
      console.debug('STOMP: ' + str);
    }
  });

  try {
    stompClient.activate();
  } catch (error) {
    console.error('Error activating STOMP client:', error);
  }

  return stompClient;
};

export const subscribeTopic = (topic, callback) => {
  try {
    if (!stompClient || !stompClient.connected) {
      console.warn('WebSocket not connected. Attempting to connect...');
      connectWebSocket(() => {
        doSubscribe(topic, callback);
      });
      return null;
    }
    return doSubscribe(topic, callback);
  } catch (error) {
    console.error('Subscription error:', error);
    return null;
  }
};

const doSubscribe = (topic, callback) => {
  console.log(`Subscribing to ${topic}`);
  return stompClient.subscribe(topic, (message) => {
    try {
      const data = JSON.parse(message.body);
      callback(data);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    try {
      stompClient.deactivate();
      stompClient = null;
      console.log('WebSocket disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting WebSocket:', error);
    }
  }
};
package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;
    public void sendMessage(String destination, Object payload) {
        messagingTemplate.convertAndSend(destination, payload);
    }
}

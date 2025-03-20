package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.NotificationResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Notifications;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    NotificationRepository notificationRepository;

    public List<NotificationResponseDTO> getAllNotifications() {
        List<Notifications> notifications = notificationRepository.findAll();
        return notifications.stream()
                .map(notification -> new NotificationResponseDTO(
                        notification.getNotificationId(),
                        notification.getTitle(),
                        notification.getContent()))
                .collect(Collectors.toList());
    }
}

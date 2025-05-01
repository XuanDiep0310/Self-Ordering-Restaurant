package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.NotificationRequestDTO.CreateNotificationRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.NotificationResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Notifications;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Tables;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.NotificationRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final TableRepository tableRepository;
    private final WebSocketService webSocketService;

    private static final String NOTIFICATION_TOPIC = "/topic/notifications";
    private static final String NOTIFICATION_TABLE_TOPIC = "/topic/notifications/table/";

    public List<NotificationResponseDTO> getAllNotifications() {
        List<Notifications> notifications = notificationRepository.findAll();
        return notifications.stream()
                .map(notification -> new NotificationResponseDTO(
                        notification.getNotificationId(),
                        notification.getTable().getTableNumber(),
                        notification.getTitle(),
                        notification.getContent(),
                        notification.getCreatedAt(),
                        notification.isRead()))
                .collect(Collectors.toList());
    }

    public ResponseEntity<?> createNotification(CreateNotificationRequestDTO request) {
            Tables table = tableRepository.findByTableNumber(request.getTableNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

            Notifications notification = new Notifications();
            notification.setTable(table);
            notification.setTitle(request.getTitle());
            notification.setContent(request.getContent());
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);

            Notifications savedNotification = notificationRepository.save(notification);

            ResponseEntity<?> response = ResponseEntity.ok(new NotificationResponseDTO(
                    savedNotification.getNotificationId(),
                    savedNotification.getTable().getTableNumber(),
                    savedNotification.getTitle(),
                    savedNotification.getContent(),
                    savedNotification.getCreatedAt(),
                    savedNotification.isRead()));
        webSocketService.sendMessage(NOTIFICATION_TABLE_TOPIC + table.getTableNumber(), getUnreadNotificationsByTableNumber(table.getTableNumber()));
        webSocketService.sendMessage(NOTIFICATION_TOPIC, getAllNotifications());
        return response;
    }

    public void updateNotificationReadStatus(Integer notificationId, boolean isRead) {
        Notifications notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(isRead);
        notificationRepository.save(notification);
        webSocketService.sendMessage(NOTIFICATION_TABLE_TOPIC + notification.getTable().getTableNumber(), getUnreadNotificationsByTableNumber(notification.getTable().getTableNumber()));
        webSocketService.sendMessage(NOTIFICATION_TOPIC, getAllNotifications());
    }

    public void deleteNotification(Integer notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notificationRepository.deleteById(notificationId);
        webSocketService.sendMessage(NOTIFICATION_TOPIC, getAllNotifications());
    }

    public List<NotificationResponseDTO> getUnreadNotificationsByTableNumber(Integer tableNumber) {
        List<Notifications> notifications = notificationRepository.findByTable_TableNumberAndIsReadFalse(tableNumber);
        return notifications.stream()
                .map(notification -> new NotificationResponseDTO(
                        notification.getNotificationId(),
                        notification.getTable().getTableNumber(),
                        notification.getTitle(),
                        notification.getContent(),
                        notification.getCreatedAt(),
                        notification.isRead()))
                .collect(Collectors.toList());
    }
}

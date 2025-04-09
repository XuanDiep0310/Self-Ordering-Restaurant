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

            return ResponseEntity.ok(new NotificationResponseDTO(
                    savedNotification.getNotificationId(),
                    savedNotification.getTable().getTableNumber(),
                    savedNotification.getTitle(),
                    savedNotification.getContent(),
                    savedNotification.getCreatedAt(),
                    savedNotification.isRead()));
    }

    public void updateNotificationReadStatus(Integer notificationId, boolean isRead) {
        Notifications notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(isRead);
        notificationRepository.save(notification);
    }

    public void deleteNotification(Integer notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notificationRepository.deleteById(notificationId);
    }
}

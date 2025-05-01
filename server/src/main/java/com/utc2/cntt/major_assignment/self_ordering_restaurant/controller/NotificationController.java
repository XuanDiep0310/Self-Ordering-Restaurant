package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.NotificationRequestDTO.CreateNotificationRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.NotificationResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody CreateNotificationRequestDTO request) {
        return notificationService.createNotification(request);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> updateReadStatus(
            @PathVariable Integer notificationId,
            @RequestBody Map<String, Boolean> payload) {

        Boolean isRead = payload.get("isRead");
        if (isRead == null) {
            return ResponseEntity.badRequest().body("isRead field is required");
        }

        notificationService.updateNotificationReadStatus(notificationId, isRead);
        return ResponseEntity.ok("Notification status updated");
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Integer notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok("Notification deleted successfully");
    }

    @GetMapping("/table/{tableNumber}/unread")
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotificationsByTableNumber(@PathVariable Integer tableNumber) {
        return ResponseEntity.ok(notificationService.getUnreadNotificationsByTableNumber(tableNumber));
    }
}

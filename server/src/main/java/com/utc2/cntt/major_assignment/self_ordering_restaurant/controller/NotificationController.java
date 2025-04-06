package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.NotificationRequestDTO.CreateNotificationRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.NotificationResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> markAsRead(@PathVariable Integer notificationId) {
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok("Marked as read");
    }
}

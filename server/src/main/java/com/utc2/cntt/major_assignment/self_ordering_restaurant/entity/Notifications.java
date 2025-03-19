package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications")
@Getter
@Setter
public class Notifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Notification_ID")
    private Integer notificationId;

    @ManyToOne
    @JoinColumn(name = "User_ID")
    private Users user;

    @Column(name = "Title")
    private String title;

    @Column(name = "Content")
    private String content;

    @Column(name = "ExpiryDate")
    private LocalDateTime expiryDate;

    @Column(name = "CreateAt")
    private LocalDateTime createdAt;

    @Column(name = "IsRead")
    private boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "Type")
    private NotificationType type;
}

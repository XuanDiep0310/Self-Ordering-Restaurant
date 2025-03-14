package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.UserStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.UserType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "User_ID")
    private Integer userId;

    @Column(name = "Username", unique = true, nullable = false)
    private String username;

    @Column(name = "Password")
    private String password;

    @Column(name = "GoogleID", unique = true)
    private String googleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "UserType", nullable = false)
    private UserType userType;

    @Column(name = "Email", unique = true, nullable = false)
    private String email;

    @Column(name = "Phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", columnDefinition = "ENUM('Active', 'Inactive', 'Pending') DEFAULT 'Active'")
    private UserStatus status = UserStatus.Active;

    @Column(name = "CreateAt", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createAt = LocalDateTime.now();

    @Column(name = "LastLogin")
    private LocalDateTime lastLogin;

    @OneToMany(mappedBy = "user")
    private Set<Notifications> listNotification;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Staff staff;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Customers customer;

}

package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.FeedbackStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "CustomerFeedback")
@Getter
@Setter
public class CustomerFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Feedback_ID")
    private int feedbackId;

    @ManyToOne
    @JoinColumn(name = "Customer_ID", nullable = false)
    private Customers customer;

    @ManyToOne
    @JoinColumn(name = "Order_ID", nullable = false)
    private Orders order;

    @Column(name = "Rating", nullable = false)
    @Min(1)
    @Max(5)
    private int rating; // Giá trị từ 1 đến 5

    @Column(name = "Comment")
    private String comment;

    @Column(name = "FeedbackDate", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime feedbackDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private FeedbackStatus status;

    public void setRating(Integer rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        this.rating = rating;
    }
}

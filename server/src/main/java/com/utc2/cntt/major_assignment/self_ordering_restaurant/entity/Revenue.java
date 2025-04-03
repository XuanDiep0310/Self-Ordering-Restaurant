package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Revenue")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Revenue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Revenue_ID")
    private Long revenueId;

    @Column(name = "Date", nullable = false, unique = true)
    private LocalDate date;

    @Column(name = "TotalRevenue", precision = 12, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "TotalOrders")
    private Integer totalOrders = 0;

    @Column(name = "TotalCustomers")
    private Integer totalCustomers = 0;

    @Column(name = "FoodRevenue", precision = 10, scale = 2)
    private BigDecimal foodRevenue = BigDecimal.ZERO;

    @Column(name = "DrinkRevenue", precision = 10, scale = 2)
    private BigDecimal drinkRevenue = BigDecimal.ZERO;

    @Column(name = "OtherRevenue", precision = 10, scale = 2)
    private BigDecimal otherRevenue = BigDecimal.ZERO;

    @Column(name = "TotalDiscount", precision = 10, scale = 2)
    private BigDecimal totalDiscount = BigDecimal.ZERO;

    // Vì NetRevenue là trường được tự động tính toán từ cơ sở dữ liệu,
    // ta nên thêm method để tính toán trong Java
    @Transient // Không lưu vào cơ sở dữ liệu
    public BigDecimal getNetRevenue() {
        return totalRevenue.subtract(totalDiscount);
    }

    // Tương tự cho AverageOrderValue
    @Transient
    public BigDecimal getAverageOrderValue() {
        if (totalOrders == null || totalOrders == 0) {
            return BigDecimal.ZERO;
        }
        return totalRevenue.divide(new BigDecimal(totalOrders), 2, BigDecimal.ROUND_HALF_UP);
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Staff_ID")
    private Staff staff;

    @Column(name = "Notes")
    private String notes;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    // Pre-persist và Pre-update hooks để tự động cập nhật timestamps
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


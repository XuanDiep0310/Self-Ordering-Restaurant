package com.utc2.cntt.major_assignment.self_ordering_restaurant.repository;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notifications, Integer> {
    List<Notifications> findByTable_TableNumberAndIsReadFalse(Integer tableNumber);
}

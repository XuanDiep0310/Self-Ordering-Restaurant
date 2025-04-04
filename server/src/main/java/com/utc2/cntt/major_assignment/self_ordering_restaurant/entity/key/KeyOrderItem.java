package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.key;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KeyOrderItem implements Serializable {
    private Integer orderId;
    private Integer dishId;
}

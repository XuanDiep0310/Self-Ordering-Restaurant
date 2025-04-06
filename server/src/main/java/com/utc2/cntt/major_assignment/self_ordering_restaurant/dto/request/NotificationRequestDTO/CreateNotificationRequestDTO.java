package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.NotificationRequestDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateNotificationRequestDTO {
    private Integer tableNumber;
    private String title;
    private String content;
}

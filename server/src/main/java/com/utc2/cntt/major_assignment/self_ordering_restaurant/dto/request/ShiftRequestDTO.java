package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShiftRequestDTO {
    private String name;
    private LocalTime startTime;
    private LocalTime endTime;
}

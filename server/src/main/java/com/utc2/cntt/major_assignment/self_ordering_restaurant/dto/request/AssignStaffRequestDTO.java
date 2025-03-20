package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignStaffRequestDTO {
    private Integer staffId;
    private Integer shiftId;
    private LocalDate date;
}

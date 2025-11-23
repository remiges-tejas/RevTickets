package com.revtickets.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CreateBookingRequest {

    @NotNull(message = "Show time ID is required")
    private Long showTimeId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<Long> seatIds;
}

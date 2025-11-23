package com.revtickets.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateReviewRequest {

    @NotNull(message = "Movie ID is required")
    private Long movieId;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private int rating;

    @Size(max = 100, message = "Title must be at most 100 characters")
    private String title;

    @NotBlank(message = "Review content is required")
    @Size(max = 1000, message = "Review must be at most 1000 characters")
    private String content;
}

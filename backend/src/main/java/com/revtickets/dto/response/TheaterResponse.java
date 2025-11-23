package com.revtickets.dto.response;

import com.revtickets.entity.mysql.Theater;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterResponse {

    private Long id;
    private String name;
    private String city;
    private String area;
    private String address;
    private String amenities;
    private String contactNumber;
    private List<ScreenResponse> screens;

    public static TheaterResponse fromEntity(Theater theater) {
        return TheaterResponse.builder()
                .id(theater.getId())
                .name(theater.getName())
                .city(theater.getCity())
                .area(theater.getArea())
                .address(theater.getAddress())
                .amenities(theater.getAmenities())
                .contactNumber(theater.getContactNumber())
                .screens(theater.getScreens() != null ?
                        theater.getScreens().stream()
                                .map(ScreenResponse::fromEntity)
                                .collect(Collectors.toList()) : null)
                .build();
    }
}

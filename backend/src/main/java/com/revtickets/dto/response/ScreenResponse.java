package com.revtickets.dto.response;

import com.revtickets.entity.mysql.Screen;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreenResponse {

    private Long id;
    private String name;
    private Integer totalSeats;
    private String screenType;
    private String soundSystem;

    public static ScreenResponse fromEntity(Screen screen) {
        return ScreenResponse.builder()
                .id(screen.getId())
                .name(screen.getName())
                .totalSeats(screen.getTotalSeats())
                .screenType(screen.getScreenType())
                .soundSystem(screen.getSoundSystem())
                .build();
    }
}

package com.revtickets.service;

import com.revtickets.dto.request.TheaterRequest;
import com.revtickets.dto.response.TheaterResponse;
import com.revtickets.entity.mysql.Theater;
import com.revtickets.exception.BadRequestException;
import com.revtickets.exception.ResourceNotFoundException;
import com.revtickets.repository.mysql.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheaterService {

    private final TheaterRepository theaterRepository;

    public List<TheaterResponse> getAllTheaters() {
        return theaterRepository.findByIsActiveTrue().stream()
                .map(TheaterResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TheaterResponse> getTheatersByCity(String city) {
        return theaterRepository.findActiveByCityIgnoreCase(city).stream()
                .map(TheaterResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TheaterResponse getTheaterById(Long id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater", "id", id));
        return TheaterResponse.fromEntity(theater);
    }

    public Theater getTheaterEntity(Long id) {
        return theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater", "id", id));
    }

    public List<String> getAvailableCities() {
        return theaterRepository.findDistinctCities();
    }

    public List<TheaterResponse> searchTheaters(String query) {
        return theaterRepository.searchTheaters(query).stream()
                .map(TheaterResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public TheaterResponse createTheater(TheaterRequest request) {
        if (theaterRepository.existsByNameAndCity(request.getName(), request.getCity())) {
            throw new BadRequestException("Theater with this name already exists in this city");
        }

        Theater theater = Theater.builder()
                .name(request.getName())
                .city(request.getCity())
                .area(request.getArea())
                .address(request.getAddress())
                .amenities(request.getAmenities())
                .contactNumber(request.getContactNumber())
                .isActive(true)
                .build();

        theater = theaterRepository.save(theater);
        return TheaterResponse.fromEntity(theater);
    }

    @Transactional
    public TheaterResponse updateTheater(Long id, TheaterRequest request) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater", "id", id));

        theater.setName(request.getName());
        theater.setCity(request.getCity());
        theater.setArea(request.getArea());
        theater.setAddress(request.getAddress());
        theater.setAmenities(request.getAmenities());
        theater.setContactNumber(request.getContactNumber());

        theater = theaterRepository.save(theater);
        return TheaterResponse.fromEntity(theater);
    }

    @Transactional
    public void deleteTheater(Long id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater", "id", id));
        theater.setActive(false);
        theaterRepository.save(theater);
    }
}

package com.revtickets.repository.mongodb;

import com.revtickets.entity.mongodb.MovieReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovieReviewRepository extends MongoRepository<MovieReview, String> {

    Page<MovieReview> findByMovieIdOrderByCreatedAtDesc(Long movieId, Pageable pageable);

    List<MovieReview> findByMovieIdAndFlaggedFalseOrderByLikesCountDesc(Long movieId);

    Optional<MovieReview> findByMovieIdAndUserId(Long movieId, Long userId);

    boolean existsByMovieIdAndUserId(Long movieId, Long userId);

    List<MovieReview> findByUserId(Long userId);

    @Query(value = "{ 'movieId': ?0, 'flagged': false }", count = true)
    long countByMovieId(Long movieId);

    @Query("{ 'movieId': ?0, 'flagged': false }")
    List<MovieReview> findAllByMovieIdForRating(Long movieId);

    List<MovieReview> findByFlaggedTrue();

    void deleteByMovieIdAndUserId(Long movieId, Long userId);
}

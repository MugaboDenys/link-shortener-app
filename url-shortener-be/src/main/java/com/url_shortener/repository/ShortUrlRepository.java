package com.url_shortener.repository;

import com.url_shortener.model.ShortUrl;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ShortUrlRepository extends JpaRepository<ShortUrl, Long> {
    Optional<ShortUrl> findByShortCode(String shortCode);
    List<ShortUrl> findAllByUserId(Long userId);
    
    @Modifying
    @Query("UPDATE ShortUrl s SET s.clicks = s.clicks + 1 WHERE s.shortCode = :shortCode")
    void incrementClicks(@Param("shortCode") String shortCode);

    @Query("SELECT s FROM ShortUrl s ORDER BY s.clicks DESC")
    List<ShortUrl> findTopShortUrls(Pageable pageable);


}
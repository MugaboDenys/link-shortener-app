package com.url_shortener.service;

import com.url_shortener.model.ShortUrl;
import com.url_shortener.model.User;
import com.url_shortener.repository.ShortUrlRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class URLShortenerService {

    private static final String BASE_URL = "http://localhost:8080/api/";
    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int SHORT_URL_LENGTH = 6;
    private final Random random = new Random();

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    public String shortenURL(String longURL, User user) {
        String shortCode = generateShortCode();
        ShortUrl shortUrl = new ShortUrl(shortCode, longURL, LocalDateTime.now(), user);
        shortUrlRepository.save(shortUrl);
        return BASE_URL + shortCode;
    }

    private String generateShortCode() {
        StringBuilder sb = new StringBuilder(SHORT_URL_LENGTH);
        for (int i = 0; i < SHORT_URL_LENGTH; i++) {
            sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}

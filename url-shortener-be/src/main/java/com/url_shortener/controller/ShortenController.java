package com.url_shortener.controller;

import com.url_shortener.model.User;
import com.url_shortener.repository.UserRepository;
import com.url_shortener.service.URLShortenerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/shorten")
public class ShortenController {

    private final URLShortenerService urlShortenerService;
    private final UserRepository userRepository;

    public ShortenController(URLShortenerService urlShortenerService, UserRepository userRepository) {
        this.urlShortenerService = urlShortenerService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> shortenURL(@RequestBody Map<String, String> request) {
        // Get the current authenticated user's email
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        // Extract the long URL from the request
        String longURL = request.get("longURL");

        // Shorten the URL
        String shortURL = urlShortenerService.shortenURL(longURL, user);

        // Respond with the shortened URL and the email of the authenticated user
        return ResponseEntity.ok(Map.of(
                "email", email,
                "shortURL", shortURL
        ));
    }
}

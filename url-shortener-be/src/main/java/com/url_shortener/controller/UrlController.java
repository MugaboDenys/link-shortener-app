package com.url_shortener.controller;

import com.url_shortener.model.ShortUrl;
import com.url_shortener.model.User;
import com.url_shortener.repository.ShortUrlRepository;
import com.url_shortener.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UrlController {
    private static final Logger logger = LoggerFactory.getLogger(UrlController.class);

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{shortUrl}")
    @ResponseStatus(HttpStatus.FOUND)  // HTTP 302 Redirect
    @Transactional
    public void redirect(@PathVariable("shortUrl") String shortUrl, HttpServletResponse response) {

        // Find the URL by short code
        Optional<ShortUrl> optionalShortUrl = shortUrlRepository.findByShortCode(shortUrl);

        if (optionalShortUrl.isPresent()) {
            ShortUrl shortUrl1 = optionalShortUrl.get();
            String longUrl = shortUrl1.getLongUrl();
            try {
                response.sendRedirect(longUrl);
                shortUrlRepository.incrementClicks(shortUrl);
            } catch (IOException e) {
                logger.error("Error while redirecting to: {}", longUrl, e);
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        } else {
            logger.warn("Short URL not found: {}", shortUrl);
            // If the short URL does not exist, return 404
            response.setStatus(HttpStatus.NOT_FOUND.value());
        }
    }

    @GetMapping("/{shortUrl}/clicks")
    public ResponseEntity<?> getClickCount(@PathVariable String shortUrl) {
        return shortUrlRepository.findByShortCode(shortUrl)
                .map(url -> ResponseEntity.ok(Map.of("shortUrl", shortUrl, "clicks", url.getClicks())))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Short URL not found")));
    }

    @GetMapping("/analytics/top")
    public ResponseEntity<List<ShortUrl>> getTopShortUrls(@RequestParam(defaultValue = "10") int limit) {
        logger.info("Fetching top {} short URLs", limit);
        List<ShortUrl> topUrls = shortUrlRepository.findTopShortUrls(PageRequest.of(0, limit));
        return ResponseEntity.ok(topUrls);
    }   



    @GetMapping("/urls")
    public ResponseEntity<List<ShortUrl>> getUserUrls() {
        // Get the authenticated user's email
        logger.info("Fetching URLs for user");
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        logger.info("Fetching URLs for user with email: {}", email);
        User user = userRepository.findByEmail(email).orElseThrow();
    
        // Fetch URLs belonging to this user
        List<ShortUrl> urls = shortUrlRepository.findAllByUserId(user.getId());
        return ResponseEntity.ok(urls);
    }
    
}
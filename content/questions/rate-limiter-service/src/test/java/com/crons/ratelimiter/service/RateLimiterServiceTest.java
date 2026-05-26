package com.crons.ratelimiter.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RateLimiterServiceTest {

    @Test
    void allowsRequestsUpToLimit() {
        RateLimiterService limiter = new RateLimiterService(3);
        assertTrue(limiter.allowRequest());
        assertTrue(limiter.allowRequest());
        assertTrue(limiter.allowRequest());
        assertFalse(limiter.allowRequest());
    }

    @Test
    void resetClearsCount() {
        RateLimiterService limiter = new RateLimiterService(2);
        assertTrue(limiter.allowRequest());
        assertTrue(limiter.allowRequest());
        assertFalse(limiter.allowRequest());
        limiter.reset();
        assertTrue(limiter.allowRequest());
    }
}

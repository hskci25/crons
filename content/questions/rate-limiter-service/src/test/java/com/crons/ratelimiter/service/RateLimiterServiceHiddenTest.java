package com.crons.ratelimiter.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RateLimiterServiceHiddenTest {

    @Test
    void limitOfOneAllowsSingleRequest() {
        RateLimiterService limiter = new RateLimiterService(1);
        assertTrue(limiter.allowRequest());
        assertFalse(limiter.allowRequest());
    }
}

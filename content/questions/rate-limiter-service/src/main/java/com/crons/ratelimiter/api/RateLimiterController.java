package com.crons.ratelimiter.api;

import com.crons.ratelimiter.service.RateLimiterService;

public class RateLimiterController {

    private final RateLimiterService service = new RateLimiterService();

    public boolean allowRequest() {
        return service.allowRequest();
    }
}

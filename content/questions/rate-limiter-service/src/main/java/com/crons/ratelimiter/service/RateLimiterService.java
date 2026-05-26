package com.crons.ratelimiter.service;

public class RateLimiterService {

    private int requestCount = 0;
    private final int maxRequests;

    public RateLimiterService() {
        this(10);
    }

    public RateLimiterService(int maxRequests) {
        this.maxRequests = maxRequests;
    }

    /** Returns true if the request is allowed under the limit. */
    public boolean allowRequest() {
        // BUG: uses > instead of >= — allows one extra request past the limit
        if (requestCount > maxRequests) {
            return false;
        }
        requestCount++;
        return true;
    }

    public void reset() {
        requestCount = 0;
    }
}

package com.crons.usersearch.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserSearchServiceHiddenTest {

    private final UserSearchService service = new UserSearchService();

    @Test
    void emptyPrefixReturnsEmpty() {
        assertTrue(service.findByPrefix("").isEmpty());
    }

    @Test
    void noMatchReturnsEmpty() {
        assertTrue(service.findByPrefix("zzz").isEmpty());
    }
}

package com.crons.usersearch.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserSearchServiceTest {

    private final UserSearchService service = new UserSearchService();

    @Test
    void findsAlPrefixMatches() {
        assertEquals(List.of("alice", "alicia"), service.findByPrefix("al"));
    }

    @Test
    void caseInsensitive() {
        assertEquals(List.of("bob"), service.findByPrefix("BO"));
    }
}

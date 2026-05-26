package com.crons.pagination.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PaginationServiceHiddenTest {

    private final PaginationService service = new PaginationService();

    @Test
    void lastPartialPage() {
        List<Integer> all = List.of(1, 2, 3, 4, 5);
        assertEquals(List.of(5), service.page(all, 3, 2));
    }

    @Test
    void pageBeyondEndReturnsEmpty() {
        assertTrue(service.page(List.of(1, 2), 5, 2).isEmpty());
    }
}

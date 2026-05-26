package com.crons.pagination.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PaginationServiceTest {

    private final PaginationService service = new PaginationService();

    @Test
    void firstPage() {
        List<String> all = List.of("a", "b", "c", "d", "e");
        assertEquals(List.of("a", "b"), service.page(all, 1, 2));
    }

    @Test
    void secondPage() {
        List<String> all = List.of("a", "b", "c", "d", "e");
        assertEquals(List.of("c", "d"), service.page(all, 2, 2));
    }
}

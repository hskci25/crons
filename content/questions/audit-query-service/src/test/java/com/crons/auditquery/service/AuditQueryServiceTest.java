package com.crons.auditquery.service;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AuditQueryServiceTest {

    private final AuditQueryService service = new AuditQueryService();

    @Test
    void singleDayRange() {
        assertEquals(List.of("e1"),
            service.eventIdsBetween(LocalDate.of(2024, 1, 5), LocalDate.of(2024, 1, 5)));
    }

    @Test
    void monthRange() {
        assertEquals(List.of("e1", "e2"),
            service.eventIdsBetween(LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 31)));
    }
}

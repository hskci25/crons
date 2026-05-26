package com.crons.auditquery.service;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class AuditQueryServiceHiddenTest {

    private final AuditQueryService service = new AuditQueryService();

    @Test
    void invalidRangeReturnsEmpty() {
        assertTrue(service.eventIdsBetween(LocalDate.of(2024, 2, 1), LocalDate.of(2024, 1, 1)).isEmpty());
    }

    @Test
    void nullDatesReturnEmpty() {
        assertTrue(service.eventIdsBetween(null, LocalDate.now()).isEmpty());
    }
}

package com.crons.auditquery.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class AuditQueryService {

    private static final List<Map<String, Object>> EVENTS = List.of(
        Map.of("id", "e1", "day", LocalDate.of(2024, 1, 5)),
        Map.of("id", "e2", "day", LocalDate.of(2024, 1, 15)),
        Map.of("id", "e3", "day", LocalDate.of(2024, 2, 1))
    );

    /** Inclusive date range [from, to]. */
    public List<String> eventIdsBetween(LocalDate from, LocalDate to) {
        throw new UnsupportedOperationException("Not implemented");
    }
}

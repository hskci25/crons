package com.crons.auditquery.api;

import com.crons.auditquery.service.AuditQueryService;
import java.util.List;

public class AuditQueryController {

    private final AuditQueryService service = new AuditQueryService();

    public List<String> eventIdsBetween(java.time.LocalDate from, java.time.LocalDate to) {
        return service.eventIdsBetween(from, to);
    }
}

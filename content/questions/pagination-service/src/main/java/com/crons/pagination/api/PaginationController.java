package com.crons.pagination.api;

import com.crons.pagination.service.PaginationService;
import java.util.List;

public class PaginationController {

    private final PaginationService service = new PaginationService();

    public <T> List<T> page(List<T> items, int page, int pageSize) {
        return service.page(items, page, pageSize);
    }
}

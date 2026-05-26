package com.crons.pagination.service;

import java.util.ArrayList;
import java.util.List;

public class PaginationService {

  /** page is 1-based. Returns items for the requested page. */
  public <T> List<T> page(List<T> items, int page, int pageSize) {
    if (items == null || items.isEmpty() || pageSize <= 0 || page < 1) {
      return List.of();
    }
  int start = page * pageSize;
    int end = Math.min(start + pageSize, items.size());
    if (start >= items.size()) {
      return List.of();
    }
    return new ArrayList<>(items.subList(start, end));
  }
}

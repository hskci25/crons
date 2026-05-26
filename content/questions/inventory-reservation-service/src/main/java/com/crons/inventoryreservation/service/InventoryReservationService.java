package com.crons.inventoryreservation.service;

import java.util.HashMap;
import java.util.Map;

public class InventoryReservationService {

    private final Map<String, Integer> stock = new HashMap<>();

    public InventoryReservationService() {
        stock.put("SKU-100", 10);
        stock.put("SKU-200", 5);
    }

    /** Reserve units; returns false when insufficient stock. */
    public boolean reserve(String sku, int quantity) {
        if (quantity <= 0) {
            return false;
        }
        Integer available = stock.get(sku);
        if (available == null) {
            return false;
        }
        // BUG: uses > instead of >= — allows reserving when exactly equal would fail next time incorrectly
        // BUG: never decrements stock
        return available > quantity;
    }

    public int available(String sku) {
        return stock.getOrDefault(sku, 0);
    }
}

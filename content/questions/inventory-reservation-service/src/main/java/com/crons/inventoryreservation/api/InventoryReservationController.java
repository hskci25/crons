package com.crons.inventoryreservation.api;

import com.crons.inventoryreservation.service.InventoryReservationService;

public class InventoryReservationController {

    private final InventoryReservationService service = new InventoryReservationService();

    public boolean reserve(String sku, int quantity) {
        return service.reserve(sku, quantity);
    }

    public int available(String sku) {
        return service.available(sku);
    }
}

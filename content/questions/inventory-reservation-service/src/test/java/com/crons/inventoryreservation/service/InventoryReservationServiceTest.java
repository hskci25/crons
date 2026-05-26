package com.crons.inventoryreservation.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InventoryReservationServiceTest {

    private final InventoryReservationService service = new InventoryReservationService();

    @Test
    void reservesWhenStockIsSufficient() {
        assertTrue(service.reserve("SKU-100", 3));
        assertEquals(7, service.available("SKU-100"));
    }

    @Test
    void rejectsWhenStockIsInsufficient() {
        assertFalse(service.reserve("SKU-200", 10));
        assertEquals(5, service.available("SKU-200"));
    }
}

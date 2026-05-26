package com.crons.inventoryreservation.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InventoryReservationServiceHiddenTest {

    private final InventoryReservationService service = new InventoryReservationService();

    @Test
    void reservesExactRemainingQuantity() {
        assertTrue(service.reserve("SKU-100", 10));
        assertEquals(0, service.available("SKU-100"));
        assertFalse(service.reserve("SKU-100", 1));
    }

    @Test
    void rejectsUnknownSku() {
        assertFalse(service.reserve("SKU-999", 1));
    }
}

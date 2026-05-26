package com.crons.ordertotal.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderTotalServiceHiddenTest {

    private final OrderTotalService service = new OrderTotalService();

    @Test
    void roundsTax() {
        assertEquals(33, service.totalWithTaxCents(31));
    }

    @Test
    void rejectsNegative() {
        assertThrows(IllegalArgumentException.class, () -> service.totalWithTaxCents(-1));
    }
}

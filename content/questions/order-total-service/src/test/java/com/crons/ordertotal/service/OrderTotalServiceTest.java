package com.crons.ordertotal.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderTotalServiceTest {

    private final OrderTotalService service = new OrderTotalService();

    @Test
    void addsEightPercentTax() {
        assertEquals(1080, service.totalWithTaxCents(1000));
    }

    @Test
    void zeroSubtotal() {
        assertEquals(0, service.totalWithTaxCents(0));
    }
}

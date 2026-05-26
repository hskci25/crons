package com.crons.discountcalculator.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DiscountCalculatorServiceHiddenTest {

    private final DiscountCalculatorService service = new DiscountCalculatorService();

    @Test
    void twentyPercentAtOneHundredDollars() {
        assertEquals(8000, service.applyDiscountCents(10000));
    }

    @Test
    void rejectsNegativeSubtotal() {
        assertThrows(IllegalArgumentException.class, () -> service.applyDiscountCents(-1));
    }
}

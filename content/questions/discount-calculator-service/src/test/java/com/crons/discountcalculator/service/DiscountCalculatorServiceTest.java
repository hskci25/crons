package com.crons.discountcalculator.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DiscountCalculatorServiceTest {

    private final DiscountCalculatorService service = new DiscountCalculatorService();

    @Test
    void noDiscountUnderFiftyDollars() {
        assertEquals(4999, service.applyDiscountCents(4999));
    }

    @Test
    void tenPercentAtFiftyDollars() {
        assertEquals(4500, service.applyDiscountCents(5000));
    }
}

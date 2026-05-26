package com.crons.discountcalculator.api;

import com.crons.discountcalculator.service.DiscountCalculatorService;

public class DiscountCalculatorController {

    private final DiscountCalculatorService service = new DiscountCalculatorService();

    public long applyDiscountCents(long subtotalCents) {
        return service.applyDiscountCents(subtotalCents);
    }
}

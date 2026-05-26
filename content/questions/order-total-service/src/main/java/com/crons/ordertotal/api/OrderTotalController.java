package com.crons.ordertotal.api;

import com.crons.ordertotal.service.OrderTotalService;

public class OrderTotalController {

    private final OrderTotalService service = new OrderTotalService();

    public long totalWithTaxCents(long subtotalCents) {
        return service.totalWithTaxCents(subtotalCents);
    }
}

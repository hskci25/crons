package com.crons.pairmatch.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

class PairMatchServiceHiddenTest {

    private final PairMatchService service = new PairMatchService();

    @Test
    void handlesNegativeValues() {
        int[] values = { -1, -2, -3, -4, -5 };
        assertArrayEquals(new int[] { 2, 4 }, service.findPairIndices(values, -8));
    }

    @Test
    void handlesDuplicateValues() {
        int[] values = { 3, 3 };
        assertArrayEquals(new int[] { 0, 1 }, service.findPairIndices(values, 6));
    }
}

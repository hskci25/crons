package com.crons.pairmatch.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

class PairMatchServiceTest {

    private final PairMatchService service = new PairMatchService();

    @Test
    void findsPairForSampleLedger() {
        int[] values = { 2, 7, 11, 15 };
        assertArrayEquals(new int[] { 0, 1 }, service.findPairIndices(values, 9));
    }

    @Test
    void findsPairWhenMatchIsNotFirstTwoSlots() {
        int[] values = { 3, 2, 4 };
        assertArrayEquals(new int[] { 1, 2 }, service.findPairIndices(values, 6));
    }
}

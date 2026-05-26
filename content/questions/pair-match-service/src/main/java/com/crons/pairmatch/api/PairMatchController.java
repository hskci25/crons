package com.crons.pairmatch.api;

import com.crons.pairmatch.service.PairMatchService;

public class PairMatchController {

    private final PairMatchService pairMatchService = new PairMatchService();

    public int[] match(int[] values, int targetSum) {
        return pairMatchService.findPairIndices(values, targetSum);
    }
}

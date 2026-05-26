package app;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SolutionHiddenTest {
    @Test
    void negativeNumbers() {
        Solution s = new Solution();
        int[] out = s.twoSum(new int[] { -1, -2, -3, -4, -5 }, -8);
        assertArrayEquals(new int[] { 2, 4 }, out);
    }

    @Test
    void duplicateValues() {
        Solution s = new Solution();
        int[] out = s.twoSum(new int[] { 3, 3 }, 6);
        assertArrayEquals(new int[] { 0, 1 }, out);
    }
}

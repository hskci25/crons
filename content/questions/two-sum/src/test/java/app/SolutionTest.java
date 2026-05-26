package app;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SolutionTest {
    @Test
    void exampleOne() {
        Solution s = new Solution();
        int[] out = s.twoSum(new int[] { 2, 7, 11, 15 }, 9);
        assertArrayEquals(new int[] { 0, 1 }, out);
    }

    @Test
    void exampleTwo() {
        Solution s = new Solution();
        int[] out = s.twoSum(new int[] { 3, 2, 4 }, 6);
        assertArrayEquals(new int[] { 1, 2 }, out);
    }
}

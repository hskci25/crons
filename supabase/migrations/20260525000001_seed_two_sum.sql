-- Seed Two Sum question (run after schema migration)

insert into public.questions (id, slug, title, difficulty, tags, language, spec_md, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000001',
  'two-sum',
  'Two Sum',
  'easy',
  array['array', 'hash-table'],
  'java',
  E'# Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n## Examples\n\n**Input:** `nums = [2, 7, 11, 15]`, `target = 9`  \n**Output:** `[0, 1]`\n\n**Input:** `nums = [3, 2, 4]`, `target = 6`  \n**Output:** `[1, 2]`\n\n## Constraints\n\n- `2 <= nums.length <= 10^4`\n- Only one valid answer exists.\n\n## Your task\n\nImplement `twoSum` in `src/main/java/app/Solution.java`.',
  45,
  true
)
on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'src/main/java/app/Solution.java',
    E'package app;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // TODO: implement\n        return new int[] { 0, 0 };\n    }\n}\n',
    'starter'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'src/test/java/app/SolutionTest.java',
    E'package app;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass SolutionTest {\n    @Test\n    void exampleOne() {\n        Solution s = new Solution();\n        int[] out = s.twoSum(new int[] { 2, 7, 11, 15 }, 9);\n        assertArrayEquals(new int[] { 0, 1 }, out);\n    }\n    @Test\n    void exampleTwo() {\n        Solution s = new Solution();\n        int[] out = s.twoSum(new int[] { 3, 2, 4 }, 6);\n        assertArrayEquals(new int[] { 1, 2 }, out);\n    }\n}\n',
    'readonly'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'src/test/java/app/SolutionHiddenTest.java',
    E'package app;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass SolutionHiddenTest {\n    @Test\n    void negativeNumbers() {\n        Solution s = new Solution();\n        int[] out = s.twoSum(new int[] { -1, -2, -3, -4, -5 }, -8);\n        assertArrayEquals(new int[] { 2, 4 }, out);\n    }\n    @Test\n    void duplicateValues() {\n        Solution s = new Solution();\n        int[] out = s.twoSum(new int[] { 3, 3 }, 6);\n        assertArrayEquals(new int[] { 0, 1 }, out);\n    }\n}\n',
    'hidden_test'
  )
on conflict (question_id, path) do nothing;

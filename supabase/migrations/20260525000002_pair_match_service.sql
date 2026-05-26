-- Replace leetcode-style two-sum with Spring-style repo challenge (no spec text)

update public.questions
set
  slug = 'pair-match-service',
  title = 'pair-match-service',
  difficulty = 'medium',
  tags = array['spring', 'java', 'debugging'],
  spec_md = '',
  language = 'java'
where id = '00000000-0000-4000-8000-000000000001';

delete from public.question_files
where question_id = '00000000-0000-4000-8000-000000000001';

insert into public.question_files (question_id, path, content, kind)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'pom.xml',
    E'<?xml version="1.0" encoding="UTF-8"?>\n<project xmlns="http://maven.apache.org/POM/4.0.0"\n         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">\n  <modelVersion>4.0.0</modelVersion>\n  <groupId>com.crons</groupId>\n  <artifactId>pair-match-service</artifactId>\n  <version>0.0.1-SNAPSHOT</version>\n  <name>pair-match-service</name>\n  <properties>\n    <java.version>17</java.version>\n  </properties>\n</project>\n',
    'readonly'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'src/main/java/com/crons/pairmatch/PairMatchApplication.java',
    E'package com.crons.pairmatch;\n\npublic class PairMatchApplication {\n    public static void main(String[] args) {\n    }\n}\n',
    'readonly'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'src/main/java/com/crons/pairmatch/api/PairMatchController.java',
    E'package com.crons.pairmatch.api;\n\nimport com.crons.pairmatch.service.PairMatchService;\n\npublic class PairMatchController {\n    private final PairMatchService pairMatchService = new PairMatchService();\n    public int[] match(int[] values, int targetSum) {\n        return pairMatchService.findPairIndices(values, targetSum);\n    }\n}\n',
    'readonly'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'src/main/java/com/crons/pairmatch/service/PairMatchService.java',
    E'package com.crons.pairmatch.service;\n\npublic class PairMatchService {\n    public int[] findPairIndices(int[] values, int targetSum) {\n        return new int[] { 0, 0 };\n    }\n}\n',
    'starter'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'src/test/java/com/crons/pairmatch/service/PairMatchServiceTest.java',
    E'package com.crons.pairmatch.service;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.assertArrayEquals;\n\nclass PairMatchServiceTest {\n    private final PairMatchService service = new PairMatchService();\n    @Test\n    void findsPairForSampleLedger() {\n        assertArrayEquals(new int[] { 0, 1 }, service.findPairIndices(new int[] { 2, 7, 11, 15 }, 9));\n    }\n    @Test\n    void findsPairWhenMatchIsNotFirstTwoSlots() {\n        assertArrayEquals(new int[] { 1, 2 }, service.findPairIndices(new int[] { 3, 2, 4 }, 6));\n    }\n}\n',
    'readonly'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'src/test/java/com/crons/pairmatch/service/PairMatchServiceHiddenTest.java',
    E'package com.crons.pairmatch.service;\n\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.assertArrayEquals;\n\nclass PairMatchServiceHiddenTest {\n    private final PairMatchService service = new PairMatchService();\n    @Test\n    void handlesNegativeValues() {\n        assertArrayEquals(new int[] { 2, 4 }, service.findPairIndices(new int[] { -1, -2, -3, -4, -5 }, -8));\n    }\n    @Test\n    void handlesDuplicateValues() {\n        assertArrayEquals(new int[] { 0, 1 }, service.findPairIndices(new int[] { 3, 3 }, 6));\n    }\n}\n',
    'hidden_test'
  );

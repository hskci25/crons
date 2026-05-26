package com.crons.csvparser.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CsvParserServiceHiddenTest {

    private final CsvParserService service = new CsvParserService();

    @Test
    void emptyLineReturnsEmptyList() {
        assertTrue(service.parseLine("").isEmpty());
    }

    @Test
    void singleQuotedField() {
        assertEquals(List.of("only"), service.parseLine("\"only\""));
    }
}

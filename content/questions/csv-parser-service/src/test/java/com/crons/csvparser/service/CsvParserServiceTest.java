package com.crons.csvparser.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CsvParserServiceTest {

    private final CsvParserService service = new CsvParserService();

    @Test
    void parsesSimpleLine() {
        assertEquals(List.of("a", "b", "c"), service.parseLine("a,b,c"));
    }

    @Test
    void parsesQuotedFieldWithComma() {
        assertEquals(List.of("hello", "world,again", "end"),
            service.parseLine("hello,\"world,again\",end"));
    }
}

package com.crons.csvparser.api;

import com.crons.csvparser.service.CsvParserService;
import java.util.List;

public class CsvParserController {

    private final CsvParserService service = new CsvParserService();

    public List<String> parseLine(String line) {
        return service.parseLine(line);
    }
}

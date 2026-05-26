package com.crons.csvparser.service;

import java.util.ArrayList;
import java.util.List;

public class CsvParserService {

    /** Parse a single CSV line into fields (supports quoted fields). */
    public List<String> parseLine(String line) {
        List<String> fields = new ArrayList<>();
        if (line == null || line.isEmpty()) {
            return fields;
        }
        // BUG: naive split — breaks on commas inside quotes
        String[] parts = line.split(",");
        for (String part : parts) {
            fields.add(part.trim());
        }
        return fields;
    }
}

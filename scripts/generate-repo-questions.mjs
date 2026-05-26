#!/usr/bin/env node
/**
 * Generates 10 repository-based interview problems:
 * - 5 debugging (broken implementations)
 * - 5 feature addition (stub implementations)
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export const QUESTIONS = [
  {
    slug: "inventory-reservation-service",
    artifactId: "inventory-reservation-service",
    pkg: "inventoryreservation",
    title: "inventory-reservation-service",
    difficulty: "medium",
    tags: ["spring", "java", "debugging"],
    type: "debug",
    serviceName: "InventoryReservationService",
    controllerName: "InventoryReservationController",
    appName: "InventoryReservationApplication",
    brokenStarter: `package com.crons.inventoryreservation.service;

import java.util.HashMap;
import java.util.Map;

public class InventoryReservationService {

    private final Map<String, Integer> stock = new HashMap<>();

    public InventoryReservationService() {
        stock.put("SKU-100", 10);
        stock.put("SKU-200", 5);
    }

    /** Reserve units; returns false when insufficient stock. */
    public boolean reserve(String sku, int quantity) {
        if (quantity <= 0) {
            return false;
        }
        Integer available = stock.get(sku);
        if (available == null) {
            return false;
        }
        // BUG: uses > instead of >= — allows reserving when exactly equal would fail next time incorrectly
        // BUG: never decrements stock
        return available > quantity;
    }

    public int available(String sku) {
        return stock.getOrDefault(sku, 0);
    }
}
`,
    solution: `package com.crons.inventoryreservation.service;

import java.util.HashMap;
import java.util.Map;

public class InventoryReservationService {

    private final Map<String, Integer> stock = new HashMap<>();

    public InventoryReservationService() {
        stock.put("SKU-100", 10);
        stock.put("SKU-200", 5);
    }

    public boolean reserve(String sku, int quantity) {
        if (quantity <= 0) {
            return false;
        }
        Integer available = stock.get(sku);
        if (available == null || available < quantity) {
            return false;
        }
        stock.put(sku, available - quantity);
        return true;
    }

    public int available(String sku) {
        return stock.getOrDefault(sku, 0);
    }
}
`,
    controllerMethods: `    public boolean reserve(String sku, int quantity) {
        return service.reserve(sku, quantity);
    }

    public int available(String sku) {
        return service.available(sku);
    }`,
    visibleTests: `package com.crons.inventoryreservation.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InventoryReservationServiceTest {

    private final InventoryReservationService service = new InventoryReservationService();

    @Test
    void reservesWhenStockIsSufficient() {
        assertTrue(service.reserve("SKU-100", 3));
        assertEquals(7, service.available("SKU-100"));
    }

    @Test
    void rejectsWhenStockIsInsufficient() {
        assertFalse(service.reserve("SKU-200", 10));
        assertEquals(5, service.available("SKU-200"));
    }
}
`,
    hiddenTests: `package com.crons.inventoryreservation.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InventoryReservationServiceHiddenTest {

    private final InventoryReservationService service = new InventoryReservationService();

    @Test
    void reservesExactRemainingQuantity() {
        assertTrue(service.reserve("SKU-100", 10));
        assertEquals(0, service.available("SKU-100"));
        assertFalse(service.reserve("SKU-100", 1));
    }

    @Test
    void rejectsUnknownSku() {
        assertFalse(service.reserve("SKU-999", 1));
    }
}
`,
  },
  {
    slug: "rate-limiter-service",
    artifactId: "rate-limiter-service",
    pkg: "ratelimiter",
    title: "rate-limiter-service",
    difficulty: "medium",
    tags: ["spring", "java", "debugging"],
    type: "debug",
    serviceName: "RateLimiterService",
    controllerName: "RateLimiterController",
    appName: "RateLimiterApplication",
    brokenStarter: `package com.crons.ratelimiter.service;

public class RateLimiterService {

    private int requestCount = 0;
    private final int maxRequests;

    public RateLimiterService() {
        this(10);
    }

    public RateLimiterService(int maxRequests) {
        this.maxRequests = maxRequests;
    }

    /** Returns true if the request is allowed under the limit. */
    public boolean allowRequest() {
        // BUG: uses > instead of >= — allows one extra request past the limit
        if (requestCount > maxRequests) {
            return false;
        }
        requestCount++;
        return true;
    }

    public void reset() {
        requestCount = 0;
    }
}
`,
    solution: `package com.crons.ratelimiter.service;

public class RateLimiterService {

    private int requestCount = 0;
    private final int maxRequests;

    public RateLimiterService() {
        this(10);
    }

    public RateLimiterService(int maxRequests) {
        this.maxRequests = maxRequests;
    }

    public boolean allowRequest() {
        if (requestCount >= maxRequests) {
            return false;
        }
        requestCount++;
        return true;
    }

    public void reset() {
        requestCount = 0;
    }
}
`,
    controllerMethods: `    public boolean allowRequest() {
        return service.allowRequest();
    }`,
    visibleTests: `package com.crons.ratelimiter.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RateLimiterServiceTest {

    @Test
    void allowsRequestsUpToLimit() {
        RateLimiterService limiter = new RateLimiterService(3);
        assertTrue(limiter.allowRequest());
        assertTrue(limiter.allowRequest());
        assertTrue(limiter.allowRequest());
        assertFalse(limiter.allowRequest());
    }

    @Test
    void resetClearsCount() {
        RateLimiterService limiter = new RateLimiterService(2);
        assertTrue(limiter.allowRequest());
        assertTrue(limiter.allowRequest());
        assertFalse(limiter.allowRequest());
        limiter.reset();
        assertTrue(limiter.allowRequest());
    }
}
`,
    hiddenTests: `package com.crons.ratelimiter.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RateLimiterServiceHiddenTest {

    @Test
    void limitOfOneAllowsSingleRequest() {
        RateLimiterService limiter = new RateLimiterService(1);
        assertTrue(limiter.allowRequest());
        assertFalse(limiter.allowRequest());
    }
}
`,
  },
  {
    slug: "password-strength-service",
    artifactId: "password-strength-service",
    pkg: "passwordstrength",
    title: "password-strength-service",
    difficulty: "easy",
    tags: ["spring", "java", "debugging"],
    type: "debug",
    serviceName: "PasswordStrengthService",
    controllerName: "PasswordStrengthController",
    appName: "PasswordStrengthApplication",
    brokenStarter: `package com.crons.passwordstrength.service;

public class PasswordStrengthService {

    /** Strong if length >= 8, has uppercase, lowercase, and digit. */
    public boolean isStrong(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        // BUG: only checks length — ignores character classes
        return true;
    }
}
`,
    solution: `package com.crons.passwordstrength.service;

public class PasswordStrengthService {

    public boolean isStrong(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        boolean upper = false, lower = false, digit = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) upper = true;
            if (Character.isLowerCase(c)) lower = true;
            if (Character.isDigit(c)) digit = true;
        }
        return upper && lower && digit;
    }
}
`,
    controllerMethods: `    public boolean isStrong(String password) {
        return service.isStrong(password);
    }`,
    visibleTests: `package com.crons.passwordstrength.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordStrengthServiceTest {

    private final PasswordStrengthService service = new PasswordStrengthService();

    @Test
    void acceptsValidPassword() {
        assertTrue(service.isStrong("Secure1pass"));
    }

    @Test
    void rejectsShortPassword() {
        assertFalse(service.isStrong("Ab1"));
    }
}
`,
    hiddenTests: `package com.crons.passwordstrength.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordStrengthServiceHiddenTest {

    private final PasswordStrengthService service = new PasswordStrengthService();

    @Test
    void rejectsMissingDigit() {
        assertFalse(service.isStrong("NoDigitsHere"));
    }

    @Test
    void rejectsMissingUppercase() {
        assertFalse(service.isStrong("alllower1"));
    }
}
`,
  },
  {
    slug: "pagination-service",
    artifactId: "pagination-service",
    pkg: "pagination",
    title: "pagination-service",
    difficulty: "easy",
    tags: ["spring", "java", "debugging"],
    type: "debug",
    serviceName: "PaginationService",
    controllerName: "PaginationController",
    appName: "PaginationApplication",
    brokenStarter: `package com.crons.pagination.service;

import java.util.ArrayList;
import java.util.List;

public class PaginationService {

  /** page is 1-based. Returns items for the requested page. */
  public <T> List<T> page(List<T> items, int page, int pageSize) {
    if (items == null || items.isEmpty() || pageSize <= 0 || page < 1) {
      return List.of();
    }
  int start = page * pageSize;
    int end = Math.min(start + pageSize, items.size());
    if (start >= items.size()) {
      return List.of();
    }
    return new ArrayList<>(items.subList(start, end));
  }
}
`,
    solution: `package com.crons.pagination.service;

import java.util.ArrayList;
import java.util.List;

public class PaginationService {

  public <T> List<T> page(List<T> items, int page, int pageSize) {
    if (items == null || items.isEmpty() || pageSize <= 0 || page < 1) {
      return List.of();
    }
    int start = (page - 1) * pageSize;
    int end = Math.min(start + pageSize, items.size());
    if (start >= items.size()) {
      return List.of();
    }
    return new ArrayList<>(items.subList(start, end));
  }
}
`,
    controllerMethods: `    public <T> List<T> page(List<T> items, int page, int pageSize) {
        return service.page(items, page, pageSize);
    }`,
    visibleTests: `package com.crons.pagination.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PaginationServiceTest {

    private final PaginationService service = new PaginationService();

    @Test
    void firstPage() {
        List<String> all = List.of("a", "b", "c", "d", "e");
        assertEquals(List.of("a", "b"), service.page(all, 1, 2));
    }

    @Test
    void secondPage() {
        List<String> all = List.of("a", "b", "c", "d", "e");
        assertEquals(List.of("c", "d"), service.page(all, 2, 2));
    }
}
`,
    hiddenTests: `package com.crons.pagination.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PaginationServiceHiddenTest {

    private final PaginationService service = new PaginationService();

    @Test
    void lastPartialPage() {
        List<Integer> all = List.of(1, 2, 3, 4, 5);
        assertEquals(List.of(5), service.page(all, 3, 2));
    }

    @Test
    void pageBeyondEndReturnsEmpty() {
        assertTrue(service.page(List.of(1, 2), 5, 2).isEmpty());
    }
}
`,
  },
  {
    slug: "csv-parser-service",
    artifactId: "csv-parser-service",
    pkg: "csvparser",
    title: "csv-parser-service",
    difficulty: "medium",
    tags: ["spring", "java", "debugging"],
    type: "debug",
    serviceName: "CsvParserService",
    controllerName: "CsvParserController",
    appName: "CsvParserApplication",
    brokenStarter: `package com.crons.csvparser.service;

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
`,
    solution: `package com.crons.csvparser.service;

import java.util.ArrayList;
import java.util.List;

public class CsvParserService {

    public List<String> parseLine(String line) {
        List<String> fields = new ArrayList<>();
        if (line == null || line.isEmpty()) {
            return fields;
        }
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(stripQuotes(current.toString()));
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        fields.add(stripQuotes(current.toString()));
        return fields;
    }

    private String stripQuotes(String s) {
        String t = s.trim();
        if (t.length() >= 2 && t.charAt(0) == '\\u0022' && t.charAt(t.length() - 1) == '\\u0022') {
            return t.substring(1, t.length() - 1);
        }
        return t;
    }
}
`,
    controllerMethods: `    public List<String> parseLine(String line) {
        return service.parseLine(line);
    }`,
    visibleTests: `package com.crons.csvparser.service;

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
            service.parseLine("hello,\\"world,again\\",end"));
    }
}
`,
    hiddenTests: `package com.crons.csvparser.service;

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
        assertEquals(List.of("only"), service.parseLine("\\"only\\""));
    }
}
`,
  },
  // Feature addition problems
  {
    slug: "discount-calculator-service",
    artifactId: "discount-calculator-service",
    pkg: "discountcalculator",
    title: "discount-calculator-service",
    difficulty: "medium",
    tags: ["spring", "java", "feature"],
    type: "feature",
    serviceName: "DiscountCalculatorService",
    controllerName: "DiscountCalculatorController",
    appName: "DiscountCalculatorApplication",
    brokenStarter: `package com.crons.discountcalculator.service;

public class DiscountCalculatorService {

    /**
     * Apply tiered discount: 0% under $50, 10% for $50–$99.99, 20% for $100+.
     * Returns final price after discount (rounded to 2 decimal places via cents).
     */
    public long applyDiscountCents(long subtotalCents) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
`,
    solution: `package com.crons.discountcalculator.service;

public class DiscountCalculatorService {

    public long applyDiscountCents(long subtotalCents) {
        if (subtotalCents < 0) {
            throw new IllegalArgumentException("negative subtotal");
        }
        double rate;
        if (subtotalCents < 5000) {
            rate = 0.0;
        } else if (subtotalCents < 10000) {
            rate = 0.10;
        } else {
            rate = 0.20;
        }
        return Math.round(subtotalCents * (1.0 - rate));
    }
}
`,
    controllerMethods: `    public long applyDiscountCents(long subtotalCents) {
        return service.applyDiscountCents(subtotalCents);
    }`,
    visibleTests: `package com.crons.discountcalculator.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DiscountCalculatorServiceTest {

    private final DiscountCalculatorService service = new DiscountCalculatorService();

    @Test
    void noDiscountUnderFiftyDollars() {
        assertEquals(4999, service.applyDiscountCents(4999));
    }

    @Test
    void tenPercentAtFiftyDollars() {
        assertEquals(4500, service.applyDiscountCents(5000));
    }
}
`,
    hiddenTests: `package com.crons.discountcalculator.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DiscountCalculatorServiceHiddenTest {

    private final DiscountCalculatorService service = new DiscountCalculatorService();

    @Test
    void twentyPercentAtOneHundredDollars() {
        assertEquals(8000, service.applyDiscountCents(10000));
    }

    @Test
    void rejectsNegativeSubtotal() {
        assertThrows(IllegalArgumentException.class, () -> service.applyDiscountCents(-1));
    }
}
`,
  },
  {
    slug: "user-search-service",
    artifactId: "user-search-service",
    pkg: "usersearch",
    title: "user-search-service",
    difficulty: "medium",
    tags: ["spring", "java", "feature"],
    type: "feature",
    serviceName: "UserSearchService",
    controllerName: "UserSearchController",
    appName: "UserSearchApplication",
    brokenStarter: `package com.crons.usersearch.service;

import java.util.List;

public class UserSearchService {

    private static final List<String> USERS = List.of(
        "alice", "alicia", "bob", "carol", "charlie"
    );

    /** Case-insensitive prefix match; returns names sorted alphabetically. */
    public List<String> findByPrefix(String prefix) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
`,
    solution: `package com.crons.usersearch.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UserSearchService {

    private static final List<String> USERS = List.of(
        "alice", "alicia", "bob", "carol", "charlie"
    );

    public List<String> findByPrefix(String prefix) {
        if (prefix == null || prefix.isEmpty()) {
            return Collections.emptyList();
        }
        String lower = prefix.toLowerCase();
        List<String> matches = new ArrayList<>();
        for (String user : USERS) {
            if (user.toLowerCase().startsWith(lower)) {
                matches.add(user);
            }
        }
        Collections.sort(matches);
        return matches;
    }
}
`,
    controllerMethods: `    public List<String> findByPrefix(String prefix) {
        return service.findByPrefix(prefix);
    }`,
    visibleTests: `package com.crons.usersearch.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserSearchServiceTest {

    private final UserSearchService service = new UserSearchService();

    @Test
    void findsAlPrefixMatches() {
        assertEquals(List.of("alice", "alicia"), service.findByPrefix("al"));
    }

    @Test
    void caseInsensitive() {
        assertEquals(List.of("bob"), service.findByPrefix("BO"));
    }
}
`,
    hiddenTests: `package com.crons.usersearch.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserSearchServiceHiddenTest {

    private final UserSearchService service = new UserSearchService();

    @Test
    void emptyPrefixReturnsEmpty() {
        assertTrue(service.findByPrefix("").isEmpty());
    }

    @Test
    void noMatchReturnsEmpty() {
        assertTrue(service.findByPrefix("zzz").isEmpty());
    }
}
`,
  },
  {
    slug: "notification-router-service",
    artifactId: "notification-router-service",
    pkg: "notificationrouter",
    title: "notification-router-service",
    difficulty: "easy",
    tags: ["spring", "java", "feature"],
    type: "feature",
    serviceName: "NotificationRouterService",
    controllerName: "NotificationRouterController",
    appName: "NotificationRouterApplication",
    brokenStarter: `package com.crons.notificationrouter.service;

public class NotificationRouterService {

    /**
     * Route notification: use preferredChannel if set and non-blank,
     * otherwise fall back to "email".
     */
    public String route(String preferredChannel) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
`,
    solution: `package com.crons.notificationrouter.service;

public class NotificationRouterService {

    public String route(String preferredChannel) {
        if (preferredChannel == null || preferredChannel.isBlank()) {
            return "email";
        }
        return preferredChannel.trim().toLowerCase();
    }
}
`,
    controllerMethods: `    public String route(String preferredChannel) {
        return service.route(preferredChannel);
    }`,
    visibleTests: `package com.crons.notificationrouter.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NotificationRouterServiceTest {

    private final NotificationRouterService service = new NotificationRouterService();

    @Test
    void defaultsToEmailWhenBlank() {
        assertEquals("email", service.route(""));
        assertEquals("email", service.route(null));
    }

    @Test
    void usesPreferredChannel() {
        assertEquals("sms", service.route("sms"));
    }
}
`,
    hiddenTests: `package com.crons.notificationrouter.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NotificationRouterServiceHiddenTest {

    private final NotificationRouterService service = new NotificationRouterService();

    @Test
    void trimsAndLowercases() {
        assertEquals("push", service.route("  PUSH  "));
    }
}
`,
  },
  {
    slug: "order-total-service",
    artifactId: "order-total-service",
    pkg: "ordertotal",
    title: "order-total-service",
    difficulty: "medium",
    tags: ["spring", "java", "feature"],
    type: "feature",
    serviceName: "OrderTotalService",
    controllerName: "OrderTotalController",
    appName: "OrderTotalApplication",
    brokenStarter: `package com.crons.ordertotal.service;

public class OrderTotalService {

    private static final double TAX_RATE = 0.08;

    /** Returns subtotal + 8% tax in cents (rounded). */
    public long totalWithTaxCents(long subtotalCents) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
`,
    solution: `package com.crons.ordertotal.service;

public class OrderTotalService {

    private static final double TAX_RATE = 0.08;

    public long totalWithTaxCents(long subtotalCents) {
        if (subtotalCents < 0) {
            throw new IllegalArgumentException("negative subtotal");
        }
        return Math.round(subtotalCents * (1.0 + TAX_RATE));
    }
}
`,
    controllerMethods: `    public long totalWithTaxCents(long subtotalCents) {
        return service.totalWithTaxCents(subtotalCents);
    }`,
    visibleTests: `package com.crons.ordertotal.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderTotalServiceTest {

    private final OrderTotalService service = new OrderTotalService();

    @Test
    void addsEightPercentTax() {
        assertEquals(1080, service.totalWithTaxCents(1000));
    }

    @Test
    void zeroSubtotal() {
        assertEquals(0, service.totalWithTaxCents(0));
    }
}
`,
    hiddenTests: `package com.crons.ordertotal.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderTotalServiceHiddenTest {

    private final OrderTotalService service = new OrderTotalService();

    @Test
    void roundsTax() {
        assertEquals(33, service.totalWithTaxCents(31));
    }

    @Test
    void rejectsNegative() {
        assertThrows(IllegalArgumentException.class, () -> service.totalWithTaxCents(-1));
    }
}
`,
  },
  {
    slug: "audit-query-service",
    artifactId: "audit-query-service",
    pkg: "auditquery",
    title: "audit-query-service",
    difficulty: "medium",
    tags: ["spring", "java", "feature"],
    type: "feature",
    serviceName: "AuditQueryService",
    controllerName: "AuditQueryController",
    appName: "AuditQueryApplication",
    brokenStarter: `package com.crons.auditquery.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class AuditQueryService {

    private static final List<Map<String, Object>> EVENTS = List.of(
        Map.of("id", "e1", "day", LocalDate.of(2024, 1, 5)),
        Map.of("id", "e2", "day", LocalDate.of(2024, 1, 15)),
        Map.of("id", "e3", "day", LocalDate.of(2024, 2, 1))
    );

    /** Inclusive date range [from, to]. */
    public List<String> eventIdsBetween(LocalDate from, LocalDate to) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
`,
    solution: `package com.crons.auditquery.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AuditQueryService {

    private static final List<Map<String, Object>> EVENTS = List.of(
        Map.of("id", "e1", "day", LocalDate.of(2024, 1, 5)),
        Map.of("id", "e2", "day", LocalDate.of(2024, 1, 15)),
        Map.of("id", "e3", "day", LocalDate.of(2024, 2, 1))
    );

    public List<String> eventIdsBetween(LocalDate from, LocalDate to) {
        if (from == null || to == null || from.isAfter(to)) {
            return List.of();
        }
        List<String> ids = new ArrayList<>();
        for (Map<String, Object> event : EVENTS) {
            LocalDate day = (LocalDate) event.get("day");
            if (!day.isBefore(from) && !day.isAfter(to)) {
                ids.add((String) event.get("id"));
            }
        }
        return ids;
    }
}
`,
    controllerMethods: `    public List<String> eventIdsBetween(java.time.LocalDate from, java.time.LocalDate to) {
        return service.eventIdsBetween(from, to);
    }`,
    visibleTests: `package com.crons.auditquery.service;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AuditQueryServiceTest {

    private final AuditQueryService service = new AuditQueryService();

    @Test
    void singleDayRange() {
        assertEquals(List.of("e1"),
            service.eventIdsBetween(LocalDate.of(2024, 1, 5), LocalDate.of(2024, 1, 5)));
    }

    @Test
    void monthRange() {
        assertEquals(List.of("e1", "e2"),
            service.eventIdsBetween(LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 31)));
    }
}
`,
    hiddenTests: `package com.crons.auditquery.service;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class AuditQueryServiceHiddenTest {

    private final AuditQueryService service = new AuditQueryService();

    @Test
    void invalidRangeReturnsEmpty() {
        assertTrue(service.eventIdsBetween(LocalDate.of(2024, 2, 1), LocalDate.of(2024, 1, 1)).isEmpty());
    }

    @Test
    void nullDatesReturnEmpty() {
        assertTrue(service.eventIdsBetween(null, LocalDate.now()).isEmpty());
    }
}
`,
  },
];

function pom(artifactId) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>${artifactId}</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>${artifactId}</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
`;
}

function appClass(pkg, appName) {
  return `package com.crons.${pkg};

public class ${appName} {
    public static void main(String[] args) {
    }
}
`;
}

function controllerClass(pkg, controllerName, serviceName, methods) {
  const listImport = /List</.test(methods) ? "\nimport java.util.List;" : "";
  return `package com.crons.${pkg}.api;

import com.crons.${pkg}.service.${serviceName};${listImport}

public class ${controllerName} {

    private final ${serviceName} service = new ${serviceName}();

${methods}
}
`;
}

function escSql(s) {
  return s.replace(/'/g, "''");
}

function jsonEsc(s) {
  return JSON.stringify(s);
}

async function writeFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

async function generateQuestion(q, index) {
  const base = path.join(ROOT, "content", "questions", q.slug);
  const servicePath = `src/main/java/com/crons/${q.pkg}/service/${q.serviceName}.java`;
  const testPath = `src/test/java/com/crons/${q.pkg}/service/${q.serviceName}Test.java`;
  const hiddenPath = `src/test/java/com/crons/${q.pkg}/service/${q.serviceName}HiddenTest.java`;
  const appPath = `src/main/java/com/crons/${q.pkg}/${q.appName}.java`;
  const controllerPath = `src/main/java/com/crons/${q.pkg}/api/${q.controllerName}.java`;

  const pomContent = pom(q.artifactId);
  const appContent = appClass(q.pkg, q.appName);
  const controllerContent = controllerClass(
    q.pkg,
    q.controllerName,
    q.serviceName,
    q.controllerMethods
  );

  await writeFile(path.join(base, "pom.xml"), pomContent);
  await writeFile(path.join(base, servicePath), q.brokenStarter);
  await writeFile(path.join(base, testPath), q.visibleTests);
  await writeFile(path.join(base, hiddenPath), q.hiddenTests);
  await writeFile(path.join(base, appPath), appContent);
  await writeFile(path.join(base, controllerPath), controllerContent);

  const manifest = {
    slug: q.slug,
    starterTemplates: { [servicePath]: q.brokenStarter },
    visibleTests: { [testPath]: q.visibleTests },
    hiddenTests: { [hiddenPath]: q.hiddenTests },
    readonlyFiles: {
      "pom.xml": pomContent,
      [appPath]: appContent,
      [controllerPath]: controllerContent,
    },
  };

  await writeFile(
    path.join(ROOT, "runner", "questions", `${q.slug}.json`),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  const questionId = `00000000-0000-4000-8000-0000000000${(index + 2).toString(16).padStart(2, "0")}`;
  return { ...q, questionId, servicePath, testPath, hiddenPath, appPath, controllerPath, pomContent, appContent, controllerContent };
}

async function main() {
  const generated = [];
  for (let i = 0; i < QUESTIONS.length; i++) {
    generated.push(await generateQuestion(QUESTIONS[i], i));
  }

  let sql = `-- Seed 10 repository-based interview problems\n\n`;
  for (const g of generated) {
    sql += `insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)\n`;
    sql += `values (\n`;
    sql += `  '${g.questionId}',\n`;
    sql += `  '${g.slug}',\n`;
    sql += `  '${g.title}',\n`;
    sql += `  '${g.difficulty}',\n`;
    sql += `  array[${g.tags.map((t) => `'${t}'`).join(", ")}],\n`;
    sql += `  '',\n`;
    sql += `  'java',\n`;
    sql += `  45,\n`;
    sql += `  true\n`;
    sql += `) on conflict (slug) do nothing;\n\n`;

    const files = [
      ["pom.xml", g.pomContent, "readonly"],
      [g.appPath, g.appContent, "readonly"],
      [g.controllerPath, g.controllerContent, "readonly"],
      [g.servicePath, g.brokenStarter, "starter"],
      [g.testPath, g.visibleTests, "readonly"],
      [g.hiddenPath, g.hiddenTests, "hidden_test"],
    ];

    for (const [filePath, content, kind] of files) {
      sql += `insert into public.question_files (question_id, path, content, kind)\n`;
      sql += `select '${g.questionId}', '${filePath}', E'${escSql(content)}', '${kind}'\n`;
      sql += `where exists (select 1 from public.questions where id = '${g.questionId}');\n\n`;
    }
  }

  await writeFile(
    path.join(ROOT, "supabase", "migrations", "20260526000000_repo_questions_batch.sql"),
    sql
  );

  await writeSeedQuestionsTs(generated);

  console.log(`Generated ${generated.length} questions.`);
}

async function writeSeedQuestionsTs(generated) {
  const pairMatch = {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "pair-match-service",
    title: "pair-match-service",
    difficulty: "medium",
    tags: ["spring", "java", "debugging"],
  };
  const pairStarter = await fs.readFile(
    path.join(ROOT, "content/questions/pair-match-service/src/main/java/com/crons/pairmatch/service/PairMatchService.java"),
    "utf8"
  );
  const pairPom = await fs.readFile(
    path.join(ROOT, "content/questions/pair-match-service/pom.xml"),
    "utf8"
  );
  const pairApp = await fs.readFile(
    path.join(ROOT, "content/questions/pair-match-service/src/main/java/com/crons/pairmatch/PairMatchApplication.java"),
    "utf8"
  );
  const pairController = await fs.readFile(
    path.join(ROOT, "content/questions/pair-match-service/src/main/java/com/crons/pairmatch/api/PairMatchController.java"),
    "utf8"
  );
  const pairVisible = await fs.readFile(
    path.join(ROOT, "content/questions/pair-match-service/src/test/java/com/crons/pairmatch/service/PairMatchServiceTest.java"),
    "utf8"
  );

  const all = [
    { ...pairMatch, files: [
      ["pom.xml", pairPom, "readonly"],
      ["src/main/java/com/crons/pairmatch/PairMatchApplication.java", pairApp, "readonly"],
      ["src/main/java/com/crons/pairmatch/api/PairMatchController.java", pairController, "readonly"],
      ["src/main/java/com/crons/pairmatch/service/PairMatchService.java", pairStarter, "starter"],
      ["src/test/java/com/crons/pairmatch/service/PairMatchServiceTest.java", pairVisible, "readonly"],
    ]},
    ...generated.map((g) => ({
      id: g.questionId,
      slug: g.slug,
      title: g.title,
      difficulty: g.difficulty,
      tags: g.tags,
      files: [
        ["pom.xml", g.pomContent, "readonly"],
        [g.appPath, g.appContent, "readonly"],
        [g.controllerPath, g.controllerContent, "readonly"],
        [g.servicePath, g.brokenStarter, "starter"],
        [g.testPath, g.visibleTests, "readonly"],
      ],
    })),
  ];

  const lit = (s) => JSON.stringify(s);

  let out = `import type { Question, QuestionFile, QuestionWithFiles } from "./types/questions";\n\n`;
  out += `export const SEED_QUESTION_ID = ${lit(pairMatch.id)};\n\n`;
  out += `export const SEED_QUESTIONS: Question[] = [\n`;
  for (const q of all) {
    out += `  {\n`;
    out += `    id: ${lit(q.id)},\n`;
    out += `    slug: ${lit(q.slug)},\n`;
    out += `    title: ${lit(q.title)},\n`;
    out += `    difficulty: ${lit(q.difficulty)},\n`;
    out += `    tags: ${JSON.stringify(q.tags)},\n`;
    out += `    language: "java",\n`;
    out += `    spec_md: "",\n`;
    out += `    time_limit_min: 45,\n`;
    out += `    published: true,\n`;
    out += `    created_at: new Date().toISOString(),\n`;
    out += `  },\n`;
  }
  out += `];\n\nexport const SEED_QUESTION_FILES: QuestionFile[] = [\n`;

  let fileIdx = 0;
  for (const q of all) {
    for (const [filePath, content, kind] of q.files) {
      const fid = `00000000-0000-4000-8001-${String(fileIdx++).padStart(12, "0")}`;
      out += `  {\n`;
      out += `    id: ${lit(fid)},\n`;
      out += `    question_id: ${lit(q.id)},\n`;
      out += `    path: ${lit(filePath)},\n`;
      out += `    content: ${lit(content)},\n`;
      out += `    kind: ${lit(kind)},\n`;
      out += `  },\n`;
    }
  }
  out += `];\n\n`;
  out += `export function getSeedQuestion(slug: string): QuestionWithFiles | null {
  const q = SEED_QUESTIONS.find((x) => x.slug === slug);
  if (!q) return null;
  return {
    ...q,
    files: SEED_QUESTION_FILES.filter((f) => f.question_id === q.id),
  };
}

export function listSeedQuestions(): Question[] {
  return SEED_QUESTIONS.filter((q) => q.published);
}

export function isSeedQuestionId(id: string): boolean {
  return SEED_QUESTIONS.some((q) => q.id === id);
}
`;

  await writeFile(path.join(ROOT, "src/lib/seedQuestions.ts"), out);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

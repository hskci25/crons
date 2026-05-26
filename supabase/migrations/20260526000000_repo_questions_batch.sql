-- Seed 10 repository-based interview problems

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000002',
  'inventory-reservation-service',
  'inventory-reservation-service',
  'medium',
  array['spring', 'java', 'debugging'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000002', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>inventory-reservation-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>inventory-reservation-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000002');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000002', 'src/main/java/com/crons/inventoryreservation/InventoryReservationApplication.java', E'package com.crons.inventoryreservation;

public class InventoryReservationApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000002');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000002', 'src/main/java/com/crons/inventoryreservation/api/InventoryReservationController.java', E'package com.crons.inventoryreservation.api;

import com.crons.inventoryreservation.service.InventoryReservationService;

public class InventoryReservationController {

    private final InventoryReservationService service = new InventoryReservationService();

    public boolean reserve(String sku, int quantity) {
        return service.reserve(sku, quantity);
    }

    public int available(String sku) {
        return service.available(sku);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000002');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000002', 'src/main/java/com/crons/inventoryreservation/service/InventoryReservationService.java', E'package com.crons.inventoryreservation.service;

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
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000002');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000002', 'src/test/java/com/crons/inventoryreservation/service/InventoryReservationServiceTest.java', E'package com.crons.inventoryreservation.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000002');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000002', 'src/test/java/com/crons/inventoryreservation/service/InventoryReservationServiceHiddenTest.java', E'package com.crons.inventoryreservation.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000002');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000003',
  'rate-limiter-service',
  'rate-limiter-service',
  'medium',
  array['spring', 'java', 'debugging'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000003', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>rate-limiter-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>rate-limiter-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000003');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000003', 'src/main/java/com/crons/ratelimiter/RateLimiterApplication.java', E'package com.crons.ratelimiter;

public class RateLimiterApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000003');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000003', 'src/main/java/com/crons/ratelimiter/api/RateLimiterController.java', E'package com.crons.ratelimiter.api;

import com.crons.ratelimiter.service.RateLimiterService;

public class RateLimiterController {

    private final RateLimiterService service = new RateLimiterService();

    public boolean allowRequest() {
        return service.allowRequest();
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000003');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000003', 'src/main/java/com/crons/ratelimiter/service/RateLimiterService.java', E'package com.crons.ratelimiter.service;

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
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000003');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000003', 'src/test/java/com/crons/ratelimiter/service/RateLimiterServiceTest.java', E'package com.crons.ratelimiter.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000003');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000003', 'src/test/java/com/crons/ratelimiter/service/RateLimiterServiceHiddenTest.java', E'package com.crons.ratelimiter.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000003');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000004',
  'password-strength-service',
  'password-strength-service',
  'easy',
  array['spring', 'java', 'debugging'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000004', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>password-strength-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>password-strength-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000004');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000004', 'src/main/java/com/crons/passwordstrength/PasswordStrengthApplication.java', E'package com.crons.passwordstrength;

public class PasswordStrengthApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000004');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000004', 'src/main/java/com/crons/passwordstrength/api/PasswordStrengthController.java', E'package com.crons.passwordstrength.api;

import com.crons.passwordstrength.service.PasswordStrengthService;

public class PasswordStrengthController {

    private final PasswordStrengthService service = new PasswordStrengthService();

    public boolean isStrong(String password) {
        return service.isStrong(password);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000004');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000004', 'src/main/java/com/crons/passwordstrength/service/PasswordStrengthService.java', E'package com.crons.passwordstrength.service;

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
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000004');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000004', 'src/test/java/com/crons/passwordstrength/service/PasswordStrengthServiceTest.java', E'package com.crons.passwordstrength.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000004');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000004', 'src/test/java/com/crons/passwordstrength/service/PasswordStrengthServiceHiddenTest.java', E'package com.crons.passwordstrength.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000004');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000005',
  'pagination-service',
  'pagination-service',
  'easy',
  array['spring', 'java', 'debugging'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000005', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>pagination-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>pagination-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000005');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000005', 'src/main/java/com/crons/pagination/PaginationApplication.java', E'package com.crons.pagination;

public class PaginationApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000005');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000005', 'src/main/java/com/crons/pagination/api/PaginationController.java', E'package com.crons.pagination.api;

import com.crons.pagination.service.PaginationService;
import java.util.List;

public class PaginationController {

    private final PaginationService service = new PaginationService();

    public <T> List<T> page(List<T> items, int page, int pageSize) {
        return service.page(items, page, pageSize);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000005');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000005', 'src/main/java/com/crons/pagination/service/PaginationService.java', E'package com.crons.pagination.service;

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
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000005');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000005', 'src/test/java/com/crons/pagination/service/PaginationServiceTest.java', E'package com.crons.pagination.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000005');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000005', 'src/test/java/com/crons/pagination/service/PaginationServiceHiddenTest.java', E'package com.crons.pagination.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000005');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000006',
  'csv-parser-service',
  'csv-parser-service',
  'medium',
  array['spring', 'java', 'debugging'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000006', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>csv-parser-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>csv-parser-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000006');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000006', 'src/main/java/com/crons/csvparser/CsvParserApplication.java', E'package com.crons.csvparser;

public class CsvParserApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000006');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000006', 'src/main/java/com/crons/csvparser/api/CsvParserController.java', E'package com.crons.csvparser.api;

import com.crons.csvparser.service.CsvParserService;
import java.util.List;

public class CsvParserController {

    private final CsvParserService service = new CsvParserService();

    public List<String> parseLine(String line) {
        return service.parseLine(line);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000006');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000006', 'src/main/java/com/crons/csvparser/service/CsvParserService.java', E'package com.crons.csvparser.service;

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
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000006');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000006', 'src/test/java/com/crons/csvparser/service/CsvParserServiceTest.java', E'package com.crons.csvparser.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000006');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000006', 'src/test/java/com/crons/csvparser/service/CsvParserServiceHiddenTest.java', E'package com.crons.csvparser.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000006');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000007',
  'discount-calculator-service',
  'discount-calculator-service',
  'medium',
  array['spring', 'java', 'feature'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000007', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>discount-calculator-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>discount-calculator-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000007');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000007', 'src/main/java/com/crons/discountcalculator/DiscountCalculatorApplication.java', E'package com.crons.discountcalculator;

public class DiscountCalculatorApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000007');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000007', 'src/main/java/com/crons/discountcalculator/api/DiscountCalculatorController.java', E'package com.crons.discountcalculator.api;

import com.crons.discountcalculator.service.DiscountCalculatorService;

public class DiscountCalculatorController {

    private final DiscountCalculatorService service = new DiscountCalculatorService();

    public long applyDiscountCents(long subtotalCents) {
        return service.applyDiscountCents(subtotalCents);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000007');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000007', 'src/main/java/com/crons/discountcalculator/service/DiscountCalculatorService.java', E'package com.crons.discountcalculator.service;

public class DiscountCalculatorService {

    /**
     * Apply tiered discount: 0% under $50, 10% for $50–$99.99, 20% for $100+.
     * Returns final price after discount (rounded to 2 decimal places via cents).
     */
    public long applyDiscountCents(long subtotalCents) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000007');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000007', 'src/test/java/com/crons/discountcalculator/service/DiscountCalculatorServiceTest.java', E'package com.crons.discountcalculator.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000007');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000007', 'src/test/java/com/crons/discountcalculator/service/DiscountCalculatorServiceHiddenTest.java', E'package com.crons.discountcalculator.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000007');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000008',
  'user-search-service',
  'user-search-service',
  'medium',
  array['spring', 'java', 'feature'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000008', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>user-search-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>user-search-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000008');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000008', 'src/main/java/com/crons/usersearch/UserSearchApplication.java', E'package com.crons.usersearch;

public class UserSearchApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000008');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000008', 'src/main/java/com/crons/usersearch/api/UserSearchController.java', E'package com.crons.usersearch.api;

import com.crons.usersearch.service.UserSearchService;
import java.util.List;

public class UserSearchController {

    private final UserSearchService service = new UserSearchService();

    public List<String> findByPrefix(String prefix) {
        return service.findByPrefix(prefix);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000008');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000008', 'src/main/java/com/crons/usersearch/service/UserSearchService.java', E'package com.crons.usersearch.service;

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
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000008');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000008', 'src/test/java/com/crons/usersearch/service/UserSearchServiceTest.java', E'package com.crons.usersearch.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000008');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000008', 'src/test/java/com/crons/usersearch/service/UserSearchServiceHiddenTest.java', E'package com.crons.usersearch.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000008');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-000000000009',
  'notification-router-service',
  'notification-router-service',
  'easy',
  array['spring', 'java', 'feature'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000009', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>notification-router-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>notification-router-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000009');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000009', 'src/main/java/com/crons/notificationrouter/NotificationRouterApplication.java', E'package com.crons.notificationrouter;

public class NotificationRouterApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000009');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000009', 'src/main/java/com/crons/notificationrouter/api/NotificationRouterController.java', E'package com.crons.notificationrouter.api;

import com.crons.notificationrouter.service.NotificationRouterService;

public class NotificationRouterController {

    private final NotificationRouterService service = new NotificationRouterService();

    public String route(String preferredChannel) {
        return service.route(preferredChannel);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000009');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000009', 'src/main/java/com/crons/notificationrouter/service/NotificationRouterService.java', E'package com.crons.notificationrouter.service;

public class NotificationRouterService {

    /**
     * Route notification: use preferredChannel if set and non-blank,
     * otherwise fall back to "email".
     */
    public String route(String preferredChannel) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000009');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000009', 'src/test/java/com/crons/notificationrouter/service/NotificationRouterServiceTest.java', E'package com.crons.notificationrouter.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000009');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-000000000009', 'src/test/java/com/crons/notificationrouter/service/NotificationRouterServiceHiddenTest.java', E'package com.crons.notificationrouter.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NotificationRouterServiceHiddenTest {

    private final NotificationRouterService service = new NotificationRouterService();

    @Test
    void trimsAndLowercases() {
        assertEquals("push", service.route("  PUSH  "));
    }
}
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-000000000009');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-00000000000a',
  'order-total-service',
  'order-total-service',
  'medium',
  array['spring', 'java', 'feature'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000a', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>order-total-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>order-total-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000a');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000a', 'src/main/java/com/crons/ordertotal/OrderTotalApplication.java', E'package com.crons.ordertotal;

public class OrderTotalApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000a');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000a', 'src/main/java/com/crons/ordertotal/api/OrderTotalController.java', E'package com.crons.ordertotal.api;

import com.crons.ordertotal.service.OrderTotalService;

public class OrderTotalController {

    private final OrderTotalService service = new OrderTotalService();

    public long totalWithTaxCents(long subtotalCents) {
        return service.totalWithTaxCents(subtotalCents);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000a');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000a', 'src/main/java/com/crons/ordertotal/service/OrderTotalService.java', E'package com.crons.ordertotal.service;

public class OrderTotalService {

    private static final double TAX_RATE = 0.08;

    /** Returns subtotal + 8% tax in cents (rounded). */
    public long totalWithTaxCents(long subtotalCents) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000a');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000a', 'src/test/java/com/crons/ordertotal/service/OrderTotalServiceTest.java', E'package com.crons.ordertotal.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000a');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000a', 'src/test/java/com/crons/ordertotal/service/OrderTotalServiceHiddenTest.java', E'package com.crons.ordertotal.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000a');

insert into public.questions (id, slug, title, difficulty, tags, spec_md, language, time_limit_min, published)
values (
  '00000000-0000-4000-8000-00000000000b',
  'audit-query-service',
  'audit-query-service',
  'medium',
  array['spring', 'java', 'feature'],
  '',
  'java',
  45,
  true
) on conflict (slug) do nothing;

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000b', 'pom.xml', E'<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.crons</groupId>
  <artifactId>audit-query-service</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>audit-query-service</name>
  <properties>
    <java.version>17</java.version>
  </properties>
</project>
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000b');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000b', 'src/main/java/com/crons/auditquery/AuditQueryApplication.java', E'package com.crons.auditquery;

public class AuditQueryApplication {
    public static void main(String[] args) {
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000b');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000b', 'src/main/java/com/crons/auditquery/api/AuditQueryController.java', E'package com.crons.auditquery.api;

import com.crons.auditquery.service.AuditQueryService;
import java.util.List;

public class AuditQueryController {

    private final AuditQueryService service = new AuditQueryService();

    public List<String> eventIdsBetween(java.time.LocalDate from, java.time.LocalDate to) {
        return service.eventIdsBetween(from, to);
    }
}
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000b');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000b', 'src/main/java/com/crons/auditquery/service/AuditQueryService.java', E'package com.crons.auditquery.service;

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
', 'starter'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000b');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000b', 'src/test/java/com/crons/auditquery/service/AuditQueryServiceTest.java', E'package com.crons.auditquery.service;

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
', 'readonly'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000b');

insert into public.question_files (question_id, path, content, kind)
select '00000000-0000-4000-8000-00000000000b', 'src/test/java/com/crons/auditquery/service/AuditQueryServiceHiddenTest.java', E'package com.crons.auditquery.service;

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
', 'hidden_test'
where exists (select 1 from public.questions where id = '00000000-0000-4000-8000-00000000000b');


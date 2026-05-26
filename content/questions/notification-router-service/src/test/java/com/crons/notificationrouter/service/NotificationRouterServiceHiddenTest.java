package com.crons.notificationrouter.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NotificationRouterServiceHiddenTest {

    private final NotificationRouterService service = new NotificationRouterService();

    @Test
    void trimsAndLowercases() {
        assertEquals("push", service.route("  PUSH  "));
    }
}

package com.crons.notificationrouter.service;

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

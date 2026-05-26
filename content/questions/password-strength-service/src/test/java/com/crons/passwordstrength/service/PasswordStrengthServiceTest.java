package com.crons.passwordstrength.service;

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

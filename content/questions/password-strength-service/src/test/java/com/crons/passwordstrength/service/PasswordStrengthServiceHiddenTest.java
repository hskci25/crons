package com.crons.passwordstrength.service;

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

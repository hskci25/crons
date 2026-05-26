package com.crons.passwordstrength.service;

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

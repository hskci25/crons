package com.crons.passwordstrength.api;

import com.crons.passwordstrength.service.PasswordStrengthService;

public class PasswordStrengthController {

    private final PasswordStrengthService service = new PasswordStrengthService();

    public boolean isStrong(String password) {
        return service.isStrong(password);
    }
}

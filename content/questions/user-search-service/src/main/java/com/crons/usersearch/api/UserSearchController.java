package com.crons.usersearch.api;

import com.crons.usersearch.service.UserSearchService;
import java.util.List;

public class UserSearchController {

    private final UserSearchService service = new UserSearchService();

    public List<String> findByPrefix(String prefix) {
        return service.findByPrefix(prefix);
    }
}

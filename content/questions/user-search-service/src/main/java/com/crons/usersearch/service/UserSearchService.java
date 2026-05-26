package com.crons.usersearch.service;

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

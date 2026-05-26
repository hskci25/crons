package com.crons.notificationrouter.api;

import com.crons.notificationrouter.service.NotificationRouterService;

public class NotificationRouterController {

    private final NotificationRouterService service = new NotificationRouterService();

    public String route(String preferredChannel) {
        return service.route(preferredChannel);
    }
}

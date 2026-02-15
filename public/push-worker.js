self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "New Mission Alert!";
    const options = {
        body: data.body || "Check your hydration status.",
        icon: "/icon-192.svg",
        badge: "/icon-192.svg",
        data: { url: data.url || "/" }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

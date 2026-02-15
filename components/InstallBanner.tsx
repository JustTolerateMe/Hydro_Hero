"use client";

import { useState, useEffect } from "react";

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsVisible(false);
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="install-banner">
            <div className="install-content">
                <div className="install-icon">&#x26A1;</div>
                <div className="install-text">
                    <strong>ADD TO UTILITY BELT!</strong>
                    <span>Install Hydro Hero for quick access.</span>
                </div>
            </div>
            <button className="install-btn" onClick={handleInstall}>
                INSTALL
            </button>
            <button className="install-close" onClick={() => setIsVisible(false)}>
                &times;
            </button>
        </div>
    );
}

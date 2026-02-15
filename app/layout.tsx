import Link from "next/link";
import InstallBanner from "@/components/InstallBanner";
import type { Metadata } from "next";
import { Bangers, Comic_Neue } from "next/font/google";
import "./globals.css";

const bangers = Bangers({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-hero",
    display: 'swap',
});

const comicNeue = Comic_Neue({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-body",
    display: 'swap',
});

export const viewport = {
    themeColor: "#FFD700",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: "The Kidney Pill — Stop Kidney-ing Around!",
    description: "Safe Hydration, Smarter Medication",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Hydro Hero",
    },
    icons: {
        apple: "/icon-192.svg", // Using SVG as placeholder, might need PNG for real iOS
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${bangers.variable} ${comicNeue.variable}`}>
                {children}
                <InstallBanner />
            </body>
        </html>
    );
}

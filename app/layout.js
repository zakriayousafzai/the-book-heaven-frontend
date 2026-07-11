import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreInitializer } from "./components/StoreInitializer";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";

// Font configuration
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#080C16",
};

export const metadata = {
    title: "The book Heaven",
    description: "A place to find your next read",
    keywords: "books, reading, library, ebooks, literature",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
                <ClerkProvider>
                    <StoreInitializer />
                    <header className="sticky top-0 z-10">
                        <Navbar />
                    </header>
                    {children}
                </ClerkProvider>
            </body>
        </html>
    );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BooksProvider } from "./ContextAPI/booksAPI";
// import { AuthProvider } from "./ContextAPI/AuthContextApi";
import { FavoriteProvider } from "./ContextAPI/FavoriteContext";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

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

const AppProviders = ({ children }) => (
  <ErrorBoundary>
    <FavoriteProvider>
      <BooksProvider>{children}</BooksProvider>
    </FavoriteProvider>
  </ErrorBoundary>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ClerkProvider>
          <AppProviders>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </header>
            {children}
          </AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}

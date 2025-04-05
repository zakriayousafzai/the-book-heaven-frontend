import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BooksProvider } from "./ContextAPI/booksAPI";
import { AuthProvider } from "./ContextAPI/AuthContextApi";
import { FavoriteProvider } from "./ContextAPI/FavoriteContext";
import ErrorBoundary from "./components/ErrorBoundary";

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

export const metadata = {
  title: "The book Heaven",
  description: "A place to find your next read",
  keywords: "books, reading, library, ebooks, literature",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#080C16",
};

const AppProviders = ({ children }) => (
  <ErrorBoundary>
    <AuthProvider>
      <FavoriteProvider>
        <BooksProvider>
          {children}
        </BooksProvider>
      </FavoriteProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

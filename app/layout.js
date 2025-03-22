import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BooksProvider } from "./ContextAPI/booksAPI";
import { AuthProvider } from "./ContextAPI/AuthContextApi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The book Heaven",
  description: "A place to find your next read",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <BooksProvider>

            {children}

          </BooksProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

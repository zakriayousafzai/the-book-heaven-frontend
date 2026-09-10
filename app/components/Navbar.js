"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";

    return (
        <nav className="w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant/60 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-[72px]">
                    {/* Logo & Title */}
                    <div className="flex items-center shrink-0">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/50 group-hover:border-primary/40 group-hover:bg-primary-fixed/30 transition-all">
                                <BookOpenIcon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-secondary group-hover:text-primary transition-colors hidden sm:inline">
                                The Book Heaven
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-3 sm:mx-6">
                        <SearchBar />
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                        <Show when="signed-in">
                            <Link
                                href="/dashboard"
                                className="text-xs sm:text-sm font-medium text-secondary/80 hover:text-secondary transition-colors px-2 py-1 rounded-md hover:bg-surface-container">
                                Dashboard
                            </Link>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-xs sm:text-sm font-medium text-secondary/80 hover:text-secondary transition-colors px-2 py-1 rounded-md hover:bg-surface-container">
                                    Admin
                                </Link>
                            )}
                            <div className="flex items-center justify-center w-8 h-8">
                                <UserButton />
                            </div>
                        </Show>

                        <Show when="signed-out">
                            <SignInButton>
                                <button className="text-secondary hover:text-primary transition-colors font-medium text-xs sm:text-sm px-3 py-1.5 cursor-pointer">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton>
                                <button className="bg-primary hover:bg-[#8e330e] active:scale-[0.98] text-white rounded-md font-semibold text-xs sm:text-sm px-4 py-2 cursor-pointer shadow-xs hover:shadow transition-all">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </Show>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

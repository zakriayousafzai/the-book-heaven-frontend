"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";

    return (
        <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border/80 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-[72px]">
                    {/* Logo & Title */}
                    <div className="flex items-center shrink-0">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group">
                            <BookOpenIcon className="w-5 h-5 text-primary group-hover:rotate-6 transition-transform" />
                            <span className="text-sm font-semibold tracking-tight text-textPrimary group-hover:text-primary transition-colors hidden sm:inline">
                                The Book Heaven
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-2 sm:mx-4">
                        <SearchBar />
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                        <Show when="signed-in">
                            <Link 
                                href="/dashboard" 
                                className="text-xs sm:text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
                                Dashboard
                            </Link>
                            {isAdmin && (
                                <Link 
                                    href="/admin" 
                                    className="text-xs sm:text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors">
                                    Admin
                                </Link>
                            )}
                            <div className="flex items-center justify-center w-8 h-8">
                                <UserButton />
                            </div>
                        </Show>

                        <Show when="signed-out">
                            <SignInButton>
                                <button className="text-textSecondary hover:text-textPrimary transition-colors font-medium text-xs sm:text-sm px-2.5 py-1.5 cursor-pointer">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton>
                                <button className="bg-primary hover:bg-amber-700 active:scale-[0.98] text-white rounded-full font-medium text-xs sm:text-sm px-3.5 py-1.5 cursor-pointer transition-all">
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

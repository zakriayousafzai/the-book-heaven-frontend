"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
    return (
        <div className="flex flex-col w-full bg-background border-b border-border">
            <div className="flex justify-between items-center h-[10vh] bg-background text-textPrimary p-3">
                <div className="flex items-center">
                    <h1 className=" w-max sm:ml-6">
                        <Link
                            href="/"
                            className="sm:flex sm:items-center sm:gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                />
                            </svg>
                            <span className="hidden min-[500px]:block text-xs font-semibold sm:text-sm sm:font-semibold">
                                The Book Heaven
                            </span>
                        </Link>
                    </h1>
                </div>

                <SearchBar />

                <div className="flex gap-5">
                    <Show when="signed-in">
                        <Link href={`/dashboard`}>Dashboard</Link>
                        <UserButton />
                    </Show>

                    <Show when="signed-out">
                        <SignInButton>
                            <button className="text-white rounded-full font-medium text-sm sm:text-base p-1 cursor-pointer">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton>
                            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base p-1 px-2 cursor-pointer">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </Show>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <>
      <div className="flex justify-between items-center h-[10vh] bg-background sticky top-0 z-10 text-textPrimary p-3">
        <div className="flex items-center">
          <h1 className=" w-max sm:ml-6">
            <Link href="/" className="sm:flex sm:items-center sm:gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
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

        <div>
          <Show when="signed-in">
            <UserButton />
            <Link href={`/pages/profile`}></Link>
          </Show>

          <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
        </div>

        {/* Decorative border line at the bottom of the navbar */}
        <div className="absolute bottom-0 w-full h-1 bg-border"></div>
      </div>
    </>
  );
};

export default Navbar;

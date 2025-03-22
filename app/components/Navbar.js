'use client'
import React, { useStaten, useContext } from 'react'
import { HeartIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import SearchBar from './SearchBar'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../ContextAPI/AuthContextApi'

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);

    return (
        <>
            <div className='flex justify-around items-center h-[10vh] bg-background sticky top-0 z-10 text-textPrimary p-3' >

                <div className="flex items-center">

                    <h1 className=' w-max sm:ml-6'>
                        <Link href="/" className='sm:flex sm:items-center sm:gap-3'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                            <span className='hidden min-[500px]:block text-xs font-semibold sm:text-sm sm:font-semibold'>The Book Heaven</span>
                        </Link>
                    </h1>

                </div>

                <SearchBar />


                {isAuthenticated ? (
                    <div className='flex items-center gap-2'>
                        <div className='bg-surface rounded-full p-2 border-border text-xs cursor-pointer'>
                            <Link href={"/user"}>
                                <button className='flex items-center gap-1 text-textPrimary font-semibold'>
                                    Profile
                                </button>
                            </Link>
                        </div>
                        <div className='bg-surface rounded-full p-2 border-border text-xs cursor-pointer'>
                            <button className='flex items-center gap-1 text-textPrimary font-semibold'
                                onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='bg-surface rounded-full p-2 border-border text-xs cursor-pointer'>
                        <Link href={"/login"}>
                            <button
                                className='flex items-center gap-1 text-textPrimary font-semibold'>
                                Login
                            </button>
                        </Link>
                    </div>
                )}


                {/* Decorative border line at the bottom of the navbar */}
                <div className="absolute bottom-0 w-full h-1 bg-border"></div>

            </div>
        </>
    )
}

export default Navbar

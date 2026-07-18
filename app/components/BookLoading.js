"use client";

import React from "react";

/**
 * BookLoading Component
 * Renders a premium skeleton loading state matching the BookCard grid for "lg" size,
 * or an elegant pure-CSS page-flip book symbol for "sm" and "md" sizes.
 */
const BookLoading = ({ size = "md", isLoading = true }) => {
    if (!isLoading) return null;

    if (size === "lg") {
        // High-end skeleton grid matching final visual grid spacing
        return (
            <div 
                className="w-full"
                role="alert"
                aria-busy="true"
                aria-label="Loading library catalog">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 w-full">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="relative aspect-[3/4.2] w-full rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 
                                       overflow-hidden flex flex-col justify-between animate-pulse">
                            {/* Inner border mock */}
                            <div className="absolute inset-[10px] border border-white/5 opacity-30 rounded pointer-events-none" />
                            
                            {/* Spine mock shadow */}
                            <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-r from-black/40 via-black/10 to-transparent rounded-l-xl" />
                            
                            {/* Title lines mock */}
                            <div className="w-full mt-4 flex flex-col items-center gap-2">
                                <div className="h-3.5 bg-zinc-800/80 rounded-md w-4/5" />
                                <div className="h-3.5 bg-zinc-800/80 rounded-md w-3/5" />
                            </div>

                            {/* Genre line mock */}
                            <div className="w-2/3 mx-auto h-2 bg-zinc-800/50 rounded-md mt-auto mb-2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Single elegant page-flip book loader for inline states
    const dimensionClasses = {
        sm: "w-8 h-6",
        md: "w-12 h-9",
    };

    const dotDimension = size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5";

    return (
        <div
            className="flex flex-col items-center justify-center gap-5 py-6"
            role="alert"
            aria-busy="true"
            aria-label="Loading content">
            
            {/* Animated flipping book */}
            <div className={`relative ${dimensionClasses[size]} perspective-500`}>
                <div className="book-shell w-full h-full flex justify-between relative">
                    {/* Left cover page static */}
                    <div className="w-[48%] h-full bg-gradient-to-l from-zinc-850 to-zinc-900 border-l border-y border-zinc-800 rounded-l shadow-md" />
                    
                    {/* Center book spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-primary/80 z-20" />
                    
                    {/* Flipping page */}
                    <div className="flipping-page absolute right-[1%] top-0 w-[49%] h-full bg-zinc-800 border-r border-y border-zinc-700/85 rounded-r origin-left z-10" />
                    
                    {/* Right cover page static */}
                    <div className="w-[48%] h-full bg-gradient-to-r from-zinc-850 to-zinc-900 border-r border-y border-zinc-800 rounded-r shadow-md" />
                </div>
            </div>

            {/* Micro-loading indicators */}
            <div className="flex gap-1.5">
                <div className={`${dotDimension} bg-primary/70 rounded-full animate-bounce-custom-1`} />
                <div className={`${dotDimension} bg-primary/70 rounded-full animate-bounce-custom-2`} />
                <div className={`${dotDimension} bg-primary/70 rounded-full animate-bounce-custom-3`} />
            </div>

            <style jsx global>{`
                .perspective-500 {
                    perspective: 500px;
                }
                .flipping-page {
                    animation: flipPage 1.6s infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);
                    transform-style: preserve-3d;
                }
                
                @keyframes flipPage {
                    0% {
                        transform: rotateY(0deg);
                        background-color: #27272a;
                    }
                    50% {
                        transform: rotateY(-180deg);
                        background-color: #3f3f46;
                    }
                    100% {
                        transform: rotateY(-360deg);
                        background-color: #27272a;
                    }
                }

                .animate-bounce-custom-1 {
                    animation: bounceDots 1.2s infinite ease-in-out;
                }
                .animate-bounce-custom-2 {
                    animation: bounceDots 1.2s infinite ease-in-out 0.2s;
                }
                .animate-bounce-custom-3 {
                    animation: bounceDots 1.2s infinite ease-in-out 0.4s;
                }

                @keyframes bounceDots {
                    0%, 100% {
                        transform: translateY(0);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-4px);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookLoading;

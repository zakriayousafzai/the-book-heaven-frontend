"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Scholarly editorial cover palettes for physical book mockups
const COVER_PALETTES = [
    { from: "from-[#1a2a3a]", to: "to-[#0e1720]", border: "border-[#2c4258]/60", accent: "text-[#d3e4fa]", titleColor: "text-[#fbf9f5]" }, // Library Navy
    { from: "from-[#8f330e]", to: "to-[#591e06]", border: "border-[#b8481b]/60", accent: "text-[#ffdbcf]", titleColor: "text-[#fbf9f5]" }, // Terracotta
    { from: "from-[#1d3c34]", to: "to-[#0f231e]", border: "border-[#2d5c50]/60", accent: "text-[#c2ebd9]", titleColor: "text-[#fbf9f5]" }, // Scholar Pine
    { from: "from-[#5a1827]", to: "to-[#380e18]", border: "border-[#7d293b]/60", accent: "text-[#fcd2db]", titleColor: "text-[#fbf9f5]" }, // Vintage Burgundy
    { from: "from-[#253f56]", to: "to-[#142433]", border: "border-[#3e5f7e]/60", accent: "text-[#cce5ff]", titleColor: "text-[#fbf9f5]" }, // Ink Blue
    { from: "from-[#54412c]", to: "to-[#332617]", border: "border-[#7a6245]/60", accent: "text-[#ffe8ba]", titleColor: "text-[#fbf9f5]" }, // Warm Ochre
];

const BookCard = ({ id, title, genre, status }) => {
    // Generate a consistent palette index based on book ID or Title
    const paletteIndex = id
        ? id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % COVER_PALETTES.length
        : title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % COVER_PALETTES.length;

    const palette = COVER_PALETTES[paletteIndex];

    return (
        <Link href={`/bookDetailsPage/${id}`} className="block w-full">
            <motion.div
                className="relative aspect-[3/4.4] w-full cursor-pointer group bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-[0_4px_16px_-4px_rgba(27,28,26,0.06)] hover:border-primary/40 hover:shadow-[0_12px_28px_-6px_rgba(27,28,26,0.12)] transition-colors"
                whileHover={{
                    y: -1,
                    scale: 1.015,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
                {/* Status Badges */}
                {status && status !== "allowed" && (
                    <span
                        className={`absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-xs ${status === "pending"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-red-100 text-red-900 border border-red-300"
                            }`}>
                        {status === "pending" ? "Pending" : status}
                    </span>
                )}

                {/* Main Book Cover Mockup with 4px radius and spine gradient */}
                <div
                    className={`flex flex-col items-center p-4 rounded-[4px] h-full w-full border ${palette.border}
                              relative bg-gradient-to-br ${palette.from} ${palette.to}
                              shadow-[2px_3px_8px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.12)]
                              overflow-hidden`}
                >
                    {/* Canvas / Paper Texture overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

                    {/* Book Spine Highlight & Shadows */}
                    <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-r from-black/40 via-black/15 to-transparent rounded-l-[4px]" />
                    <div className="absolute left-[3px] top-[4%] bottom-[4%] w-[1px] bg-white/15" />

                    {/* Decorative Border Frame */}
                    <div className="absolute inset-[8px] border border-white/10 opacity-70 rounded-[2px] pointer-events-none" />
                    <div className="absolute inset-[11px] border border-white/5 rounded-[2px] pointer-events-none" />

                    {/* Book Title Section */}
                    <div className="w-full mt-3 mb-2 relative z-10 text-center flex-1 flex items-center justify-center">
                        <h3 className={`font-serif ${palette.titleColor} text-xs sm:text-sm font-bold tracking-tight line-clamp-4 px-1.5 select-none leading-relaxed`}>
                            {title}
                        </h3>
                    </div>

                    {/* Genre Section */}
                    <div className={`w-full text-[9px] sm:text-[10px] text-center uppercase tracking-widest font-mono relative z-10 mt-auto pt-2 border-t border-white/10 ${palette.accent}`}>
                        {genre}
                    </div>

                    {/* Subtle corner marks */}
                    <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/20"></div>
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/20"></div>
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/20"></div>
                    <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/20"></div>
                </div>
            </motion.div>
        </Link>
    );
};

export default BookCard;

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Dynamic cover palettes for the books
const COVER_PALETTES = [
    { from: "from-zinc-900", to: "to-zinc-950", border: "border-zinc-800/80", accent: "text-[#c4a484]" }, // Charcoal
    { from: "from-rose-950", to: "to-stone-950", border: "border-rose-900/40", accent: "text-[#e8c4b4]" },  // Burgundy
    { from: "from-teal-950", to: "to-slate-950", border: "border-teal-900/40", accent: "text-[#a4e8d5]" },   // Teal
    { from: "from-amber-950", to: "to-zinc-950", border: "border-amber-900/40", accent: "text-[#e8d5c4]" },  // Bronze
    { from: "from-blue-950", to: "to-zinc-950", border: "border-blue-900/40", accent: "text-[#b4d5e8]" },    // Indigo
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
                className="relative aspect-[3/4.2] w-full cursor-pointer group"
                whileHover={{ 
                    y: -8,
                    rotate: 1.5,
                    scale: 1.01,
                    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.7)"
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
                {/* Status Badges */}
                {status && status !== "allowed" && (
                    <span
                        className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md ${
                            status === "pending"
                                ? "bg-amber-500/90 text-black border border-amber-400/40"
                                : "bg-red-500/90 text-white border border-red-400/40"
                        }`}>
                        {status === "pending" ? "Pending" : status}
                    </span>
                )}

                {/* Main Book Cover Container */}
                <div
                    className={`flex flex-col items-center p-4 rounded-md h-full w-full border ${palette.border}
                              relative bg-gradient-to-br ${palette.from} ${palette.to}
                              shadow-[4px_6px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]
                              overflow-hidden`}
                >
                    {/* Canvas Texture overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

                    {/* Book Spine Highlight & Shadows */}
                    <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-l-md" />
                    <div className="absolute left-[3px] top-[5%] bottom-[5%] w-[1px] bg-white/10" />

                    {/* Decorative Border Frame */}
                    <div className="absolute inset-[10px] border border-white/5 opacity-55 rounded pointer-events-none" />
                    <div className={`absolute inset-[14px] border border-[#c4a484]/20 rounded pointer-events-none`} />

                    {/* Book Title Section */}
                    <div className="w-full mt-4 mb-2 relative z-10 text-center flex-1 flex items-center justify-center">
                        <h3 className="text-[#e8d5c4] text-xs sm:text-sm font-semibold tracking-tight line-clamp-4 px-2 select-none leading-relaxed">
                            {title}
                        </h3>
                    </div>

                    {/* Genre Section */}
                    <div className={`w-full text-[10px] text-center uppercase tracking-widest relative z-10 mt-auto pt-2 border-t border-white/5 ${palette.accent}`}>
                        {genre}
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/10"></div>
                    <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/10"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/10"></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/10"></div>
                </div>
            </motion.div>
        </Link>
    );
};

export default BookCard;

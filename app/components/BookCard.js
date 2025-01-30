import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// BookCard component displays individual book information with a vintage book cover aesthetic
const BookCard = ({ id, title, genre }) => {
  return (
    <Link href={`/bookDetailsPage/${id}`}>
      <div className="h-full relative transform transition-transform duration-300 hover:scale-105 hover:rotate-1 m-4">
        {/* Main Book Cover Container */}
        <div className="flex flex-col items-center p-4 rounded-md h-full w-full
          before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-[#2c1810] before:to-[#5c3828]
          before:opacity-90 before:content-[''] 
          after:absolute after:inset-0 after:rounded-md after:bg-[url('data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E')] after:opacity-30 after:content-['']
          relative bg-gradient-to-r from-[#3a2317] to-[#6b422e]
          shadow-[8px_8px_15px_rgba(0,0,0,0.3),inset_0_0_100px_rgba(0,0,0,0.2)]">

          {/* Book Spine Effect */}
          <div className="absolute left-0 top-0 w-[20px] h-full bg-gradient-to-r from-[#1a0f09] to-[#3a2317] rounded-l-md
            before:absolute before:left-[2px] before:top-[10%] before:h-[80%] before:w-[1px] before:bg-[#c4a484] before:opacity-20"></div>

          {/* Decorative Border Frame */}
          <div className="absolute inset-[12px] border-2 border-[#c4a484] opacity-40 rounded pointer-events-none
            before:absolute before:inset-[-8px] before:border before:border-[#c4a484] before:opacity-20 before:rounded
            after:absolute after:inset-[4px] after:border after:border-[#c4a484] after:opacity-10 after:rounded"></div>

          {/* Book Title Section */}
          <div className="w-full mb-2 relative z-10 h-28 break-words line-clamp-6">
            <h1 className="text-[#e8d5c4] text-center text-sm font-serif mb-2 p-2
              bg-gradient-to-b from-[rgba(62,39,27,0.5)] to-transparent">
              {title}
            </h1>
          </div>

          {/* Genre Section */}
          <div className="text-[#c4a484] w-full text-xs text-center italic relative z-10 mt-auto line-clamp-2 p-1 break-words">
            {genre}
          </div>

          {/* Embossed Corner Decorations */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#c4a484] opacity-30"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#c4a484] opacity-30"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#c4a484] opacity-30"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#c4a484] opacity-30"></div>
        </div>
      </div>
    </Link>
  )
}

export default BookCard

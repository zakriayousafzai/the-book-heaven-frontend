import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

// BookCard component displays individual movie information

const BookCard = ({ id, title, artwork, genre }) => {

  return (
    // Wrap the entire card in a Link for navigation to the movie details page
    <Link href={`/bookDetailsPage/${id}`}>

      <div
        className='flex flex-col items-center border-2 border-border p-2 text-textPrimary rounded-lg bg-surface shadow h-[100%] '>

        <div className="w-full h-24 bg-background text-textSecondary p-2 text-xs overflow-hidden break-words ">
          {title}
        </div>

        {/* Display the genre of the movie below the artwork */}
        <p className='text-textSecondary text-xs sm:text-base m-2 w-full overflow-hidden break-words line-clamp-2'>{genre}</p>

        {/* Display the movie Name below the genre */}
        <h2 className='text-xs sm:text-base w-full overflow-hidden break-words line-clamp-2'>{title}</h2>

      </div>

    </Link>
  )
}


export default BookCard

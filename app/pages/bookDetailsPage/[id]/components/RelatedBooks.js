'use client'
import BookGrid from "@/app/components/BookGrid"

export const RelatedBooks = ({ books }) => {
    if (!books.length) return null

    return (
        <section className=" w-full h-auto py-5 px-7 flex flex-col justify-center sm:px-14">
            <h1 className='text-2xl text-textSecondary'>Related Books</h1>
            <BookGrid bookData={books} />
        </section>
    )
}
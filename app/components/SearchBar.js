'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useBooksStore } from '@/app/store/useBooksStore';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

/**
 * Search configuration constants
 */
const SEARCH_CONFIG = {
  MAX_RESULTS: 5,      // Maximum number of search results to display
  MIN_LENGTH: 2,       // Minimum characters required to trigger search
  DEBOUNCE_MS: 300    // Debounce delay for search updates
};

/**
 * SearchBar Component
 * Provides real-time search functionality with keyboard navigation and accessibility support
 */
const SearchBar = () => {

  const { booksData } = useBooksStore();

  const [inputValue, setInputValue] = useState('')  // Search input text
  const [isOpen, setIsOpen] = useState(false)       // Dropdown visibility
  const [selectedIndex, setSelectedIndex] = useState(-1)  // Keyboard navigation index

  // Refs for DOM elements
  const searchRef = useRef(null)  // Reference to search container for click outside detection
  const inputRef = useRef(null)   // Reference to input element for focus management

  /**
   * Memoized search results to prevent unnecessary recalculations
   * Filters books based on search term and returns limited results
   */
  const matchingBooks = useMemo(() => {
    if (inputValue.length < SEARCH_CONFIG.MIN_LENGTH) return [];

    const searchTerm = inputValue.toLowerCase();
    const matchingResults = booksData
      .filter(book => {
        // Search across multiple fields with null checks
        const titleMatch = book.title?.toLowerCase().includes(searchTerm);
        const authorMatch = book.author?.toLowerCase().includes(searchTerm);
        const genreMatch = book.genre?.toLowerCase().includes(searchTerm);
        return titleMatch || authorMatch || genreMatch;
      })
      .slice(0, SEARCH_CONFIG.MAX_RESULTS);

    return matchingResults;
  }, [inputValue, booksData]);

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)  // Close dropdown when clicking outside
      }
    }

    // Add and remove event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    setInputValue(e.target.value)
    setIsOpen(true)  // Show dropdown when typing
    setSelectedIndex(-1)  // Reset selection
  }

  // Clear search input and reset states
  const handleClear = () => {
    setInputValue('')
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()  // Return focus to input
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Skip keyboard navigation if no results
    if (!matchingBooks.length) return;

    const keyboardActions = {
      ArrowDown: () => {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < matchingBooks.length - 1 ? prev + 1 : prev
        );
      },
      ArrowUp: () => {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      },
      Enter: () => {
        if (selectedIndex >= 0) {
          const selectedBook = matchingBooks[selectedIndex];
          window.location.href = `/bookDetailsPage/${selectedBook._id}`;
        }
      },
      Escape: () => {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    // Execute keyboard action if defined
    const action = keyboardActions[e.key];
    if (action) action();
  }

  return (
    <div className=" flex items-center justify-center relative">

      {/* Search container */}
      <div ref={searchRef} className="relative flex flex-col items-center gap-1">
        {/* Search input container */}
        <div className="relative flex items-center w-52 sm:w-96">
          {/* Search icon */}
          <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-textSecondary" />

          {/* Search input */}
          <input
            ref={inputRef}
            className="bg-surface text-textPrimary border-[1px] border-black h-10 rounded-md 
                     pl-10 pr-10 opacity-80 w-full focus:outline-none focus:ring-2 
                     focus:ring-accent focus:border-transparent"
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by Title, Author or Genre"
            aria-label="Search books"
            aria-controls="search-results"
            aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
          />

          {/* Clear button - only show when there's input */}
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 text-textSecondary hover:text-textPrimary"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {isOpen && (
          <div
            id="search-results"
            role="listbox"
            className="absolute top-full mt-1 w-52 sm:w-96 bg-background border-[1px] 
                     border-border rounded-md shadow-lg z-10 max-h-[60vh] overflow-y-auto"
          >
            {matchingBooks.length > 0 ? (
              // Map through matching books
              matchingBooks.map((book, index) => (
                <Link
                  key={book._id}
                  href={`/bookDetailsPage/${book._id}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    role="option"
                    id={`result-${index}`}
                    aria-selected={selectedIndex === index}
                    className={`flex items-center gap-3 p-2 hover:bg-secondary cursor-pointer
                              ${selectedIndex === index ? 'bg-secondary' : 'bg-surface'}`}
                  >

                    {/* book details */}
                    <div className="flex flex-col">
                      <span className="text-textPrimary font-medium">
                        {book.title}
                      </span>
                      <span className="text-textSecondary text-sm">
                        {book.genre}
                      </span>
                      <span className="text-textSecondary text-sm">
                        {book.author}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Display appropriate message based on search state
              <div className="p-3 text-textSecondary text-center">
                {inputValue.length >= SEARCH_CONFIG.MIN_LENGTH
                  ? 'No results found'
                  : `Type at least ${SEARCH_CONFIG.MIN_LENGTH} characters to search`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar

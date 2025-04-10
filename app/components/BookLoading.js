'use client';

import React from 'react';

/**
 * BookLoading Component
 * Displays an animated loading indicator in the shape of a book
 *
 * @param {Object} props
 * @param {('sm'|'md'|'lg')} props.size - Size variant of the loading indicator
 * @param {boolean} props.isLoading - Controls visibility of the loading indicator
 */
const BookLoading = ({ size = 'md', isLoading = true }) => {
  // Define width classes for different size variants
  const sizeClasses = {
    sm: 'w-16',
    md: 'w-20',
    lg: 'w-24'
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${isLoading ? 'block' : 'hidden'}`}
      role="alert"
      aria-busy={isLoading}
      aria-label="Loading content"
    >
      {/* Animated book loader with spine and cover */}
      <div className={`relative ${sizeClasses[size]} aspect-[3/4]`}>
        <div className="absolute inset-0" aria-hidden="true">
          {/* Book spine shadow */}
          <div className="absolute inset-y-0 left-0 w-[15%] bg-blue-600 rounded-l" />

          {/* Book cover */}
          <div className="absolute inset-0 bg-blue-500 rounded animate-pulse">
            {/* Decorative lines */}
            <div className="absolute inset-x-[20%] top-1/4 h-[2px] bg-blue-200 opacity-50" />
            <div className="absolute inset-x-[20%] top-1/3 h-[2px] bg-blue-200 opacity-50" />
            <div className="absolute inset-x-[20%] top-1/2 h-[2px] bg-blue-200 opacity-30" />
          </div>

          {/* Loading dots */}
          <div className="loading-dots absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Loading animation styles */}
      <style jsx>{`
        /* Bouncing animation for loading dots */
        .loading-dots div {
          animation: loadingDots 1.4s infinite cubic-bezier(0.45, 0, 0.55, 1);
        }
        
        /* Staggered animation delays for dots */
        .loading-dots div:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loading-dots div:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Keyframes for dot animation */
        @keyframes loadingDots {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default BookLoading;
'use client';

import React from 'react';

const BookLoading = ({ size = 'md', isLoading = true }) => {
  const sizeClasses = {
    sm: 'w-16',
    md: 'w-20',
    lg: 'w-24'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${isLoading ? 'block' : 'hidden'}`}>
      {/* Book icon with loading animation */}
      <div className={`relative ${sizeClasses[size]} aspect-[3/4]`}>
        <div className="absolute inset-0">
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

      <style jsx>{`
        .loading-dots div {
          animation: loadingDots 1.4s infinite;
        }
        .loading-dots div:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loading-dots div:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes loadingDots {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default BookLoading;
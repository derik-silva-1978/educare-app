
import React from 'react';

export const ChildrenListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 h-[280px] animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
          <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
          
          <div className="flex gap-2 justify-between mt-auto">
            <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          
          <div className="flex gap-2 justify-between mt-3">
            <div className="h-8 w-[32%] bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-8 w-[32%] bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-8 w-[32%] bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

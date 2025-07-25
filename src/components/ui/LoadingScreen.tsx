import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-gradient-to-br dark:from-red-950 dark:via-red-900 dark:to-black flex items-center justify-center">
      <div className="text-center">
        {/* Animated 3 4 */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="text-8xl font-bold text-red-600 dark:text-red-400 animate-bounce">
            3
          </div>
          <div className="text-8xl font-bold text-red-600 dark:text-red-400 animate-bounce delay-300">
            4
          </div>
        </div>
        
        {/* Loading text */}
        <div className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          Loading Shiwalik House Portal...
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
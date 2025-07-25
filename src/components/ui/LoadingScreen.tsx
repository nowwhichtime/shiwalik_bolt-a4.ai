import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-gradient-to-br dark:from-red-950 dark:via-red-900 dark:to-black flex items-center justify-center">
      <div className="text-center">
        {/* Animated 3 4 with funny jumping */}
        <div className="flex items-center justify-center space-x-4 mb-8 relative">
          <div className="text-8xl font-bold text-red-600 dark:text-red-400 animate-bounce" style={{
            animation: 'bounce 1s infinite, moveAround 3s infinite linear'
          }}>
            3
          </div>
          <div className="text-8xl font-bold text-red-600 dark:text-red-400 animate-bounce delay-300" style={{
            animation: 'bounce 1s infinite 0.3s, moveAroundReverse 3s infinite linear 1.5s'
          }}>
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
      
      {/* Custom CSS for funny movement */}
      <style jsx>{`
        @keyframes moveAround {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(20px) translateY(-10px) rotate(5deg); }
          50% { transform: translateX(-15px) translateY(15px) rotate(-3deg); }
          75% { transform: translateX(10px) translateY(-20px) rotate(2deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        
        @keyframes moveAroundReverse {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(-20px) translateY(10px) rotate(-5deg); }
          50% { transform: translateX(15px) translateY(-15px) rotate(3deg); }
          75% { transform: translateX(-10px) translateY(20px) rotate(-2deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
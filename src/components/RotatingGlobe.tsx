import React from 'react';

const RotatingGlobe = () => {
  return (
    <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-96 h-96 opacity-20 animate-globe-rotate hidden lg:block">
      {/* Globe Circle */}
      <div className="relative w-full h-full">
        {/* Main globe circle */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-globe-glow"></div>
        
        {/* Globe grid lines - latitude */}
        <div className="absolute inset-8 rounded-full border border-blue-300/20"></div>
        <div className="absolute inset-16 rounded-full border border-blue-300/20"></div>
        <div className="absolute inset-24 rounded-full border border-blue-300/20"></div>
        
        {/* Globe grid lines - longitude */}
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent transform -translate-x-0.5"></div>
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-300/15 to-transparent transform -translate-x-0.5 rotate-12"></div>
        <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-300/15 to-transparent transform translate-x-0.5 -rotate-12"></div>
        
        {/* Connection dots representing global network */}
        <div className="absolute top-16 left-20 w-2 h-2 bg-blue-400 rounded-full animate-dot-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-32 left-32 w-2 h-2 bg-purple-400 rounded-full animate-dot-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-24 right-24 w-2 h-2 bg-pink-400 rounded-full animate-dot-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-24 w-2 h-2 bg-indigo-400 rounded-full animate-dot-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-dot-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-12 w-2 h-2 bg-blue-500 rounded-full animate-dot-pulse" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-1/2 right-12 w-2 h-2 bg-purple-500 rounded-full animate-dot-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Connection arcs/lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 384 384">
          <defs>
            <linearGradient id="arcGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="arcGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Curved connection lines */}
          <path 
            d="M 80 100 Q 192 50 300 120" 
            stroke="url(#arcGradient1)" 
            strokeWidth="1" 
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '0s' }}
          />
          <path 
            d="M 100 280 Q 192 200 280 260" 
            stroke="url(#arcGradient2)" 
            strokeWidth="1" 
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <path 
            d="M 60 192 Q 120 120 180 192" 
            stroke="url(#arcGradient1)" 
            strokeWidth="1" 
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <path 
            d="M 200 192 Q 260 120 320 192" 
            stroke="url(#arcGradient2)" 
            strokeWidth="1" 
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 animate-globe-glow"></div>
        
        {/* Center glow point */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-400/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>
    </div>
  );
};

export default RotatingGlobe;

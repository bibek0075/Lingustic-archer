
import React from 'react';

interface ArcherProps {
  x: number;
  y: number;
  isActive: boolean;
  isFiring: boolean;
}

export const Archer: React.FC<ArcherProps> = ({ x, y, isActive, isFiring }) => {
  return (
    <div 
      className={`absolute transition-transform duration-200 z-20 ${isFiring ? 'shake' : ''}`}
      style={{ 
        left: x, 
        top: y, 
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.05)' : 'scale(1)'}` 
      }}
    >
      <svg width="220" height="220" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hand-drawn Bow Appearance */}
        <path 
          d={isFiring ? "M20 20 Q30 50 20 80" : (isActive ? "M25 15 Q60 50 25 85" : "M20 10 Q70 50 20 90")} 
          stroke="#2c1810" 
          strokeWidth="4" 
          strokeLinecap="round"
          className="transition-all duration-150"
        />
        {/* String */}
        <path 
          d={isFiring ? "M20 20 L25 50 L20 80" : (isActive ? "M25 15 L5 50 L25 85" : "M20 10 L20 90")} 
          stroke="#2c1810" 
          strokeWidth="1" 
          strokeDasharray="2,2"
          opacity="0.6"
          className="transition-all duration-150"
        />
        
        {/* Woodcut Character Style */}
        <g stroke="#2c1810" strokeWidth="1.5">
           {/* Head */}
           <path d="M10 30 Q18 20 26 30 L22 40 Q18 36 14 40 Z" fill="none" />
           <circle cx="18" cy="30" r="5" fill="#f4ecd8" />
           {/* Torso with cross-hatching look */}
           <rect x="5" y="40" width="25" height="40" fill="none" />
           <path d="M5 45 L30 45 M5 55 L30 55 M5 65 L30 65" strokeOpacity="0.3" />
           
           {/* Arm pulling back */}
           <path 
             d={isActive ? "M10 50 L5 50" : "M10 50 L25 45"} 
             fill="none" 
             strokeLinecap="round" 
           />
        </g>
        
        {/* Ready arrow in classic style */}
        {isActive && !isFiring && (
          <g>
            <line x1="5" y1="50" x2="45" y2="50" stroke="#8b0000" strokeWidth="2.5" />
            <path d="M45 50 L38 47 L38 53 Z" fill="#8b0000" />
            <path d="M10 50 L0 45 M10 50 L0 55" stroke="#2c1810" strokeWidth="1" />
          </g>
        )}
      </svg>
      
      {/* Decorative Pillar */}
      <div className="absolute -left-36 top-10 w-48 h-[800px] border-r-4 border-[#2c1810] opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to bottom, #2c1810 1px, transparent 1px)', backgroundSize: '100% 40px' }}></div>
      </div>
    </div>
  );
};

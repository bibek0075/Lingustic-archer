
import React from 'react';
import { WordTarget } from '../types';

interface WordItemProps {
  word: WordTarget;
  isActive: boolean;
}

export const WordItem: React.FC<WordItemProps> = ({ word, isActive }) => {
  const typedPart = word.text.substring(0, word.typedIndex);
  const remainingPart = word.text.substring(word.typedIndex);
  const shaftLength = word.text.length * 18 + 70;

  return (
    <div 
      className={`absolute transition-all duration-300 ${word.isHit ? 'opacity-0 -rotate-12 translate-y-20 pointer-events-none' : 'opacity-100'}`}
      style={{ 
        left: word.x, 
        top: word.y,
        transform: 'translate(0, -50%)'
      }}
    >
      <div className="relative flex items-center group">
        <svg 
          width={shaftLength + 50} 
          height="80" 
          viewBox={`0 0 ${shaftLength + 50} 80`} 
          className="filter drop-shadow-lg"
        >
          {/* Classic Fletching (Feathers) */}
          <path 
            d="M5 30 Q15 20 30 25 L30 55 Q15 60 5 50 Z" 
            fill={isActive ? "#8b0000" : "none"} 
            stroke="#2c1810" 
            strokeWidth="1.5"
            className="transition-colors duration-300"
          />
          <path d="M8 35 L25 35 M8 45 L25 45" stroke="#2c1810" strokeWidth="0.5" strokeOpacity="0.4" />
          
          {/* Wooden Shaft */}
          <rect 
            x="30" y="38" 
            width={shaftLength} height="4" 
            fill={isActive ? "#8b0000" : "#2c1810"} 
            className="transition-colors duration-300"
          />
          
          {/* Ink-drawn Arrowhead */}
          <path 
            d={`M${shaftLength + 30} 40 L${shaftLength + 10} 30 L${shaftLength + 10} 50 Z`} 
            fill={isActive ? "#8b0000" : "none"} 
            stroke="#2c1810" 
            strokeWidth="2" 
          />
        </svg>

        {/* Calligraphy Word Text */}
        <div 
          className="absolute flex items-center justify-center font-classic tracking-widest pointer-events-none px-12"
          style={{ 
            left: 20, 
            width: shaftLength,
            fontSize: '1.5rem',
          }}
        >
          <span className="text-[#8b0000] drop-shadow-sm">{typedPart}</span>
          <span className={`${isActive ? 'text-[#2c1810]' : 'text-[#2c1810]/40'} transition-colors`}>{remainingPart}</span>
        </div>

        {/* Decorative flourish under the word */}
        <div 
          className="absolute left-[20%] bottom-2 h-0.5 bg-[#2c1810]/20 w-3/5 rounded-full"
          style={{ width: `${(word.typedIndex / word.text.length) * 60}%` }}
        ></div>
      </div>
    </div>
  );
};

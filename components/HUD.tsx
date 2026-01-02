
import React from 'react';

interface HUDProps {
  score: number;
  health: number;
  level: number;
}

export const HUD: React.FC<HUDProps> = ({ score, health, level }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-12 flex justify-between items-start pointer-events-none z-40">
      <div className="flex flex-col gap-8">
        <div className="relative">
          <div className="text-[#2c1810] text-xs font-classic uppercase tracking-[0.5em] opacity-60 mb-2">Chronicle Points</div>
          <div className="text-8xl font-classic text-[#2c1810] leading-none drop-shadow-sm">{score}</div>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#2c1810]/10"></div>
        </div>
        
        <div className="w-80">
           <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[#2c1810] text-[10px] font-bold uppercase tracking-[0.4em] font-medieval">Vigor</span>
              <span className={`text-sm font-classic ${health < 30 ? 'text-[#8b0000] animate-pulse' : 'text-[#2c1810]'}`}>{health}%</span>
           </div>
           <div className="h-1.5 w-full bg-[#2c1810]/10 rounded-full overflow-hidden border border-[#2c1810]/20">
             <div 
                className={`h-full transition-all duration-1000 ${
                    health > 50 ? 'bg-[#2c1810]' : 'bg-[#8b0000]'
                }`}
                style={{ width: `${health}%` }}
             ></div>
           </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
          <div className="ink-border bg-[#f4ecd8] px-10 py-6 flex flex-col items-center min-w-[180px] shadow-xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f4ecd8] px-4 font-classic text-[#2c1810] text-xl">
              VOLLEY
            </div>
            <div className="text-6xl font-classic text-[#2c1810]">{level}</div>
            <div className="mt-4 text-[10px] text-[#2c1810]/50 uppercase tracking-widest font-medieval">
              Volatilis Antiqua
            </div>
          </div>
          
          <div className="mt-8 text-right italic text-[#2c1810]/40 font-medieval text-xs max-w-[200px]">
            "A steady hand and a swift heart shall pierce the darkness."
          </div>
      </div>
    </div>
  );
};

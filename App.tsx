
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WordTarget, GameStatus } from './types';
import { fetchThematicWords } from './services/geminiService';
import { Archer } from './components/Archer';
import { WordItem } from './components/WordItem';
import { HUD } from './components/HUD';

const INITIAL_HEALTH = 100;
const WORD_SPAWN_INTERVAL = 3000;
const BASE_SPEED = 1.8;
const SPEED_INCREMENT = 0.07;

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(INITIAL_HEALTH);
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState<WordTarget[]>([]);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [themeWords, setThemeWords] = useState<string[]>([]);
  const [isFiring, setIsFiring] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const requestRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const spawnCountRef = useRef<number>(0);
  const archerPos = { x: 150, y: window.innerHeight / 2 };

  useEffect(() => {
    const loadWords = async () => {
      const fetched = await fetchThematicWords(level);
      setThemeWords(fetched);
    };
    loadWords();
  }, [level]);

  const createInkSplatter = (x: number, y: number) => {
    const newParticles: Particle[] = Array.from({ length: 20 }).map(() => ({
      id: Math.random().toString(),
      x,
      y,
      vx: (Math.random() - 0.2) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1.0,
      color: Math.random() > 0.3 ? '#2c1810' : '#8b0000'
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const spawnWord = useCallback(() => {
    if (themeWords.length === 0) return;
    
    setIsFiring(true);
    setTimeout(() => setIsFiring(false), 250);

    const text = themeWords[Math.floor(Math.random() * themeWords.length)];
    const currentSpeed = BASE_SPEED + (spawnCountRef.current * SPEED_INCREMENT) + (level * 0.1);
    
    const newWord: WordTarget = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      x: archerPos.x + 40,
      y: Math.random() * (window.innerHeight - 300) + 150,
      speed: currentSpeed,
      typedIndex: 0
    };
    
    spawnCountRef.current += 1;
    setWords(prev => [...prev, newWord]);
  }, [themeWords, level, archerPos.x]);

  const update = useCallback((time: number) => {
    if (status !== GameStatus.PLAYING) return;

    if (time - lastSpawnRef.current > Math.max(900, WORD_SPAWN_INTERVAL - (level * 180))) {
      spawnWord();
      lastSpawnRef.current = time;
    }

    setParticles(prev => prev
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.3,
        life: p.life - 0.03
      }))
      .filter(p => p.life > 0)
    );

    setWords(prev => {
      const nextWords = prev.map(w => ({ 
        ...w, 
        x: w.x + w.speed,
        y: w.y + Math.sin(time / 600 + parseInt(w.id, 36)) * 0.8
      }));
      
      const escaped = nextWords.filter(w => w.x > window.innerWidth);
      if (escaped.length > 0) {
        setHealth(h => {
            const newHealth = h - (escaped.length * 20);
            if (newHealth <= 0) {
                setStatus(GameStatus.GAMEOVER);
                return 0;
            }
            return newHealth;
        });
      }
      
      return nextWords.filter(w => w.x <= window.innerWidth && !w.isHit);
    });

    requestRef.current = requestAnimationFrame(update);
  }, [status, level, spawnWord]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status, update]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== GameStatus.PLAYING) return;
    
    const char = e.key.toLowerCase();
    if (!/^[a-z]$/.test(char)) return;

    setWords(prev => {
      let targetWord: WordTarget | undefined;
      
      if (activeWordId) {
        targetWord = prev.find(w => w.id === activeWordId);
      } else {
        targetWord = prev
          .filter(w => w.text.toLowerCase().startsWith(char))
          .sort((a, b) => b.x - a.x)[0];
      }

      if (!targetWord) return prev;

      if (targetWord.text[targetWord.typedIndex].toLowerCase() === char) {
        const nextTypedIndex = targetWord.typedIndex + 1;
        const isComplete = nextTypedIndex === targetWord.text.length;

        if (isComplete) {
          createInkSplatter(targetWord.x + 80, targetWord.y);
          setScore(s => {
            const newScore = s + targetWord!.text.length * 20;
            if (Math.floor(newScore / 2000) > Math.floor(s / 2000)) {
                setLevel(l => l + 1);
            }
            return newScore;
          });
          setActiveWordId(null);
          return prev.map(w => w.id === targetWord!.id ? { ...w, typedIndex: nextTypedIndex, isHit: true } : w);
        } else {
          setActiveWordId(targetWord.id);
          return prev.map(w => w.id === targetWord!.id ? { ...w, typedIndex: nextTypedIndex } : w);
        }
      }
      return prev;
    });
  }, [status, activeWordId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const startGame = () => {
    setScore(0);
    setHealth(INITIAL_HEALTH);
    setLevel(1);
    setWords([]);
    setActiveWordId(null);
    setParticles([]);
    spawnCountRef.current = 0;
    setStatus(GameStatus.PLAYING);
  };

  return (
    <div className="relative w-full h-screen parchment overflow-hidden select-none">
      {/* Scroll Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none grayscale">
          <div className="absolute top-10 left-0 w-full text-[120px] font-classic whitespace-nowrap opacity-20 animate-drift">
            Tale of the Ink and Arrow • Volley of the Scribe • Marksman of Antiquity • 
          </div>
          <div className="absolute bottom-10 left-0 w-full text-[120px] font-classic whitespace-nowrap opacity-20 animate-drift direction-reverse" style={{ animationDirection: 'reverse' }}>
            A Song of Strings • Feathers in Flight • The Classic Archer • 
          </div>
      </div>

      <div className="relative w-full h-full z-10">
        {status === GameStatus.PLAYING && (
          <>
            <Archer x={archerPos.x} y={archerPos.y} isActive={!!activeWordId} isFiring={isFiring} />
            
            {words.map(word => (
              <WordItem 
                key={word.id} 
                word={word} 
                isActive={word.id === activeWordId}
              />
            ))}

            {particles.map(p => (
              <div 
                key={p.id}
                className="absolute w-2 h-2 rounded-full pointer-events-none z-50"
                style={{
                  left: p.x,
                  top: p.y,
                  backgroundColor: p.color,
                  opacity: p.life,
                  transform: `scale(${p.life * 2}) rotate(${p.life * 360}deg)`,
                }}
              />
            ))}
          </>
        )}

        <HUD score={score} health={health} level={level} />

        {status === GameStatus.START && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2c1810]/40 backdrop-blur-[2px] z-50">
            <div className="text-center p-16 bg-[#f4ecd8] ink-border rounded-lg shadow-2xl max-w-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#2c1810]"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#2c1810]"></div>
              
              <h1 className="text-7xl font-classic text-[#2c1810] mb-4">THE SCRIBE'S VOLLEY</h1>
              <div className="h-0.5 w-1/2 bg-[#2c1810] mx-auto mb-8"></div>
              
              <p className="text-[#2c1810] mb-12 text-2xl font-medieval italic leading-relaxed px-8">
                Your words are your weapons, your keystrokes the wind. Intercept the voids before they vanish into the ether.
              </p>
              
              <button 
                onClick={startGame}
                className="px-16 py-6 border-4 border-[#2c1810] text-[#2c1810] hover:bg-[#2c1810] hover:text-[#f4ecd8] font-classic text-4xl transition-all shadow-lg active:scale-95"
              >
                UNROLL THE SCROLL
              </button>
            </div>
          </div>
        )}

        {status === GameStatus.GAMEOVER && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2c1810]/80 z-50">
            <div className="text-center p-20 bg-[#f4ecd8] ink-border rounded-sm max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <h1 className="text-6xl font-classic text-[#8b0000] mb-4">FINIS</h1>
              <p className="text-[#2c1810] mb-12 text-xl font-medieval opacity-70">The ink has run dry, and the volley is ended.</p>
              
              <div className="bg-[#2c1810]/5 p-8 border-y-2 border-[#2c1810]/20 mb-12">
                  <div className="text-[#2c1810] text-sm uppercase tracking-widest mb-2 font-bold">Chronicle Record</div>
                  <div className="text-7xl font-classic text-[#2c1810]">{score}</div>
                  <div className="mt-2 text-[#2c1810] font-medieval italic">Wave {level} reached</div>
              </div>

              <button 
                onClick={startGame}
                className="px-12 py-4 bg-[#2c1810] text-[#f4ecd8] font-classic text-2xl hover:bg-[#4a2b1f] transition-colors"
              >
                BEGIN ANEW
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative borders for the whole app */}
      <div className="absolute top-0 left-0 w-full h-4 bg-[#2c1810]/20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-4 bg-[#2c1810]/20 pointer-events-none"></div>
    </div>
  );
};

export default App;

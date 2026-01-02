
export interface WordTarget {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  typedIndex: number;
  isHit?: boolean;
}

export interface GameState {
  score: number;
  health: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
  words: WordTarget[];
  activeWordId: string | null;
}

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

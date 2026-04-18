import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const TICK_RATE = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  while (true) {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return newFood;
    }
  }
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const dirQueueRef = useRef<Point[]>([]);
  const currentDirRef = useRef<Point>({ x: 0, y: 0 });

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    currentDirRef.current = { x: 0, y: 0 };
    dirQueueRef.current = [];
    setFood({ x: 15, y: 10 });
    setGameOver(false);
    setScore(0);
    setHasStarted(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      
      const lastPending = dirQueueRef.current.length > 0 
        ? dirQueueRef.current[dirQueueRef.current.length - 1] 
        : currentDirRef.current;
      
      let newDir: Point | null = null;
      if (e.key === 'ArrowUp' && lastPending.y !== 1) newDir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && lastPending.y !== -1) newDir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && lastPending.x !== 1) newDir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && lastPending.x !== -1) newDir = { x: 1, y: 0 };

      if (newDir) {
        if (!hasStarted) {
          setHasStarted(true);
        }
        dirQueueRef.current.push(newDir);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted]);

  useEffect(() => {
    if (gameOver || !hasStarted) return;

    const intervalId = setInterval(() => {
      setSnake(prev => {
        let nextDir = currentDirRef.current;
        if (dirQueueRef.current.length > 0) {
          nextDir = dirQueueRef.current.shift()!;
          currentDirRef.current = nextDir;
        }

        const head = prev[0];
        const newHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [gameOver, hasStarted, food]);

  return (
    <div className="flex flex-col items-center max-w-full z-10 w-full sm:w-[400px]">
      <div className="flex justify-between w-full mb-2 items-center px-1">
        <h2 className="font-pixel text-lg sm:text-xl text-[#00ffff] uppercase">
          SEQ_SCORE // {score.toString().padStart(4, '0')}
        </h2>
        {gameOver && (
          <span className="text-[#ff00ff] glitch font-vt323 text-3xl font-bold uppercase" data-text="ERR:TERMINAL">ERR:TERMINAL</span>
        )}
      </div>

      <div 
        className="grid bg-[#000] border-4 border-[#ff00ff] shadow-[4px_4px_0_#00ffff] relative overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: '100%',
          aspectRatio: '1/1'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = !isHead && snake.some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
             <div key={i} className="flex justify-center items-center w-full h-full relative" style={{border: '0.5px solid rgba(0,255,255,0.1)'}}>
                {isHead && <div className="w-full h-full bg-[#00ffff] z-10" />}
                {isBody && <div className="w-[80%] h-[80%] bg-[#00ffff]/80" />}
                {isFood && <div className="w-full h-full bg-[#ff00ff] animate-pulse z-10" />}
            </div>
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-[2px]">
            <h3 className="font-pixel text-2xl text-[#ff00ff] mb-8 glitch uppercase" data-text="FATAL_ERROR">FATAL_ERROR</h3>
            <button 
              onClick={resetGame}
              className="px-4 py-2 bg-[#00ffff] text-black border-none hover:bg-[#ff00ff] hover:text-black transition-none font-vt323 text-2xl uppercase shadow-[4px_4px_0_#fff]"
            >
              [ REBOOT_SEQUENCE ]
            </button>
          </div>
        )}

        {!hasStarted && !gameOver && (
           <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
             <div className="bg-[#ff00ff] text-black px-4 py-2 font-vt323 text-3xl uppercase animate-pulse border-2 border-[#00ffff]">
               &gt; INPUT_REQUIRED
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

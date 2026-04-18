import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-vt323">
      {/* Static Noise Overlay */}
      <div className="bg-noise mix-blend-screen"></div>
      
      {/* Screen Tearing line effect */}
      <div className="screen-tear"></div>
      
      <header className="mb-8 z-10 text-center flex flex-col items-center mt-4">
        <h1 
           className="glitch text-3xl sm:text-5xl font-pixel tracking-widest text-white mb-2 uppercase" 
           data-text="SECTOR_0XF_SNAKE">
          SECTOR_0XF_SNAKE
        </h1>
        <div className="bg-[#ff00ff] text-black px-2 py-1 font-vt323 text-xl sm:text-2xl w-max uppercase border-2 border-[#00ffff] skew-x-[-10deg]">
          WARNING: UNAUTHORIZED_AUDIO_STREAM_DETECTED
        </div>
      </header>

      <main className="flex flex-col items-center w-full z-10 gap-6">
        <SnakeGame />
        <MusicPlayer />
      </main>

    </div>
  );
}

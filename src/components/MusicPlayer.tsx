import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI Neon Drive (Generated)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Synthwave Setup (Generated)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Network Pulse (Generated)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn("Autoplay prevented pending user interaction", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const handleNext = () => {
    setCurrentTrackIdx(prev => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIdx(prev => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full sm:w-[400px] mt-2 p-4 bg-black border-4 border-[#00ffff] shadow-[-6px_6px_0_#ff00ff] flex flex-col z-10 relative">
      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrackIdx].url} 
        onEnded={handleNext}
      />
      
      <div className="flex flex-col mb-4 relative z-10 border-b-4 border-double border-[#ff00ff] pb-2">
        <span className="text-xl text-[#00ffff] font-vt323 tracking-widest uppercase mb-1">
          &gt; AUDIO_DECRYPT: [ <span className={isPlaying ? "text-[#ff00ff] animate-pulse" : ""}>{isPlaying ? "ACTIVE" : "IDLE"}</span> ]
        </span>
        <span className="text-[#ff00ff] font-pixel text-[8px] sm:text-[10px] w-full truncate uppercase mt-2">
           FILE:// {TRACKS[currentTrackIdx].title}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 relative z-10">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="text-black bg-[#ff00ff] border-2 border-[#ff00ff] p-1.5 hover:bg-[#00ffff] hover:border-[#00ffff] transition-none"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-[#00ffff] bg-black border-2 border-[#00ffff] p-1.5 hover:bg-[#ff00ff] hover:text-black hover:border-black transition-none"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-black bg-[#00ffff] border-2 border-[#00ffff] p-3 hover:bg-[#ff00ff] hover:border-[#ff00ff] transition-none shadow-[4px_4px_0_#fff]"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-[2px]" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-[#00ffff] bg-black border-2 border-[#00ffff] p-1.5 hover:bg-[#ff00ff] hover:text-black hover:border-black transition-none"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

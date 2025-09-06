"use client";

import { useState, useRef, useEffect } from 'react';

// Define the SVG icons for play and pause
const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 4v16l13-8L6 4z" />
  </svg>
);

const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8 4h3v16H8V4zm5 0h3v16h-3V4z" />
  </svg>
);

interface CustomAudioPlayerProps {
  audioUrl: string;
}

export const CustomAudioPlayer = ({ audioUrl }: CustomAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // This effect synchronizes the component's state with the audio element's actual state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Autoplay logic
    // We try to play, and if it succeeds, the `onPlay` event will set the state.
    // Browsers might block autoplay, so we don't set state directly here.
    audio.play().catch(error => console.log("Autoplay was prevented:", error));

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]); // Rerun effect if the audio source changes

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  };

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg bg-black/10 dark:bg-white/10 w-full max-w-xs">
      {/* The actual audio element is hidden, but controlled by our button */}
      <audio ref={audioRef} src={audioUrl} preload="auto" />
      
      <button
        onClick={togglePlayPause}
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-100"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>

      {/* Animation Section: Renders only when playing */}
      <div className="flex items-center justify-center gap-1 w-full h-8 overflow-hidden">
        {isPlaying ? (
          <>
            {/* These divs create the animated "sound wave" effect */}
            <span className="w-1 h-2 bg-primary-foreground/80 rounded-full animate-wave" />
            <span className="w-1 h-4 bg-primary-foreground/80 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
            <span className="w-1 h-6 bg-primary-foreground/80 rounded-full animate-wave" style={{ animationDelay: '0.4s' }} />
            <span className="w-1 h-3 bg-primary-foreground/80 rounded-full animate-wave" style={{ animationDelay: '0.6s' }} />
            <span className="w-1 h-5 bg-primary-foreground/80 rounded-full animate-wave" style={{ animationDelay: '0.8s' }} />
          </>
        ) : (
           <div className="w-full h-[2px] bg-primary-foreground/30 rounded-full" />
        )}
      </div>
    </div>
  );
};
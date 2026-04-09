import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { albums } from '@/constants/albums';

type PlayerContextValue = {
  currentIndex: number;
  isPlaying: boolean;
  currentAlbum: (typeof albums)[number];
  setTrackByIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const setTrackByIndex = (index: number) => {
    if (index >= 0 && index < albums.length) {
      setCurrentIndex(index);
    }
  };

  const playNext = () => {
    setCurrentIndex((prev) => (prev + 1) % albums.length);
  };

  const playPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + albums.length) % albums.length);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      currentIndex,
      isPlaying,
      currentAlbum: albums[currentIndex] ?? albums[0],
      setTrackByIndex,
      playNext,
      playPrevious,
      togglePlay,
    }),
    [currentIndex, isPlaying]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { albums } from "@/constants/albums";

export type RepeatMode = 0 | 1 | 2; // 0 = off, 1 = repeat-all, 2 = repeat-one

type PlayerContextValue = {
  currentIndex: number;
  isPlaying: boolean;
  currentAlbum: (typeof albums)[number];
  isShuffle: boolean;
  repeatMode: RepeatMode;
  favorites: string[];
  setTrackByIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  stopPlay: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Keep a ref to isShuffle and repeatMode for use inside callbacks
  const isShuffleRef = useRef(isShuffle);
  const repeatModeRef = useRef(repeatMode);
  isShuffleRef.current = isShuffle;
  repeatModeRef.current = repeatMode;

  const setTrackByIndex = useCallback((index: number) => {
    if (index >= 0 && index < albums.length) {
      setCurrentIndex(index);
    }
  }, []);

  const playNext = useCallback(() => {
    if (isShuffleRef.current) {
      // Pick random index different from current
      setCurrentIndex((prev) => {
        if (albums.length <= 1) return prev;
        let next: number;
        do {
          next = Math.floor(Math.random() * albums.length);
        } while (next === prev);
        return next;
      });
    } else {
      setCurrentIndex((prev) => {
        if (repeatModeRef.current === 2) return prev; // repeat-one: stay
        return (prev + 1) % albums.length;
      });
    }
  }, []);

  const playPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + albums.length) % albums.length);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const stopPlay = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => ((prev + 1) % 3) as RepeatMode);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const value = useMemo(
    () => ({
      currentIndex,
      isPlaying,
      currentAlbum: albums[currentIndex] ?? albums[0],
      isShuffle,
      repeatMode,
      favorites,
      setTrackByIndex,
      playNext,
      playPrevious,
      togglePlay,
      stopPlay,
      toggleShuffle,
      cycleRepeat,
      toggleFavorite,
      isFavorite,
    }),
    [
      currentIndex,
      isPlaying,
      isShuffle,
      repeatMode,
      favorites,
      setTrackByIndex,
      playNext,
      playPrevious,
      togglePlay,
      stopPlay,
      toggleShuffle,
      cycleRepeat,
      toggleFavorite,
      isFavorite,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}

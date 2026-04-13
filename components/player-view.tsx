import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePlayer } from "@/contexts/player-context";
import { useTheme } from "../contexts/ThemeContext";
import { albums } from "@/constants/albums";

type PlayerViewProps = {
  onClose: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const LYRICS: Record<string, string[]> = {
  /* ── The Marías ─────────────────────────────────────────────────── */
  "marias-1": [
    "I've been out of my mind lately",
    "out of my mind",
    "",
    "talk to me, talk to me",
    "like you used to",
    "hold on to, hold on to",
    "what we're going through",
    "",
    "I still feel you everywhere",
    "I still feel you in the air",
    "I close my eyes and there you are",
    "like you never went that far",
    "",
    "No one noticed when you left",
    "no one noticed at all",
    "was I the only one who heard",
    "the silence in the hall",
    "",
    "So I stay up talking to the dark",
    "keeping every piece of every scar",
    "loving someone who has gone away",
    "no one noticed anyway",
    "",
    "I've been out of my mind lately",
    "out of my mind",
  ],
  "marias-2": [
    "Sienna skies above me",
    "warm like amber, soft as sand",
    "",
    "drift me somewhere quiet",
    "where nobody understands",
    "",
    "every shade of golden",
    "every hue of rose and rust",
    "sienna light at evening",
    "turning everything to dust",
    "",
    "stay a little longer",
    "let the color wash through me",
    "sienna, sienna",
    "you are all I want to see",
  ],
  "marias-3": [
    "This is heavy",
    "heavier than before",
    "",
    "you left me with it",
    "left it at my door",
    "",
    "I've been carrying this",
    "for longer than I know",
    "heavy on my chest",
    "heavy in my bones",
    "",
    "Tell me how to let it go",
    "tell me what it means",
    "heavy is the heart",
    "that lives between the seams",
    "",
    "This is heavy",
    "heavier than before",
  ],
  "marias-4": [
    "Lejos de ti",
    "el tiempo no se mueve",
    "",
    "todo lo que éramos",
    "se queda entre las nubes",
    "",
    "Y aunque intento olvidarte",
    "tu voz sigue en el viento",
    "lejos de ti",
    "cerca del tormento",
    "",
    "Qué difícil es vivir",
    "cuando tú no estás aquí",
    "lejos de ti",
    "tan lejos de ti",
  ],
  "marias-5": [
    "I don't want nobody new",
    "I only want you",
    "",
    "every face I see",
    "is just a shadow of you",
    "",
    "I've tried to move along",
    "pretend that I'm fine",
    "but nobody new",
    "ever crosses my mind",
    "",
    "so I'll wait here",
    "in the same old space",
    "nobody new",
    "could ever take your place",
  ],
  "marias-6": [
    "Nadie lo notó",
    "cuando te marchaste",
    "",
    "nadie preguntó",
    "a dónde ibas cuando te alejaste",
    "",
    "Yo sigo aquí",
    "con tu recuerdo entre las manos",
    "nadie lo notó",
    "solo yo quedé en el llano",
    "",
    "El silencio del pasillo",
    "solo yo lo pude oír",
    "nadie lo notó",
    "y así me quedé sin ti",
  ],
  "marias-7": [
    "Come back to me",
    "wherever you are",
    "",
    "I've been waiting here",
    "under the same old star",
    "",
    "the nights are long",
    "without you by my side",
    "come back to me",
    "I've got nowhere else to hide",
    "",
    "I'll leave the light on",
    "I'll leave the door wide",
    "come back to me",
    "like you promised that night",
  ],
  "marias-8": [
    "Cariño, te quiero",
    "más de lo que sé decir",
    "",
    "en tus ojos encuentro",
    "todo lo que quiero vivir",
    "",
    "Cariño, despacio",
    "cuéntame lo que soñaste",
    "que aquí entre tus brazos",
    "todo el mundo se apagaste",
    "",
    "Cariño, te quiero",
    "más de lo que puedo dar",
    "pero aquí estoy contigo",
    "y eso es todo lo demás",
  ],

  /* ── Skrillex ───────────────────────────────────────────────────── */
  "skrillex-1": [
    "Scary monsters and nice sprites",
    "make you run, make you run, make you run",
    "",
    "Electric pulse in the air",
    "feel the bass shake everywhere",
    "nice sprites dancing in the light",
    "scary monsters out tonight",
    "",
    "Drop it",
    "let the beat break through",
    "lock it",
    "everything is new",
    "",
    "Scary monsters and nice sprites",
    "make you run, make you run",
  ],
  "skrillex-2": [
    "Call 9-1-1",
    "now now now",
    "",
    "First of the year",
    "the beat is dropping",
    "equinox rising",
    "can you feel it",
    "",
    "Shadows in the dark",
    "fire in the hall",
    "first of the year",
    "watching empires fall",
    "",
    "Call 9-1-1",
    "now now now",
  ],
  "skrillex-3": [
    "I want to kill everybody",
    "in the world",
    "",
    "Bass heavy, bass heavy",
    "take it to the floor",
    "kill everybody",
    "we want more and more",
    "",
    "Electric current through my veins",
    "the whole world feels the bass",
    "kill everybody",
    "not a single trace",
    "",
    "Bass drop",
    "kill everybody",
  ],
  "skrillex-4": [
    "We are at the summit",
    "standing at the top",
    "",
    "looking down together",
    "we will never stop",
    "",
    "Higher than the clouds",
    "further than the sea",
    "at the summit now",
    "just you and me",
    "",
    "Let the moment last",
    "don't let it fade away",
    "we are at the summit",
    "we found our way",
  ],
  "skrillex-5": [
    "Recess is now",
    "let the children play",
    "",
    "bass is in the building",
    "bass won't go away",
    "",
    "Take a break from thinking",
    "let the music in",
    "recess is forever",
    "let the fun begin",
    "",
    "Drop it on the floor",
    "feel the system shake",
    "recess is now",
    "for everyone's sake",
  ],
  "skrillex-6": [
    "Mumbai power",
    "rising from the streets",
    "",
    "feel the current flowing",
    "in the pulse and beats",
    "",
    "City lights are glowing",
    "bass is in the air",
    "Mumbai power",
    "feel it everywhere",
    "",
    "Beam it through the speakers",
    "let the low end hit",
    "Mumbai power",
    "this is it",
  ],
  "skrillex-7": [
    "Try it out",
    "just try it out",
    "",
    "feel the groove inside you",
    "let it all come out",
    "",
    "Smooth like velvet",
    "deep like ocean floor",
    "try it out",
    "you'll keep coming back for more",
    "",
    "Lose yourself in rhythm",
    "let the music guide",
    "try it out",
    "just feel it deep inside",
  ],
  "skrillex-8": [
    "Ease my mind",
    "ease my mind tonight",
    "",
    "take away the weight",
    "of all that I fight",
    "",
    "Something in the music",
    "calms the storm in me",
    "ease my mind",
    "set the feeling free",
    "",
    "Let the bass roll over",
    "let the melody stay",
    "ease my mind",
    "wash it all away",
  ],
};

const DEFAULT_LYRICS = [
  "♪ No lyrics available for this track ♪",
  "",
  "Stay tuned...",
];

const getLyrics = (id?: string, artist?: string): string[] => {
  if (id && LYRICS[id]) return LYRICS[id];
  if (artist?.toLowerCase().includes("skrillex")) return LYRICS["skrillex-1"];
  if (
    artist?.toLowerCase().includes("marías") ||
    artist?.toLowerCase().includes("marias")
  )
    return LYRICS["marias-1"];
  return DEFAULT_LYRICS;
};
const COVER_SIZE = SCREEN_WIDTH - 76;
const WARM_ACCENT = "#A30000";
const DISMISS_THRESHOLD = 120;
const DISMISS_VELOCITY = 1.2;

export function PlayerView({ onClose }: PlayerViewProps) {
  const { c, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    currentAlbum,
    isPlaying,
    togglePlay,
    stopPlay,
    playNext,
    playPrevious,
    isShuffle,
    repeatMode,
    toggleShuffle,
    cycleRepeat,
    toggleFavorite,
    isFavorite,
    currentIndex,
    setTrackByIndex,
  } = usePlayer();

  /* ── Animations ─────────────────────────────────────────────────────────── */
  const scaleAnim = useRef(new Animated.Value(1)).current;

  /* ── Lyrics panel ───────────────────────────────────────────────────────── */
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const lyricsAnim = useRef(new Animated.Value(0)).current;
  const [activeLine, setActiveLine] = useState(2);

  const openLyrics = () => {
    setLyricsOpen(true);
    Animated.spring(lyricsAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 240,
      mass: 0.9,
    }).start();
  };

  const closeLyrics = () => {
    Animated.timing(lyricsAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start(() => setLyricsOpen(false));
  };

  /* ── Queue panel ─────────────────────────────────────────────────────────── */
  const [queueOpen, setQueueOpen] = useState(false);
  const queueAnim = useRef(new Animated.Value(0)).current;

  const openQueue = () => {
    setQueueOpen(true);
    Animated.spring(queueAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 240,
      mass: 0.9,
    }).start();
  };

  const closeQueue = () => {
    Animated.timing(queueAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start(() => setQueueOpen(false));
  };

  /* ── Options menu ───────────────────────────────────────────────────────── */
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setMenuView("main");
    setMenuOpen(true);
    Animated.spring(menuAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 260,
      mass: 0.9,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  /* ── Menu view (main | timer) ──────────────────────────────────────────── */
  const [menuView, setMenuView] = useState<"main" | "timer">("main");

  /* ── Sleep timer ───────────────────────────────────────────────────────── */
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepEndRef = useRef<number>(0);
  const [sleepLabel, setSleepLabel] = useState<string | null>(null);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const startSleepTimer = (minutes: number) => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    sleepEndRef.current = Date.now() + minutes * 60 * 1000;
    setSleepLabel(`${minutes} min`);
    sleepTimerRef.current = setTimeout(
      () => {
        if (isPlayingRef.current) stopPlay();
        setSleepLabel(null);
        sleepTimerRef.current = null;
      },
      minutes * 60 * 1000,
    );
    setMenuView("main");
    closeMenu();
  };

  const cancelSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    setSleepLabel(null);
  };

  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, []);

  /* ── Share ─────────────────────────────────────────────────────────────── */
  const handleShare = async () => {
    closeMenu();
    await Share.share({
      message: `🎵 ${currentAlbum?.title ?? "Track"} — ${currentAlbum?.artist ?? "Artist"}`,
      title: currentAlbum?.title ?? "Track",
    });
  };

  /* ── Favorito ──────────────────────────────────────────────────────────── */
  const favorited = currentAlbum?.id ? isFavorite(currentAlbum.id) : false;

  /* ── DNA expand ────────────────────────────────────────────────────────── */
  const [dnaOpen, setDnaOpen] = useState(false);
  const dnaAnim = useRef(new Animated.Value(0)).current;

  const toggleDna = () => {
    const next = !dnaOpen;
    setDnaOpen(next);
    Animated.spring(dnaAnim, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      damping: 14,
      stiffness: 200,
      mass: 0.8,
    }).start();
  };
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy >= 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > DISMISS_VELOCITY) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 220,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 18,
            stiffness: 280,
          }).start();
        }
      },
    }),
  ).current;

  const handlePlayPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 10,
        stiffness: 220,
      }),
    ]).start();
    togglePlay();
  };

  /* ── Colour tokens ───────────────────────────────────────────────────────── */
  const bg = c.bg;
  const textPrimary = c.textPrimary;
  const textSec = c.textSecondary;

  const playBg = isDark ? "#FBFFFE" : "#121212";
  const playIcon = isDark ? "#121212" : "#FBFFFE";
  const handleColor = isDark ? "rgba(255,255,255,0.28)" : "rgba(18,18,18,0.22)";
  const trackBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(18,18,18,0.12)";
  const btnBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(18,18,18,0.07)";

  /* ── Render ──────────────────────────────────────────────────────────────── */
  return (
    <Animated.View
      style={[
        styles.root,
        { backgroundColor: bg, transform: [{ translateY }] },
      ]}
    >
      {/* ── Header: pill + route + waveform ────────────────────────────────── */}
      <View
        style={[styles.headerArea, { paddingTop: insets.top + 4 }]}
        {...panResponder.panHandlers}
      >
        {/* Drag pill — centred */}
        <View style={[styles.handle, { backgroundColor: handleColor }]} />

        {/* Route row */}
        <View style={styles.routeRow}>
          <Ionicons
            name="musical-note"
            size={11}
            color={textSec}
            style={styles.routeIcon}
          />
          <Text
            style={[styles.routeText, { color: textSec }]}
            numberOfLines={1}
          >
            Playlist: Kimberella
          </Text>

          {/* Waveform button — top-right (geometric concentric arcs) */}
          <TouchableOpacity
            activeOpacity={0.72}
            style={[styles.cornerBtn, { backgroundColor: btnBg }]}
          >
            <MaterialCommunityIcons name="waveform" size={20} color={textSec} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Cover ──────────────────────────────────────────────────────────── */}
      <View style={styles.coverSection} {...panResponder.panHandlers}>
        <View
          style={[
            styles.coverShell,
            { shadowColor: isDark ? "#000000" : "#33658A" },
          ]}
        >
          {currentAlbum?.cover ? (
            <Image
              source={
                typeof currentAlbum.cover === "string"
                  ? { uri: currentAlbum.cover }
                  : currentAlbum.cover
              }
              style={styles.cover}
              contentFit="cover"
              transition={280}
            />
          ) : (
            <View
              style={[
                styles.coverFallback,
                { backgroundColor: isDark ? "#1A1A1A" : "#C8E0E0" },
              ]}
            >
              <Ionicons name="musical-notes" size={72} color={textSec} />
            </View>
          )}
        </View>
      </View>

      {/* ── Info + controls ────────────────────────────────────────────────── */}
      <View
        style={[
          styles.bottomSection,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {/* Title + artist + 3-dot menu button */}
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            <Text
              style={[styles.trackTitle, { color: textPrimary }]}
              numberOfLines={1}
            >
              {currentAlbum?.title ?? "Unknown Track"}
            </Text>
            <Text
              style={[styles.trackArtist, { color: textSec }]}
              numberOfLines={1}
            >
              {currentAlbum?.artist ?? "Unknown Artist"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={openMenu}
            activeOpacity={0.7}
            style={[styles.dotsBtn, { backgroundColor: btnBg }]}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color={textSec} />
          </TouchableOpacity>
        </View>

        {/* Quality badge — replaces album/subtitle label */}
        <View style={styles.qualityRow}>
          <View style={[styles.qualityPill, { borderColor: WARM_ACCENT }]}>
            <Text style={[styles.qualityFormat, { color: WARM_ACCENT }]}>
              FLAC
            </Text>
          </View>
          <Text style={[styles.qualityDetail, { color: textSec }]}>
            24-bit · 48 kHz
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressArea}>
          <View style={[styles.progressTrack, { backgroundColor: trackBg }]}>
            <View
              style={[styles.progressFill, { backgroundColor: WARM_ACCENT }]}
            />
          </View>
          <View style={styles.progressTimes}>
            <Text style={[styles.timeText, { color: textSec }]}>0:00</Text>
            <Text style={[styles.timeText, { color: textSec }]}>
              {currentAlbum?.duration ?? "--:--"}
            </Text>
          </View>
        </View>

        {/* Main controls */}
        <View style={styles.mainControls}>
          <TouchableOpacity activeOpacity={0.7} style={styles.sideIconButton}>
            <Ionicons name="shuffle-outline" size={22} color={textSec} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={playPrevious}
            style={styles.navButton}
          >
            <Ionicons name="play-skip-back" size={30} color={textPrimary} />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handlePlayPress}
              style={[
                styles.playButton,
                {
                  backgroundColor: playBg,
                  shadowColor: isDark ? "#000000" : "#33658A",
                },
              ]}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={28}
                color={playIcon}
                style={isPlaying ? undefined : { marginLeft: 3 }}
              />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={playNext}
            style={styles.navButton}
          >
            <Ionicons name="play-skip-forward" size={30} color={textPrimary} />
          </TouchableOpacity>

          {/* Loop / repeat — replaces old list icon */}
          <TouchableOpacity activeOpacity={0.7} style={styles.sideIconButton}>
            <Ionicons name="repeat-outline" size={22} color={textSec} />
          </TouchableOpacity>
        </View>

        {/* Bottom bar: lyrics · [bpm ← dna → mood] · playlist */}
        <View style={styles.bottomBar}>
          {/* Lyrics — bottom-left */}
          <TouchableOpacity
            activeOpacity={0.72}
            onPress={openLyrics}
            style={[styles.cornerBtn, { backgroundColor: btnBg }]}
          >
            <MaterialCommunityIcons
              name="comment-quote-outline"
              size={20}
              color={WARM_ACCENT}
            />
          </TouchableOpacity>

          {/* ── DNA expand group ─────────────────────────────────────── */}
          <View style={styles.dnaGroup}>
            {/* BPM — slides left on press */}
            <Animated.View
              pointerEvents={dnaOpen ? "box-none" : "none"}
              style={[
                styles.dnaGroupSide,
                {
                  opacity: dnaAnim,
                  transform: [
                    {
                      translateX: dnaAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -56],
                      }),
                    },
                    {
                      scale: dnaAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.4, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.72}
                style={[
                  styles.sideOptionBtn,
                  {
                    backgroundColor: isDark
                      ? "rgba(184,115,51,0.13)"
                      : "rgba(184,115,51,0.09)",
                    borderColor: isDark
                      ? "rgba(184,115,51,0.42)"
                      : "rgba(184,115,51,0.32)",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="metronome"
                  size={19}
                  color={WARM_ACCENT}
                />
              </TouchableOpacity>
            </Animated.View>

            {/* DNA button — always visible */}
            <TouchableOpacity
              onPress={toggleDna}
              activeOpacity={0.75}
              style={[
                styles.dnaBtn,
                {
                  backgroundColor: dnaOpen
                    ? isDark
                      ? "rgba(184,115,51,0.22)"
                      : "rgba(184,115,51,0.16)"
                    : isDark
                      ? "rgba(184,115,51,0.13)"
                      : "rgba(184,115,51,0.09)",
                  borderColor: isDark
                    ? "rgba(184,115,51,0.50)"
                    : "rgba(184,115,51,0.40)",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="dna"
                size={26}
                color={WARM_ACCENT}
                style={{ transform: [{ rotate: "30deg" }] }}
              />
            </TouchableOpacity>

            {/* Mood — slides right on press */}
            <Animated.View
              pointerEvents={dnaOpen ? "box-none" : "none"}
              style={[
                styles.dnaGroupSide,
                {
                  opacity: dnaAnim,
                  transform: [
                    {
                      translateX: dnaAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 56],
                      }),
                    },
                    {
                      scale: dnaAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.4, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.72}
                style={[
                  styles.sideOptionBtn,
                  {
                    backgroundColor: isDark
                      ? "rgba(184,115,51,0.13)"
                      : "rgba(184,115,51,0.09)",
                    borderColor: isDark
                      ? "rgba(184,115,51,0.42)"
                      : "rgba(184,115,51,0.32)",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="palette-outline"
                  size={19}
                  color={WARM_ACCENT}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
          {/* ── end DNA group ────────────────────────────────────────── */}

          {/* Playlist / queue — bottom-right */}
          <TouchableOpacity
            activeOpacity={0.72}
            onPress={openQueue}
            style={[styles.cornerBtn, { backgroundColor: btnBg }]}
          >
            <MaterialCommunityIcons
              name="format-list-bulleted-square"
              size={20}
              color={WARM_ACCENT}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* ── Lyrics panel ─────────────────────────────────────────────────── */}
      {lyricsOpen && (
        <Animated.View
          style={[
            styles.lyricsPanel,
            {
              backgroundColor: bg,
              transform: [
                {
                  translateY: lyricsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [SCREEN_HEIGHT, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.lyricsHeader, { paddingTop: insets.top + 6 }]}>
            <TouchableOpacity
              onPress={closeLyrics}
              activeOpacity={0.7}
              style={[styles.lyricsBackBtn, { backgroundColor: btnBg }]}
            >
              <Ionicons name="chevron-down" size={20} color={textSec} />
            </TouchableOpacity>

            <Text style={[styles.lyricsTitleLabel, { color: textSec }]}>
              LYRICS
            </Text>

            <View style={styles.lyricsHeaderRight} />
          </View>

          {/* Track mini-info */}
          <View style={styles.lyricsTrackInfo}>
            <Text
              style={[styles.lyricsTrackName, { color: textPrimary }]}
              numberOfLines={1}
            >
              {currentAlbum?.title ?? "Unknown Track"}
            </Text>
            <Text
              style={[styles.lyricsTrackArtist, { color: textSec }]}
              numberOfLines={1}
            >
              {currentAlbum?.artist ?? "Unknown Artist"}
            </Text>
          </View>

          {/* Lyrics scroll */}
          <ScrollView
            style={styles.lyricsScroll}
            contentContainerStyle={styles.lyricsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {getLyrics(currentAlbum?.id, currentAlbum?.artist).map(
              (line, i) => {
                const isEmpty = line.trim() === "";
                const isActive = i === activeLine;

                if (isEmpty) {
                  return <View key={i} style={styles.lyricsSpacer} />;
                }

                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.6}
                    onPress={() => setActiveLine(i)}
                    style={styles.lyricsLineBtn}
                  >
                    <Text
                      style={[
                        styles.lyricsLine,
                        {
                          color: textPrimary,
                          opacity: isActive ? 1 : 0.35,
                          fontSize: isActive ? 26 : 22,
                          fontWeight: isActive ? "800" : "600",
                          letterSpacing: isActive ? -0.5 : -0.2,
                        },
                      ]}
                    >
                      {line}
                    </Text>
                    {isActive && (
                      <View
                        style={[
                          styles.lyricsActiveDot,
                          { backgroundColor: WARM_ACCENT },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              },
            )}

            {/* Footer spacer */}
            <View style={styles.lyricsFooter}>
              <Text style={[styles.lyricsFooterText, { color: textSec }]}>
                {currentAlbum?.artist ?? ""}
              </Text>
              <Text style={[styles.lyricsFooterSub, { color: textSec }]}>
                {currentAlbum?.subtitle ?? ""}
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {/* ── Queue panel ─────────────────────────────────────────────────────────── */}
      {queueOpen && (
        <Animated.View
          style={[
            styles.lyricsPanel,
            {
              backgroundColor: bg,
              transform: [
                {
                  translateY: queueAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [SCREEN_HEIGHT, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.lyricsHeader, { paddingTop: insets.top + 6 }]}>
            <TouchableOpacity
              onPress={closeQueue}
              activeOpacity={0.7}
              style={[styles.lyricsBackBtn, { backgroundColor: btnBg }]}
            >
              <Ionicons name="chevron-down" size={20} color={textSec} />
            </TouchableOpacity>
            <Text style={[styles.lyricsTitleLabel, { color: textSec }]}>
              COLA
            </Text>
            <View style={styles.lyricsHeaderRight} />
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Now playing section */}
            <View
              style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 1.2,
                  color: WARM_ACCENT,
                  marginBottom: 12,
                }}
              >
                REPRODUCIENDO AHORA
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 14,
                  backgroundColor: isDark
                    ? "rgba(163,0,0,0.10)"
                    : "rgba(163,0,0,0.06)",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(163,0,0,0.30)"
                    : "rgba(163,0,0,0.18)",
                }}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    overflow: "hidden",
                    marginRight: 12,
                    backgroundColor: isDark ? "#1A1A1A" : "#E0E8E8",
                  }}
                >
                  {currentAlbum?.cover ? (
                    <Image
                      source={
                        typeof currentAlbum.cover === "string"
                          ? { uri: currentAlbum.cover }
                          : currentAlbum.cover
                      }
                      style={{ width: 46, height: 46 }}
                      contentFit="cover"
                      transition={180}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="musical-notes"
                        size={22}
                        color={textSec}
                      />
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "800",
                      color: textPrimary,
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {currentAlbum?.title ?? "Unknown Track"}
                  </Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: "500", color: textSec }}
                    numberOfLines={1}
                  >
                    {currentAlbum?.artist ?? "Unknown Artist"}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="waveform"
                  size={18}
                  color={WARM_ACCENT}
                />
              </View>
            </View>

            {/* Divider */}
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(0,0,0,0.08)",
                marginHorizontal: 20,
                marginVertical: 8,
              }}
            />

            {/* Up next section */}
            <View style={{ paddingHorizontal: 20 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 1.2,
                  color: textSec,
                  marginBottom: 10,
                }}
              >
                A CONTINUACIÓN
              </Text>
              {albums.map((album, i) => {
                const isCurrentTrack = i === currentIndex;
                if (isCurrentTrack) return null;
                return (
                  <TouchableOpacity
                    key={album.id}
                    activeOpacity={0.75}
                    onPress={() => {
                      setTrackByIndex(i);
                      closeQueue();
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 9,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: isDark
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(0,0,0,0.06)",
                    }}
                  >
                    <Text
                      style={{
                        width: 22,
                        fontSize: 12,
                        fontWeight: "600",
                        color: textSec,
                        textAlign: "center",
                        marginRight: 8,
                      }}
                    >
                      {i + 1}
                    </Text>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 9,
                        overflow: "hidden",
                        marginRight: 12,
                        backgroundColor: isDark ? "#1A1A1A" : "#D8EAEA",
                      }}
                    >
                      {album.cover ? (
                        <Image
                          source={{ uri: album.cover }}
                          style={{ width: 42, height: 42 }}
                          contentFit="cover"
                          transition={140}
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name="musical-notes"
                            size={18}
                            color={textSec}
                          />
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: textPrimary,
                          marginBottom: 2,
                        }}
                        numberOfLines={1}
                      >
                        {album.title ?? "Unknown"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "500",
                          color: textSec,
                        }}
                        numberOfLines={1}
                      >
                        {album.artist ?? "Unknown"}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "500",
                        color: textSec,
                        marginLeft: 8,
                      }}
                    >
                      {album.duration ?? "--:--"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {/* ── Options bottom sheet ─────────────────────────────────────────── */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeMenu}
      >
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.menuBackdrop,
            {
              opacity: menuAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={closeMenu}
          />
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          style={[
            styles.menuSheet,
            {
              backgroundColor: isDark ? "#121212" : "#ECF8F8",
              transform: [
                {
                  translateY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [420, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Pill handle */}
          <View
            style={[
              styles.menuHandle,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(26,22,18,0.18)",
              },
            ]}
          />

          {menuView === "main" ? (
            <>
              {/* Track info header */}
              <View style={styles.menuHeader}>
                <Text
                  style={[
                    styles.menuHeaderTitle,
                    { color: isDark ? "#FBFFFE" : "#121212" },
                  ]}
                  numberOfLines={1}
                >
                  {currentAlbum?.title ?? "Unknown Track"}
                </Text>
                <Text
                  style={[styles.menuHeaderArtist, { color: textSec }]}
                  numberOfLines={1}
                >
                  {currentAlbum?.artist ?? "Unknown Artist"}
                </Text>
              </View>

              <View
                style={[
                  styles.menuDivider,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(26,22,18,0.08)",
                  },
                ]}
              />

              {/* 1 — Favorito */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  currentAlbum?.id && toggleFavorite(currentAlbum.id)
                }
                style={[
                  styles.menuItem,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(26,22,18,0.06)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.menuItemIconWrap,
                    {
                      backgroundColor: favorited
                        ? "rgba(239,68,68,0.10)"
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(26,22,18,0.06)",
                    },
                  ]}
                >
                  <Ionicons
                    name={favorited ? "heart" : "heart-outline"}
                    size={18}
                    color={
                      favorited ? "#EF4444" : isDark ? "#FBFFFE" : "#121212"
                    }
                  />
                </View>
                <View style={styles.menuItemTextCol}>
                  <Text
                    style={[
                      styles.menuItemLabel,
                      {
                        color: favorited
                          ? "#EF4444"
                          : isDark
                            ? "#FBFFFE"
                            : "#121212",
                      },
                    ]}
                  >
                    {favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 2 — Shuffle */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleShuffle}
                style={[
                  styles.menuItem,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(26,22,18,0.06)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.menuItemIconWrap,
                    {
                      backgroundColor: isShuffle
                        ? "rgba(184,115,51,0.14)"
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(26,22,18,0.06)",
                    },
                  ]}
                >
                  <Ionicons
                    name="shuffle"
                    size={18}
                    color={
                      isShuffle ? WARM_ACCENT : isDark ? "#FBFFFE" : "#121212"
                    }
                  />
                </View>
                <View style={styles.menuItemTextCol}>
                  <Text
                    style={[
                      styles.menuItemLabel,
                      {
                        color: isShuffle
                          ? WARM_ACCENT
                          : isDark
                            ? "#FBFFFE"
                            : "#121212",
                      },
                    ]}
                  >
                    Modo aleatorio
                  </Text>
                  <Text style={[styles.menuItemSublabel, { color: textSec }]}>
                    {isShuffle ? "Activo" : "Desactivado"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 3 — Repetir */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={cycleRepeat}
                style={[
                  styles.menuItem,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(26,22,18,0.06)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.menuItemIconWrap,
                    {
                      backgroundColor:
                        repeatMode > 0
                          ? "rgba(184,115,51,0.14)"
                          : isDark
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(26,22,18,0.06)",
                    },
                  ]}
                >
                  <Ionicons
                    name={repeatMode === 0 ? "repeat-outline" : "repeat"}
                    size={18}
                    color={
                      repeatMode > 0
                        ? WARM_ACCENT
                        : isDark
                          ? "#FBFFFE"
                          : "#121212"
                    }
                  />
                </View>
                <View style={styles.menuItemTextCol}>
                  <Text
                    style={[
                      styles.menuItemLabel,
                      {
                        color:
                          repeatMode > 0
                            ? WARM_ACCENT
                            : isDark
                              ? "#FBFFFE"
                              : "#121212",
                      },
                    ]}
                  >
                    Repetir
                  </Text>
                  <Text style={[styles.menuItemSublabel, { color: textSec }]}>
                    {repeatMode === 0
                      ? "Desactivado"
                      : repeatMode === 1
                        ? "Repetir todo"
                        : "Repetir una"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 4 — Compartir */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleShare}
                style={[
                  styles.menuItem,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(26,22,18,0.06)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.menuItemIconWrap,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(26,22,18,0.06)",
                    },
                  ]}
                >
                  <Ionicons
                    name="share-outline"
                    size={18}
                    color={isDark ? "#FBFFFE" : "#121212"}
                  />
                </View>
                <View style={styles.menuItemTextCol}>
                  <Text
                    style={[
                      styles.menuItemLabel,
                      { color: isDark ? "#FBFFFE" : "#121212" },
                    ]}
                  >
                    Compartir
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 5 — Temporizador de sueño */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setMenuView("timer")}
                style={styles.menuItem}
              >
                <View
                  style={[
                    styles.menuItemIconWrap,
                    {
                      backgroundColor: sleepLabel
                        ? "rgba(184,115,51,0.14)"
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(26,22,18,0.06)",
                    },
                  ]}
                >
                  <Ionicons
                    name="timer-outline"
                    size={18}
                    color={
                      sleepLabel ? WARM_ACCENT : isDark ? "#FBFFFE" : "#121212"
                    }
                  />
                </View>
                <View style={styles.menuItemTextCol}>
                  <Text
                    style={[
                      styles.menuItemLabel,
                      {
                        color: sleepLabel
                          ? WARM_ACCENT
                          : isDark
                            ? "#FBFFFE"
                            : "#121212",
                      },
                    ]}
                  >
                    Temporizador de sueño
                  </Text>
                  <Text style={[styles.menuItemSublabel, { color: textSec }]}>
                    {sleepLabel ?? "Sin temporizador"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={textSec} />
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeMenu}
                style={[
                  styles.menuCancel,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(26,22,18,0.06)",
                  },
                ]}
              >
                <Text style={[styles.menuCancelText, { color: textSec }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Timer sub-menu header */}
              <View style={styles.timerHeader}>
                <TouchableOpacity
                  onPress={() => setMenuView("main")}
                  activeOpacity={0.7}
                  style={[
                    styles.timerBackBtn,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(26,22,18,0.06)",
                    },
                  ]}
                >
                  <Ionicons
                    name="chevron-back"
                    size={18}
                    color={isDark ? "#FBFFFE" : "#121212"}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.timerTitle,
                    { color: isDark ? "#FBFFFE" : "#121212" },
                  ]}
                >
                  Temporizador de sueño
                </Text>
                <View style={{ width: 36 }} />
              </View>

              <View
                style={[
                  styles.menuDivider,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(26,22,18,0.08)",
                  },
                ]}
              />

              {/* Time options */}
              {([15, 30, 45, 60] as const).map((mins, idx) => {
                const isActive = sleepLabel === `${mins} min`;
                return (
                  <TouchableOpacity
                    key={mins}
                    activeOpacity={0.7}
                    onPress={() => startSleepTimer(mins)}
                    style={[
                      styles.menuItem,
                      idx < 3 && {
                        borderBottomWidth: 1,
                        borderBottomColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(26,22,18,0.06)",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.menuItemIconWrap,
                        {
                          backgroundColor: isActive
                            ? "rgba(184,115,51,0.14)"
                            : isDark
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(26,22,18,0.06)",
                        },
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={
                          isActive
                            ? WARM_ACCENT
                            : isDark
                              ? "#FBFFFE"
                              : "#121212"
                        }
                      />
                    </View>
                    <View style={styles.menuItemTextCol}>
                      <Text
                        style={[
                          styles.menuItemLabel,
                          {
                            color: isActive
                              ? WARM_ACCENT
                              : isDark
                                ? "#FBFFFE"
                                : "#121212",
                          },
                        ]}
                      >
                        {mins} minutos
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={WARM_ACCENT}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Cancel active timer */}
              {!!sleepLabel && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    cancelSleepTimer();
                    setMenuView("main");
                  }}
                  style={[
                    styles.menuItem,
                    {
                      marginTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(26,22,18,0.08)",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.menuItemIconWrap,
                      { backgroundColor: "rgba(239,68,68,0.10)" },
                    ]}
                  >
                    <Ionicons name="timer-outline" size={18} color="#EF4444" />
                  </View>
                  <View style={styles.menuItemTextCol}>
                    <Text style={[styles.menuItemLabel, { color: "#EF4444" }]}>
                      Cancelar temporizador
                    </Text>
                    <Text style={[styles.menuItemSublabel, { color: textSec }]}>
                      {sleepLabel} restantes (aprox.)
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Back */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setMenuView("main")}
                style={[
                  styles.menuCancel,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(26,22,18,0.06)",
                    marginTop: 12,
                  },
                ]}
              >
                <Text style={[styles.menuCancelText, { color: textSec }]}>
                  Volver
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </Modal>
    </Animated.View>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  /* ── Header ──────────────────────────────────────────────────────────────── */
  headerArea: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 999,
    marginBottom: 10,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minHeight: 36,
  },
  routeIcon: {
    marginRight: 5,
    flexShrink: 0,
  },
  routeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  /* ── Cover ───────────────────────────────────────────────────────────────── */
  coverSection: {
    alignItems: "center",
    paddingHorizontal: 38,
    paddingVertical: 14,
  },
  coverShell: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#D5CCBE",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 36,
    elevation: 18,
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  coverFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Bottom section ──────────────────────────────────────────────────────── */
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    justifyContent: "space-between",
  },

  /* Title row */
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleCol: {
    flex: 1,
    paddingRight: 10,
  },
  dotsBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  trackTitle: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
    lineHeight: 34,
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },

  /* Quality badge */
  qualityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  qualityPill: {
    borderWidth: 1.2,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  qualityFormat: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  qualityDetail: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.1,
  },

  /* Progress */
  progressArea: {
    marginBottom: 2,
  },
  progressTrack: {
    width: "100%",
    height: 3,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 7,
  },
  progressFill: {
    width: "34%",
    height: "100%",
    borderRadius: 999,
  },
  progressTimes: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  /* Main controls */
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  sideIconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 12,
  },

  /* Ghost row */
  secondaryControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  ghostButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  circleGhostButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Bottom bar */
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* ── Lyrics panel ────────────────────────────────────────────────────────── */
  lyricsPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  lyricsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  lyricsBackBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  lyricsTitleLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  lyricsHeaderRight: {
    width: 34,
  },
  lyricsTrackInfo: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(120,120,128,0.18)",
    marginBottom: 8,
  },
  lyricsTrackName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  lyricsTrackArtist: {
    fontSize: 13,
    fontWeight: "500",
  },
  lyricsScroll: {
    flex: 1,
  },
  lyricsScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  lyricsLineBtn: {
    paddingVertical: 4,
    marginBottom: 2,
  },
  lyricsLine: {
    lineHeight: 34,
  },
  lyricsActiveDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    marginTop: 2,
    marginLeft: 2,
  },
  lyricsSpacer: {
    height: 22,
  },
  lyricsFooter: {
    marginTop: 40,
    alignItems: "center",
    paddingBottom: 20,
  },
  lyricsFooterText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  lyricsFooterSub: {
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.6,
  },

  /* ── Options menu sheet ──────────────────────────────────────────────────── */
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  menuSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 36,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
  },
  menuHandle: {
    alignSelf: "center",
    width: 36,
    height: 5,
    borderRadius: 999,
    marginTop: 12,
    marginBottom: 18,
  },
  menuHeader: {
    marginBottom: 14,
  },
  menuHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  menuHeaderArtist: {
    fontSize: 13,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },
  menuItemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  menuItemTextCol: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 6,
  },
  menuItemSublabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    opacity: 0.8,
  },
  timerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  timerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  timerTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  menuCancel: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  menuCancelText: {
    fontSize: 15,
    fontWeight: "700",
  },

  /* Corner buttons (waveform / lyrics / playlist) */
  cornerBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  /* DNA button — elegant, diagonal helix */
  dnaBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A30000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },

  /* DNA expand group — container wide enough for 3 items */
  dnaGroup: {
    width: 160,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Side option buttons — absolutely centred on DNA, then slide out */
  dnaGroupSide: {
    position: "absolute",
    top: 4, // (46 - 38) / 2
    left: 61, // (160 - 38) / 2
  },

  /* BPM / Mood button pill */
  sideOptionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A30000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 3,
  },
});

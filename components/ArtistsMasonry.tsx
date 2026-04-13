import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface Artist {
  id: string;
  name: string;
  tier: 0 | 1 | 2 | 3 | 4;
}

const ARTISTS: Artist[] = [
  { id: "1", name: "Bon Iver", tier: 0 },
  { id: "2", name: "Massive Attack", tier: 0 },
  { id: "3", name: "Radiohead", tier: 0 },
  { id: "4", name: "Tame Impala", tier: 0 },
  { id: "5", name: "Beach House", tier: 1 },
  { id: "6", name: "Cigarettes After Sex", tier: 1 },
  { id: "7", name: "Fleet Foxes", tier: 1 },
  { id: "8", name: "James Blake", tier: 1 },
  { id: "9", name: "Portishead", tier: 1 },
  { id: "10", name: "Sigur Rós", tier: 1 },
  { id: "11", name: "Vampire Weekend", tier: 1 },
  { id: "12", name: "Caribou", tier: 2 },
  { id: "13", name: "Coldplay", tier: 2 },
  { id: "14", name: "FKA Twigs", tier: 2 },
  { id: "15", name: "Glass Animals", tier: 2 },
  { id: "16", name: "Hozier", tier: 2 },
  { id: "17", name: "Lorde", tier: 2 },
  { id: "18", name: "Nick Drake", tier: 2 },
  { id: "19", name: "Oasis", tier: 2 },
  { id: "20", name: "Queens of the Stone Age", tier: 2 },
  { id: "21", name: "Warpaint", tier: 2 },
  { id: "22", name: "Adele", tier: 3 },
  { id: "23", name: "Daughter", tier: 3 },
  { id: "24", name: "Dorian Lynwood", tier: 3 },
  { id: "25", name: "Ella Frost", tier: 3 },
  { id: "26", name: "Emiliana Torrini", tier: 3 },
  { id: "27", name: "Ibeyi", tier: 3 },
  { id: "28", name: "Kimbra", tier: 3 },
  { id: "29", name: "The XX", tier: 3 },
  { id: "30", name: "Arca", tier: 4 },
  { id: "31", name: "Beach Boys", tier: 4 },
  { id: "32", name: "Glass Candy", tier: 4 },
  { id: "33", name: "Harper Vale", tier: 4 },
  { id: "34", name: "Ultraísta", tier: 4 },
  { id: "35", name: "Years & Years", tier: 4 },
  { id: "36", name: "Zaz", tier: 4 },
];

const SORTED_ARTISTS = [...ARTISTS].sort((a, b) =>
  a.name.localeCompare(b.name),
);

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BASE_SCALE = 1;
const MAX_SCALE = 3.6;
const SIGMA = 1.8;

interface Props {
  searchQuery?: string;
}

export default function ArtistsMasonry({ searchQuery = "" }: Props) {
  const { c } = useTheme();

  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Clear letter filter whenever the user starts typing
  useEffect(() => {
    if (searchQuery.length > 0) setSelectedLetter(null);
  }, [searchQuery]);

  // One Animated.Value per letter — scale (native driver OK)
  const scales = useRef(
    ALPHABET.map(() => new Animated.Value(BASE_SCALE)),
  ).current;

  const barHeight = useRef(520);

  // ── Gaussian magnification ───────────────────────────────────────────────
  function magnify(locationY: number) {
    const slotH = barHeight.current / ALPHABET.length;
    const focusIdx = Math.max(
      0,
      Math.min(ALPHABET.length - 1, locationY / slotH),
    );

    scales.forEach((anim, i) => {
      const dist = Math.abs(i - focusIdx);
      const extra =
        (MAX_SCALE - BASE_SCALE) *
        Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
      anim.setValue(BASE_SCALE + extra);
    });

    const idx = Math.min(25, Math.max(0, Math.round(focusIdx)));
    const letter = ALPHABET[idx];
    setSelectedLetter(letter);
  }

  function relax() {
    scales.forEach((anim) =>
      Animated.spring(anim, {
        toValue: BASE_SCALE,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }).start(),
    );
    setSelectedLetter(null);
  }

  // ── PanResponder ─────────────────────────────────────────────────────────
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => magnify(e.nativeEvent.locationY),
      onPanResponderMove: (e) => magnify(e.nativeEvent.locationY),
      onPanResponderRelease: () => relax(),
      onPanResponderTerminate: () => relax(),
    }),
  ).current;

  // ── Theme-aware tier styles ───────────────────────────────────────────────
  const TIERS = [
    {
      fontSize: 50,
      fontWeight: "900" as const,
      color: c.textPrimary,
      letterSpacing: -2,
      lineScale: 1.1,
    },
    {
      fontSize: 32,
      fontWeight: "700" as const,
      color: c.textPrimary,
      letterSpacing: -1,
      lineScale: 1.12,
    },
    {
      fontSize: 21,
      fontWeight: "600" as const,
      color: c.accent,
      letterSpacing: -0.4,
      lineScale: 1.15,
    },
    {
      fontSize: 14,
      fontWeight: "500" as const,
      color: c.textSecondary,
      letterSpacing: 0,
      lineScale: 1.18,
    },
    {
      fontSize: 10,
      fontWeight: "400" as const,
      color: c.textMuted,
      letterSpacing: 0,
      lineScale: 1.2,
    },
  ];

  // ── Filtered artists ─────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase().trim();
  const visibleArtists = SORTED_ARTISTS.filter((a) =>
    q === "" ? true : a.name.toLowerCase().includes(q),
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: c.bg }}>
      {/* ── Word cloud ──────────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 8,
          paddingBottom: 56,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          {visibleArtists.map((artist) => {
            const t = TIERS[artist.tier];
            const filtered = selectedLetter !== null && q === "";
            const matches = artist.name
              .toUpperCase()
              .startsWith(selectedLetter ?? "");

            return (
              <TouchableOpacity
                key={artist.id}
                activeOpacity={0.6}
                style={{
                  marginHorizontal: 4,
                  marginVertical: 3,
                  opacity: filtered ? (matches ? 1 : 0.1) : 1,
                }}
                onPress={() =>
                  setSelectedLetter((prev) => {
                    const first = artist.name[0].toUpperCase();
                    return prev === first ? null : first;
                  })
                }
              >
                <Text
                  style={{
                    fontSize: t.fontSize,
                    fontWeight: t.fontWeight,
                    color: t.color,
                    letterSpacing: t.letterSpacing,
                    lineHeight: t.fontSize * t.lineScale,
                  }}
                >
                  {artist.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ── A-Z index bar ───────────────────────────────────────────────── */}
      <View
        {...pan.panHandlers}
        onLayout={(e) => {
          barHeight.current = e.nativeEvent.layout.height;
        }}
        style={{
          width: 28,
          paddingVertical: 6,
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "visible",
        }}
      >
        {ALPHABET.map((letter, i) => (
          <View
            key={letter}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              overflow: "visible",
            }}
          >
            <Animated.Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: c.textSecondary,
                includeFontPadding: false,
                transform: [
                  { scale: scales[i] },
                  {
                    translateX: scales[i].interpolate({
                      inputRange: [BASE_SCALE, MAX_SCALE],
                      outputRange: [0, -10],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            >
              {letter}
            </Animated.Text>
          </View>
        ))}
      </View>
    </View>
  );
}

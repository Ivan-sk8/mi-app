import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { usePlayer } from "@/contexts/player-context";
import { useTheme } from "../contexts/ThemeContext";
import { albums } from "@/constants/albums";

const { width: W } = Dimensions.get("window");
const H_PAD = 20;
const CARD_GAP = 12;
const CARD_W = W - H_PAD * 2 - 28; // leaves ~28 px peek on right
const CARD_H = Math.round(CARD_W * 1.18);
const SNAP = CARD_W + CARD_GAP;

export default function PlaylistTab() {
  const { c, isDark } = useTheme();
  const { isPlaying, togglePlay, setTrackByIndex } = usePlayer();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SNAP);
    setActiveIdx(Math.max(0, Math.min(idx, albums.length - 1)));
  };

  const bg = c.bg;
  const cardBg = isDark ? "#1A1A1A" : "#D8EAEA";

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      {/* ── Header ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: c.textPrimary }]}>
          Playlist
        </Text>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.headerBtn, { backgroundColor: c.iconBg }]}
        >
          <Ionicons name="add" size={20} color={c.iconColor} />
        </TouchableOpacity>
      </View>

      {/* ── Carousel ─────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP}
        snapToAlignment="start"
        contentContainerStyle={[
          styles.carouselContent,
          { paddingLeft: H_PAD, paddingRight: H_PAD - CARD_GAP },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: onScroll },
        )}
        scrollEventThrottle={16}
      >
        {albums.map((album, i) => {
          const inputRange = [(i - 1) * SNAP, i * SNAP, (i + 1) * SNAP];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.94, 1, 0.94],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={album.id}
              style={[
                styles.card,
                {
                  width: CARD_W,
                  height: CARD_H,
                  marginRight: CARD_GAP,
                  backgroundColor: cardBg,
                  transform: [{ scale }],
                },
              ]}
            >
              {/* Album art */}
              {album.cover ? (
                <Image
                  source={{ uri: album.cover }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  transition={260}
                />
              ) : (
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    styles.cardFallback,
                    { backgroundColor: c.iconBg },
                  ]}
                >
                  <Ionicons
                    name="musical-notes"
                    size={48}
                    color={c.textSecondary}
                  />
                </View>
              )}

              {/* Dark gradient overlay (simulated with layered views) */}
              <View style={styles.overlayTop} />
              <View style={styles.overlayBottom} />

              {/* Text + play button */}
              <View style={styles.cardInfo}>
                <View style={styles.cardTextRow}>
                  <View style={styles.cardTextCol}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {album.title}
                    </Text>
                    <Text style={styles.cardArtist} numberOfLines={1}>
                      {album.artist}
                    </Text>
                  </View>
                </View>

                {/* Play button */}
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => {
                    setTrackByIndex(i);
                    if (!isPlaying) togglePlay();
                  }}
                  style={styles.playCircle}
                >
                  <Ionicons
                    name={activeIdx === i && isPlaying ? "pause" : "play"}
                    size={20}
                    color="#FFFFFF"
                    style={
                      activeIdx === i && isPlaying
                        ? undefined
                        : { marginLeft: 2 }
                    }
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* ── Dot indicators ───────────────────────────────────── */}
      <View style={styles.dots}>
        {albums.slice(0, 8).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIdx
                    ? c.textPrimary
                    : isDark
                      ? "rgba(255,255,255,0.22)"
                      : "rgba(26,22,18,0.18)",
                width: i === activeIdx ? 16 : 5,
              },
            ]}
          />
        ))}
      </View>

      {/* ── Track list ───────────────────────────────────────── */}
      <ScrollView
        style={styles.listScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {albums.map((album, i) => (
          <TouchableOpacity
            key={album.id}
            activeOpacity={0.75}
            onPress={() => setTrackByIndex(i)}
            style={styles.trackRow}
          >
            {/* Thumbnail */}
            <View style={styles.thumbShell}>
              {album.cover ? (
                <Image
                  source={{ uri: album.cover }}
                  style={styles.thumb}
                  contentFit="cover"
                  transition={180}
                />
              ) : (
                <View style={[styles.thumb, { backgroundColor: c.iconBg }]} />
              )}
            </View>

            {/* Meta */}
            <View style={styles.trackMeta}>
              <Text
                style={[styles.trackTitle, { color: c.textPrimary }]}
                numberOfLines={1}
              >
                {album.title}
              </Text>
              <Text
                style={[styles.trackArtist, { color: c.textSecondary }]}
                numberOfLines={1}
              >
                {album.artist}
              </Text>
            </View>

            {/* Active indicator */}
            {i === activeIdx && (
              <Ionicons
                name="volume-medium"
                size={16}
                color={c.accent}
                style={{ marginLeft: 8 }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PAD,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Carousel */
  carouselContent: {
    alignItems: "flex-start",
  },
  card: {
    borderRadius: 22,
    overflow: "hidden",
  },
  cardFallback: {
    alignItems: "center",
    justifyContent: "center",
  },

  /* Gradient layers */
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "transparent",
  },
  overlayBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "52%",
    backgroundColor: "rgba(0,0,0,0.62)",
  },

  /* Card info */
  cardInfo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardTextRow: {
    flex: 1,
    marginRight: 14,
  },
  cardTextCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardArtist: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 0.1,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Dot indicators */
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
  },
  dot: {
    height: 5,
    borderRadius: 999,
  },

  /* Track list */
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: H_PAD,
    paddingBottom: 24,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  thumbShell: {
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 14,
    flexShrink: 0,
  },
  thumb: {
    width: 52,
    height: 52,
  },
  trackMeta: {
    flex: 1,
    minWidth: 0,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 19,
    marginBottom: 3,
  },
  trackArtist: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 16,
  },
});

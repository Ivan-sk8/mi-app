import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { albums as CONST_ALBUMS } from "@/constants/albums";
import { useTheme } from "../contexts/ThemeContext";

type AlbumItem = {
  id?: string;
  title?: string;
  artist?: string;
  subtitle?: string;
  duration?: string;
  cover?: string;
};

const FALLBACK_ALBUMS: AlbumItem[] = [
  {
    id: "fb1",
    title: "No One Noticed",
    artist: "The Marías",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0b/4d/b6/0b4db6bd-2d40-55a5-1714-67f5c816294d/075679659644.jpg/600x600bb.jpg",
  },
  {
    id: "fb2",
    title: "Scary Monsters",
    artist: "David Bowie",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/8c/6e/9f/8c6e9f84-d9b4-0e2a-7e23-7d8b73c0e6a1/mzi.jcnvtbta.jpg/600x600bb.jpg",
  },
  {
    id: "fb3",
    title: "After Hours",
    artist: "The Weeknd",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/6a/23/dc/6a23dc65-cdf1-c950-8542-8e7b9d2d9c69/20UMGIM02356.rgb.jpg/600x600bb.jpg",
  },
];

const ALBUMS: AlbumItem[] =
  Array.isArray(CONST_ALBUMS) && CONST_ALBUMS.length > 0
    ? (CONST_ALBUMS as AlbumItem[])
    : FALLBACK_ALBUMS;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const EDGE_GESTURE_WIDTH = 22;

export default function AlbumTab() {
  const { c } = useTheme();
  const { width, height } = useWindowDimensions();

  const albums = useMemo(
    () =>
      ALBUMS.map((album, index) => ({
        ...album,
        safeId: album.id ?? `album-${index}`,
        safeTitle: album.title ?? "Unknown Album",
        safeArtist: album.artist ?? "Unknown Artist",
        safeSubtitle: album.subtitle ?? "Unknown Release",
        safeDuration: album.duration ?? "--:--",
      })),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const detailAnim = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(0)).current;
  const dragStartIndex = useRef(0);

  const topBleed = 220;
  const availableHeight = Math.max(320, height + topBleed + 96);
  const segmentHeight = availableHeight / 2;

  const coverColorFor = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title.length; i += 1) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 62%, 52%)`;
  };

  const clampIndex = (index: number) =>
    Math.max(0, Math.min(albums.length - 1, index));

  const parseDurationSeconds = (duration: string) => {
    const parts = duration.split(":").map((value) => Number(value));
    if (parts.length !== 2 || parts.some((value) => Number.isNaN(value))) {
      return 0;
    }
    return parts[0] * 60 + parts[1];
  };

  const deriveReleaseType = (subtitle: string) => {
    const normalized = subtitle.toLowerCase();
    if (normalized.includes("ep")) return "EP";
    return "";
  };

  const deriveYear = (subtitle: string, index: number) => {
    const normalized = subtitle.toLowerCase();
    if (normalized.includes("submarine")) return "2024";
    if (normalized.includes("cinema")) return "2021";
    if (normalized.includes("superclean")) return "2018";
    if (normalized.includes("scary monsters")) return "2010";
    if (normalized.includes("more monsters")) return "2011";
    if (normalized.includes("bangarang")) return "2011";
    if (normalized.includes("recess")) return "2014";
    if (normalized.includes("show tracks")) return "2019";
    return String(2016 + (index % 9));
  };

  const deriveAudioQuality = (
    title: string,
    subtitle: string,
    index: number,
  ) => {
    const normalized = `${title} ${subtitle}`.toLowerCase();

    if (normalized.includes("extended")) return "FLAC";
    if (normalized.includes("single")) return "WAV";
    if (normalized.includes("cinema")) return "FLAC";
    if (normalized.includes("submarine")) return "DSD";
    if (normalized.includes("recess")) return "WAV";
    if (normalized.includes("bangarang")) return "FLAC";
    if (normalized.includes("scary monsters")) return "MP3";

    const formats = ["FLAC", "WAV", "MP3", "DSD"];
    return formats[index % formats.length];
  };

  const releaseMeta = useMemo(() => {
    const grouped = new Map<
      string,
      {
        totalSongs: number;
        totalDurationSeconds: number;
      }
    >();

    albums.forEach((album) => {
      const key = `${album.safeArtist}__${album.safeSubtitle}`;
      const current = grouped.get(key) ?? {
        totalSongs: 0,
        totalDurationSeconds: 0,
      };

      current.totalSongs += 1;
      current.totalDurationSeconds += parseDurationSeconds(album.safeDuration);
      grouped.set(key, current);
    });

    return grouped;
  }, [albums]);

  const animateToIndex = (nextIndex: number) => {
    const clamped = clampIndex(nextIndex);
    setActiveIndex(clamped);
    Animated.spring(translateY, {
      toValue: -clamped * segmentHeight,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.9,
    }).start();
  };

  const openDetail = () => {
    setDetailOpen(true);
    Animated.spring(detailAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 240,
      mass: 0.9,
    }).start();
  };

  const closeDetail = () => {
    Animated.timing(detailAnim, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start(() => setDetailOpen(false));
  };

  const jumpToLetter = (letter: string) => {
    setSelectedLetter(letter);
    const idx = albums.findIndex((album) =>
      album.safeTitle.toUpperCase().startsWith(letter),
    );
    if (idx >= 0) {
      animateToIndex(idx);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt) => {
      const x = evt.nativeEvent.pageX;
      return x <= EDGE_GESTURE_WIDTH || x >= width - EDGE_GESTURE_WIDTH;
    },
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dy) > 8,
    onPanResponderGrant: () => {
      dragStartIndex.current = activeIndex;
      translateY.stopAnimation();
    },
    onPanResponderMove: (_, gestureState) => {
      const base = -dragStartIndex.current * segmentHeight;
      translateY.setValue(base + gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = segmentHeight * 0.18;
      let nextIndex = dragStartIndex.current;

      if (gestureState.dy <= -threshold || gestureState.vy < -0.45) {
        nextIndex = dragStartIndex.current + 1;
      } else if (gestureState.dy >= threshold || gestureState.vy > 0.45) {
        nextIndex = dragStartIndex.current - 1;
      }

      animateToIndex(nextIndex);
    },
    onPanResponderTerminate: () => {
      animateToIndex(dragStartIndex.current);
    },
  });

  const renderBackgroundAlbum = (
    album: (typeof albums)[number],
    absoluteIndex: number,
  ) => {
    const inputRange = [
      (absoluteIndex - 1) * segmentHeight,
      absoluteIndex * segmentHeight,
      (absoluteIndex + 1) * segmentHeight,
    ];

    const overlayOpacity = translateY.interpolate({
      inputRange,
      outputRange: [0.58, 0.28, 0.58],
      extrapolate: "clamp",
    });

    const infoOpacity = translateY.interpolate({
      inputRange,
      outputRange: [0.72, 1, 0.72],
      extrapolate: "clamp",
    });

    const infoTranslateY = translateY.interpolate({
      inputRange,
      outputRange: [18, 0, -18],
      extrapolate: "clamp",
    });

    const imageScale = translateY.interpolate({
      inputRange,
      outputRange: [1.02, 1, 1.02],
      extrapolate: "clamp",
    });

    const imageBrightness = translateY.interpolate({
      inputRange,
      outputRange: [0.18, 0.06, 0.18],
      extrapolate: "clamp",
    });

    return (
      <View
        key={album.safeId}
        style={[
          styles.segment,
          {
            top: absoluteIndex * segmentHeight,
            height: segmentHeight,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.segmentImageWrap,
            {
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          {album.cover ? (
            <Image
              source={{ uri: album.cover }}
              style={styles.segmentImage}
              contentFit="cover"
              transition={220}
            />
          ) : (
            <View
              style={[
                styles.segmentFallback,
                { backgroundColor: coverColorFor(album.safeTitle) },
              ]}
            >
              <Ionicons
                name="musical-notes"
                size={54}
                color="rgba(255,255,255,0.92)"
              />
            </View>
          )}
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.segmentShade,
            {
              opacity: overlayOpacity,
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.segmentDepth,
            {
              opacity: imageBrightness,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.infoOverlay,
            {
              opacity: infoOpacity,
              transform: [{ translateY: infoTranslateY }],
            },
          ]}
        >
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.albumTitle} numberOfLines={2}>
                {album.safeTitle}
              </Text>

              <Text style={styles.albumArtist} numberOfLines={1}>
                {album.safeArtist}
              </Text>
            </View>

            <View style={styles.yearBadge}>
              <Text style={styles.yearText}>
                {deriveYear(album.safeSubtitle, absoluteIndex)}
              </Text>
            </View>
          </View>

          <View style={styles.bottomInfoBlock}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Lanzamiento</Text>
              <Text style={styles.metaValue} numberOfLines={2}>
                {album.safeSubtitle}
              </Text>
            </View>

            <View style={styles.metaGrid}>
              <View style={styles.metaGridItem}>
                <Text style={styles.metaGridLabel}>Calidad</Text>
                <Text style={styles.metaGridValue}>
                  {deriveAudioQuality(
                    album.safeTitle,
                    album.safeSubtitle,
                    absoluteIndex,
                  )}
                </Text>
              </View>
              <View style={styles.metaGridItem}>
                <Text style={styles.metaGridLabel}>Duración</Text>
                <Text style={styles.metaGridValue}>{album.safeDuration}</Text>
              </View>
              <View style={styles.metaGridItem}>
                <Text style={styles.metaGridLabel}>Canciones</Text>
                <Text style={styles.metaGridValue}>
                  {
                    releaseMeta.get(
                      `${album.safeArtist}__${album.safeSubtitle}`,
                    )?.totalSongs
                  }
                </Text>
              </View>
              {deriveReleaseType(album.safeSubtitle) ? (
                <View style={styles.metaGridItem}>
                  <Text style={styles.metaGridLabel}>Tipo</Text>
                  <Text style={styles.metaGridValue}>
                    {deriveReleaseType(album.safeSubtitle)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {absoluteIndex === activeIndex && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={openDetail}
              style={{
                marginTop: 16,
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: "rgba(163,0,0,0.85)",
              }}
            >
              <Ionicons name="albums-outline" size={15} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: "700",
                  letterSpacing: 0.2,
                }}
              >
                Ver álbum
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.headerContainer} />

      <View style={styles.contentArea} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.track,
            {
              height: albums.length * segmentHeight,
              transform: [{ translateY }],
            },
          ]}
        >
          {albums.map((album, index) => renderBackgroundAlbum(album, index))}
        </Animated.View>

        <View style={styles.indexColumn}>
          {ALPHABET.map((letter) => {
            const isActive = selectedLetter === letter;
            return (
              <TouchableOpacity
                key={letter}
                activeOpacity={0.7}
                onPress={() => jumpToLetter(letter)}
                style={styles.indexSlot}
              >
                <Text
                  style={[
                    styles.indexLetter,
                    {
                      color: isActive ? c.accent : c.textSecondary,
                      transform: [{ scale: isActive ? 1.18 : 1 }],
                    },
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.positionContainer}>
        <View
          style={[
            styles.positionIndicator,
            {
              backgroundColor: c.glass2,
              borderColor: c.border,
            },
          ]}
        >
          <Text style={[styles.positionText, { color: c.textPrimary }]}>
            {activeIndex + 1} / {albums.length}
          </Text>
        </View>
      </View>

      <View pointerEvents="none" style={styles.edgeHintLeft} />
      <View pointerEvents="none" style={styles.edgeHintRight} />

      {/* ── Album detail modal ──────────────────────────────────────── */}
      {detailOpen && (
        <Modal
          visible={detailOpen}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={closeDetail}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: c.bg,
                transform: [
                  {
                    translateY: detailAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 18,
                paddingTop: 56,
                paddingBottom: 12,
              }}
            >
              <TouchableOpacity
                onPress={closeDetail}
                activeOpacity={0.7}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: c.glass2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={c.textSecondary}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  letterSpacing: 1,
                  color: c.textSecondary,
                }}
              >
                ÁLBUM
              </Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 48 }}
            >
              {/* Cover */}
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 40,
                  paddingVertical: 20,
                }}
              >
                <View
                  style={{
                    width: width - 80,
                    height: width - 80,
                    borderRadius: 20,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.35,
                    shadowRadius: 20,
                    elevation: 12,
                  }}
                >
                  {albums[activeIndex]?.cover ? (
                    <Image
                      source={{ uri: albums[activeIndex].cover }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={220}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: c.iconBg,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="musical-notes"
                        size={64}
                        color={c.textSecondary}
                      />
                    </View>
                  )}
                </View>
              </View>

              {/* Album info */}
              <View style={{ paddingHorizontal: 22, marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color: c.textPrimary,
                    letterSpacing: -0.5,
                    lineHeight: 30,
                    marginBottom: 4,
                  }}
                  numberOfLines={2}
                >
                  {albums[activeIndex]?.safeTitle ?? ""}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: c.textSecondary,
                    marginBottom: 14,
                  }}
                  numberOfLines={1}
                >
                  {albums[activeIndex]?.safeArtist ?? ""}
                </Text>
                <View
                  style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}
                >
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#A30000",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "700",
                        color: "#A30000",
                        letterSpacing: 0.5,
                      }}
                    >
                      {deriveAudioQuality(
                        albums[activeIndex]?.safeTitle ?? "",
                        albums[activeIndex]?.safeSubtitle ?? "",
                        activeIndex,
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: c.glass2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: c.textSecondary,
                      }}
                    >
                      {deriveYear(
                        albums[activeIndex]?.safeSubtitle ?? "",
                        activeIndex,
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: c.glass2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: c.textSecondary,
                      }}
                    >
                      {albums[activeIndex]?.safeSubtitle ?? ""}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Play / Shuffle row */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  paddingHorizontal: 22,
                  marginBottom: 24,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: "#A30000",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Ionicons name="play" size={18} color="#fff" />
                  <Text
                    style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}
                  >
                    Reproducir
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: c.glass2,
                    borderWidth: 1,
                    borderColor: c.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="shuffle" size={20} color={c.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Track list — all tracks from same artist + subtitle group */}
              <View style={{ paddingHorizontal: 22 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    letterSpacing: 1,
                    color: c.textSecondary,
                    marginBottom: 12,
                  }}
                >
                  CANCIONES
                </Text>
                {albums
                  .filter(
                    (t) =>
                      t.safeArtist === albums[activeIndex]?.safeArtist &&
                      t.safeSubtitle === albums[activeIndex]?.safeSubtitle,
                  )
                  .map((track, i) => (
                    <View
                      key={track.safeId}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 10,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: c.border,
                      }}
                    >
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          overflow: "hidden",
                          marginRight: 12,
                          backgroundColor: c.iconBg,
                        }}
                      >
                        {track.cover ? (
                          <Image
                            source={{ uri: track.cover }}
                            style={{ width: 44, height: 44 }}
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
                              size={20}
                              color={c.textSecondary}
                            />
                          </View>
                        )}
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "700",
                            color: c.textPrimary,
                            marginBottom: 2,
                          }}
                          numberOfLines={1}
                        >
                          {track.safeTitle}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            color: c.textSecondary,
                          }}
                          numberOfLines={1}
                        >
                          {track.safeArtist}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: c.textMuted,
                          fontWeight: "500",
                          marginLeft: 8,
                        }}
                      >
                        {track.safeDuration}
                      </Text>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    zIndex: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.72,
    marginTop: 4,
  },
  contentArea: {
    flex: 1,
    overflow: "hidden",
    marginTop: -220,
  },
  track: {
    position: "relative",
  },
  segment: {
    position: "absolute",
    left: 0,
    right: 0,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  segmentImageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  segmentImage: {
    width: "100%",
    height: "100%",
  },
  segmentFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  segmentShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,10,18,0.34)",
  },
  segmentDepth: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  infoOverlay: {
    position: "absolute",
    left: 22,
    right: 58,
    top: 170,
    bottom: 26,
    justifyContent: "space-between",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleColumn: {
    flex: 1,
    justifyContent: "flex-start",
  },
  albumTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  albumArtist: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 0,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  yearBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignSelf: "flex-start",
  },
  yearText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  bottomInfoBlock: {
    justifyContent: "flex-end",
  },
  metaBlock: {
    marginBottom: 14,
  },
  metaLabel: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaValue: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
    gap: 8,
  },
  metaGridItem: {
    minWidth: "30%",
    paddingVertical: 6,
    paddingRight: 8,
  },
  metaGridLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaGridValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  indexColumn: {
    position: "absolute",
    top: 8,
    right: 6,
    bottom: 18,
    width: 34,
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 9,
  },
  indexSlot: {
    width: 28,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  indexLetter: {
    fontSize: 11,
    fontWeight: "700",
    includeFontPadding: false,
  },
  positionContainer: {
    position: "absolute",
    right: 20,
    bottom: 34,
    zIndex: 10,
  },
  positionIndicator: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  positionText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  edgeHintLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_GESTURE_WIDTH,
  },
  edgeHintRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: EDGE_GESTURE_WIDTH,
  },
});

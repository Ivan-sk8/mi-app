import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { albums as CONST_ALBUMS } from "@/constants/albums";
import { useTheme } from "../contexts/ThemeContext";
import { usePlayer } from "@/contexts/player-context";

type TrackItem = {
  id?: string;
  title?: string;
  artist?: string;
  subtitle?: string;
  duration?: string;
  cover?: string;
};

const FALLBACK_TRACKS: TrackItem[] = [
  {
    id: "fb1",
    title: "No One Noticed",
    artist: "The Marías",
    subtitle: "Submarine",
    duration: "03:56",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0b/4d/b6/0b4db6bd-2d40-55a5-1714-67f5c816294d/075679659644.jpg/600x600bb.jpg",
  },
  {
    id: "fb2",
    title: "Scary Monsters and Nice Sprites",
    artist: "Skrillex",
    subtitle: "Scary Monsters and Nice Sprites",
    duration: "04:03",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/31/70/da/3170da66-9280-ccd2-1f97-57d8a1996f9e/075679970930.jpg/600x600bb.jpg",
  },
];

const TRACKS: TrackItem[] =
  Array.isArray(CONST_ALBUMS) && CONST_ALBUMS.length > 0
    ? (CONST_ALBUMS as TrackItem[])
    : FALLBACK_TRACKS;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const EDGE_GESTURE_WIDTH = 22;

export default function TracksTab() {
  const { c, isDark } = useTheme();
  const { width, height } = useWindowDimensions();
  const { setTrackByIndex, isFavorite, toggleFavorite } = usePlayer();

  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView | null>(null);
  const scrollOffsetY = useRef(0);

  const [menuTrack, setMenuTrack] = useState<(typeof tracks)[0] | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;
  const [mixOpen, setMixOpen] = useState(false);
  const [bpmOn, setBpmOn] = useState(false);
  const [moodOn, setMoodOn] = useState(false);

  const openMenu = (track: (typeof tracks)[0]) => {
    setMenuTrack(track);
    setMixOpen(false);
    setBpmOn(false);
    setMoodOn(false);
    setMenuVisible(true);
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
    }).start(() => {
      setMenuVisible(false);
      setMenuTrack(null);
    });
  };

  const tracks = useMemo(
    () =>
      TRACKS.map((track, index) => ({
        ...track,
        safeId: track.id ?? `track-${index}`,
        safeTitle: track.title ?? "Unknown Track",
        safeArtist: track.artist ?? "Unknown Artist",
        safeSubtitle: track.subtitle ?? "",
        safeDuration: track.duration ?? "--:--",
      })),
    [],
  );

  const filteredTracks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return tracks;

    return tracks.filter((track) => {
      const haystack =
        `${track.safeTitle} ${track.safeArtist} ${track.safeSubtitle}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [query, tracks]);

  const rowHeight = 84;
  const topPadding = 126;
  const bottomPadding = 36;
  const listHeight = Math.max(height - topPadding - bottomPadding, 200);

  const coverColorFor = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title.length; i += 1) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 62%, 52%)`;
  };

  const scrollToIndex = (index: number) => {
    const y = Math.max(0, index * rowHeight);
    scrollOffsetY.current = y;
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  const jumpToLetter = (letter: string) => {
    setSelectedLetter(letter);
    const idx = filteredTracks.findIndex((track) =>
      track.safeTitle.toUpperCase().startsWith(letter),
    );
    if (idx >= 0) {
      scrollToIndex(idx);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt) => {
      const x = evt.nativeEvent.pageX;
      return x <= EDGE_GESTURE_WIDTH || x >= width - EDGE_GESTURE_WIDTH;
    },
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dy) > 8,
    onPanResponderMove: (_, gestureState) => {
      const nextY = Math.max(0, scrollOffsetY.current - gestureState.dy);
      scrollRef.current?.scrollTo({ y: nextY, animated: false });
    },
    onPanResponderRelease: (_, gestureState) => {
      scrollOffsetY.current = Math.max(
        0,
        scrollOffsetY.current - gestureState.dy,
      );
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.contentArea} {...panResponder.panHandlers}>
        <ScrollView
          ref={scrollRef}
          style={styles.list}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: bottomPadding,
            paddingLeft: 18,
            paddingRight: 52,
            minHeight: listHeight + bottomPadding + 84,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            scrollOffsetY.current = event.nativeEvent.contentOffset.y;
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: c.textPrimary }]}>
              Tracks
            </Text>

            <View
              style={[
                styles.searchWrap,
                {
                  backgroundColor: c.glass2,
                  borderColor: c.border,
                },
              ]}
            >
              <Ionicons
                name="search"
                size={18}
                color={c.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  setSelectedLetter(null);
                  scrollOffsetY.current = 0;
                  requestAnimationFrame(() => {
                    scrollRef.current?.scrollTo({ y: 0, animated: false });
                  });
                }}
                placeholder="Buscar tracks"
                placeholderTextColor={c.textSecondary}
                style={[styles.searchInput, { color: c.textPrimary }]}
                selectionColor={c.textPrimary}
              />
            </View>
          </View>
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track, index) => (
              <TouchableOpacity
                key={track.safeId}
                activeOpacity={0.82}
                style={styles.row}
              >
                <View style={styles.leftBlock}>
                  <View
                    style={[styles.coverShell, { backgroundColor: c.iconBg }]}
                  >
                    {track.cover ? (
                      <Image
                        source={{ uri: track.cover }}
                        style={styles.coverImage}
                        contentFit="cover"
                        transition={180}
                      />
                    ) : (
                      <View
                        style={[
                          styles.coverFallback,
                          {
                            backgroundColor: coverColorFor(track.safeTitle),
                          },
                        ]}
                      >
                        <Ionicons
                          name="musical-notes"
                          size={22}
                          color="rgba(255,255,255,0.92)"
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.textBlock}>
                    <Text
                      style={[
                        styles.trackTitle,
                        { color: c.textPrimary },
                        index === 2 ? styles.trackTitleAccent : null,
                      ]}
                      numberOfLines={1}
                    >
                      {track.safeTitle}
                    </Text>
                    <Text
                      style={[styles.trackArtist, { color: c.textSecondary }]}
                      numberOfLines={1}
                    >
                      {track.safeArtist}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.moreButton}
                  onPress={() => openMenu(track)}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={22}
                    color={c.iconColor}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: c.textPrimary }]}>
                Sin resultados
              </Text>
              <Text style={[styles.emptySubtitle, { color: c.textSecondary }]}>
                No encontramos tracks para &quot;{query}&quot;.
              </Text>
            </View>
          )}
        </ScrollView>

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

      <View pointerEvents="none" style={styles.edgeHintLeft} />
      <View pointerEvents="none" style={styles.edgeHintRight} />

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeMenu}
      >
        {/* Backdrop */}
        <Animated.View
          style={[
            menuStyles.backdrop,
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
            menuStyles.sheet,
            {
              backgroundColor: isDark ? "#121212" : "#F8F7F4",
              transform: [
                {
                  translateY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [480, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Pill */}
          <View
            style={[
              menuStyles.pill,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.20)"
                  : "rgba(0,0,0,0.15)",
              },
            ]}
          />

          {/* Track header */}
          <View style={menuStyles.header}>
            <Text
              style={[menuStyles.headerTitle, { color: c.textPrimary }]}
              numberOfLines={1}
            >
              {menuTrack?.safeTitle ?? ""}
            </Text>
            <Text
              style={[menuStyles.headerArtist, { color: c.textSecondary }]}
              numberOfLines={1}
            >
              {menuTrack?.safeArtist ?? ""}
            </Text>
          </View>

          <View
            style={[
              menuStyles.divider,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
              },
            ]}
          />

          {/* 1 — Reproducir */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              menuStyles.row,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.07)",
              },
            ]}
            onPress={() => {
              const idx = tracks.findIndex(
                (t) => t.safeId === menuTrack?.safeId,
              );
              if (idx >= 0) setTrackByIndex(idx);
              closeMenu();
            }}
          >
            <View
              style={[
                menuStyles.iconWrap,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <Ionicons name="play" size={17} color={c.accent} />
            </View>
            <Text style={[menuStyles.rowLabel, { color: c.textPrimary }]}>
              Reproducir
            </Text>
          </TouchableOpacity>

          {/* 2 — Favorito */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              menuStyles.row,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.07)",
              },
            ]}
            onPress={() => {
              if (menuTrack?.safeId) toggleFavorite(menuTrack.safeId);
            }}
          >
            <View
              style={[
                menuStyles.iconWrap,
                {
                  backgroundColor:
                    menuTrack && isFavorite(menuTrack.safeId)
                      ? "rgba(239,68,68,0.10)"
                      : isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <Ionicons
                name={
                  menuTrack && isFavorite(menuTrack.safeId)
                    ? "heart"
                    : "heart-outline"
                }
                size={17}
                color={
                  menuTrack && isFavorite(menuTrack.safeId)
                    ? "#EF4444"
                    : c.accent
                }
              />
            </View>
            <Text style={[menuStyles.rowLabel, { color: c.textPrimary }]}>
              {menuTrack && isFavorite(menuTrack.safeId)
                ? "Quitar de favoritos"
                : "Agregar a favoritos"}
            </Text>
          </TouchableOpacity>

          {/* 3 — Crear Mix */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              menuStyles.row,
              !mixOpen && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.07)",
              },
            ]}
            onPress={() => setMixOpen((p) => !p)}
          >
            <View
              style={[
                menuStyles.iconWrap,
                {
                  backgroundColor: mixOpen
                    ? "rgba(163,0,0,0.12)"
                    : isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="dna"
                size={17}
                color={mixOpen ? "#A30000" : c.accent}
                style={{ transform: [{ rotate: "30deg" }] }}
              />
            </View>
            <Text
              style={[
                menuStyles.rowLabel,
                { color: mixOpen ? "#A30000" : c.textPrimary },
              ]}
            >
              Crear mix
            </Text>
            <Ionicons
              name={mixOpen ? "chevron-up" : "chevron-down"}
              size={14}
              color={c.textSecondary}
            />
          </TouchableOpacity>

          {/* Mix sub-panel */}
          {mixOpen && (
            <View
              style={[
                menuStyles.mixPanel,
                {
                  backgroundColor: isDark
                    ? "rgba(163,0,0,0.06)"
                    : "rgba(163,0,0,0.04)",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.07)",
                },
              ]}
            >
              <Text style={[menuStyles.mixTitle, { color: c.textSecondary }]}>
                Selecciona elementos para el mix
              </Text>
              <View style={menuStyles.mixButtons}>
                {/* BPM */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setBpmOn((p) => !p)}
                  style={[
                    menuStyles.mixBtn,
                    {
                      backgroundColor: bpmOn
                        ? "rgba(163,0,0,0.15)"
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                      borderColor: bpmOn
                        ? "rgba(163,0,0,0.50)"
                        : isDark
                          ? "rgba(255,255,255,0.14)"
                          : "rgba(0,0,0,0.12)",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="metronome"
                    size={20}
                    color={bpmOn ? "#A30000" : c.textSecondary}
                  />
                  <Text
                    style={[
                      menuStyles.mixBtnLabel,
                      { color: bpmOn ? "#A30000" : c.textSecondary },
                    ]}
                  >
                    BPM
                  </Text>
                </TouchableOpacity>

                {/* DNA */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    setBpmOn((p) => !p);
                    setMoodOn((p) => !p);
                  }}
                  style={[
                    menuStyles.mixBtn,
                    {
                      backgroundColor:
                        bpmOn && moodOn
                          ? "rgba(163,0,0,0.18)"
                          : isDark
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.06)",
                      borderColor:
                        bpmOn && moodOn
                          ? "rgba(163,0,0,0.55)"
                          : isDark
                            ? "rgba(255,255,255,0.14)"
                            : "rgba(0,0,0,0.12)",
                      borderWidth: 1.5,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="dna"
                    size={22}
                    color={bpmOn && moodOn ? "#A30000" : c.textPrimary}
                    style={{ transform: [{ rotate: "30deg" }] }}
                  />
                </TouchableOpacity>

                {/* Mood */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setMoodOn((p) => !p)}
                  style={[
                    menuStyles.mixBtn,
                    {
                      backgroundColor: moodOn
                        ? "rgba(163,0,0,0.15)"
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                      borderColor: moodOn
                        ? "rgba(163,0,0,0.50)"
                        : isDark
                          ? "rgba(255,255,255,0.14)"
                          : "rgba(0,0,0,0.12)",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="palette-outline"
                    size={20}
                    color={moodOn ? "#A30000" : c.textSecondary}
                  />
                  <Text
                    style={[
                      menuStyles.mixBtnLabel,
                      { color: moodOn ? "#A30000" : c.textSecondary },
                    ]}
                  >
                    Mood
                  </Text>
                </TouchableOpacity>
              </View>

              {(bpmOn || moodOn) && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={closeMenu}
                  style={[menuStyles.mixApply, { backgroundColor: "#A30000" }]}
                >
                  <Text style={menuStyles.mixApplyText}>Generar mix</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* 5 — Agregar a playlist */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              menuStyles.row,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.07)",
              },
            ]}
            onPress={() => {
              closeMenu();
              Alert.alert(
                "Playlist",
                `"${menuTrack?.safeTitle}" agregada a la playlist.`,
              );
            }}
          >
            <View
              style={[
                menuStyles.iconWrap,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <Ionicons name="add-circle-outline" size={17} color={c.accent} />
            </View>
            <Text style={[menuStyles.rowLabel, { color: c.textPrimary }]}>
              Agregar a playlist
            </Text>
          </TouchableOpacity>

          {/* 6 — Eliminar */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={menuStyles.row}
            onPress={() => {
              closeMenu();
              Alert.alert(
                "Eliminar canción",
                `¿Eliminar "${menuTrack?.safeTitle}" de la biblioteca?`,
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {},
                  },
                ],
              );
            }}
          >
            <View
              style={[
                menuStyles.iconWrap,
                { backgroundColor: "rgba(239,68,68,0.10)" },
              ]}
            >
              <Ionicons name="trash-outline" size={17} color="#EF4444" />
            </View>
            <Text style={[menuStyles.rowLabel, { color: "#EF4444" }]}>
              Eliminar
            </Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={closeMenu}
            style={[
              menuStyles.cancelBtn,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            <Text style={[menuStyles.cancelText, { color: c.textSecondary }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 12,
  },
  searchWrap: {
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 0,
  },
  contentArea: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  row: {
    minHeight: 84,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  coverShell: {
    width: 62,
    height: 62,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  trackTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
    marginBottom: 3,
  },
  trackTitleAccent: {
    color: "#8b5cf6",
  },
  trackArtist: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "500",
  },
  moreButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  indexColumn: {
    position: "absolute",
    top: 20,
    right: 6,
    bottom: 18,
    width: 34,
    alignItems: "center",
    justifyContent: "space-between",
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
  emptyState: {
    minHeight: 320,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
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

const menuStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.46)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingBottom: 28,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 20,
  },
  pill: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 999,
    marginTop: 10,
    marginBottom: 14,
  },
  header: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
    lineHeight: 20,
    marginBottom: 3,
  },
  headerArtist: {
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  mixPanel: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 4,
  },
  mixTitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  mixButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  mixBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  mixBtnLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  mixApply: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  mixApplyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  cancelBtn: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

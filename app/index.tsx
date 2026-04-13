import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import LibraryTab from "../components/LibraryTab";
import AlbumTab from "../components/AlbumTab";
import ArtistTab from "../components/ArtistTab";

import PlaylistTab from "../components/PlaylistTab";
import TracksTab from "../components/TracksTab";

import SettingsTab from "../components/SettingsTab";
import { usePlayer } from "../contexts/player-context";
import { useTheme } from "../contexts/ThemeContext";

const tabs = [
  { label: "Library", component: LibraryTab },
  { label: "Álbum", component: AlbumTab },
  { label: "Tracks", component: TracksTab },
  { label: "Artista", component: ArtistTab },

  { label: "Playlist", component: PlaylistTab },
  { label: "Ajustes", component: SettingsTab },
];

function HomeScreenInner() {
  const { c } = useTheme();
  const router = useRouter();
  const { currentAlbum, isPlaying, togglePlay } = usePlayer();
  const { width, height } = useWindowDimensions();
  const [activeSection, setActiveSection] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const carouselRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<number[]>([]);
  const sectionWidths = useRef<number[]>([]);

  const isCompact = width < 390;
  const edgeWidth = Math.max(22, Math.min(36, width * 0.08));
  const minSwipeDistance = Math.max(42, width * 0.08);
  const maxVerticalDrift = 28;

  const ActiveComponent = (tabs[activeSection] ?? tabs[0]).component;

  useEffect(() => {
    if (!shouldAutoScroll) return;

    const viewportWidth = width;
    const activeOffset = sectionOffsets.current[activeSection] ?? 0;
    const activeWidth = sectionWidths.current[activeSection] ?? 0;
    const targetX = Math.max(
      0,
      activeOffset - (viewportWidth - activeWidth) / 2,
    );

    const frame = requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({ x: targetX, animated: true });
      setShouldAutoScroll(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [activeSection, isCompact, shouldAutoScroll, width]);

  const goToSection = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(tabs.length - 1, nextIndex));
      if (clamped === activeSection) return;
      setActiveSection(clamped);
      setShouldAutoScroll(true);
    },
    [activeSection],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          const startX = evt.nativeEvent.pageX;
          const fromLeftEdge = startX <= edgeWidth;
          const fromRightEdge = startX >= width - edgeWidth;
          const horizontalIntent =
            Math.abs(gestureState.dx) > 12 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          const verticalStable = Math.abs(gestureState.dy) < maxVerticalDrift;

          return (
            horizontalIntent &&
            verticalStable &&
            (fromLeftEdge || fromRightEdge)
          );
        },
        onPanResponderRelease: (evt, gestureState) => {
          const startX = evt.nativeEvent.pageX;
          const fromLeftEdge = startX <= edgeWidth;
          const fromRightEdge = startX >= width - edgeWidth;
          const mostlyHorizontal =
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          const verticalStable = Math.abs(gestureState.dy) < maxVerticalDrift;

          if (!mostlyHorizontal || !verticalStable) return;

          if (fromLeftEdge && gestureState.dx > minSwipeDistance) {
            goToSection(activeSection - 1);
            return;
          }

          if (fromRightEdge && gestureState.dx < -minSwipeDistance) {
            goToSection(activeSection + 1);
          }
        },
      }),
    [
      activeSection,
      edgeWidth,
      goToSection,
      maxVerticalDrift,
      minSwipeDistance,
      width,
    ],
  );

  return (
    <View
      style={[styles.root, { backgroundColor: c.bg }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={carouselRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          contentContainerStyle={[
            styles.carouselContent,
            {
              paddingLeft: isCompact ? 14 : 18,
              paddingRight: Math.max(width * 0.6, 120),
            },
          ]}
        >
          {tabs.map((tab, index) => {
            const active = index === activeSection;

            return (
              <TouchableOpacity
                key={tab.label}
                style={[
                  styles.tabItem,
                  {
                    minWidth: 120,
                    maxWidth: 260,
                  },
                ]}
                activeOpacity={0.85}
                onLayout={(event) => {
                  sectionOffsets.current[index] = event.nativeEvent.layout.x;
                  sectionWidths.current[index] = event.nativeEvent.layout.width;
                }}
                onPress={() => {
                  setActiveSection(index);
                  setShouldAutoScroll(true);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    active && styles.tabTextActive,
                    isCompact && styles.tabTextCompact,
                    active && isCompact && styles.tabTextActiveCompact,
                    { color: active ? c.textPrimary : c.textMuted },
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.sectionContent}>
        <ActiveComponent />
      </View>

      <TouchableOpacity
        activeOpacity={0.96}
        style={[
          styles.miniPlayer,
          {
            backgroundColor: c.glass2,
            borderColor: c.border,
            shadowColor: c.shadow,
          },
        ]}
        onPress={() => router.push("/player")}
      >
        <View style={styles.miniPlayerLeft}>
          <View
            style={[
              styles.miniCoverShell,
              {
                backgroundColor: c.iconBg,
                borderColor: c.border,
              },
            ]}
          >
            <Image
              source={currentAlbum.cover}
              style={styles.miniCover}
              contentFit="cover"
            />
          </View>

          <View style={styles.miniMeta}>
            <Text
              style={[styles.miniTitle, { color: c.textPrimary }]}
              numberOfLines={1}
            >
              {currentAlbum.title}
            </Text>
            <Text
              style={[styles.miniArtist, { color: c.textSecondary }]}
              numberOfLines={1}
            >
              {currentAlbum.artist}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={togglePlay}
          style={[
            styles.miniPlayButton,
            {
              backgroundColor: c.textPrimary,
            },
          ]}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={18}
            color={c.bg}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <View
        pointerEvents="none"
        style={[
          styles.edgeHintLeft,
          {
            width: edgeWidth,
            height,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.edgeHintRight,
          {
            width: edgeWidth,
            height,
          },
        ]}
      />
    </View>
  );
}

export default function HomeScreen() {
  return <HomeScreenInner />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  carouselContainer: {
    paddingTop: 32,
    backgroundColor: "transparent",
    zIndex: 20,
  },
  carouselContent: {
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    paddingTop: 2,
    paddingBottom: 6,
    flexGrow: 1,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tabText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "bottom",
  },
  tabTextCompact: {
    fontSize: 14,
    lineHeight: 18,
  },
  tabTextActive: {
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "800",
    marginRight: 0,
    textAlign: "center",
  },
  tabTextActiveCompact: {
    fontSize: 26,
    lineHeight: 28,
    textAlign: "center",
  },
  sectionContent: {
    flex: 1,
    minHeight: 0,
    zIndex: 1,
    paddingBottom: 92,
  },
  miniPlayer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 68,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
    zIndex: 30,
  },
  miniPlayerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  miniCoverShell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: 12,
  },
  miniCover: {
    width: "100%",
    height: "100%",
  },
  miniMeta: {
    flex: 1,
    minWidth: 0,
  },
  miniTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  miniArtist: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "600",
  },
  miniPlayButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  edgeHintLeft: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  edgeHintRight: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

import React, { useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import HomeTab from "../components/HomeTab";
import AlbumTab from "../components/AlbumTab";
import ArtistTab from "../components/ArtistTab";
import FolderTab from "../components/FolderTab";
import MixTab from "../components/MixTab";
import PlaylistTab from "../components/PlaylistTab";

const tabs = [
  { label: "Home", component: HomeTab },
  { label: "Álbum", component: AlbumTab },
  { label: "Artista", component: ArtistTab },
  { label: "Carpeta", component: FolderTab },
  { label: "Mix", component: MixTab },
  { label: "Playlist", component: PlaylistTab },
];

export default function HomeScreen() {
  const [activeSection, setActiveSection] = useState(0);
  const carouselRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<number[]>([]);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  React.useEffect(() => {
    if (!shouldAutoScroll) return;
    const sideMargin = isCompact ? 14 : 18;
    const targetX = Math.max(
      0,
      (sectionOffsets.current[activeSection] ?? 0) - sideMargin,
    );
    const frame = requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({ x: targetX, animated: true });
      setShouldAutoScroll(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [activeSection, isCompact, shouldAutoScroll]);

  const ActiveComponent = tabs[activeSection].component;

  return (
    <View style={styles.root}>
      <View style={styles.carouselContainer}>
        <View>
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
      </View>
      <View style={styles.sectionContent}>
        <ActiveComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f3ef",
  },
  carouselContainer: {
    paddingTop: 32,
    backgroundColor: "#f4f3ef",
  },
  carouselContent: {
    gap: 8,
    alignItems: "flex-end",
    minHeight: 48,
    paddingTop: 2,
    paddingBottom: 6,
  },
  tabItem: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  tabText: {
    color: "#a9a9a9",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "400",
    textAlign: "left",
    textAlignVertical: "bottom",
  },
  tabTextCompact: {
    fontSize: 14,
    lineHeight: 18,
  },
  tabTextActive: {
    color: "#111111",
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "500",
    marginRight: 4,
    textAlign: "left",
  },
  tabTextActiveCompact: {
    fontSize: 26,
    lineHeight: 28,
    textAlign: "left",
  },
  sectionContent: {
    flex: 1,
    minHeight: 0,
  },
});

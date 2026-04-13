import React, { useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
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
  {
    id: "fb3",
    title: "Heavy",
    artist: "The Marías",
    subtitle: "CINEMA",
    duration: "04:13",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0b/67/3f/0b673fd4-5e49-fccd-6193-3076bef03f53/075679792389.jpg/600x600bb.jpg",
  },
  {
    id: "fb4",
    title: "Lejos de Ti",
    artist: "The Marías",
    subtitle: "Submarine",
    duration: "02:59",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0b/4d/b6/0b4db6bd-2d40-55a5-1714-67f5c816294d/075679659644.jpg/600x600bb.jpg",
  },
  {
    id: "fb5",
    title: "Summit",
    artist: "Skrillex",
    subtitle: "Bangarang",
    duration: "06:13",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b4/c3/e8/b4c3e867-a787-7662-d8a4-45b3a30deb54/mzi.dsikpckg.jpg/600x600bb.jpg",
  },
  {
    id: "fb6",
    title: "Back To Me",
    artist: "The Marías",
    subtitle: "Back To Me - Single",
    duration: "03:34",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cd/23/30/cd23301a-6faa-466a-0bac-ed393cce80ad/075679615336.jpg/600x600bb.jpg",
  },
];

const ALBUMS: AlbumItem[] =
  Array.isArray(CONST_ALBUMS) && CONST_ALBUMS.length > 0
    ? (CONST_ALBUMS as AlbumItem[])
    : FALLBACK_ALBUMS;

function formatDuration(duration?: string) {
  return duration && duration.trim().length > 0 ? duration : "--:--";
}

export default function HomeTab() {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = useMemo(
    () =>
      ALBUMS.map((album, index) => ({
        id: album.id ?? `album-${index}`,
        title: album.title ?? "Unknown Track",
        artist: album.artist ?? "Unknown Artist",
        subtitle: album.subtitle ?? "Unknown Release",
        duration: formatDuration(album.duration),
        cover: album.cover,
      })),
    [],
  );

  const selected = items[selectedIndex] ?? items[0];
  const stackItems = items.slice(0, 7);

  const cardWidth = Math.min(width - 48, 520);
  const topCardHeight = Math.max(220, Math.min(280, width * 0.52));
  const bottomCardHeight = Math.max(360, Math.min(460, width * 0.92));
  const stackCoverSize = Math.max(92, Math.min(118, width * 0.22));

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View
        style={[
          styles.widgetCard,
          styles.topWidget,
          {
            width: cardWidth,
            minHeight: topCardHeight,
            backgroundColor: "rgba(255,255,255,0.72)",
            borderColor: "rgba(255,255,255,0.78)",
            shadowColor: c.shadow,
          },
        ]}
      >
        <View style={styles.widgetHeader}>
          <Text style={[styles.widgetTitle, { color: c.textPrimary }]}>
            Mix
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.headerPill,
              {
                backgroundColor: "rgba(120,120,128,0.12)",
                borderColor: "rgba(120,120,128,0.08)",
              },
            ]}
          >
            <Ionicons
              name="refresh"
              size={16}
              color={c.textSecondary}
              style={styles.pillIcon}
            />
            <Text style={[styles.headerPillText, { color: c.textSecondary }]}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stackArea}>
          <View style={styles.stackWrap}>
            {stackItems.map((item, index) => {
              const offset = index * 34;
              const scale = 1 - index * 0.03;
              const rotate = `${-2 + index * 1.5}deg`;
              const zIndex = stackItems.length - index;
              const isSelected = selected.id === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  onPress={() => {
                    const nextIndex = items.findIndex(
                      (candidate) => candidate.id === item.id,
                    );
                    if (nextIndex >= 0) setSelectedIndex(nextIndex);
                  }}
                  style={[
                    styles.stackItem,
                    {
                      left: offset,
                      zIndex,
                      transform: [{ scale }, { rotate }],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.stackCoverShell,
                      {
                        width: stackCoverSize,
                        height: stackCoverSize,
                        borderColor: isSelected
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.55)",
                        shadowOpacity: isSelected ? 0.22 : 0.12,
                      },
                    ]}
                  >
                    {item.cover ? (
                      <Image
                        source={{ uri: item.cover }}
                        style={styles.coverImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.coverFallback,
                          { backgroundColor: "rgba(0,0,0,0.08)" },
                        ]}
                      >
                        <Ionicons
                          name="musical-notes"
                          size={26}
                          color="rgba(0,0,0,0.35)"
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={[
              styles.floatingInfo,
              {
                backgroundColor: "rgba(255,255,255,0.92)",
                shadowColor: c.shadow,
              },
            ]}
          >
            <Text
              style={[styles.floatingArtist, { color: c.textSecondary }]}
              numberOfLines={1}
            >
              {selected.artist}
            </Text>
            <Text
              style={[styles.floatingTrack, { color: c.textPrimary }]}
              numberOfLines={1}
            >
              {selected.title}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.widgetCard,
          styles.bottomWidget,
          {
            width: cardWidth,
            minHeight: bottomCardHeight,
            backgroundColor: "rgba(255,255,255,0.72)",
            borderColor: "rgba(255,255,255,0.78)",
            shadowColor: c.shadow,
          },
        ]}
      >
        <View style={styles.widgetHeader}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.headerPill,
              {
                backgroundColor: "rgba(120,120,128,0.12)",
                borderColor: "rgba(120,120,128,0.08)",
              },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={16}
              color={c.textSecondary}
              style={styles.pillIcon}
            />
            <Text style={[styles.headerPillText, { color: c.textSecondary }]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.headerPill,
              {
                backgroundColor: "rgba(120,120,128,0.12)",
                borderColor: "rgba(120,120,128,0.08)",
              },
            ]}
          >
            <Ionicons
              name="musical-notes-outline"
              size={16}
              color={c.textSecondary}
              style={styles.pillIcon}
            />
            <Text style={[styles.headerPillText, { color: c.textSecondary }]}>
              Open source
            </Text>
            <Ionicons
              name="arrow-up-outline"
              size={14}
              color={c.textSecondary}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.playerPhoneShell,
            {
              backgroundColor: c.glass2,
              borderColor: c.border,
              shadowColor: c.shadow,
            },
          ]}
        >
          <View style={styles.playerTopSpeaker} />
          <View style={styles.playerTopDot} />

          <View
            style={[
              styles.playerArtworkLarge,
              {
                shadowColor: c.shadow,
                borderColor: c.border,
              },
            ]}
          >
            {selected.cover ? (
              <Image
                source={{ uri: selected.cover }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.coverFallback,
                  { backgroundColor: "rgba(0,0,0,0.08)" },
                ]}
              >
                <Ionicons
                  name="musical-notes"
                  size={34}
                  color="rgba(0,0,0,0.35)"
                />
              </View>
            )}
          </View>

          <View style={styles.playerInfoVertical}>
            <View style={styles.playerTitleRow}>
              <View style={styles.playerTitleColumn}>
                <Text
                  style={[styles.playerTrack, { color: c.textPrimary }]}
                  numberOfLines={1}
                >
                  {selected.title}
                </Text>
                <Text
                  style={[styles.playerArtist, { color: c.textSecondary }]}
                  numberOfLines={1}
                >
                  {selected.artist}
                </Text>
                <Text
                  style={[styles.playerSubtitle, { color: c.textSecondary }]}
                  numberOfLines={1}
                >
                  {selected.subtitle}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.playerArrowBtn}
              >
                <Ionicons
                  name="arrow-up-outline"
                  size={18}
                  color={c.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.progressBlock}>
              <Text style={[styles.progressLabel, { color: c.textPrimary }]}>
                Pornves
              </Text>
              <View
                style={[
                  styles.progressTrack,
                  { backgroundColor: "rgba(120,120,128,0.18)" },
                ]}
              >
                <View
                  style={[styles.progressFill, { backgroundColor: c.accent }]}
                />
              </View>
              <View style={styles.progressMetaRow}>
                <Text
                  style={[styles.progressMetaText, { color: c.textSecondary }]}
                >
                  5:02
                </Text>
                <Text
                  style={[styles.progressMetaText, { color: c.textSecondary }]}
                >
                  50:10
                </Text>
              </View>
            </View>

            <View style={styles.controlsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconOnlyButton}
              >
                <Ionicons
                  name="shuffle-outline"
                  size={18}
                  color={c.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconOnlyButton}
              >
                <Ionicons
                  name="play-skip-back"
                  size={28}
                  color={c.textPrimary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.controlButton,
                  styles.playButton,
                  { backgroundColor: c.textPrimary, shadowColor: c.shadow },
                ]}
              >
                <Ionicons name="pause" size={22} color={c.bg} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconOnlyButton}
              >
                <Ionicons
                  name="play-skip-forward"
                  size={28}
                  color={c.textPrimary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.iconOnlyButton}
              >
                <Ionicons
                  name="scan-outline"
                  size={18}
                  color={c.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomMiniIcons}>
              <Ionicons
                name="shuffle-outline"
                size={16}
                color="rgba(120,120,128,0.28)"
              />
              <Ionicons
                name="play-skip-back"
                size={16}
                color="rgba(120,120,128,0.28)"
              />
              <Ionicons name="pause" size={16} color="rgba(120,120,128,0.28)" />
              <Ionicons
                name="play-skip-forward"
                size={16}
                color="rgba(120,120,128,0.28)"
              />
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.cameraButton,
                  { backgroundColor: "rgba(120,120,128,0.14)" },
                ]}
              >
                <Ionicons
                  name="radio-button-on-outline"
                  size={18}
                  color={c.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[styles.homeIndicator, { backgroundColor: c.textPrimary }]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  widgetCard: {
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
    overflow: "hidden",
  },
  topWidget: {
    marginBottom: 28,
  },
  bottomWidget: {
    marginBottom: 8,
  },
  widgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  widgetTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  headerPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  pillIcon: {
    marginRight: 6,
  },
  headerPillText: {
    fontSize: 14,
    fontWeight: "700",
  },
  stackArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  stackWrap: {
    height: 132,
    justifyContent: "center",
  },
  stackItem: {
    position: "absolute",
    top: 0,
  },
  stackCoverShell: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
  },
  floatingInfo: {
    alignSelf: "flex-end",
    maxWidth: 170,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  floatingArtist: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  floatingTrack: {
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 18,
  },
  playerPhoneShell: {
    alignSelf: "center",
    width: "100%",
    borderRadius: 34,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 12,
    overflow: "hidden",
  },
  playerTopSpeaker: {
    alignSelf: "center",
    width: 54,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(120,120,128,0.28)",
    marginBottom: 10,
  },
  playerTopDot: {
    position: "absolute",
    top: 22,
    right: 28,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(120,120,128,0.22)",
  },
  playerArtworkLarge: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 10,
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
  playerInfoVertical: {
    width: "100%",
  },
  playerTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  playerTitleColumn: {
    flex: 1,
  },
  playerArtist: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  playerTrack: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 4,
  },
  playerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 0,
  },
  playerArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBlock: {
    width: "100%",
    marginBottom: 18,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressTrack: {
    width: "100%",
    height: 3,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    width: "42%",
    height: "100%",
    borderRadius: 999,
  },
  progressMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressMetaText: {
    fontSize: 12,
    fontWeight: "700",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 18,
  },
  iconOnlyButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
  playButton: {
    width: 58,
    height: 58,
  },
  bottomMiniIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cameraButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIndicator: {
    alignSelf: "center",
    width: 118,
    height: 5,
    borderRadius: 999,
    opacity: 0.9,
  },
});

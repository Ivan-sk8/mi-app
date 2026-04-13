import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { usePlayer } from "@/contexts/player-context";
import { useTheme } from "../contexts/ThemeContext";

export default function MiniPlayer() {
  const router = useRouter();
  const { c } = useTheme();
  const { currentAlbum, isPlaying, togglePlay, playNext } = usePlayer();

  const openPlayer = () => {
    router.push("/player");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={openPlayer}
      style={[
        styles.container,
        {
          backgroundColor: c.glass2,
          borderColor: c.border,
          shadowColor: c.shadow,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.coverShell,
            {
              borderColor: c.border,
              backgroundColor: c.iconBg,
            },
          ]}
        >
          {currentAlbum?.cover ? (
            <Image
              source={{ uri: currentAlbum.cover }}
              style={styles.cover}
              contentFit="cover"
              transition={180}
            />
          ) : (
            <View style={styles.fallbackCover}>
              <Ionicons
                name="musical-notes"
                size={18}
                color={c.textSecondary}
              />
            </View>
          )}
        </View>

        <View style={styles.meta}>
          <Text
            style={[styles.title, { color: c.textPrimary }]}
            numberOfLines={1}
          >
            {currentAlbum?.title ?? "Nothing playing"}
          </Text>
          <Text
            style={[styles.artist, { color: c.textSecondary }]}
            numberOfLines={1}
          >
            {currentAlbum?.artist ?? "Unknown Artist"}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={(event) => {
            event.stopPropagation();
            togglePlay();
          }}
          style={[
            styles.iconButton,
            {
              backgroundColor: c.iconBg,
              borderColor: c.border,
            },
          ]}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={18}
            color={c.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={(event) => {
            event.stopPropagation();
            playNext();
          }}
          style={[
            styles.iconButton,
            {
              backgroundColor: c.iconBg,
              borderColor: c.border,
            },
          ]}
        >
          <Ionicons
            name="play-skip-forward"
            size={18}
            color={c.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.progressBar,
          {
            backgroundColor: c.border,
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: c.accent,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    minHeight: 74,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
    overflow: "hidden",
  },
  leftSection: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  coverShell: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    marginRight: 12,
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  fallbackCover: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 18,
    marginBottom: 4,
  },
  artist: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 6,
    height: 3,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    width: "34%",
    height: "100%",
    borderRadius: 999,
  },
});

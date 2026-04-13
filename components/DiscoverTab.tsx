import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * DiscoverTab
 *
 * Self-contained Discover screen that can be rendered inside a fixed artboard.
 * Note: avoid using an explicit return type like `: JSX.Element` to be safe with
 * some TypeScript configurations that don't include the JSX namespace.
 *
 * This is a lightweight mocked implementation (no external state) intended for
 * previewing UI in the app.
 */

const GENRES = [
  "Pop",
  "Chill",
  "Electronica",
  "Hip Hop",
  "Jazz",
  "Indie",
  "Classical",
];

const FEATURED = {
  title: "Episode 1",
  subtitle: "Wisdom Tree",
  artist: "Rachel Brown",
  cover:
    "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b4/c3/e8/b4c3e867-a787-7662-d8a4-45b3a30deb54/mzi.dsikpckg.jpg/600x600bb.jpg",
};

export default function DiscoverTab() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Discover</Text>

        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.85}>
          <Ionicons name="options-outline" size={20} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color="#999" />
        <TextInput
          placeholder="Find what you love"
          placeholderTextColor="#9b9b9b"
          style={styles.searchInput}
        />
      </View>

      {/* Genres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genresRow}
      >
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            style={styles.genreChip}
            activeOpacity={0.85}
          >
            <Text style={styles.genreText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured / big card */}
      <View style={styles.featuredCard}>
        <Image source={{ uri: FEATURED.cover }} style={styles.featuredImage} />

        <View style={styles.featuredMeta}>
          <Text style={styles.featuredSubtitle}>{FEATURED.subtitle}</Text>
          <Text style={styles.featuredTitle}>{FEATURED.title}</Text>

          <View style={styles.featuredRow}>
            <View>
              <Text style={styles.artistName}>{FEATURED.artist}</Text>
            </View>

            <TouchableOpacity style={styles.playButton} activeOpacity={0.85}>
              <Ionicons name="play" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* bottom spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 28,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    minHeight: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111",
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 14,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 15,
    color: "#222",
    padding: 0,
    flex: 1,
  },

  genresRow: {
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 999,
    marginRight: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  genreText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 13,
  },

  featuredCard: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  featuredImage: {
    width: "100%",
    height: 220,
  },
  featuredMeta: {
    padding: 14,
  },
  featuredSubtitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 6,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  featuredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  artistName: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});

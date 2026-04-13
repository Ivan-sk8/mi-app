import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ArtistsMasonry from "./ArtistsMasonry";
import { useTheme } from "../contexts/ThemeContext";

export default function ArtistTab() {
  const { c } = useTheme();
  const [query, setQuery] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: c.glass2,
              borderColor: c.border,
              shadowColor: c.shadow,
            },
          ]}
        >
          {/* Top highlight strip */}
          <View style={[styles.highlight, { backgroundColor: c.highlight }]} />

          <Ionicons
            name="search"
            size={17}
            color={c.textMuted}
            style={styles.searchIcon}
          />

          <TextInput
            style={[styles.input, { color: c.textPrimary }]}
            placeholder="Buscar artista…"
            placeholderTextColor={c.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="never"
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="close-circle"
                size={17}
                color={c.textMuted}
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Artists word cloud ─────────────────────────────────────────────── */}
      <ArtistsMasonry searchQuery={query} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 36,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 44,
    overflow: "hidden",
    position: "relative",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    borderRadius: 999,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "400",
    paddingVertical: 0,
    includeFontPadding: false,
  },
  clearIcon: {
    marginLeft: 6,
  },
});

// HistorialTab
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const historyItems = [
  {
    id: "1",
    color: "#A78BFA",
    title: "No One Noticed",
    artist: "The Marías",
    time: "hace 5 min",
  },
  {
    id: "2",
    color: "#60A5FA",
    title: "Scary Monsters",
    artist: "Skrillex",
    time: "hace 12 min",
  },
  {
    id: "3",
    color: "#F472B6",
    title: "Cariño",
    artist: "The Marías",
    time: "hace 1h",
  },
  {
    id: "4",
    color: "#34D399",
    title: "Summit",
    artist: "Skrillex",
    time: "ayer",
  },
  {
    id: "5",
    color: "#FB923C",
    title: "Back To Me",
    artist: "The Marías",
    time: "ayer",
  },
];

export default function HistorialTab() {
  const { c } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: c.textPrimary }]}>
          Historial
        </Text>
        <TouchableOpacity
          style={[
            styles.settingsButton,
            { backgroundColor: c.iconBg, borderColor: c.border },
          ]}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={22} color={c.iconColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {historyItems.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: c.glass2,
                borderColor: c.border,
                shadowColor: c.shadow,
              },
            ]}
          >
            {/* 1px top highlight strip */}
            <View
              style={[styles.cardHighlight, { backgroundColor: c.highlight }]}
            />

            {/* Colored square */}
            <View
              style={[styles.colorSquare, { backgroundColor: item.color }]}
            />

            {/* Song info */}
            <View style={styles.cardText}>
              <Text style={[styles.songTitle, { color: c.textPrimary }]}>
                {item.title}
              </Text>
              <Text style={[styles.artistName, { color: c.textSecondary }]}>
                {item.artist}
              </Text>
            </View>

            {/* Time played */}
            <Text style={[styles.timePlayed, { color: c.textMuted }]}>
              {item.time}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -1,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 6,
  },
  cardHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  colorSquare: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 14,
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  artistName: {
    fontSize: 13,
  },
  timePlayed: {
    fontSize: 12,
    marginLeft: 8,
    flexShrink: 0,
  },
});

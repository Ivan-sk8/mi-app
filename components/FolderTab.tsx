import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const FOLDERS = [
  {
    id: "1",
    name: "Orpheous",
    count: 24,
    sizeGb: 1.4,
  },
  {
    id: "2",
    name: "Kimberella",
    count: 17,
    sizeGb: 0.8,
  },
];

export default function FolderTab() {
  const { c, isDark } = useTheme();
  const [pressed, setPressed] = useState<string | null>(null);

  // The folder "cover" blends with the bg — just barely lifts off it
  const folderCoverBg = isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const folderCoverBorder = isDark
    ? "rgba(255,255,255,0.09)"
    : "rgba(0,0,0,0.06)";
  const folderIconColor = isDark
    ? "rgba(255,255,255,0.18)"
    : "rgba(0,0,0,0.12)";

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.textPrimary }]}>Carpeta</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {FOLDERS.map((folder) => {
          const isPressed = pressed === folder.id;

          return (
            <TouchableOpacity
              key={folder.id}
              activeOpacity={1}
              onPressIn={() => setPressed(folder.id)}
              onPressOut={() => setPressed(null)}
              style={[
                styles.card,
                {
                  backgroundColor: isPressed ? c.glass2 : "transparent",
                  borderColor: isPressed ? c.border : "transparent",
                },
              ]}
            >
              {/* ── Folder "cover" square ─────────────────────────────── */}
              <View
                style={[
                  styles.coverSquare,
                  {
                    backgroundColor: folderCoverBg,
                    borderColor: folderCoverBorder,
                    shadowColor: isDark ? "#000" : "#00000022",
                  },
                ]}
              >
                {/* Folder tab nub at top-left */}
                <View
                  style={[
                    styles.folderNub,
                    { backgroundColor: folderCoverBorder },
                  ]}
                />
                {/* Large folder icon — barely visible */}
                <Ionicons
                  name="folder-open-outline"
                  size={48}
                  color={folderIconColor}
                />
              </View>

              {/* ── Info ──────────────────────────────────────────────── */}
              <View style={styles.info}>
                <Text
                  style={[styles.folderName, { color: c.textPrimary }]}
                  numberOfLines={1}
                >
                  {folder.name}
                </Text>

                <Text style={[styles.count, { color: c.textSecondary }]}>
                  {folder.count} canciones
                </Text>

                <View style={styles.sizeRow}>
                  <View
                    style={[
                      styles.sizePill,
                      { borderColor: c.border, backgroundColor: c.glass1 },
                    ]}
                  >
                    <Text style={[styles.sizeText, { color: c.textMuted }]}>
                      {folder.sizeGb.toFixed(1)} GB
                    </Text>
                  </View>
                </View>
              </View>

              {/* ── Chevron ───────────────────────────────────────────── */}
              <Ionicons
                name="chevron-forward"
                size={15}
                color={c.textMuted}
                style={styles.chevron}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 36,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -1,
  },
  list: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 40,
  },

  // Card row — no heavy background, focus is on the cover square
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  // Album-cover-style square
  coverSquare: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    position: "relative",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
    overflow: "visible",
  },

  // Tiny rounded tab at the top-left of the folder shape
  folderNub: {
    position: "absolute",
    top: -5,
    left: 14,
    width: 28,
    height: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  info: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
  },
  folderName: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  count: {
    fontSize: 13,
    fontWeight: "400",
  },
  sizeRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  sizePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  sizeText: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  chevron: {
    marginLeft: 6,
  },
});

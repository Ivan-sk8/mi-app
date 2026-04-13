import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function MixTab() {
  const { c } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: c.textPrimary }]}>Mix</Text>
        <TouchableOpacity
          style={[
            styles.settingsButton,
            {
              backgroundColor: c.iconBg,
              borderColor: c.border,
              shadowColor: c.shadow,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={22} color={c.iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
  },
});

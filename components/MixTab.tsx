import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MixTab() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Mix</Text>
        <View style={styles.settingsButton}>
          <Text style={{ fontSize: 22, color: "#222" }}>⚙️</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f3ef",
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
    color: "#222",
    letterSpacing: -1,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e7e6e2",
    marginTop: 2,
  },
});

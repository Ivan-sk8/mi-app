import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FolderTab() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Carpeta</Text>
      <TouchableOpacity style={styles.settingsButton} activeOpacity={0.8}>
        <Ionicons name="options-outline" size={22} color="#222" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 36,
    backgroundColor: "#f4f3ef",
    marginBottom: 8,
  },
  headerText: {
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

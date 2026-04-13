import React from "react";
import { ScrollView, StyleSheet, Text, View, Platform } from "react-native";

import LibraryTab from "../components/LibraryTab";
import ContentTab from "../components/ContentTab";
import DiscoverTab from "../components/DiscoverTab";

/**
 * Preview screen for showing three artboards side-by-side at fixed device dimensions.
 *
 * - Each artboard uses fixed width/height matching a reference device (iPhone-like).
 * - The layout is a horizontal row inside a ScrollView so you can pan left/right.
 * - Artboards are wrapped in a rounded frame to mimic device preview.
 *
 * Usage:
 * - Open /preview in the expo-router (or navigate to this route) to view the three screens.
 *
 * Notes:
 * - This component targets web and native. On web it will keep fixed pixel sizes so content
 *   doesn't reflow with the browser window.
 * - If any of the tab components import platform-specific code that doesn't run on web,
 *   you'll need to adapt those components for web compatibility.
 */

const DEVICE = {
  WIDTH: 430,
  HEIGHT: 932,
  RADIUS: 22,
  GAP: 20,
};

export default function PreviewScreen() {
  const artboards = [
    { key: "library", title: "Library", Component: LibraryTab },
    { key: "content", title: "Content", Component: ContentTab },
    { key: "discover", title: "Discover", Component: DiscoverTab },
  ];

  return (
    <View style={styles.page}>
      <Text style={styles.pageTitle}>Artboard preview — fixed device size</Text>

      <ScrollView
        horizontal
        contentContainerStyle={styles.row}
        showsHorizontalScrollIndicator={false}
        // on web we want the scroll to feel natural and constrained; decelerationRate has no effect on web
        scrollEventThrottle={16}
      >
        {artboards.map(({ key, title, Component }) => (
          <View key={key} style={styles.slot}>
            <View style={styles.frame}>
              <View style={styles.frameHeader}>
                <Text style={styles.artboardTitle}>{title}</Text>
              </View>

              {/* artboard viewport */}
              <View style={styles.artboardViewport}>
                <Component />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.note}>
        Each artboard is rendered at {DEVICE.WIDTH} x {DEVICE.HEIGHT} px to keep
        layout stable.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 14,
    color: "#222",
    marginBottom: 12,
  },
  row: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  slot: {
    width: DEVICE.WIDTH + DEVICE.GAP,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: DEVICE.WIDTH,
    height: DEVICE.HEIGHT,
    borderRadius: DEVICE.RADIUS,
    backgroundColor: "#ffffff",
    overflow: "hidden",

    // shadow (works on native). For web, React Native Web maps shadow props to box-shadow.
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,

    // small border to emphasize the device frame
    borderWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: Platform.OS === "web" ? "#e6e6e6" : "transparent",
  },
  frameHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },
  artboardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  artboardViewport: {
    // This viewport holds the actual app screen component.
    // Important: force the child to be exactly the artboard size so internal layout does not reflow.
    width: DEVICE.WIDTH,
    height: DEVICE.HEIGHT - 56, // subtract header area in frame
    backgroundColor: "transparent",
  },
  note: {
    marginTop: 18,
    fontSize: 12,
    color: "#666",
  },
});

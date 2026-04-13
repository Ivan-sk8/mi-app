import React from "react";
import { View, StyleSheet } from "react-native";
import ArtistsMasonry from "./ArtistsMasonry";

/**
 * ContentTab
 *
 * Lightweight wrapper to expose a `ContentTab` component that reuses the
 * existing `ArtistsMasonry` implementation. Kept intentionally simple so it
 * can be rendered in the preview artboard and in the app without TypeScript
 * JSX namespace requirements.
 */
export default function ContentTab() {
  return (
    <View style={styles.container}>
      <ArtistsMasonry />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Keep background transparent so the preview frame can control the artboard background.
    backgroundColor: "transparent",
    // Ensure children can shrink/grow to fill the available artboard space.
    minHeight: 0,
  },
});

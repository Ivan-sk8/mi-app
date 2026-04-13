import { StyleSheet, ViewStyle, TextStyle } from "react-native";

// ─── Core palette ─────────────────────────────────────────────────────────────
export const COLORS = {
  /** Main app background – deep dark purple-black */
  bg: "#0D0C14",
  bgAlt: "#110F1A",

  /** Glass surface layers */
  glass1: "rgba(255,255,255,0.07)",   // subtle card
  glass2: "rgba(255,255,255,0.11)",   // elevated card
  glass3: "rgba(255,255,255,0.18)",   // pressed / active
  glassDeep: "rgba(10,8,20,0.55)",    // dark glass overlay

  /** Borders */
  border: "rgba(255,255,255,0.13)",
  borderBright: "rgba(255,255,255,0.22)",
  borderDim: "rgba(255,255,255,0.07)",

  /** Top-edge highlight (inner glow) */
  highlight: "rgba(255,255,255,0.20)",

  /** Typography */
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.28)",

  /** Accent colours */
  accent: "#A78BFA",        // soft violet
  accentBlue: "#60A5FA",    // sky blue
  accentPink: "#F472B6",    // pink
  accentGlow: "rgba(167,139,250,0.35)",

  /** Utility */
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────
export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const SPACE = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─── Shared shadow for glass cards ────────────────────────────────────────────
export const GLASS_SHADOW: ViewStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.45,
  shadowRadius: 24,
  elevation: 10,
};

// ─── Glass card base style ────────────────────────────────────────────────────
export const glassCard: ViewStyle = {
  backgroundColor: COLORS.glass1,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.lg,
  ...GLASS_SHADOW,
};

/** Slightly more opaque / elevated card */
export const glassCardElevated: ViewStyle = {
  ...glassCard,
  backgroundColor: COLORS.glass2,
  borderColor: COLORS.borderBright,
};

/** Pill-shaped glass button */
export const glassPill: ViewStyle = {
  backgroundColor: COLORS.glass2,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.full,
  paddingHorizontal: SPACE.md,
  paddingVertical: SPACE.sm,
};

// ─── Top-edge inner highlight strip ──────────────────────────────────────────
export const glassTopHighlight: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 16,
  right: 16,
  height: 1,
  backgroundColor: COLORS.highlight,
  borderRadius: RADIUS.full,
};

// ─── Settings / icon button ───────────────────────────────────────────────────
export const iconButton: ViewStyle = {
  width: 38,
  height: 38,
  borderRadius: RADIUS.full,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: COLORS.glass2,
  borderWidth: 1,
  borderColor: COLORS.border,
  ...GLASS_SHADOW,
};

// ─── Typography helpers ───────────────────────────────────────────────────────
export const TEXT: Record<string, TextStyle> = {
  heading: {
    fontSize: 38,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
};

// ─── Root screen style ────────────────────────────────────────────────────────
export const screenBase = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.xl,
    marginBottom: SPACE.sm,
  },
});

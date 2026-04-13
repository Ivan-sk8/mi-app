import React, { createContext, useContext, useState } from "react";

// ─── Colour tokens ────────────────────────────────────────────────────────────
export type ThemeColors = {
  bg: string;
  bgAlt: string;
  glass1: string;
  glass2: string;
  glass3: string;
  border: string;
  borderBright: string;
  highlight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentBlue: string;
  iconColor: string;
  iconBg: string;
  shadow: string;
  switchTrack: string;
};

export const LIGHT: ThemeColors = {
  bg: "#F8F7F4",
  bgAlt: "#FBFFFE",
  glass1: "rgba(255,255,255,0.60)",
  glass2: "rgba(255,255,255,0.82)",
  glass3: "rgba(255,255,255,0.97)",
  border: "rgba(0,0,0,0.07)",
  borderBright: "rgba(0,0,0,0.14)",
  highlight: "rgba(255,255,255,0.92)",
  textPrimary: "#121212",
  textSecondary: "rgba(18,18,18,0.52)",
  textMuted: "rgba(18,18,18,0.30)",
  accent: "#A30000",
  accentBlue: "#33658A",
  iconColor: "#121212",
  iconBg: "rgba(0,0,0,0.07)",
  shadow: "#00000022",
  switchTrack: "#A30000",
};

export const DARK: ThemeColors = {
  bg: "#121212",
  bgAlt: "#1A1A1A",
  glass1: "rgba(255,255,255,0.07)",
  glass2: "rgba(255,255,255,0.11)",
  glass3: "rgba(255,255,255,0.18)",
  border: "rgba(255,255,255,0.12)",
  borderBright: "rgba(255,255,255,0.22)",
  highlight: "rgba(255,255,255,0.18)",
  textPrimary: "#FBFFFE",
  textSecondary: "rgba(251,255,254,0.55)",
  textMuted: "rgba(251,255,254,0.28)",
  accent: "#A30000",
  accentBlue: "#33658A",
  iconColor: "#FBFFFE",
  iconBg: "rgba(255,255,255,0.11)",
  shadow: "#00000066",
  switchTrack: "#A30000",
};

// ─── Context ──────────────────────────────────────────────────────────────────
type ThemeContextType = {
  isDark: boolean;
  toggle: () => void;
  c: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
  c: LIGHT,
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false); // light is default

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggle: () => setIsDark((prev) => !prev),
        c: isDark ? DARK : LIGHT,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}

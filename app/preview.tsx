import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";

// ── Actual screen / tab components ───────────────────────────────────────────
import LibraryTab from "@/components/LibraryTab";
import AlbumTab from "@/components/AlbumTab";
import TracksTab from "@/components/TracksTab";
import ArtistTab from "@/components/ArtistTab";
import PlaylistTab from "@/components/PlaylistTab";
import SettingsTab from "@/components/SettingsTab";
import { PlayerView } from "@/components/player-view";
import AllAlbumsScreen from "./all-albums";

// ── Hooks & data ──────────────────────────────────────────────────────────────
import { useTheme } from "@/contexts/ThemeContext";
import { albums } from "@/constants/albums";

// ─────────────────────────────────────────────────────────────────────────────
// Canvas constants
// ─────────────────────────────────────────────────────────────────────────────
const W = 430;
const H = 932;
const GAP = 48;
const PAD = 64;
const ACCENT = "#A30000";

// ─────────────────────────────────────────────────────────────────────────────
// Artboard — device-frame wrapper
// ─────────────────────────────────────────────────────────────────────────────
function Artboard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginRight: GAP, alignItems: "center" }}>
      <Text style={s.artboardLabel}>{label}</Text>
      <View
        style={[
          s.frame,
          Platform.OS === "web" &&
            ({ boxShadow: "0 28px 72px rgba(0,0,0,0.75)" } as object),
        ]}
      >
        {children}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GroupRow — labelled horizontal-scroll row
// ─────────────────────────────────────────────────────────────────────────────
function GroupRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 80 }}>
      <Text style={s.groupLabel}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: PAD }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK — +Not Found  (inline so we avoid Stack.Screen outside navigator)
// ─────────────────────────────────────────────────────────────────────────────
function NotFoundMock() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#121212",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
      }}
    >
      <Ionicons
        name="alert-circle-outline"
        size={64}
        color="rgba(255,255,255,0.18)"
        style={{ marginBottom: 20 }}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          color: "#FBFFFE",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Oops!
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "rgba(251,255,254,0.45)",
          textAlign: "center",
          marginBottom: 32,
          lineHeight: 22,
        }}
      >
        Esta pantalla no existe.
      </Text>
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 13,
          borderRadius: 14,
          backgroundColor: ACCENT,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
          Volver al inicio
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK — Album Detail overlay
// ─────────────────────────────────────────────────────────────────────────────
function AlbumDetailMock() {
  const { c } = useTheme();
  const album = albums[0];
  const group = albums.filter(
    (a) => a.artist === album.artist && a.subtitle === album.subtitle,
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 18,
          paddingTop: 56,
          paddingBottom: 12,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: c.glass2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-down" size={20} color={c.textSecondary} />
        </View>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            letterSpacing: 1.1,
            color: c.textSecondary,
          }}
        >
          ÁLBUM
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* Cover */}
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: 40,
            paddingVertical: 18,
          }}
        >
          <View
            style={{
              width: W - 80,
              height: W - 80,
              borderRadius: 20,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.38,
              shadowRadius: 22,
              elevation: 14,
            }}
          >
            <Image
              source={{ uri: album.cover }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        </View>

        {/* Info */}
        <View style={{ paddingHorizontal: 22, marginBottom: 22 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: c.textPrimary,
              letterSpacing: -0.5,
              lineHeight: 30,
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {album.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: c.textSecondary,
              marginBottom: 14,
            }}
            numberOfLines={1}
          >
            {album.artist}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: ACCENT,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: ACCENT,
                  letterSpacing: 0.5,
                }}
              >
                DSD
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: c.glass2,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: c.textSecondary,
                }}
              >
                2024
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: c.glass2,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: c.textSecondary,
                }}
              >
                {album.subtitle}
              </Text>
            </View>
          </View>
        </View>

        {/* Play / Shuffle */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            paddingHorizontal: 22,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 48,
              borderRadius: 14,
              backgroundColor: ACCENT,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
              Reproducir
            </Text>
          </View>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: c.glass2,
              borderWidth: 1,
              borderColor: c.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="shuffle" size={20} color={c.textPrimary} />
          </View>
        </View>

        {/* Track list */}
        <View style={{ paddingHorizontal: 22 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1,
              color: c.textSecondary,
              marginBottom: 12,
            }}
          >
            CANCIONES
          </Text>
          {group.map((track) => (
            <View
              key={track.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: c.border,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  overflow: "hidden",
                  marginRight: 12,
                  backgroundColor: c.iconBg,
                }}
              >
                <Image
                  source={{ uri: track.cover }}
                  style={{ width: 44, height: 44 }}
                  contentFit="cover"
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: c.textPrimary,
                    marginBottom: 2,
                  }}
                  numberOfLines={1}
                >
                  {track.title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: c.textSecondary,
                  }}
                  numberOfLines={1}
                >
                  {track.artist}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: c.textMuted,
                  fontWeight: "500",
                  marginLeft: 8,
                }}
              >
                {track.duration}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK — Queue panel
// ─────────────────────────────────────────────────────────────────────────────
function QueueMock() {
  const { c, isDark } = useTheme();
  const bg = c.bg;
  const tp = c.textPrimary;
  const ts = c.textSecondary;
  const btnBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(18,18,18,0.07)";

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: btnBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-down" size={20} color={ts} />
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 1.2,
            color: ts,
          }}
        >
          COLA
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Now playing */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 6 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1.2,
              color: ACCENT,
              marginBottom: 12,
            }}
          >
            REPRODUCIENDO AHORA
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 14,
              backgroundColor: isDark
                ? "rgba(163,0,0,0.10)"
                : "rgba(163,0,0,0.06)",
              borderWidth: 1,
              borderColor: isDark ? "rgba(163,0,0,0.30)" : "rgba(163,0,0,0.18)",
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                overflow: "hidden",
                marginRight: 12,
                backgroundColor: c.iconBg,
              }}
            >
              <Image
                source={{ uri: albums[0].cover }}
                style={{ width: 46, height: 46 }}
                contentFit="cover"
              />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: tp,
                  marginBottom: 2,
                }}
                numberOfLines={1}
              >
                {albums[0].title}
              </Text>
              <Text
                style={{ fontSize: 12, fontWeight: "500", color: ts }}
                numberOfLines={1}
              >
                {albums[0].artist}
              </Text>
            </View>
            <MaterialCommunityIcons name="waveform" size={18} color={ACCENT} />
          </View>
        </View>

        {/* Divider */}
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.10)"
              : "rgba(0,0,0,0.08)",
            marginHorizontal: 20,
            marginVertical: 10,
          }}
        />

        {/* Up next */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1.2,
              color: ts,
              marginBottom: 10,
            }}
          >
            A CONTINUACIÓN
          </Text>
          {albums.slice(1).map((album, i) => (
            <View
              key={album.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 9,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.06)",
              }}
            >
              <Text
                style={{
                  width: 22,
                  fontSize: 12,
                  fontWeight: "600",
                  color: ts,
                  textAlign: "center",
                  marginRight: 8,
                }}
              >
                {i + 2}
              </Text>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 9,
                  overflow: "hidden",
                  marginRight: 12,
                  backgroundColor: c.iconBg,
                }}
              >
                <Image
                  source={{ uri: album.cover }}
                  style={{ width: 42, height: 42 }}
                  contentFit="cover"
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: tp,
                    marginBottom: 2,
                  }}
                  numberOfLines={1}
                >
                  {album.title}
                </Text>
                <Text
                  style={{ fontSize: 12, fontWeight: "500", color: ts }}
                  numberOfLines={1}
                >
                  {album.artist}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "500",
                  color: ts,
                  marginLeft: 8,
                }}
              >
                {album.duration}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK — Lyrics panel
// ─────────────────────────────────────────────────────────────────────────────
const LYRICS_SAMPLE = [
  "Te fuiste un domingo",
  "que el cielo nublado",
  "",
  "Y nadie lo notó,",
  "nadie lo notó",
  "",
  "Caminé entre sombras",
  "buscando tu voz",
  "",
  "Pero nadie lo notó,",
  "nadie lo notó",
  "",
  "Las flores marchitas",
  "en silencio cayeron",
  "",
  "Y el mundo siguió",
  "como si nada pasó",
  "",
  "Pero yo te recuerdo",
  "cada vez que anochece",
  "",
  "Y nadie lo notó,",
  "nadie lo notó",
];
const ACTIVE_LINE = 4;

function LyricsMock() {
  const { c, isDark } = useTheme();
  const bg = c.bg;
  const tp = c.textPrimary;
  const ts = c.textSecondary;
  const btnBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(18,18,18,0.07)";

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: btnBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-down" size={20} color={ts} />
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 1.2,
            color: ts,
          }}
        >
          LYRICS
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Track info */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 14,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: c.border,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: tp,
            marginBottom: 3,
          }}
          numberOfLines={1}
        >
          {albums[0].title}
        </Text>
        <Text
          style={{ fontSize: 13, fontWeight: "500", color: ts }}
          numberOfLines={1}
        >
          {albums[0].artist}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {LYRICS_SAMPLE.map((line, i) => {
          if (line === "") return <View key={i} style={{ height: 14 }} />;
          const active = i === ACTIVE_LINE;
          return (
            <View key={i} style={{ paddingVertical: 4, marginBottom: 2 }}>
              <Text
                style={{
                  color: tp,
                  opacity: active ? 1 : 0.35,
                  fontSize: active ? 27 : 22,
                  fontWeight: active ? "800" : "600",
                  letterSpacing: active ? -0.5 : -0.2,
                  lineHeight: active ? 33 : 28,
                }}
              >
                {line}
              </Text>
              {active && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: ACCENT,
                    marginTop: 5,
                    marginLeft: 2,
                  }}
                />
              )}
            </View>
          );
        })}
        <View
          style={{ marginTop: 32, alignItems: "center", paddingBottom: 16 }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: ts,
              marginBottom: 4,
            }}
          >
            {albums[0].artist}
          </Text>
          <Text style={{ fontSize: 12, color: ts, opacity: 0.5 }}>
            {albums[0].subtitle}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK — Player options bottom sheet
// ─────────────────────────────────────────────────────────────────────────────
const PLAYER_MENU = [
  {
    icon: "heart-outline" as const,
    label: "Agregar a favoritos",
    sub: null,
    chevron: false,
  },
  {
    icon: "shuffle" as const,
    label: "Modo aleatorio",
    sub: "Desactivado",
    chevron: false,
  },
  {
    icon: "repeat-outline" as const,
    label: "Repetir",
    sub: "Desactivado",
    chevron: false,
  },
  {
    icon: "share-outline" as const,
    label: "Compartir",
    sub: null,
    chevron: false,
  },
  {
    icon: "timer-outline" as const,
    label: "Temporizador de sueño",
    sub: "Sin temporizador",
    chevron: true,
  },
];

function PlayerOptionsMock() {
  const { c, isDark } = useTheme();
  const sheetBg = isDark ? "#121212" : "#ECF8F8";
  const tp = isDark ? "#FBFFFE" : "#121212";
  const ts = c.textSecondary;
  const iconBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(26,22,18,0.06)";
  const div = isDark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.06)";

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Dimmed bg */}
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.52)" }} />

      {/* Sheet */}
      <View
        style={{
          backgroundColor: sheetBg,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          paddingBottom: 36,
          paddingHorizontal: 16,
        }}
      >
        {/* Pill */}
        <View
          style={{
            alignSelf: "center",
            width: 40,
            height: 4,
            borderRadius: 2,
            marginTop: 12,
            marginBottom: 18,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.22)"
              : "rgba(26,22,18,0.18)",
          }}
        />

        {/* Track header */}
        <View style={{ marginBottom: 14 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              letterSpacing: -0.3,
              color: tp,
              marginBottom: 3,
            }}
            numberOfLines={1}
          >
            {albums[0].title}
          </Text>
          <Text
            style={{ fontSize: 13, fontWeight: "500", color: ts }}
            numberOfLines={1}
          >
            {albums[0].artist}
          </Text>
        </View>
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(26,22,18,0.08)",
            marginBottom: 6,
          }}
        />

        {PLAYER_MENU.map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 13,
              borderBottomWidth: i < PLAYER_MENU.length - 1 ? 1 : 0,
              borderBottomColor: div,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                backgroundColor: iconBg,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name={item.icon} size={18} color={tp} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: tp }}>
                {item.label}
              </Text>
              {item.sub ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: ts,
                    marginTop: 2,
                    opacity: 0.7,
                  }}
                >
                  {item.sub}
                </Text>
              ) : null}
            </View>
            {item.chevron ? (
              <Ionicons name="chevron-forward" size={16} color={ts} />
            ) : null}
          </View>
        ))}

        {/* Cancel */}
        <View
          style={{
            marginTop: 10,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
            backgroundColor: isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(26,22,18,0.06)",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: ts }}>
            Cancelar
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK — Track context menu (TracksTab)
// ─────────────────────────────────────────────────────────────────────────────
const TRACK_MENU = [
  { icon: "play" as const, label: "Reproducir", danger: false },
  {
    icon: "heart-outline" as const,
    label: "Agregar a favoritos",
    danger: false,
  },
  {
    icon: "add-circle-outline" as const,
    label: "Agregar a playlist",
    danger: false,
  },
  { icon: "trash-outline" as const, label: "Eliminar", danger: true },
];

function TrackMenuMock() {
  const { c, isDark } = useTheme();
  const sheetBg = isDark ? "#121212" : "#F8F7F4";
  const tp = c.textPrimary;
  const ts = c.textSecondary;
  const div = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const track = albums[8]; // Scary Monsters — Skrillex

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Dimmed bg */}
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.50)" }} />

      {/* Sheet */}
      <View
        style={{
          backgroundColor: sheetBg,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          paddingBottom: 36,
          paddingHorizontal: 16,
        }}
      >
        {/* Pill */}
        <View
          style={{
            alignSelf: "center",
            width: 40,
            height: 4,
            borderRadius: 2,
            marginTop: 12,
            marginBottom: 18,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.20)"
              : "rgba(0,0,0,0.15)",
          }}
        />

        {/* Track header */}
        <View style={{ marginBottom: 14 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              letterSpacing: -0.3,
              color: tp,
              marginBottom: 3,
            }}
            numberOfLines={1}
          >
            {track.title}
          </Text>
          <Text
            style={{ fontSize: 13, fontWeight: "500", color: ts }}
            numberOfLines={1}
          >
            {track.artist}
          </Text>
        </View>
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.08)",
            marginBottom: 6,
          }}
        />

        {TRACK_MENU.map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 13,
              borderBottomWidth:
                i < TRACK_MENU.length - 1 ? StyleSheet.hairlineWidth : 0,
              borderBottomColor: div,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: item.danger
                  ? "rgba(239,68,68,0.10)"
                  : isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons
                name={item.icon}
                size={17}
                color={item.danger ? "#EF4444" : c.accent}
              />
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: item.danger ? "#EF4444" : tp,
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}

        {/* Cancel */}
        <View
          style={{
            marginTop: 10,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
            backgroundColor: isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.06)",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: ts }}>
            Cancelar
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK — Mini player (index home bar) — standalone artboard
// ─────────────────────────────────────────────────────────────────────────────
function MiniPlayerMock() {
  const { c, isDark } = useTheme();
  const bg = c.bg;
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Content area placeholder */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Ionicons
          name="musical-notes-outline"
          size={56}
          color={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
        />
      </View>

      {/* Mini player bar */}
      <View style={{ position: "absolute", left: 16, right: 16, bottom: 18 }}>
        <View
          style={{
            height: 68,
            borderRadius: 24,
            borderWidth: 1,
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: c.glass2,
            borderColor: c.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                overflow: "hidden",
                marginRight: 12,
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.iconBg,
              }}
            >
              <Image
                source={{ uri: albums[0].cover }}
                style={{ width: 48, height: 48 }}
                contentFit="cover"
              />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: c.textPrimary,
                  marginBottom: 2,
                }}
                numberOfLines={1}
              >
                {albums[0].title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: c.textSecondary,
                }}
                numberOfLines={1}
              >
                {albums[0].artist}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              backgroundColor: c.textPrimary,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 12,
            }}
          >
            <Ionicons name="pause" size={18} color={c.bg} />
          </View>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main preview screen
// ─────────────────────────────────────────────────────────────────────────────
export default function PreviewScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={s.canvas}
        contentContainerStyle={s.canvasContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page header ──────────────────────────────────────────────── */}
        <View style={{ marginBottom: 64 }}>
          <Text style={s.pageTitle}>Figma Preview</Text>
          <Text style={s.pageSubtitle}>15 artboards · 3 secciones</Text>
        </View>

        {/* ── SECCIÓN 1 — Pantallas principales ────────────────────────── */}
        <GroupRow title="PANTALLAS PRINCIPALES">
          <Artboard label="Library">
            <LibraryTab />
          </Artboard>

          <Artboard label="Álbum">
            <AlbumTab />
          </Artboard>

          <Artboard label="Tracks">
            <TracksTab />
          </Artboard>

          <Artboard label="Artista">
            <ArtistTab />
          </Artboard>

          <Artboard label="Playlist">
            <PlaylistTab />
          </Artboard>

          <Artboard label="Ajustes">
            <SettingsTab />
          </Artboard>
        </GroupRow>

        {/* ── SECCIÓN 2 — Otras pantallas ──────────────────────────────── */}
        <GroupRow title="OTRAS PANTALLAS">
          <Artboard label="Player">
            <PlayerView onClose={() => {}} />
          </Artboard>

          <Artboard label="All Albums">
            <AllAlbumsScreen />
          </Artboard>

          <Artboard label="Mini Player">
            <MiniPlayerMock />
          </Artboard>

          <Artboard label="+Not Found">
            <NotFoundMock />
          </Artboard>
        </GroupRow>

        {/* ── SECCIÓN 3 — Overlays & estados ───────────────────────────── */}
        <GroupRow title="OVERLAYS & ESTADOS">
          <Artboard label="Detalle Álbum">
            <AlbumDetailMock />
          </Artboard>

          <Artboard label="Cola (Queue)">
            <QueueMock />
          </Artboard>

          <Artboard label="Letras">
            <LyricsMock />
          </Artboard>

          <Artboard label="Opciones Player">
            <PlayerOptionsMock />
          </Artboard>

          <Artboard label="Menú Track">
            <TrackMenuMock />
          </Artboard>
        </GroupRow>
      </ScrollView>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  canvasContent: {
    padding: PAD,
    paddingBottom: PAD + 80,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255,255,255,0.35)",
  },
  groupLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.2,
    color: "rgba(255,255,255,0.28)",
    marginBottom: 24,
  },
  artboardLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255,255,255,0.45)",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  frame: {
    width: W,
    height: H,
    borderRadius: 44,
    overflow: "hidden",
    backgroundColor: "#121212",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.7,
    shadowRadius: 52,
    elevation: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
});

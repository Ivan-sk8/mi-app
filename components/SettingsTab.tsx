import React, { useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { usePlayer } from "../contexts/player-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACCENT = "#A30000";

/* ─────────────────────────────────────────────────────────────────
   FOLDER DATA (same as FolderTab)
───────────────────────────────────────────────────────────────── */
const FOLDERS = [
  { id: "1", name: "Orpheous", count: 24, sizeGb: 1.4 },
  { id: "2", name: "Kimberella", count: 17, sizeGb: 0.8 },
];

/* ─────────────────────────────────────────────────────────────────
   SQUARE TOGGLE
───────────────────────────────────────────────────────────────── */
const TK_W = 48,
  TK_H = 27,
  TK_THUMB = 21,
  TK_PAD = 3;

function SquareToggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { isDark } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      damping: 14,
      stiffness: 320,
      mass: 0.7,
    }).start();
  }, [value, anim]);

  const maxTravel = TK_W - TK_THUMB - TK_PAD * 2;
  const thumbLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [TK_PAD, TK_PAD + maxTravel],
  });
  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.13)",
      ACCENT,
    ],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View style={[tkSt.track, { backgroundColor: trackBg }]}>
        <Animated.View style={[tkSt.thumb, { left: thumbLeft }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}
const tkSt = StyleSheet.create({
  track: {
    width: TK_W,
    height: TK_H,
    borderRadius: 8,
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    width: TK_THUMB,
    height: TK_THUMB,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    top: TK_PAD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 4,
  },
});

/* ─────────────────────────────────────────────────────────────────
   CROSSFADE SLIDER
───────────────────────────────────────────────────────────────── */
function CrossfadeSlider({
  value,
  onValueChange,
}: {
  value: number;
  onValueChange: (v: number) => void;
}) {
  const { c, isDark } = useTheme();
  const [trackW, setTrackW] = useState(1);
  const MIN = 1,
    MAX = 10;

  const posAnim = useRef(
    new Animated.Value((value - MIN) / (MAX - MIN)),
  ).current;

  const updateValue = (locationX: number) => {
    const ratio = Math.max(0, Math.min(1, locationX / trackW));
    const v = Math.round(MIN + ratio * (MAX - MIN));
    onValueChange(v);
    Animated.spring(posAnim, {
      toValue: (v - MIN) / (MAX - MIN),
      useNativeDriver: false,
      damping: 16,
      stiffness: 300,
    }).start();
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => updateValue(e.nativeEvent.locationX),
      onPanResponderMove: (e) => updateValue(e.nativeEvent.locationX),
    }),
  ).current;

  const thumbLeft = posAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(0, trackW - 22)],
  });
  const fillW = posAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackW],
  });

  return (
    <View style={slSt.wrapper}>
      <View style={slSt.labelRow}>
        <Text style={[slSt.labelLeft, { color: c.textSecondary }]}>1 s</Text>
        <Text style={[slSt.valueLabel, { color: ACCENT }]}>{value} s</Text>
        <Text style={[slSt.labelRight, { color: c.textSecondary }]}>10 s</Text>
      </View>

      <View
        style={slSt.trackArea}
        onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
        {...pan.panHandlers}
      >
        {/* Background track */}
        <View
          style={[
            slSt.track,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.10)",
            },
          ]}
        />
        {/* Fill */}
        <Animated.View
          style={[slSt.fill, { width: fillW, backgroundColor: ACCENT }]}
        />
        {/* Thumb */}
        <Animated.View
          style={[
            slSt.thumb,
            {
              left: thumbLeft,
              backgroundColor: "#FFFFFF",
              borderColor: ACCENT,
            },
          ]}
        />
      </View>
    </View>
  );
}
const slSt = StyleSheet.create({
  wrapper: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 4 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  labelLeft: { fontSize: 11, fontWeight: "500" },
  labelRight: { fontSize: 11, fontWeight: "500" },
  valueLabel: { fontSize: 13, fontWeight: "800", letterSpacing: -0.3 },
  trackArea: { height: 28, justifyContent: "center", position: "relative" },
  track: {
    height: 4,
    borderRadius: 999,
    position: "absolute",
    left: 0,
    right: 0,
  },
  fill: { height: 4, borderRadius: 999, position: "absolute", left: 0 },
  thumb: {
    position: "absolute",
    top: 3,
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 4,
  },
});

/* ─────────────────────────────────────────────────────────────────
   SETTING ROW
───────────────────────────────────────────────────────────────── */
type RowProps = {
  icon: string;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
  isLast?: boolean;
};

function SettingRow({
  icon,
  label,
  sublabel,
  right,
  onPress,
  danger,
  isLast,
}: RowProps) {
  const { c, isDark } = useTheme();
  const sep = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.68 : 1}
      onPress={onPress}
      style={[
        rSt.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: sep,
        },
      ]}
    >
      <View
        style={[
          rSt.iconWrap,
          {
            backgroundColor: danger
              ? "rgba(239,68,68,0.10)"
              : isDark
                ? "rgba(255,255,255,0.09)"
                : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={17}
          color={danger ? "#EF4444" : c.accent}
        />
      </View>
      <View style={rSt.textCol}>
        <Text
          style={[rSt.label, { color: danger ? "#EF4444" : c.textPrimary }]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text style={[rSt.sublabel, { color: c.textSecondary }]}>
            {sublabel}
          </Text>
        ) : null}
      </View>
      {right !== undefined ? (
        right
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={15} color={c.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );
}
const rSt = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    flexShrink: 0,
  },
  textCol: { flex: 1, paddingRight: 8 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.1,
    lineHeight: 18,
  },
  sublabel: { fontSize: 11, fontWeight: "500", marginTop: 2, lineHeight: 14 },
});

/* ─────────────────────────────────────────────────────────────────
   COLLAPSIBLE SECTION
───────────────────────────────────────────────────────────────── */
function CollapsibleSection({
  headerIcon,
  title,
  children,
  defaultOpen = false,
}: {
  headerIcon: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const { c, isDark } = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const chevAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const handleToggle = () => {
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "easeInEaseOut" },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });
    const next = !open;
    setOpen(next);
    Animated.spring(chevAnim, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      damping: 14,
      stiffness: 260,
      mass: 0.8,
    }).start();
  };

  const rotate = chevAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      style={[
        cSt.card,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.92)",
          borderColor: c.border,
          shadowColor: isDark ? "#000" : "#33658A",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.72}
        onPress={handleToggle}
        style={cSt.header}
      >
        <View
          style={[
            cSt.hIcon,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.10)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <Ionicons name={headerIcon as any} size={15} color={c.accent} />
        </View>
        <Text style={[cSt.hTitle, { color: c.textPrimary }]}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={16} color={c.textSecondary} />
        </Animated.View>
      </TouchableOpacity>
      {open && (
        <View
          style={[
            cSt.body,
            {
              borderTopColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.08)",
            },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}
const cSt = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 10,
  },
  hIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  hTitle: { flex: 1, fontSize: 14, fontWeight: "700", letterSpacing: -0.2 },
  body: { borderTopWidth: StyleSheet.hairlineWidth },
});

/* ─────────────────────────────────────────────────────────────────
   FOLDER MODAL  (same visual design as FolderTab)
───────────────────────────────────────────────────────────────── */
function FolderModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { c, isDark } = useTheme();
  const folderCoverBg = isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const folderCoverBorder = isDark
    ? "rgba(255,255,255,0.09)"
    : "rgba(0,0,0,0.06)";
  const folderIconColor = isDark
    ? "rgba(255,255,255,0.18)"
    : "rgba(0,0,0,0.12)";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[fmSt.root, { backgroundColor: c.bg }]}>
        {/* Header */}
        <View style={fmSt.header}>
          <Text style={[fmSt.title, { color: c.textPrimary }]}>Carpetas</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={[fmSt.closeBtn, { backgroundColor: c.iconBg }]}
          >
            <Ionicons name="close" size={18} color={c.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={fmSt.list}
          showsVerticalScrollIndicator={false}
        >
          {FOLDERS.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              activeOpacity={0.82}
              style={[fmSt.card, { borderColor: c.border }]}
            >
              {/* Folder cover */}
              <View
                style={[
                  fmSt.coverSquare,
                  {
                    backgroundColor: folderCoverBg,
                    borderColor: folderCoverBorder,
                    shadowColor: isDark ? "#000" : "#00000022",
                  },
                ]}
              >
                <View
                  style={[
                    fmSt.folderNub,
                    { backgroundColor: folderCoverBorder },
                  ]}
                />
                <Ionicons
                  name="folder-open-outline"
                  size={48}
                  color={folderIconColor}
                />
              </View>

              {/* Info */}
              <View style={fmSt.info}>
                <Text
                  style={[fmSt.folderName, { color: c.textPrimary }]}
                  numberOfLines={1}
                >
                  {folder.name}
                </Text>
                <Text style={[fmSt.count, { color: c.textSecondary }]}>
                  {folder.count} canciones
                </Text>
                <View style={fmSt.sizeRow}>
                  <View
                    style={[
                      fmSt.sizePill,
                      { borderColor: c.border, backgroundColor: c.glass1 },
                    ]}
                  >
                    <Text style={[fmSt.sizeText, { color: c.textMuted }]}>
                      {folder.sizeGb.toFixed(1)} GB
                    </Text>
                  </View>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={15}
                color={c.textMuted}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
const fmSt = StyleSheet.create({
  root: { flex: 1, paddingTop: 36 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: "800", letterSpacing: -0.8 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingHorizontal: 20, gap: 14, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
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
  folderNub: {
    position: "absolute",
    top: -5,
    left: 14,
    width: 28,
    height: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  info: { flex: 1, justifyContent: "center", gap: 5 },
  folderName: { fontSize: 20, fontWeight: "700", letterSpacing: -0.5 },
  count: { fontSize: 13, fontWeight: "400" },
  sizeRow: { flexDirection: "row", marginTop: 2 },
  sizePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  sizeText: { fontSize: 11, fontWeight: "500", letterSpacing: 0.2 },
});

/* ─────────────────────────────────────────────────────────────────
   SORT PICKER  (standalone mini-card)
───────────────────────────────────────────────────────────────── */
const SORT_OPTIONS: { key: "nombre" | "artista" | "fecha"; label: string }[] = [
  { key: "nombre", label: "Por nombre" },
  { key: "artista", label: "Por artista" },
  { key: "fecha", label: "Por fecha añadida" },
];

function SortPicker({
  value,
  onChange,
}: {
  value: "nombre" | "artista" | "fecha";
  onChange: (v: "nombre" | "artista" | "fecha") => void;
}) {
  const { c, isDark } = useTheme();
  const sep = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  return (
    <View
      style={[
        spSt.card,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.92)",
          borderColor: c.border,
          shadowColor: isDark ? "#000" : "#33658A",
        },
      ]}
    >
      {/* Card header (non-collapsible) */}
      <View style={spSt.header}>
        <View
          style={[
            spSt.hIcon,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.10)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <Ionicons name="funnel-outline" size={15} color={c.accent} />
        </View>
        <Text style={[spSt.hTitle, { color: c.textPrimary }]}>
          Ordenar biblioteca
        </Text>
      </View>

      {/* Options */}
      <View
        style={[
          spSt.body,
          {
            borderTopColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.08)",
          },
        ]}
      >
        {SORT_OPTIONS.map((opt, i) => {
          const active = value === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.7}
              onPress={() => onChange(opt.key)}
              style={[
                spSt.row,
                i < SORT_OPTIONS.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: sep,
                },
              ]}
            >
              <Text
                style={[
                  spSt.optLabel,
                  { color: active ? ACCENT : c.textPrimary },
                ]}
              >
                {opt.label}
              </Text>
              {active && (
                <View style={[spSt.dot, { backgroundColor: ACCENT }]} />
              )}
              {!active && (
                <View
                  style={[
                    spSt.dotEmpty,
                    {
                      borderColor: isDark
                        ? "rgba(255,255,255,0.22)"
                        : "rgba(0,0,0,0.18)",
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
const spSt = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 10,
  },
  hIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  hTitle: { flex: 1, fontSize: 14, fontWeight: "700", letterSpacing: -0.2 },
  body: { borderTopWidth: StyleSheet.hairlineWidth },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  optLabel: { flex: 1, fontSize: 14, fontWeight: "600", letterSpacing: -0.1 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  dotEmpty: { width: 10, height: 10, borderRadius: 999, borderWidth: 1.5 },
});

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function SettingsTab() {
  const { isDark, toggle, c } = useTheme();
  const { isShuffle, toggleShuffle, repeatMode, cycleRepeat } = usePlayer();

  const [crossfade, setCrossfade] = useState(false);
  const [crossfadeSecs, setCrossfadeSecs] = useState(2);
  const [continuousPlay, setContinuousPlay] = useState(true);
  const [showDuration, setShowDuration] = useState(true);
  const [sortBy, setSortBy] = useState<"nombre" | "artista" | "fecha">(
    "nombre",
  );
  const [folderOpen, setFolderOpen] = useState(false);

  const repeatLabel = ["Desactivado", "Repetir todo", "Repetir una"];

  return (
    <>
      <ScrollView
        style={[styles.root, { backgroundColor: c.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────────────────── */}
        <Text style={[styles.title, { color: c.textPrimary }]}>Ajustes</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>
          Personaliza tu experiencia
        </Text>

        {/* ── Apariencia ──────────────────────────────────────── */}
        <CollapsibleSection
          headerIcon="color-palette-outline"
          title="Apariencia"
          defaultOpen
        >
          <SettingRow
            icon="moon-outline"
            label="Modo oscuro"
            sublabel={isDark ? "Activado" : "Desactivado"}
            isLast
            right={<SquareToggle value={isDark} onValueChange={toggle} />}
          />
        </CollapsibleSection>

        {/* ── Reproducción ──────────────────────────────────── */}
        <CollapsibleSection
          headerIcon="musical-notes-outline"
          title="Reproducción"
        >
          <SettingRow
            icon="shuffle-outline"
            label="Modo aleatorio"
            sublabel={isShuffle ? "Activo" : "Desactivado"}
            right={
              <SquareToggle value={isShuffle} onValueChange={toggleShuffle} />
            }
          />
          <SettingRow
            icon="repeat-outline"
            label="Repetir"
            sublabel={repeatLabel[repeatMode]}
            onPress={cycleRepeat}
          />

          {/* Crossfade toggle */}
          <SettingRow
            icon="swap-horizontal-outline"
            label="Fundido entre canciones"
            sublabel={crossfade ? `Activo · ${crossfadeSecs} s` : "Desactivado"}
            isLast={!crossfade}
            right={
              <SquareToggle value={crossfade} onValueChange={setCrossfade} />
            }
          />

          {/* Crossfade slider — only visible when on */}
          {crossfade && (
            <CrossfadeSlider
              value={crossfadeSecs}
              onValueChange={setCrossfadeSecs}
            />
          )}

          <SettingRow
            icon="play-forward-outline"
            label="Reproducción continua"
            sublabel="Sigue al terminar la lista"
            isLast
            right={
              <SquareToggle
                value={continuousPlay}
                onValueChange={setContinuousPlay}
              />
            }
          />
        </CollapsibleSection>

        {/* ── Ordenar (standalone) ──────────────────────────── */}
        <SortPicker value={sortBy} onChange={setSortBy} />

        {/* ── Biblioteca ────────────────────────────────────── */}
        <CollapsibleSection headerIcon="library-outline" title="Biblioteca">
          <SettingRow
            icon="time-outline"
            label="Mostrar duración"
            sublabel="Visible en listas de canciones"
            isLast={false}
            right={
              <SquareToggle
                value={showDuration}
                onValueChange={setShowDuration}
              />
            }
          />
          {/* Carpetas */}
          <SettingRow
            icon="folder-outline"
            label="Carpetas"
            sublabel={`${FOLDERS.length} carpetas · ${FOLDERS.reduce((a, f) => a + f.count, 0)} canciones`}
            isLast
            onPress={() => setFolderOpen(true)}
          />
        </CollapsibleSection>

        {/* ── Privacidad ────────────────────────────────────── */}
        <CollapsibleSection
          headerIcon="shield-checkmark-outline"
          title="Privacidad"
        >
          <SettingRow
            icon="trash-outline"
            label="Borrar historial"
            sublabel="Elimina el historial de reproducción"
            isLast
            danger
            onPress={() =>
              Alert.alert(
                "Borrar historial",
                "¿Seguro que quieres borrar tu historial? Esta acción no se puede deshacer.",
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Borrar", style: "destructive", onPress: () => {} },
                ],
              )
            }
          />
        </CollapsibleSection>

        {/* ── Acerca de ─────────────────────────────────────── */}
        <CollapsibleSection
          headerIcon="information-circle-outline"
          title="Acerca de"
        >
          <SettingRow
            icon="phone-portrait-outline"
            label="Versión"
            sublabel="1.0.0 (build 1)"
            isLast
          />
        </CollapsibleSection>
      </ScrollView>

      {/* ── Folder modal ──────────────────────────────────────── */}
      <FolderModal visible={folderOpen} onClose={() => setFolderOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingTop: 36, paddingHorizontal: 18, paddingBottom: 110 },
  title: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: { fontSize: 13, fontWeight: "500", marginBottom: 26 },
});

import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  StatusBar,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePlayer } from "@/contexts/player-context";
import { useTheme } from "../contexts/ThemeContext";
import { albums } from "@/constants/albums";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const AVAILABLE = Math.round((SCREEN_HEIGHT - 180) / 2);
const CARD_SIZE = Math.min(Math.round(SCREEN_WIDTH * 0.42), AVAILABLE);
const MIX_SIZE = Math.min(Math.round(SCREEN_WIDTH * 0.38), AVAILABLE - 10);
const WARM_ACCENT = "#A30000";

const MIXES = [
  {
    id: "mix-1",
    title: "Late Night",
    subtitle: "8 tracks",
    cover: albums[0].cover,
  },
  {
    id: "mix-2",
    title: "Energy",
    subtitle: "10 tracks",
    cover: albums[8].cover,
  },
  {
    id: "mix-3",
    title: "Deep Focus",
    subtitle: "7 tracks",
    cover: albums[2].cover,
  },
  {
    id: "mix-4",
    title: "Morning",
    subtitle: "9 tracks",
    cover: albums[4].cover,
  },
  {
    id: "mix-5",
    title: "Sunset Vibe",
    subtitle: "6 tracks",
    cover: albums[6].cover,
  },
  {
    id: "mix-6",
    title: "Recess",
    subtitle: "5 tracks",
    cover: albums[12].cover,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HISTORY MODAL — simple full list
───────────────────────────────────────────────────────────────────────────── */
function HistoryModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { c, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bg = isDark ? "#0D0C14" : "#F7F6F2";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          hStyles.root,
          { backgroundColor: bg, paddingTop: insets.top + 8 },
        ]}
      >
        {/* Header */}
        <View style={[hStyles.header, { borderBottomColor: border }]}>
          <Text style={[hStyles.title, { color: c.textPrimary }]}>
            Recently Played
          </Text>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={[hStyles.closeBtn, { backgroundColor: c.iconBg }]}
          >
            <Ionicons name="close" size={18} color={c.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          ItemSeparatorComponent={() => (
            <View style={[hStyles.separator, { backgroundColor: border }]} />
          )}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.7} style={hStyles.row}>
              {/* Cover */}
              <Image
                source={{ uri: item.cover }}
                style={hStyles.rowCover}
                contentFit="cover"
                transition={180}
              />

              {/* Info */}
              <View style={hStyles.rowInfo}>
                <Text
                  style={[hStyles.rowTitle, { color: c.textPrimary }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  style={[hStyles.rowArtist, { color: c.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.artist}
                </Text>
              </View>

              {/* Duration + chevron */}
              <View style={hStyles.rowRight}>
                <Text style={[hStyles.rowDuration, { color: c.textSecondary }]}>
                  {item.duration}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={c.textMuted ?? c.textSecondary}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const hStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 84,
    marginRight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rowCover: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  rowInfo: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
    lineHeight: 18,
    marginBottom: 3,
  },
  rowArtist: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 15,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowDuration: {
    fontSize: 12,
    fontWeight: "500",
  },
});

/* ─────────────────────────────────────────────────────────────────────────────
   MIX MODAL — aesthetic editorial layout
───────────────────────────────────────────────────────────────────────────── */
const MIX_GRID_GAP = 12;
const MIX_GRID_COLS = 2;
const MIX_GRID_H_PAD = 20;
const MIX_CARD_WIDTH =
  (SCREEN_WIDTH - MIX_GRID_H_PAD * 2 - MIX_GRID_GAP) / MIX_GRID_COLS;
const MIX_FEATURED_H = Math.round(SCREEN_HEIGHT * 0.28);
const MIX_GRID_CARD_H = Math.round(SCREEN_HEIGHT * 0.19);

function MixModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  useTheme();
  const insets = useSafeAreaInsets();

  const featured = MIXES[0];
  const gridMixes = MIXES.slice(1);

  // Dark editorial palette regardless of theme — the modal is always dark-toned
  const modalBg = "#121212";
  const headerBg = "#1A1A1A";
  const subtitleClr = "rgba(255,255,255,0.50)";
  const badgeBg = "rgba(163,0,0,0.20)";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={[mStyles.root, { backgroundColor: modalBg }]}>
        {/* ── Top header bar ──────────────────────────────────────────── */}
        <View
          style={[
            mStyles.topBar,
            { paddingTop: insets.top + 6, backgroundColor: headerBg },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={mStyles.backBtn}
          >
            <Ionicons
              name="chevron-down"
              size={22}
              color="rgba(255,255,255,0.80)"
            />
          </TouchableOpacity>

          <View style={mStyles.topBarCenter}>
            <Text style={mStyles.topBarTitle}>Your Mix</Text>
            <Text style={[mStyles.topBarSub, { color: subtitleClr }]}>
              Curated for you
            </Text>
          </View>

          {/* Spacer to balance back btn */}
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            mStyles.scrollContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Section label ──────────────────────────────────────────── */}
          <View style={mStyles.sectionLabelRow}>
            <View
              style={[mStyles.accentLine, { backgroundColor: WARM_ACCENT }]}
            />
            <Text style={mStyles.sectionLabel}>FEATURED</Text>
          </View>

          {/* ── Featured card ──────────────────────────────────────────── */}
          <TouchableOpacity activeOpacity={0.88} style={mStyles.featuredCard}>
            {/* Cover */}
            <Image
              source={{ uri: featured.cover }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={260}
            />

            {/* Multi-layer overlay for depth */}
            <View style={mStyles.featuredOverlayTop} />
            <View style={mStyles.featuredOverlayBottom} />

            {/* FEATURED badge */}
            <View style={[mStyles.featuredBadge, { backgroundColor: badgeBg }]}>
              <Text style={[mStyles.featuredBadgeText, { color: WARM_ACCENT }]}>
                FEATURED
              </Text>
            </View>

            {/* Bottom content */}
            <View style={mStyles.featuredContent}>
              <View style={mStyles.featuredTextBlock}>
                <Text style={mStyles.featuredTitle} numberOfLines={1}>
                  {featured.title}
                </Text>
                <Text style={mStyles.featuredSubtitle}>
                  {featured.subtitle}
                </Text>
              </View>

              {/* Large play button */}
              <TouchableOpacity
                activeOpacity={0.78}
                style={[mStyles.featuredPlay, { backgroundColor: WARM_ACCENT }]}
              >
                <Ionicons
                  name="play"
                  size={22}
                  color="#fff"
                  style={{ marginLeft: 3 }}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* ── Section label — grid ───────────────────────────────────── */}
          <View style={[mStyles.sectionLabelRow, { marginTop: 28 }]}>
            <View
              style={[mStyles.accentLine, { backgroundColor: WARM_ACCENT }]}
            />
            <Text style={mStyles.sectionLabel}>ALL MIXES</Text>
          </View>

          {/* ── Grid ───────────────────────────────────────────────────── */}
          <View style={mStyles.grid}>
            {gridMixes.map((mix) => (
              <TouchableOpacity
                key={mix.id}
                activeOpacity={0.84}
                style={mStyles.gridCard}
              >
                {/* Cover */}
                <Image
                  source={{ uri: mix.cover }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  transition={220}
                />

                {/* Overlay */}
                <View style={mStyles.gridOverlayTop} />
                <View style={mStyles.gridOverlayBottom} />

                {/* Bottom info */}
                <View style={mStyles.gridContent}>
                  <Text style={mStyles.gridTitle} numberOfLines={1}>
                    {mix.title}
                  </Text>
                  <Text style={mStyles.gridSubtitle}>{mix.subtitle}</Text>
                </View>

                {/* Small play button */}
                <TouchableOpacity
                  activeOpacity={0.78}
                  style={[mStyles.gridPlay, { borderColor: WARM_ACCENT }]}
                >
                  <Ionicons
                    name="play"
                    size={13}
                    color={WARM_ACCENT}
                    style={{ marginLeft: 2 }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Footer note ────────────────────────────────────────────── */}
          <View style={mStyles.footer}>
            <MaterialCommunityIcons
              name="dna"
              size={18}
              color={WARM_ACCENT}
              style={{ opacity: 0.7, transform: [{ rotate: "30deg" }] }}
            />
            <Text style={mStyles.footerText}>
              Generated from your listening patterns
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const mStyles = StyleSheet.create({
  root: {
    flex: 1,
  },

  /* Top bar */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  topBarCenter: {
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  topBarSub: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },

  /* Scroll content */
  scrollContent: {
    paddingHorizontal: MIX_GRID_H_PAD,
    paddingTop: 24,
  },

  /* Section label */
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  accentLine: {
    width: 3,
    height: 14,
    borderRadius: 999,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 1.6,
  },

  /* Featured card */
  featuredCard: {
    width: "100%",
    height: MIX_FEATURED_H,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  featuredOverlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  featuredOverlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "65%",
    backgroundColor: "rgba(0,0,0,0.62)",
  },
  featuredBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(163,0,0,0.45)",
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  featuredContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  featuredTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  featuredTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.65)",
  },
  featuredPlay: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A30000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 10,
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: MIX_GRID_GAP,
  },
  gridCard: {
    width: MIX_CARD_WIDTH,
    height: MIX_GRID_CARD_H,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  gridOverlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(0,0,0,0.20)",
  },
  gridOverlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundColor: "rgba(0,0,0,0.58)",
  },
  gridContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
    lineHeight: 18,
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255,255,255,0.58)",
  },
  gridPlay: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  /* Footer */
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.30)",
    letterSpacing: 0.1,
  },
});

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN LIBRARY TAB
───────────────────────────────────────────────────────────────────────────── */
export default function LibraryTab() {
  const { c, isDark } = useTheme();
  const { currentAlbum } = usePlayer();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [mixOpen, setMixOpen] = useState(false);

  const cardBg = isDark ? c.glass2 : "rgba(255,255,255,0.82)";

  return (
    <>
      <ScrollView
        style={[styles.root, { backgroundColor: c.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Recently Played ─────────────────────────────────── */}
        <View style={[styles.section, { paddingTop: 12 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>
              Recently Played
            </Text>
            <TouchableOpacity
              style={styles.seeAllRow}
              activeOpacity={0.7}
              onPress={() => setHistoryOpen(true)}
            >
              <Text style={[styles.seeAllText, { color: c.accent }]}>
                See all
              </Text>
              <Ionicons name="chevron-forward" size={12} color={c.accent} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: cardBg,
                borderColor: c.border,
                shadowColor: isDark ? "#000" : "#6B4F3A",
              },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={CARD_SIZE + 12}
              snapToAlignment="start"
              contentContainerStyle={styles.albumScroll}
            >
              {albums.map((album) => (
                <TouchableOpacity
                  key={album.id}
                  activeOpacity={0.88}
                  style={styles.albumCard}
                >
                  {album.cover ? (
                    <Image
                      source={{ uri: album.cover }}
                      style={styles.albumImage}
                      contentFit="cover"
                      transition={220}
                    />
                  ) : (
                    <View
                      style={[
                        styles.albumImageFallback,
                        { backgroundColor: c.iconBg },
                      ]}
                    >
                      <Ionicons
                        name="musical-notes"
                        size={36}
                        color={c.textSecondary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.infoBlock}>
              <Text
                style={[styles.trackTitle, { color: c.textPrimary }]}
                numberOfLines={1}
              >
                {currentAlbum?.title ?? "Nothing playing"}
              </Text>
              <Text
                style={[styles.trackArtist, { color: c.textSecondary }]}
                numberOfLines={1}
              >
                {currentAlbum?.artist ?? "Unknown"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Your Mix ────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>
              Your Mix
            </Text>
            <TouchableOpacity
              style={styles.seeAllRow}
              activeOpacity={0.7}
              onPress={() => setMixOpen(true)}
            >
              <Text style={[styles.seeAllText, { color: c.accent }]}>
                See all
              </Text>
              <Ionicons name="chevron-forward" size={12} color={c.accent} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: cardBg,
                borderColor: c.border,
                shadowColor: isDark ? "#000" : "#6B4F3A",
              },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={MIX_SIZE + 12}
              snapToAlignment="start"
              contentContainerStyle={styles.mixScroll}
            >
              {MIXES.map((mix) => (
                <TouchableOpacity
                  key={mix.id}
                  activeOpacity={0.88}
                  style={styles.mixCard}
                >
                  {mix.cover ? (
                    <Image
                      source={{ uri: mix.cover }}
                      style={styles.mixImage}
                      contentFit="cover"
                      transition={220}
                    />
                  ) : (
                    <View
                      style={[
                        styles.mixImageFallback,
                        { backgroundColor: c.iconBg },
                      ]}
                    >
                      <Ionicons
                        name="musical-notes"
                        size={32}
                        color={c.textSecondary}
                      />
                    </View>
                  )}
                  <View style={styles.mixOverlay}>
                    <Text style={styles.mixOverlayTitle} numberOfLines={1}>
                      {mix.title}
                    </Text>
                    <Text style={styles.mixOverlaySubtitle} numberOfLines={1}>
                      {mix.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.infoBlock}>
              <Text
                style={[styles.trackTitle, { color: c.textPrimary }]}
                numberOfLines={1}
              >
                Your Mix
              </Text>
              <Text
                style={[styles.trackArtist, { color: c.textSecondary }]}
                numberOfLines={1}
              >
                Curated for you
              </Text>
            </View>
          </View>
        </View>

        {/* ── Your rhythm ─────────────────────────────────────── */}
        <View style={styles.rhythmSection}>
          <Text
            style={[
              styles.sectionTitle,
              { color: c.textPrimary, marginBottom: 14 },
            ]}
          >
            Your rhythm
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rhythmRow}
          >
            {albums.map((album) => (
              <TouchableOpacity
                key={album.id}
                style={styles.rhythmCard}
                activeOpacity={0.75}
              >
                {album.cover ? (
                  <Image
                    source={{ uri: album.cover }}
                    style={styles.rhythmImage}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View
                    style={[
                      styles.rhythmImageFallback,
                      { backgroundColor: c.iconBg },
                    ]}
                  >
                    <Ionicons
                      name="musical-notes"
                      size={20}
                      color={c.textSecondary}
                    />
                  </View>
                )}
                <Text
                  style={[styles.rhythmTitle, { color: c.textPrimary }]}
                  numberOfLines={1}
                >
                  {album.title}
                </Text>
                <Text
                  style={[styles.rhythmArtist, { color: c.textSecondary }]}
                  numberOfLines={1}
                >
                  {album.artist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* ── Modals ──────────────────────────────────────────── */}
      <HistoryModal
        visible={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <MixModal visible={mixOpen} onClose={() => setMixOpen(false)} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN STYLES
───────────────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: 100 },

  section: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  rhythmSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },

  card: {
    borderRadius: 22,
    borderWidth: 1,
    paddingTop: 14,
    paddingBottom: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 22,
    elevation: 8,
    overflow: "hidden",
  },

  albumScroll: {
    paddingHorizontal: 14,
    gap: 10,
  },
  albumCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 7,
  },
  albumImage: {
    width: CARD_SIZE,
    height: CARD_SIZE,
  },
  albumImageFallback: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  mixScroll: {
    paddingHorizontal: 14,
    gap: 10,
  },
  mixCard: {
    width: MIX_SIZE,
    height: MIX_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 7,
  },
  mixImage: {
    width: MIX_SIZE,
    height: MIX_SIZE,
  },
  mixImageFallback: {
    width: MIX_SIZE,
    height: MIX_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  mixOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 24,
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  mixOverlayTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 17,
    letterSpacing: -0.2,
  },
  mixOverlaySubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255,255,255,0.72)",
    lineHeight: 14,
    marginTop: 1,
  },

  infoBlock: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.3,
    lineHeight: 19,
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 17,
  },

  rhythmRow: {
    paddingRight: 8,
  },
  rhythmCard: {
    width: 100,
    marginRight: 12,
  },
  rhythmImage: {
    width: 100,
    height: 100,
    borderRadius: 14,
  },
  rhythmImageFallback: {
    width: 100,
    height: 100,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  rhythmTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
    lineHeight: 16,
  },
  rhythmArtist: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
    marginTop: 1,
  },
});

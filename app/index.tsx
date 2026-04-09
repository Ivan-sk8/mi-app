import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { albums } from '@/constants/albums';
import { usePlayer } from '@/contexts/player-context';

const playerSections = ['Álbum', 'Artista', 'Carpeta', 'Playlist', 'Singles', 'Favoritos'];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeSection, setActiveSection] = useState(0);
  const { currentAlbum, isPlaying, togglePlay, setTrackByIndex } = usePlayer();
  const carouselRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<number[]>([]);
  const isCompact = width < 390;
  const largeBubbleSize = Math.min(116, Math.max(92, width * 0.29));
  const actionBubbleSize = Math.min(86, Math.max(70, width * 0.22));
  const smallBubbleSize = Math.min(82, Math.max(62, width * 0.2));

  useEffect(() => {
    const sideMargin = isCompact ? 14 : 18;
    const targetX = Math.max(0, (sectionOffsets.current[activeSection] ?? 0) - sideMargin);
    const frame = requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({ x: targetX, animated: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [activeSection, isCompact]);

  const openAlbum = (index: number) => {
    setTrackByIndex(index);
    router.push('/player');
  };

  const getMetaText = (album: (typeof albums)[number]) => {
    switch (playerSections[activeSection]) {
      case 'Artista':
        return album.artist;
      case 'Carpeta':
        return 'Biblioteca local';
      case 'Playlist':
        return album.subtitle;
      case 'Singles':
        return album.duration;
      case 'Favoritos':
        return 'Guardado';
      default:
        return album.subtitle;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.floatingPlayer, isCompact && styles.floatingPlayerCompact]}>
        <TouchableOpacity style={styles.floatingPlayerMain} activeOpacity={0.85} onPress={() => router.push('/player')}>
          <Image source={currentAlbum.cover} style={styles.floatingThumb} contentFit="cover" />
          <View style={styles.floatingCopy}>
            <Text style={styles.floatingLabel}>En reproducción</Text>
            <Text style={styles.floatingTitle} numberOfLines={1}>
              {currentAlbum.title}
            </Text>
            <Text style={styles.floatingArtist} numberOfLines={1}>
              {currentAlbum.artist}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.floatingAction} activeOpacity={0.85} onPress={togglePlay}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, isCompact && styles.contentCompact, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Library</Text>
            <Text style={styles.eyebrow}>Una colección curada de álbumes, artistas y playlists.</Text>
          </View>

          <TouchableOpacity style={styles.settingsButton} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={18} color="#1f1f1f" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={carouselRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.topCarouselWrap,
            {
              paddingLeft: isCompact ? 14 : 18,
              paddingRight: Math.max(width * 0.6, 120),
            },
          ]}>
          {playerSections.map((section, index) => {
            const active = index === activeSection;

            return (
              <TouchableOpacity
                key={section}
                style={styles.topCarouselItem}
                activeOpacity={0.85}
                onLayout={(event) => {
                  sectionOffsets.current[index] = event.nativeEvent.layout.x;
                }}
                onPress={() => setActiveSection(index)}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.topCarouselText,
                    isCompact && styles.topCarouselTextCompact,
                    active && styles.topCarouselTextActive,
                    active && isCompact && styles.topCarouselTextActiveCompact,
                  ]}>
                  {section}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={[styles.heroSection, isCompact && styles.heroSectionCompact]}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Silent Echoes</Text>
            <Text style={styles.heroText}>Descubre algo nuevo cada día con tu reproducción actual.</Text>
          </View>

          <View style={styles.heroBubbles}>
            <TouchableOpacity
              style={[
                styles.heroBubbleLarge,
                { width: largeBubbleSize, height: largeBubbleSize, borderRadius: largeBubbleSize / 2 },
              ]}
              activeOpacity={0.85}
              onPress={() => openAlbum(0)}>
              <Image source={albums[0]?.cover} style={styles.heroBubbleImage} contentFit="cover" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.heroBubbleAction,
                { width: actionBubbleSize, height: actionBubbleSize, borderRadius: actionBubbleSize / 2 },
              ]}
              activeOpacity={0.85}
              onPress={() => router.push('/player')}>
              <Ionicons name="open-outline" size={isCompact ? 20 : 22} color="#111111" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.heroBubbleSmall,
                { width: smallBubbleSize, height: smallBubbleSize, borderRadius: smallBubbleSize / 2 },
              ]}
              activeOpacity={0.85}
              onPress={() => openAlbum(1)}>
              <Image source={albums[1]?.cover} style={styles.heroBubbleImage} contentFit="cover" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contenido</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/all-albums')}>
            <Text style={styles.sectionLink}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {albums.slice(0, 6).map((album, index) => (
            <TouchableOpacity
              key={album.id}
              activeOpacity={0.88}
              style={[styles.coverWrap, index === 0 && styles.coverWrapLarge]}
              onPress={() => openAlbum(index)}>
              <Image
                source={album.cover}
                style={[styles.gridCover, index === 0 && styles.gridCoverLarge]}
                contentFit="cover"
              />

              <View style={styles.cardTopRow}>
                <Text style={styles.cardEyebrow}>{playerSections[activeSection]}</Text>
                <Ionicons name="arrow-up-outline" size={14} color="#5a5a5a" />
              </View>

              <Text style={styles.cardTitle} numberOfLines={2}>
                {album.title}
              </Text>
              <Text style={styles.cardMeta} numberOfLines={2}>
                {getMetaText(album)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f3ef',
  },
  floatingPlayer: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  floatingPlayerCompact: {
    left: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  floatingPlayerMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingThumb: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#ececec',
  },
  floatingCopy: {
    flex: 1,
    minWidth: 0,
  },
  floatingLabel: {
    color: '#7b7b7b',
    fontSize: 11,
    marginBottom: 2,
  },
  floatingTitle: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  floatingArtist: {
    color: '#6b6b6b',
    fontSize: 12,
    marginTop: 1,
  },
  floatingAction: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 96,
    paddingBottom: 110,
  },
  contentCompact: {
    paddingHorizontal: 14,
    paddingTop: 88,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  headerTitle: {
    color: '#111111',
    fontSize: 30,
    fontWeight: '400',
    marginBottom: 4,
  },
  eyebrow: {
    color: '#717171',
    fontSize: 13,
    lineHeight: 16,
    maxWidth: 220,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7e6e2',
  },
  heroSection: {
    backgroundColor: '#efede8',
    borderRadius: 28,
    padding: 16,
    marginBottom: 18,
  },
  heroSectionCompact: {
    padding: 14,
  },
  heroCopy: {
    marginBottom: 14,
  },
  heroTitle: {
    color: '#111111',
    fontSize: 25,
    lineHeight: 28,
    fontWeight: '500',
    marginBottom: 8,
  },
  heroText: {
    color: '#696969',
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 230,
  },
  topCarouselWrap: {
    gap: 14,
    marginBottom: 18,
    alignItems: 'flex-end',
    minHeight: 52,
    paddingTop: 2,
    paddingBottom: 8,
  },
  topCarouselItem: {
    justifyContent: 'flex-end',
    minHeight: 44,
  },
  topCarouselText: {
    color: '#a9a9a9',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '400',
    includeFontPadding: false,
    textAlignVertical: 'bottom',
  },
  topCarouselTextCompact: {
    fontSize: 16,
    lineHeight: 20,
  },
  topCarouselTextActive: {
    color: '#111111',
    fontSize: 40,
    lineHeight: 42,
    fontWeight: '500',
    marginRight: 4,
  },
  topCarouselTextActiveCompact: {
    fontSize: 31,
    lineHeight: 34,
  },
  heroBubbles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  heroBubbleLarge: {
    width: 116,
    height: 116,
    borderRadius: 58,
    overflow: 'hidden',
    backgroundColor: '#f4a12d',
  },
  heroBubbleAction: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  heroBubbleSmall: {
    width: 82,
    height: 82,
    borderRadius: 41,
    overflow: 'hidden',
    backgroundColor: '#3d160f',
  },
  heroBubbleImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLink: {
    color: '#6d6d6d',
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  coverWrap: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 10,
  },
  coverWrapLarge: {
    width: '100%',
  },
  gridCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#dedede',
    marginBottom: 10,
  },
  gridCoverLarge: {
    aspectRatio: 1.18,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardEyebrow: {
    color: '#8b8b8b',
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    color: '#111111',
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '700',
  },
  cardMeta: {
    color: '#6b6b6b',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },

});
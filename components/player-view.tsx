import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePlayer } from '@/contexts/player-context';

type PlayerViewProps = {
  onClose: () => void;
};

export function PlayerView({ onClose }: PlayerViewProps) {
  const { currentAlbum, isPlaying, togglePlay, playNext, playPrevious } = usePlayer();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image source={currentAlbum.cover} style={styles.bgImage} contentFit="cover" blurRadius={14} />
      <View style={styles.overlay} />

      <View style={styles.statusRow}>
        <Text style={styles.statusTime}>4:50</Text>
        <View style={styles.statusRight}>
          <Ionicons name="cellular" size={15} color="#ffffff" />
          <Ionicons name="wifi" size={15} color="#ffffff" />
          <View style={styles.batteryPill}>
            <Text style={styles.batteryText}>63</Text>
          </View>
        </View>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Music</Text>
        <TouchableOpacity style={styles.closeButton} activeOpacity={0.85} onPress={onClose}>
          <Ionicons name="chevron-down" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.coverWrap}>
        <Image source={currentAlbum.cover} style={styles.cover} contentFit="cover" />
      </View>

      <View style={styles.bottomContent}>
        <View style={styles.infoRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={1}>
              {currentAlbum.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {currentAlbum.artist}
            </Text>
            <View style={styles.qualityRow}>
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityBadgeText}>MP3</Text>
              </View>
              <Text style={styles.qualityText}>{currentAlbum.subtitle}</Text>
            </View>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.roundAction} activeOpacity={0.85}>
              <Ionicons name="copy-outline" size={16} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundAction} activeOpacity={0.85}>
              <Ionicons name="ellipsis-horizontal" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
          <View style={styles.progressDot} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.progressTime}>00:00</Text>
          <Text style={styles.progressTime}>{currentAlbum.duration}</Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity activeOpacity={0.85}>
            <Ionicons name="repeat" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={playPrevious}>
            <Ionicons name="play-skip-back" size={32} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} onPress={togglePlay}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} onPress={playNext}>
            <Ionicons name="play-skip-forward" size={32} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={onClose}>
            <Ionicons name="timer-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomBar}>
          <Ionicons name="list-outline" size={24} color="rgba(255,255,255,0.88)" />
          <Ionicons name="stats-chart-outline" size={24} color="rgba(255,255,255,0.52)" />
          <Ionicons name="radio-outline" size={24} color="rgba(255,255,255,0.52)" />
          <Ionicons name="reorder-four-outline" size={24} color="rgba(255,255,255,0.88)" />
          <TouchableOpacity activeOpacity={0.85} onPress={onClose}>
            <Ionicons name="chevron-down" size={26} color="rgba(255,255,255,0.88)" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  statusRow: {
    paddingHorizontal: 20,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTime: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batteryPill: {
    backgroundColor: '#f2d21d',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  batteryText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '800',
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
  },
  coverWrap: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  cover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 26,
    textTransform: 'uppercase',
    lineHeight: 29,
    marginTop: 2,
  },
  qualityRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qualityBadge: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  qualityBadgeText: {
    color: '#303030',
    fontSize: 12,
    fontWeight: '800',
  },
  qualityText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  roundAction: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center',
  },
  progressFill: {
    width: '24%',
    height: 4,
    borderRadius: 99,
    backgroundColor: '#ffffff',
  },
  progressDot: {
    position: 'absolute',
    left: '24%',
    marginLeft: -1,
    width: 2,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTime: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    fontWeight: '600',
  },
  controlsRow: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  divider: {
    marginTop: 24,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  bottomBar: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

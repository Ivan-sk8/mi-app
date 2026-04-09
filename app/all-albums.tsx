import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { albums } from '@/constants/albums';

export default function AllAlbumsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#f2f2f2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Albums</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {albums.map((album) => (
          <View key={album.id} style={styles.card}>
            <Image source={album.cover} style={styles.cover} />
            <Text style={styles.title} numberOfLines={1}>
              {album.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {album.artist}
            </Text>
            <Text style={styles.duration} numberOfLines={1}>
              {album.duration}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060606',
  },
  header: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b1b1b',
  },
  headerTitle: {
    color: '#f2f2f2',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
    height: 32,
  },
  grid: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  card: {
    width: '31%',
  },
  cover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 6,
  },
  title: {
    color: '#ededed',
    fontSize: 12,
    fontWeight: '700',
  },
  artist: {
    color: '#9e9e9e',
    fontSize: 11,
    marginTop: 2,
  },
  duration: {
    color: '#7f7f7f',
    fontSize: 11,
    marginTop: 2,
  },
});

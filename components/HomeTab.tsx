import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Simulación de historial de canciones reproducidas
const history = [
  {
    id: "1",
    title: "No One Noticed",
    artist: "The Marías",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0b/4d/b6/0b4db6bd-2d40-55a5-1714-67f5c816294d/075679659644.jpg/600x600bb.jpg",
  },
  {
    id: "2",
    title: "Scary Monsters",
    artist: "Skrillex",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/31/70/da/3170da66-9280-ccd2-1f97-57d8a1996f9e/075679970930.jpg/600x600bb.jpg",
  },
  {
    id: "3",
    title: "Cariño",
    artist: "The Marías",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/71/5f/fc/715ffc50-c006-500b-ad3e-830a6a6bbc70/artwork.jpg/600x600bb.jpg",
  },
  {
    id: "4",
    title: "Summit",
    artist: "Skrillex",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b4/c3/e8/b4c3e867-a787-7662-d8a4-45b3a30deb54/mzi.dsikpckg.jpg/600x600bb.jpg",
  },
  {
    id: "5",
    title: "Back To Me",
    artist: "The Marías",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cd/23/30/cd23301a-6faa-466a-0bac-ed393cce80ad/075679615336.jpg/600x600bb.jpg",
  },
];

export default function HomeTab() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  // Tamaños para los discos
  const diskSizes = {
    center: width * 0.32,
    side: width * 0.22,
  };

  // Para centrar el disco principal al inicio
  const initialScroll =
    (diskSizes.center + diskSizes.side + 24) / 2 -
    width / 2 +
    diskSizes.center / 2;

  return (
    <View style={styles.root}>
      {/* Encabezado */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Library</Text>
          <Text style={styles.headerSubtitle}>
            A curated collection of stories and inspiration
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.8}>
          <Ionicons name="options-outline" size={22} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Hero principal */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Silent{"\n"}Echoes</Text>
        <View style={styles.heroIconsRow}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="logo-apple" size={18} color="#222" />
          </View>
          <View style={styles.heroIconCircle}>
            <Ionicons name="logo-spotify" size={18} color="#222" />
          </View>
        </View>
      </View>

      {/* Carrusel de historial */}
      <View style={styles.carouselWrap}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          snapToInterval={diskSizes.side + 24}
          decelerationRate="fast"
          style={{ marginHorizontal: -24 }}
        >
          {history.map((item, idx) => {
            // El disco central (el tercero) es más grande y sin inclinación
            let diskStyle = {};
            let imageStyle = {};
            let rotate = "-15deg";
            let zIndex = 1;
            let opacity = 0.85;

            if (idx === 2) {
              // Central
              diskStyle = {
                width: diskSizes.center,
                height: diskSizes.center,
                marginHorizontal: 12,
                backgroundColor: "#fff",
                elevation: 6,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 6 },
              };
              imageStyle = {
                transform: [{ rotate: "0deg" }],
              };
              rotate = "0deg";
              zIndex = 2;
              opacity = 1;
            } else {
              // Laterales
              diskStyle = {
                width: diskSizes.side,
                height: diskSizes.side,
                marginHorizontal: 12,
                backgroundColor: "#fff",
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              };
              imageStyle = {
                transform: [{ rotate }],
              };
            }

            return (
              <View
                key={item.id}
                style={[styles.disk, diskStyle, { zIndex, opacity }]}
              >
                <Image
                  source={{ uri: item.cover }}
                  style={[styles.diskImage, imageStyle]}
                  resizeMode="cover"
                />
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Mensaje inferior */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomTitle}>Discover something new every day</Text>
        <Ionicons
          name="arrow-forward-outline"
          size={18}
          color="#222"
          style={{ marginLeft: 8 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f3ef",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 36,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: "700",
    color: "#222",
    letterSpacing: -1,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#444",
    opacity: 0.7,
    marginBottom: 0,
    maxWidth: 260,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e7e6e2",
    marginTop: 2,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
    letterSpacing: -1,
    lineHeight: 36,
  },
  heroIconsRow: {
    flexDirection: "row",
    gap: 10,
  },
  heroIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  carouselWrap: {
    marginTop: 10,
    marginBottom: 18,
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  carouselContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  disk: {
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  diskImage: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  bottomCard: {
    marginHorizontal: 24,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bottomTitle: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
    flex: 1,
  },
});

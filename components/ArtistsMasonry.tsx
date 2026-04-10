import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";

// Datos simulados de artistas (reemplaza por tus datos reales)
const artists = [
  {
    id: "1",
    name: "Ava Quinn",
    cover: require("../assets/artists/ava.jpg"),
  },
  {
    id: "2",
    name: "Lina Bradley",
    cover: require("../assets/artists/lina.jpg"),
  },
  {
    id: "3",
    name: "Dorian Lynwood",
    cover: require("../assets/artists/dorian.jpg"),
  },
  {
    id: "4",
    name: "Harper Vale",
    cover: require("../assets/artists/harper.jpg"),
  },
  {
    id: "5",
    name: "Mia Stone",
    cover: require("../assets/artists/mia.jpg"),
  },
  {
    id: "6",
    name: "Noah Reed",
    cover: require("../assets/artists/noah.jpg"),
  },
  {
    id: "7",
    name: "Ella Frost",
    cover: require("../assets/artists/ella.jpg"),
  },
  {
    id: "8",
    name: "Leo Carter",
    cover: require("../assets/artists/leo.jpg"),
  },
  {
    id: "9",
    name: "Sophie Lane",
    cover: require("../assets/artists/sophie.jpg"),
  },
  {
    id: "10",
    name: "Mason Blake",
    cover: require("../assets/artists/mason.jpg"),
  },
  {
    id: "11",
    name: "Isla Brooks",
    cover: require("../assets/artists/isla.jpg"),
  },
  {
    id: "12",
    name: "Lucas Hayes",
    cover: require("../assets/artists/lucas.jpg"),
  },
  {
    id: "13",
    name: "Chloe Hart",
    cover: require("../assets/artists/chloe.jpg"),
  },
  {
    id: "14",
    name: "Jack Flynn",
    cover: require("../assets/artists/jack.jpg"),
  },
  {
    id: "15",
    name: "Ruby West",
    cover: require("../assets/artists/ruby.jpg"),
  },
  {
    id: "16",
    name: "Oscar Dean",
    cover: require("../assets/artists/oscar.jpg"),
  },
  {
    id: "17",
    name: "Grace Ford",
    cover: require("../assets/artists/grace.jpg"),
  },
  {
    id: "18",
    name: "Henry Nash",
    cover: require("../assets/artists/henry.jpg"),
  },
  {
    id: "19",
    name: "Lily Page",
    cover: require("../assets/artists/lily.jpg"),
  },
  {
    id: "20",
    name: "Ethan Cole",
    cover: require("../assets/artists/ethan.jpg"),
  },
];

// Alturas variadas para el efecto masonry
const heights = [
  180, 120, 140, 200, 160, 120, 180, 140, 160, 200,
  120, 180, 140, 160, 200, 120, 180, 140, 160, 200,
];

export default function ArtistsMasonry() {
  return (
    <View style={{ flex: 1, padding: 8 }}>
      <MasonryList
        data={artists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, i }) => (
          <View style={[styles.card, { height: heights[i % heights.length] }]}>
            <Image source={item.cover} style={styles.cover} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 6,
    overflow: "hidden",
    elevation: 2,
    justifyContent: "flex-end",
    position: "relative",
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    width: "100%",
    height: "100%",
    opacity: 0.7,
  },
  textContainer: {
    padding: 12,
    zIndex: 2,
  },
  name: {
    color: "#111",
    fontSize: 22,
    fontWeight: "700",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Header({ title, regresar }: any) {
  return (
    <View style={styles.header}>

      {
        regresar && (
          <View style={styles.regresar}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
          </View>)
      }

      <Text style={styles.title}>{title}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#AACDDC",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  regresar: {
    flexDirection: "row",
    gap: 10,
  },
});
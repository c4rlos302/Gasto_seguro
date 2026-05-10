import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Header({ title, regresar, right }: any) {
  return (
    <View style={[styles.header, regresar && {height:125}, right && styles.headerSettings]}>

      {
        regresar && (
          <View style={styles.regresar}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
          </View>)
      }

      <Text style={[styles.title, right && styles.titleSettings]}>{title}</Text>
      {
        right && (
          <View>{right}</View>
        )
      }
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
  headerSettings: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  titleSettings: {
    flex: 1,
    marginLeft: 10,
  },
  regresar: {
    flexDirection: "row",
    gap: 10,
  },
});
import { View, Text, StyleSheet } from "react-native";

export default function Header({ title, up }: any) {
  return (
    <View style={styles.header}>
      
    {
        up && (
      <View style={styles.up}>
        {up}
      </View>)
    }
      
      <Text style={styles.title}>{title}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 140,
    paddingHorizontal: 20,
    backgroundColor: "#dc2626",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  up: {
    flexDirection: "row",
    gap: 10,
  },
});
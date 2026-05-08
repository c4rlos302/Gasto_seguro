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
  up: {
    flexDirection: "row",
    gap: 10,
  },
});
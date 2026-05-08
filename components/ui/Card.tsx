import { View, StyleSheet } from "react-native";

export function CardContainer({ children }: any) {
  return <View style={styles.cardContainer}>{children}</View>;
}

export function CardView({ children }: any) {
  return <View style={styles.cardView}>{children}</View>
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  cardView: {
    padding: 15,
    marginHorizontal: 10,  
    marginTop: 15,          
    backgroundColor: "#e9f3ff",
    borderRadius: 20,
    width: "auto"
  }
});
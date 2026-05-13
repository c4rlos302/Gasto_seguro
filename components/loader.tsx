import {
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
} from "react-native";

export function Loader({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>

      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Gasto Seguro
      </Text>

      <Text style={styles.subtitle}>
        Controla tu dinero inteligentemente
      </Text>

      <ActivityIndicator
        size="large"
        color="#547792"
        style={styles.loader}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#213448",
    marginTop: 15,
  },

  subtitle: {
    fontSize: 14,
    color: "#547792",
    marginTop: 8,
    textAlign: "center",
  },

  loader: {
    marginTop: 30,
  },
});
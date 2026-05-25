import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";

import { useTheme } from "@/src/context/ThemeContext";
import { lightColors, darkColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";

export default function Header({
  title,
  regresar,
  right,
  avatar,
}: any) {

  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.principal },
        regresar && { height: 125 },
        right && styles.headerSettings,
      ]}
    >

      {regresar && (
        <View style={styles.regresar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={Colors.blanco}
            />
          </Pressable>
        </View>
      )}

      <View style={styles.userInfo}>
        
        <Image source={{uri: avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",}}style={styles.avatar}
        />

        <Text
          style={[
            styles.title,
            right && styles.titleSettings,
          ]}
        >
          {title}
        </Text>

      </View>

      {right && <View>{right}</View>}

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 30,
    paddingHorizontal: 20,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 8,
  },

  headerSettings: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  regresar: {
    flexDirection: "row",
    gap: 10,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.blanco,
  },

  titleSettings: {
    flex: 1,
    marginLeft: 10,
  },
});
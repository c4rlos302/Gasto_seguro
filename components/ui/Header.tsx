import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { lightColors, darkColors } from "@/constants/theme";

export default function Header({ title, regresar, right }: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    
    <View
      style={[
        styles.header,
        { backgroundColor: colors.card },
        regresar && { height: 125 },
        right && styles.headerSettings,
      ]}
    >
      {regresar && (
        <View style={styles.regresar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        </View>
      )}

      <Text
        style={[
          styles.title,
          { color: colors.text },
          right && styles.titleSettings,
        ]}
      >
        {title}
      </Text>

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
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

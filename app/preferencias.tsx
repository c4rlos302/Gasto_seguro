import { router } from "expo-router";
import { Loader } from "@/components/loader";
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Preferencias() {

  return (
    <View style={{ flex: 1 }}>

      <Header
        title="Preferencias"
        regresar={true}
      />

    </View>
  );
}
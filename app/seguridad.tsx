import { router } from "expo-router";
import { Loader } from "@/components/loader";
import { CardContainer, CardView } from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Seguridad() {

  return (
    <CardContainer>
            <Header
           title="Seguridad"
           regresar={true}
         />
   
         <CardView>
             <TouchableOpacity style={styles.option} onPress={() => router.push("/cambiar_contrasena")}>
               <Ionicons name="lock-closed-outline" size={20} color="#81A6C6" />
               <Text style={styles.optionText}>Cambiar contraseña</Text>
               <Ionicons name="chevron-forward" size={20} color="#81A6C6" />
             </TouchableOpacity>
           </CardView>
   
       </CardContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#AACDDC",
    paddingHorizontal: 20,
    paddingTop: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
  }
});
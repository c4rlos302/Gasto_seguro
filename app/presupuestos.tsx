import { CardContainer, CardView } from '@/components/ui/Card'
import Header from '@/components/ui/Header'
import { Colors } from '@/constants/colors'
import { darkColors, lightColors } from '@/constants/theme'
import { useTheme } from '@/src/context/ThemeContext'
import { useRecurrentes } from '@/src/hooks/useRecurrentes'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import RecurrentesModal from '@/components/forms/RecurrenteModal'
import { Loader } from '@/components/loader'
import dayjs from 'dayjs'

export default function Presupuestos() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const { recurrentes, fetchRecurrentes, eliminar, crear, editar } = useRecurrentes();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recurrenteEditar, setRecurrenteEditar] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        setLoading(true);
        await fetchRecurrentes();
        setLoading(false);
      }

      cargarDatos();
    }, [])
  );

  const eliminarRecurrente = (id: string) => {
    Alert.alert(
      "Eliminar",
      "¿Eliminar este presupuesto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await eliminar(id);
            await fetchRecurrentes();
            setLoading(false);
          }
        }
      ]
    );
  };

  const guardarRecurrente = async (data: any) => {

    setLoading(true);

    if (recurrenteEditar) {
      await editar(recurrenteEditar.id, data);
    } else {
      await crear(data);
    }

    setLoading(false);

    setModalVisible(false);
    setRecurrenteEditar(null);
  };

  return (
    <CardContainer>
      <Header
        title="Presupuestos"
        regresar
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{maxHeight: 500}}
      >

        {recurrentes.length > 0 ? (
          recurrentes.map((r: any) => (
            <CardView key={r.id}>
              <View style={styles.cardHeader}>
                <View>

                  <Text style={[styles.nombre, { color: colors.text }]} >
                    {r.nombre}
                  </Text>

                  <Text style={{ color: colors.textSecondary }} >
                    ${parseFloat(r.monto).toFixed(2)}
                  </Text>

                  <Text style={{ color: colors.textSecondary }} >
                    {r.frecuencia}
                  </Text>

                  <Text style={{ color: colors.textSecondary }} >
                    Inicio:
                    {" "}
                    {dayjs(r.fecha_inicio).format("DD/MM/YYYY")}
                  </Text>

                </View>

                <View style={styles.actions}>

                  <TouchableOpacity
                    onPress={() => {
                      setRecurrenteEditar(r);
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="create-outline" size={24} color={Colors.principalLight} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => eliminarRecurrente(r.id)} >
                    <Ionicons name="trash-outline" size={24} color={Colors.error} />
                  </TouchableOpacity>

                </View>
              </View>
            </CardView>
          ))
        ) : (
          <CardView>
            <View style={styles.contenedor}>
              <Text style={{ color: colors.textSecondary, fontSize: 15 }} >
                No hay presupuestos creados
              </Text>
            </View>
          </CardView>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.principal }]}
        onPress={() => {
          setRecurrenteEditar(null);
          setModalVisible(true);
        }}
      >
        <Ionicons
          name="add"
          size={30}
          color={Colors.blanco}
        />
      </TouchableOpacity>


      <RecurrentesModal
        visible={modalVisible}
        recurrente={recurrenteEditar}
        recurrentes={recurrentes}
        modoEdicion={!!recurrenteEditar}
        onClose={() => {
          setModalVisible(false);
          setRecurrenteEditar(null);
        }}
        onSave={guardarRecurrente}
      />

      <Loader visible={loading} />
    </CardContainer>
  )
}

const styles = StyleSheet.create({

  contenedor: {
    maxHeight: 700,
    alignItems: "center",
    justifyContent: "center",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nombre: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  actions: {
    gap: 15,
  },

  fab: {
    position: "absolute",
    top: 700,
    bottom: 0,
    left: 280,
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
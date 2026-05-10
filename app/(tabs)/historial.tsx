import React, { useMemo, useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Header from '@/components/ui/Header';
import { CardContainer } from '@/components/ui/Card';
import { useMovimientos } from '@/src/hooks/useMovimientos';
import { useCategorias } from '@/src/hooks/useCategorias';
import { Loader } from '@/components/loader';

export default function Historial() {
  const { movimientos, fetchMovimientos } = useMovimientos();
  const { categorias, fetchCategorias } = useCategorias();

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        setLoading(true);
        await Promise.all([
          fetchMovimientos(),
          fetchCategorias(),
        ]);
        setLoading(false);
      };

      cargarDatos();
    }, [])
  );

  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);

  const categoriasMap = useMemo(() => {
    return categorias.reduce(
      (acc: any, cat: any) => {

        acc[cat.id] = cat.nombre;

        return acc;

      },
      {}
    );
  }, [categorias]);

  return (
    <CardContainer>
      <Header
        title="Historial"
        right={
          <TouchableOpacity
            style={styles.filterBtn}
          >
            <Ionicons
              name="filter"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        }
      />

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <FlashList
          data={movimientos}
          keyExtractor={(item) =>
            item.id.toString()
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item: m }) => (
            <View style={styles.movimiento}>
              <View style={styles.icono}>
                <Ionicons
                  name={m.tipo === "gasto" ? "arrow-down" : "arrow-up"}
                  size={18}
                  color="#fff"
                />
              </View>

              <View style={styles.info}>

                <Text style={styles.categoria}>
                  {categoriasMap[m.categoria_id] || "Sin categoría"}
                </Text>

                <Text style={styles.descripcion}>
                  {m.descripcion || "Sin descripción"}
                </Text>

                <Text style={styles.fecha}>
                  {new Date(m.fecha).toLocaleDateString()}
                </Text>

              </View>
              <Text style={styles.monto}>
                {m.tipo === "gasto" ? "-" : "+"} $ {parseFloat(m.monto).toFixed(2)}
              </Text>
            </View>

          )}

          ItemSeparatorComponent={() => (
            <View style={{ height: 10 }} />
          )}

          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Ionicons
                name="wallet-outline"
                size={60}
                color="#D1D5DB"
              />

              <Text style={styles.emptyText}>
                No hay movimientos
              </Text>
            </View>
          )}
        />
      </View>
      <Loader visible={loading} />
    </CardContainer>
  );
}

const styles = StyleSheet.create({
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
  },
  movimiento: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  icono: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#AACDDC",
  },

  info: {
    flex: 1,
  },

  categoria: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  descripcion: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  fecha: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },

  monto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#AACDDC",
  },

  filterBtn: {
    padding: 6,
  },

  empty: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },

  emptyText: {
    marginTop: 10,
    color: "#9CA3AF",
    fontSize: 15,
  },
})

import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import FlashListMovimientos from "@/components/FlashListMovimientos";
import { Loader } from "@/components/loader";

import { useUser } from "@/src/hooks/useUser";
import { useMovimientos } from "@/src/hooks/useMovimientos";
import MovimientoModal from "@/components/forms/MovimientoModal";


export default function Inicio() {
  const { usuario } = useUser();
  const { movimientos, fetchMovimientos } = useMovimientos();

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        setLoading(true);
        await Promise.all([
          fetchMovimientos(),
        ]);
        setLoading(false);
      };

      cargarDatos();
    }, [])
  );

  const [modalMovimiento, setModalMovimiento] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState<"gasto" | "ingreso">("gasto");
  const [loading, setLoading] = useState(false);

  const movimientosRecientes = useMemo(() => {
    return movimientos.slice(0, 5);
  }, [movimientos]);

  const balance = useMemo(() => {
    return movimientos.reduce((acc: number, mov: any) => {
      const monto = parseFloat(mov.monto);
      if (mov.tipo === "ingreso") {
        return acc + monto;
      }
      return acc - monto;
    }, 0);
  }, [movimientos]);

  const ingresosMes = useMemo(() => {
    return movimientos
      .filter((m: any) => m.tipo === "ingreso")
      .reduce(
        (acc: number, mov: any) =>
          acc + parseFloat(mov.monto),
        0
      );

  }, [movimientos]);

  const gastosMes = useMemo(() => {
    return movimientos
      .filter((m: any) => m.tipo === "gasto")
      .reduce(
        (acc: number, mov: any) =>
          acc + parseFloat(mov.monto),
        0
      );

  }, [movimientos]);

  return (
    <CardContainer>
      <Header title={`Hola, ${usuario?.nombre}`} />

      <ScrollView showsVerticalScrollIndicator={false}>

        <CardView style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance total</Text>
          <Text style={styles.balance}>
            ${balance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </Text>
        </CardView>

        <View style={styles.resumenContainer}>
          <CardView style={styles.resumenCard}>
            <Ionicons name="card" size={28} color="#EF4444" />
            <Text style={styles.resumenLabel}>Gastos</Text>
            <Text style={styles.gasto}>
              ${gastosMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </Text>
          </CardView>

          <CardView style={styles.resumenCard}>
            <Ionicons name="trending-up" size={28} color="#10B981" />
            <Text style={styles.resumenLabel}>Ingresos</Text>
            <Text style={styles.ingreso}>
              ${ingresosMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </Text>
          </CardView>
        </View>

        <CardView>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.grid}>
            <TouchableOpacity
              style={styles.accionRapida}
              onPress={() => {
                setTipoMovimiento("gasto");
                setModalMovimiento(true);
              }}
            >
              <Ionicons name="card" size={32} color="#81A6C6" />
              <Text style={styles.textoAccionRapida}>Gasto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accionRapida}
              onPress={() => {
                setTipoMovimiento("ingreso");
                setModalMovimiento(true);
              }}
            >
              <Ionicons name="trending-up" size={32} color="#81A6C6" />
              <Text style={styles.textoAccionRapida}>Ingreso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.accionRapida}>
              <Ionicons name="pie-chart" size={32} color="#81A6C6" />
              <Text style={styles.textoAccionRapida}>Presupuesto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accionRapida}
              onPress={() =>
                router.push("/categorias")
              }
            >
              <Ionicons name="pricetags" size={32} color="#81A6C6" />
              <Text style={styles.textoAccionRapida}>Categorías</Text>
            </TouchableOpacity>
          </View>
        </CardView>

        <CardView>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reportes y gráficos</Text>
            <TouchableOpacity>
              <Text style={styles.link}>Ver más</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="stats-chart" size={60} color="#D1D5DB" />
            <Text style={styles.chartText}>Aquí irá tu gráfica</Text>
          </View>
        </CardView>

        <CardView>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos movimientos</Text>
            <TouchableOpacity onPress={() => router.push("/historial")} >
              <Text style={styles.link}>Ver historial</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 380 }}>
            <FlashListMovimientos movimientos={movimientosRecientes} />
          </View>
        </CardView>
      </ScrollView>

      <MovimientoModal
        visible={modalMovimiento}
        onClose={() => {
          setModalMovimiento(false);          
        }}
        tipoInicial={tipoMovimiento}
      />
      <Loader visible={loading} />
    </CardContainer>
  );
}

const styles = StyleSheet.create({

  balanceCard: {
    alignItems: "center",
    paddingVertical: 30,
  },

  balanceLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 10,
  },

  balance: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111827",
  },

  resumenContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  resumenCard: {
    width: "45%",
    alignItems: "center",
    paddingVertical: 20,
  },

  resumenLabel: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },

  ingreso: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#10B981",
  },

  gasto: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#EF4444",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#111827",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },

  accionRapida: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
  },

  textoAccionRapida: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  link: {
    color: "#81A6C6",
    fontWeight: "600",
  },

  chartPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  chartText: {
    marginTop: 10,
    color: "#9CA3AF",
  },
});
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import FlashListMovimientos from "@/components/FlashListMovimientos";
import { Loader } from "@/components/loader";
import GastosCategoriaChart from "@/components/charts/GastosCategoriaChart";
import MovimientoModal from "@/components/forms/MovimientoModal";

import { useUser } from "@/src/hooks/useUser";
import { useMovimientos } from "@/src/hooks/useMovimientos";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";

export default function Inicio() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
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
          <Text style={[styles.balanceLabel, {color: colors.textSecondary}]}>Balance total</Text>
          <Text style={[styles.balance, {color: colors.text}]}>
            ${balance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </Text>
        </CardView>

        <View style={styles.resumenContainer}>
          <CardView style={[styles.balanceCard, styles.resumenCard]}>
            <Ionicons name="card" size={28} color={Colors.error} />
            <Text style={[styles.resumenLabel, {color: colors.textSecondary}]}>Gastos</Text>
            <Text style={[styles.movimiento, {color: Colors.error}]}>
              ${gastosMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </Text>
          </CardView>

          <CardView style={[styles.balanceCard, styles.resumenCard]}>
            <Ionicons name="trending-up" size={28} color={Colors.success} />
            <Text style={[styles.resumenLabel, {color: colors.textSecondary}]}>Ingresos</Text>
            <Text style={[styles.movimiento, {color: Colors.success}]}>
              ${ingresosMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </Text>
          </CardView>
        </View>

        <CardView>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Acciones rápidas</Text>
          <View style={styles.grid}>
            <TouchableOpacity
              style={[styles.accionRapida, {backgroundColor: colors.fondo}]}
              onPress={() => {
                setTipoMovimiento("gasto");
                setModalMovimiento(true);
              }}
            >
              <Ionicons name="card" size={32} color={Colors.principalLight} />
              <Text style={[styles.textoAccionRapida, {color: colors.textSecondary}]}>Gasto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.accionRapida, {backgroundColor: colors.fondo}]}
              onPress={() => {
                setTipoMovimiento("ingreso");
                setModalMovimiento(true);
              }}
            >
              <Ionicons name="trending-up" size={32} color={Colors.principalLight} />
              <Text style={[styles.textoAccionRapida, {color: colors.textSecondary}]}>Ingreso</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.accionRapida, {backgroundColor: colors.fondo}]}
              onPress={() => {
                router.navigate("../presupuestos");
              }}
            >
              <Ionicons name="pie-chart" size={32} color={Colors.principalLight} />
              <Text style={[styles.textoAccionRapida, {color: colors.textSecondary}]}>Presupuesto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.accionRapida, {backgroundColor: colors.fondo}]}
              onPress={() =>
                router.push("/categorias")
              }
            >
              <Ionicons name="pricetags" size={32} color={Colors.principalLight} />
              <Text style={[styles.textoAccionRapida, {color: colors.textSecondary}]}>Categorías</Text>
            </TouchableOpacity>
          </View>
        </CardView>

        <CardView>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Reportes y gráficos</Text>
            <TouchableOpacity onPress={() => {
              router.navigate("/(tabs)/reportes");
            }}>
              <Text style={[styles.link, {color: colors.link}]}>Ver más</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chartPlaceholder}>
            <GastosCategoriaChart movimientos={movimientos} title={false} />
          </View>
        </CardView>

        <CardView>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Últimos movimientos</Text>
            <TouchableOpacity onPress={() => router.push("/historial")} >
              <Text style={[styles.link, {color: colors.link}]}>Ver historial</Text>
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
    marginBottom: 10,
  },

  balance: {
    fontSize: 36,
    fontWeight: "700",
  },

  resumenContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  resumenCard: {
    width: "45%",
  },

  resumenLabel: {
    marginTop: 10,
    fontSize: 14,
  },

  movimiento: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },

  accionRapida: {
    width: "48%",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
  },

  textoAccionRapida: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  link: {
    fontWeight: "600",
  },

  chartPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

});
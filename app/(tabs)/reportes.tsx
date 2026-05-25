import React, { useCallback, useMemo, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, TouchableWithoutFeedback,
  Pressable
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { useMovimientos } from "@/src/hooks/useMovimientos";
import GastosCategoriaChart from "@/components/charts/GastosCategoriaChart";
import IngresosGastosChart from "@/components/charts/IngresosGastosChart";
import { useEstadisticas } from "@/src/hooks/useEstadisticas";
import { useCategorias } from "@/src/hooks/useCategorias";
import { exportarPDF } from "../../src/utils/exportarPDF";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { Loader } from "@/components/loader";
import { useUser } from "@/src/hooks/useUser";

type Periodo = "hoy" | "semana" | "mes" | "anio" | "custom" | "todos";

export default function Reportes() {

  const { usuario } = useUser();

  const { movimientos, fetchMovimientos } = useMovimientos();
  const { categorias } = useCategorias();

  const [modalFechas, setModalFechas] = useState(false);
  const [periodo, setPeriodo] = useState<Periodo>("todos");

  const [mostrarCalendarioInicio, setMostrarCalendarioInicio] = useState(false);
  const [mostrarCalendarioFin, setMostrarCalendarioFin] = useState(false);

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);

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

  const movimientosFiltrados = useMemo(() => {
    const hoy = dayjs();

    return movimientos.filter((m: any) => {
      const fechaMov = dayjs(
        m.fecha,
        "YYYY-MM-DD"
      );

      switch (periodo) {
        case "hoy":
          return fechaMov.isSame(hoy, "day");

        case "semana":
          return fechaMov.isAfter(
            hoy.subtract(7, "day").startOf("day")
          );

        case "mes":
          return fechaMov.isSame(hoy, "month");

        case "anio":
          return fechaMov.isSame(hoy, "year");

        case "custom":
          if (fechaInicio && fechaFin) {
            let inicio = dayjs(fechaInicio);
            let fin = dayjs(fechaFin);

            if (inicio.isAfter(fin)) {
              [inicio, fin] = [fin, inicio];
            }

            inicio = inicio.startOf("day");
            fin = fin.endOf("day");

            return (
              (fechaMov.isAfter(inicio) ||
                fechaMov.isSame(inicio)) &&
              (fechaMov.isBefore(fin) ||
                fechaMov.isSame(fin))
            );
          }

          return true;

        case "todos":
        default:
          return true;
      }
    });
  }, [movimientos, periodo, fechaInicio, fechaFin]);

  const stats = useEstadisticas(movimientosFiltrados, categorias);

  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <CardContainer>
      <Header title="Reportes y Gráficos" 
      avatar={usuario?.avatar_url}
      right={
        <TouchableOpacity
          onPress={async () => {
            setLoading(true);
            exportarPDF(movimientosFiltrados, categorias, periodo,
              dayjs(fechaInicio).format("DD/MM/YYYY"), dayjs(fechaFin).format("DD/MM/YYYY"));
            setLoading(false);
          }} 
        >
          <Ionicons
            name="arrow-redo-sharp"
            size={20}
            color={Colors.blanco}
          />
        </TouchableOpacity>
      } />
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.chip, { backgroundColor: colors.chip }, periodo === "todos" && { backgroundColor: colors.principal }]}
          onPress={() => setPeriodo("todos")}
        >
          <Text style={{ color: colors.text }}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, { backgroundColor: colors.chip }, periodo === "hoy" && { backgroundColor: colors.principal }]}
          onPress={() => setPeriodo("hoy")}
        >
          <Text style={{ color: colors.text }}>Hoy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, { backgroundColor: colors.chip }, periodo === "semana" && { backgroundColor: colors.principal }]}
          onPress={() => setPeriodo("semana")}
        >
          <Text style={{ color: colors.text }}>Semana</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, { backgroundColor: colors.chip }, periodo === "mes" && { backgroundColor: colors.principal }]}
          onPress={() => setPeriodo("mes")}
        >
          <Text style={{ color: colors.text }}>Mes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, { backgroundColor: colors.chip }, periodo === "anio" && { backgroundColor: colors.principal }]}
          onPress={() => setPeriodo("anio")}
        >
          <Text style={{ color: colors.text }}>Año</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, { backgroundColor: colors.chip }, periodo === "custom" && { backgroundColor: colors.principal }]}
          onPress={() => {
            setPeriodo("custom");
            setModalFechas(true);
          }}
        >
          <Text style={{ color: colors.text }}>Personalizado</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalFechas} transparent animationType="slide" >
        <TouchableWithoutFeedback onPress={() => setModalFechas(false)}>
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <TouchableWithoutFeedback>
              <View style={[styles.modal, { backgroundColor: colors.fondo }]}>
                <Text style={[styles.title, { color: colors.text }]}>Seleccionar rango de fechas</Text>

                <Pressable
                  style={[styles.input, { borderColor: colors.principal }]}
                  onPress={() => setMostrarCalendarioInicio(true)}
                >
                  <Text style={{ color: colors.text }}>{fechaInicio ? dayjs(fechaInicio).format("DD/MM/YYYY") : "Inicio"}</Text>
                </Pressable>
                {mostrarCalendarioInicio && (
                  <DateTimePicker
                    value={fechaInicio || new Date()}
                    mode="date"
                    display="calendar"
                    maximumDate={new Date()}
                    onChange={(_, date) => {
                      setMostrarCalendarioInicio(false);
                      date && setFechaInicio(date);
                    }}
                  />
                )}

                <Pressable
                  style={[styles.input, { borderColor: colors.principal }]}
                  onPress={() => setMostrarCalendarioFin(true)}
                >
                  <Text style={{ color: colors.text }}>{fechaFin ? dayjs(fechaFin).format("DD/MM/YYYY") : "Fin"}</Text>
                </Pressable>
                {mostrarCalendarioFin && (
                  <DateTimePicker
                    value={fechaFin || new Date()}
                    mode="date"
                    display="calendar"
                    maximumDate={new Date()}
                    onChange={(_, date) => {
                      setMostrarCalendarioFin(false);
                      date && setFechaFin(date);
                    }}
                  />
                )}

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btnClear, { backgroundColor: colors.fondo }]}
                    onPress={() => {
                      setFechaInicio(null);
                      setFechaFin(null);
                    }}
                  >
                    <Text style={{ color: colors.text }}>Limpiar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnApply, { backgroundColor: colors.principal }]}
                    onPress={() => setModalFechas(false)}
                  >
                    <Text style={{ color: colors.text }}>Aplicar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <CardView style={styles.balanceCard}>
          <Text style={[styles.label, { color: colors.text }]}>Balance</Text>
          <Text style={[styles.balance, { color: colors.text }]}>
            ${stats.balance.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </Text>
        </CardView>

        <View style={styles.resumenContainer}>
          <CardView style={styles.resumenCard}>
            <Text style={[styles.label, { color: colors.text }]}>Ingresos</Text>
            <Text style={[styles.ingreso, { color: Colors.success }]}>
              ${stats.ingresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </Text>
          </CardView>

          <CardView style={styles.resumenCard}>
            <Text style={[styles.label, { color: colors.text }]}>Gastos</Text>
            <Text style={[styles.gasto, { color: Colors.error }]}>
              ${stats.gastos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </Text>
          </CardView>
        </View>

        <CardView>
          <GastosCategoriaChart movimientos={movimientosFiltrados} />
        </CardView>

        <CardView>
          <IngresosGastosChart movimientos={movimientosFiltrados} />
        </CardView>

        <CardView>
          <Text style={[styles.title, { color: colors.text }]} >Estadisticas</Text>
          {movimientosFiltrados.length !== 0 ? <View style={styles.statsGrid}>

            <View style={[styles.statCard, { backgroundColor: colors.fondo }]}>
              <Text style={[styles.label, { color: colors.text }]}>Ingresos</Text>
              <Text style={[styles.value, { color: colors.textSecondary }]}>${stats.ingresos}</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.fondo }]}>
              <Text style={[styles.label, { color: colors.text }]}>Gastos</Text>
              <Text style={[styles.value, { color: colors.textSecondary }]}>${stats.gastos}</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.fondo }]}>
              <Text style={[styles.label, { color: colors.text }]}>Balance</Text>
              <Text style={[styles.value, { color: stats.balance >= 0 ? Colors.success : Colors.error }]}>
                ${stats.balance}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.fondo }]}>
              <Text style={[styles.label, { color: colors.text }]}>Ahorro</Text>
              <Text style={[styles.value, { color: colors.textSecondary }]}>{stats.ahorro.toFixed(1)}%</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.fondo }]}>
              <Text style={[styles.label, { color: colors.text }]}>Top categoría</Text>
              <Text style={[styles.value, { color: colors.textSecondary }]}>{stats.topCategoria}</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.fondo }]}>
              <Text style={[styles.label, { color: colors.text }]}>No. de Movimientos</Text>
              <Text style={[styles.value, { color: colors.textSecondary }]}>{stats.totalMovimientos}</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.fondo }]}>
              <Text style={[styles.label, { color: colors.text }]}>No. de Gastos</Text>
              <Text style={[styles.value, { color: colors.textSecondary }]}>{stats.totalGastos}</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.fondo }]}>
              <Text style={[styles.label, { color: colors.text }]}>No. de Ingresos</Text>
              <Text style={[styles.value, { color: colors.textSecondary }]}>{stats.totalIngresos}</Text>
            </View>

          </View>
            :
            <Text style={{ color: colors.text }}>No hay movimientos registrados</Text>
          }
        </CardView>
      </ScrollView>
      <Loader visible={loading} />
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  filtros: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    justifyContent: "center",
    flexWrap: "wrap",
  },

  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  balanceCard: {
    alignItems: "center",
    paddingVertical: 30,
  },

  label: {
    fontSize: 15,
  },

  balance: {
    fontSize: 36,
    fontWeight: "700",
    marginTop: 10,
  },

  resumenContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  resumenCard: {
    width: "45%",
    alignItems: "center",
    paddingVertical: 20,
  },

  ingreso: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
  },

  gasto: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statCard: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modal: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  input: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  btnClear: {
    flex: 1,
    padding: 12,
    marginRight: 5,
    borderRadius: 10,
    alignItems: "center",
  },

  btnApply: {
    flex: 1,
    padding: 12,
    marginLeft: 5,
    borderRadius: 10,
    alignItems: "center",
  },
});
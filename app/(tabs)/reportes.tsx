import React, { useMemo, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, TouchableWithoutFeedback
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "@/components/ui/Header";
import { CardContainer, CardView } from "@/components/ui/Card";
import { useMovimientos } from "@/src/hooks/useMovimientos";
import GastosCategoriaChart from "@/components/charts/GastosCategoriaChart";
import IngresosGastosChart from "@/components/charts/IngresosGastosChart";
import { useEstadisticas } from "@/src/hooks/useEstadisticas";
import { useCategorias } from "@/src/hooks/useCategorias";

type Periodo = "hoy" | "semana" | "mes" | "anio" | "custom" | "todos";

export default function Reportes() {

  const { movimientos } = useMovimientos();
  const { categorias } = useCategorias();

  const [modalFechas, setModalFechas] = useState(false);
  const [periodo, setPeriodo] = useState<Periodo>("todos");

  const [mostrarCalendarioInicio, setMostrarCalendarioInicio] = useState(false);
  const [mostrarCalendarioFin, setMostrarCalendarioFin] = useState(false);

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

 const movimientosFiltrados = useMemo(() => {
  const hoy = new Date();

  const inicioPeriodo = (() => {
    switch (periodo) {
      case "hoy":
        return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

      case "semana":
        const s = new Date();
        s.setDate(hoy.getDate() - 7);
        s.setHours(0, 0, 0, 0);
        return s;

      case "mes":
        return new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      case "anio":
        return new Date(hoy.getFullYear(), 0, 1);

      case "todos":
      default:
        return null;
    }
  })();

  return movimientos.filter((m: any) => {
    const fechaMov = new Date(m.fecha);

    // 🧠 PRIORIDAD: rango custom
    if (periodo === "custom" && fechaInicio && fechaFin) {
      let inicio = new Date(fechaInicio);
      let fin = new Date(fechaFin);

      if (inicio > fin) {
        [inicio, fin] = [fin, inicio];
      }

      inicio.setHours(0, 0, 0, 0);
      fin.setHours(23, 59, 59, 999);

      return fechaMov >= inicio && fechaMov <= fin;
    }

    // 📅 periodos normales
    if (inicioPeriodo) {
      return fechaMov >= inicioPeriodo;
    }

    // 📌 "todos" o null => no filtra nada
    return true;
  });
}, [movimientos, periodo, fechaInicio, fechaFin]);

  const stats = useEstadisticas(movimientosFiltrados, categorias);

  return (
    <CardContainer>
      <Header title="Reportes y Gráficos" />
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.chip, periodo === "todos" && styles.chipActivo]}
          onPress={() => setPeriodo("todos")}
        >
          <Text>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, periodo === "hoy" && styles.chipActivo]}
          onPress={() => setPeriodo("hoy")}
        >
          <Text>Hoy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, periodo === "semana" && styles.chipActivo]}
          onPress={() => setPeriodo("semana")}
        >
          <Text>Semana</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, periodo === "mes" && styles.chipActivo]}
          onPress={() => setPeriodo("mes")}
        >
          <Text>Mes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, periodo === "anio" && styles.chipActivo]}
          onPress={() => setPeriodo("anio")}
        >
          <Text>Año</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, periodo === "custom" && styles.chipActivo]}
          onPress={() => {
            setPeriodo("custom");
            setModalFechas(true);
          }}
        >
          <Text>Personalizado</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalFechas} transparent animationType="slide" >
        <TouchableWithoutFeedback onPress={() => setModalFechas(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Text style={styles.title}>Seleccionar rango de fechas</Text>

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setMostrarCalendarioInicio(true)}
                >
                  <Text>{fechaInicio ? fechaInicio.toLocaleDateString() : "Inicio"}</Text>
                </TouchableOpacity>
                {mostrarCalendarioInicio && (
                  <DateTimePicker
                    value={fechaInicio || new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                      setMostrarCalendarioInicio(false);
                      date && setFechaInicio(date);
                    }}
                  />
                )}

                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setMostrarCalendarioFin(true)}
                >
                  <Text>{fechaFin ? fechaFin.toLocaleDateString() : "Fin"}</Text>
                </TouchableOpacity>
                {mostrarCalendarioFin && (
                  <DateTimePicker
                    value={fechaFin || new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                      setMostrarCalendarioFin(false);
                      date && setFechaFin(date);
                    }}
                  />
                )}

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.btnClear}
                    onPress={() => {
                      setFechaInicio(null);
                      setFechaFin(null);
                    }}
                  >
                    <Text>Limpiar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnApply}
                    onPress={() => setModalFechas(false)}
                  >
                    <Text style={{ color: "#fff" }}>Aplicar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <CardView style={styles.balanceCard}>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.balance}>
            ${stats.balance.toLocaleString("es-MX",{minimumFractionDigits: 2})}
          </Text>
        </CardView>

        <View style={styles.resumenContainer}>
          <CardView style={styles.resumenCard}>
            <Text style={styles.label}>Ingresos</Text>
            <Text style={styles.ingreso}>
              ${stats.ingresos.toLocaleString("es-MX",{minimumFractionDigits: 2})}
            </Text>
          </CardView>

          <CardView style={styles.resumenCard}>
            <Text style={styles.label}>Gastos</Text>
            <Text style={styles.gasto}>
              ${stats.gastos.toLocaleString("es-MX",{minimumFractionDigits: 2})}
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
          <Text style={styles.title} >Estadisticas</Text>
          {movimientosFiltrados.length !== 0 ? <View style={styles.statsGrid}>

            <View style={styles.statCard}>
              <Text style={styles.label}>Ingresos</Text>
              <Text style={styles.value}>${stats.ingresos}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.label}>Gastos</Text>
              <Text style={styles.value}>${stats.gastos}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.label}>Balance</Text>
              <Text style={[styles.value,{ color: stats.balance >= 0 ? "#10B981" : "#EF4444" }]}>
                ${stats.balance}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.label}>Ahorro</Text>
              <Text style={styles.value}>{stats.ahorro.toFixed(1)}%</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.label}>Top categoría</Text>
              <Text style={styles.value}>{stats.topCategoria}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.label}>No. de Movimientos</Text>
              <Text style={styles.value}>{stats.totalMovimientos}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.label}>No. de Gastos</Text>
              <Text style={styles.value}>{stats.totalGastos}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.label}>No. de Ingresos</Text>
              <Text style={styles.value}>{stats.totalIngresos}</Text>
            </View>

          </View>
            :
            <Text>No hay movimientos registrados</Text>
          }
        </CardView>
      </ScrollView>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#111827",
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
    backgroundColor: "#F3F4F6",
  },

  chipActivo: {
    backgroundColor: "#AACDDC",
  },

  balanceCard: {
    alignItems: "center",
    paddingVertical: 30,
  },

  label: {
    fontSize: 15,
    color: "#6B7280",
  },

  balance: {
    fontSize: 36,
    fontWeight: "700",
    marginTop: 10,
    color: "#111827",
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
    color: "#10B981",
  },

  gasto: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
    color: "#EF4444",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  input: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    alignItems: "center",
  },

  btnApply: {
    flex: 1,
    padding: 12,
    marginLeft: 5,
    backgroundColor: "#81A6C6",
    borderRadius: 10,
    alignItems: "center",
  },
});
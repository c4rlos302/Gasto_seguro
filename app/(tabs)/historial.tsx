import React, { useMemo, useState, useCallback } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Modal, TextInput,
  Pressable, TouchableWithoutFeedback
} from "react-native";
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import DateTimePicker from "@react-native-community/datetimepicker";
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

  const [loading, setLoading] = useState(false);
  const [modalFiltros, setModalFiltros] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);
  const [montoMin, setMontoMin] = useState("");
  const [montoMax, setMontoMax] = useState("");
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [mostrarCalendarioInicio, setMostrarCalendarioInicio] = useState(false);
  const [mostrarCalendarioFin, setMostrarCalendarioFin] = useState(false);

  const categoriasMap = useMemo(() => {
    return categorias.reduce(
      (acc: any, cat: any) => {

        acc[cat.id] = cat.nombre;

        return acc;

      },
      {}
    );
  }, [categorias]);

  const seleccionarCategoria = (id: string) => {
    setCategoriasFiltro((prev) => {
      if (prev.includes(id)) {
        return prev.filter(
          (catId) => catId !== id
        );
      }
      return [...prev, id];
    });
  };

  const movimientosFiltrados = movimientos.filter((m) => {
    const monto = parseFloat(m.monto);

    const fechaMovimiento = new Date(m.fecha);

    let fechaInicioFinal = fechaInicio;
    let fechaFinFinal = fechaFin;
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      fechaInicioFinal = fechaFin;
      fechaFinFinal = fechaInicio;
    }

    const fechaMov = new Date(
      fechaMovimiento.getFullYear(),
      fechaMovimiento.getMonth(),
      fechaMovimiento.getDate()
    );

    const fechaIni = fechaInicioFinal ? new Date(
      fechaInicioFinal.getFullYear(),
      fechaInicioFinal.getMonth(),
      fechaInicioFinal.getDate()
    ) : null;

    const fechaFinNormalizada = fechaFinFinal ? new Date(
      fechaFinFinal.getFullYear(),
      fechaFinFinal.getMonth(),
      fechaFinFinal.getDate()
    ) : null;

    const cumpleTipo = !tipoFiltro || m.tipo === tipoFiltro;

    const cumpleCategoria = categoriasFiltro.length === 0 ||
      categoriasFiltro.includes(m.categoria_id);

    const cumpleMin = !montoMin || monto >= parseFloat(montoMin);
    const cumpleMax = !montoMax || monto <= parseFloat(montoMax);

    const cumpleFechaInicio = !fechaIni || fechaMov >= fechaIni;
    const cumpleFechaFin = !fechaFinNormalizada || fechaMov <= fechaFinNormalizada;

    return (
      cumpleTipo && cumpleCategoria && cumpleMin &&
      cumpleMax && cumpleFechaInicio && cumpleFechaFin
    );

  });

  return (
    <CardContainer>
      <Header
        title="Historial"
        right={
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setModalFiltros(true)}
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
          data={movimientosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: m }) => (
            <View style={styles.movimiento}>
              <View style={styles.icono}>
                <Ionicons
                  name={m.tipo === "gasto" ? "card" : "trending-up"}
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
              <Text style={styles.emptyText}>No hay movimientos</Text>
            </View>
          )}
        />
      </View>

      <Modal
        visible={modalFiltros}
        transparent
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setModalFiltros(false)} >
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>

                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filtros</Text>
                  <TouchableOpacity onPress={() => setModalFiltros(false)} >
                    <Ionicons
                      name="close"
                      size={24}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Tipo</Text>
                <View style={styles.chips}>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      tipoFiltro === "gasto" &&
                      styles.chipActivo
                    ]}
                    onPress={() => setTipoFiltro(
                        tipoFiltro === "gasto" ? "" : "gasto"
                      )
                    }
                  >
                    <Text>Gasto</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.chip,
                      tipoFiltro === "ingreso" &&
                      styles.chipActivo
                    ]}
                    onPress={() => setTipoFiltro(
                        tipoFiltro === "ingreso" ? "" : "ingreso"
                      )
                    }
                  >
                    <Text>Ingreso</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Categoría</Text>
                <View style={styles.chips}>
                  {categorias.map((cat: any) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.chip,
                        categoriasFiltro.includes(cat.id) &&
                        styles.chipActivo
                      ]}
                      onPress={() => seleccionarCategoria(cat.id)}
                    >
                      <Text>{cat.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Monto</Text>
                <View style={styles.inputs}>
                  <TextInput
                    placeholder="Mínimo"
                    keyboardType="numeric"
                    value={montoMin}
                    onChangeText={setMontoMin}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Máximo"
                    keyboardType="numeric"
                    value={montoMax}
                    onChangeText={setMontoMax}
                    style={styles.input}
                  />
                </View>

                <Text style={styles.label}>Fecha</Text>
                <View style={styles.inputs}>
                  <Pressable style={styles.input} onPress={() => setMostrarCalendarioInicio(true)} >
                    <Text>{fechaInicio ? fechaInicio.toLocaleDateString() : "Inicio"}</Text>
                  </Pressable>
                  {mostrarCalendarioInicio && (
                    <DateTimePicker
                      value={fechaInicio || new Date()}
                      mode="date"
                      display="default"
                      onChange={(_, f) => {
                        setMostrarCalendarioInicio(false);
                        f && setFechaInicio(f);
                      }}
                    />
                  )}

                  <Pressable style={styles.input} onPress={() => setMostrarCalendarioFin(true)} >
                    <Text>{fechaFin ? fechaFin.toLocaleDateString() : "Fin"}</Text>
                  </Pressable>
                  {mostrarCalendarioFin && (
                    <DateTimePicker
                      value={fechaFin || new Date()}
                      mode="date"
                      display="default"
                      onChange={(_, f) => {
                        setMostrarCalendarioFin(false);
                        f && setFechaFin(f);
                      }}
                    />
                  )}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => {
                      setTipoFiltro("");
                      setCategoriasFiltro([]);
                      setMontoMin("");
                      setMontoMax("");
                      setFechaInicio(null);
                      setFechaFin(null);
                    }}
                  >
                    <Text>Limpiar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => setModalFiltros(false)}
                  >
                    <Text style={{ color: "#fff" }}>Aplicar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 15,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  chipActivo: {
    backgroundColor: "#AACDDC",
  },
  inputs: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },
  clearBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  applyBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#81A6C6",
    alignItems: "center",
  },
})

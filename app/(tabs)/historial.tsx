import React, { useState, useCallback } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback,
  Alert
} from "react-native";
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/ui/Header';
import { CardContainer } from '@/components/ui/Card';
import { useMovimientos } from '@/src/hooks/useMovimientos';
import { useCategorias } from '@/src/hooks/useCategorias';
import { Loader } from '@/components/loader';
import FlashListMovimientos from '@/components/FlashListMovimientos';
import { Movimiento } from '@/src/types/movimiento';
import FiltroMovimientosModal from '@/components/forms/FiltroMovimientosModal';
import MovimientoModal from '@/components/forms/MovimientoModal';

export default function Historial() {
  const { movimientos, fetchMovimientos, removeMovimiento } = useMovimientos();
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
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<Movimiento | null>(null);
  const [modalMovimiento, setModalMovimiento] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modalAcciones, setModalAcciones] = useState(false);

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

    let inicio = fechaInicio;
    let fin = fechaFin;

    if (inicio && fin && inicio > fin) {
      inicio = fechaFin;
      fin = fechaInicio;
    }

    const fechaMovimiento = m.fecha;
    const fechaInicioStr = inicio ? inicio.toISOString().split("T")[0] : null;
    const fechaFinStr = fin ? fin.toISOString().split("T")[0] : null;
    const cumpleTipo = !tipoFiltro || m.tipo === tipoFiltro;
    const cumpleCategoria = categoriasFiltro.length === 0 || 
                            categoriasFiltro.includes(m.categoria_id);

    const cumpleMin = !montoMin || monto >= parseFloat(montoMin);
    const cumpleMax = !montoMax || monto <= parseFloat(montoMax);
    const cumpleFechaInicio = !fechaInicioStr || fechaMovimiento >= fechaInicioStr;
    const cumpleFechaFin = !fechaFinStr || fechaMovimiento <= fechaFinStr;

    return (
      cumpleTipo && cumpleCategoria && cumpleMin &&
      cumpleMax && cumpleFechaInicio && cumpleFechaFin
    );
  });

  const eliminarMovimiento = () => {
    if (!movimientoSeleccionado) {
      return;
    }
    Alert.alert(
      "Eliminar movimiento",
      `¿Estas seguro de eliminar este movimiento de $${movimientoSeleccionado.monto}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            setMovimientoSeleccionado(null);
            setModalAcciones(false);
          }
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await removeMovimiento(movimientoSeleccionado.id);
            await fetchMovimientos();
            setMovimientoSeleccionado(null);
            setModalAcciones(false);
            setLoading(false);
            Alert.alert("Completado", "Movimiento borrado exitosamente");
          }
        }
      ]
    )
  }

  return (
    <CardContainer>
      <Header
        title="Historial de movimientos"
        right={
          <TouchableOpacity
            style={styles.botonFiltro}
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

      <FlashListMovimientos
        movimientos={movimientosFiltrados}
        touch
        onSelect={(movimiento) => {
          setMovimientoSeleccionado(movimiento);
          setModalAcciones(true);
        }}
        movimientoSeleccionado={movimientoSeleccionado}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setMovimientoSeleccionado(null);
          setModoEdicion(false);
          setModalMovimiento(true);
        }}
      >
        <Ionicons
          name="add"
          size={30}
          color="#fff"
        />
      </TouchableOpacity>

      <MovimientoModal
        visible={modalMovimiento}
        onClose={() => {
          setModalMovimiento(false);
          setMovimientoSeleccionado(null);
        }}
        movimiento={movimientoSeleccionado}
        modoEdicion={modoEdicion}
        onSuccess={async () => {
          setLoading(true);
          setMovimientoSeleccionado(null);
          await Promise.all([
            fetchMovimientos(),
            fetchCategorias(),
          ]);
          setLoading(false);
        }}
      />

      <Modal
        visible={modalAcciones}
        transparent
        animationType="fade"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalAcciones(false);
            setMovimientoSeleccionado(null);
          }}
        >
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.actionsModal}>
                <Text style={styles.actionsTitle}>Acciones</Text>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setModoEdicion(true);
                    setModalAcciones(false);
                    setModalMovimiento(true);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="#81A6C6" />
                  <Text style={styles.actionText}>Editar movimiento</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={eliminarMovimiento}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  <Text style={[styles.actionText, { color: '#EF4444' }]}>
                    Eliminar movimiento
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalAcciones(false)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>

        </TouchableWithoutFeedback>
      </Modal>

      <FiltroMovimientosModal
        visible={modalFiltros}
        onClose={() => setModalFiltros(false)}

        tipoFiltro={tipoFiltro}
        setTipoFiltro={setTipoFiltro}

        categorias={categorias}
        categoriasFiltro={categoriasFiltro}
        seleccionarCategoria={seleccionarCategoria}

        montoMin={montoMin}
        setMontoMin={setMontoMin}

        montoMax={montoMax}
        setMontoMax={setMontoMax}

        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}

        fechaFin={fechaFin}
        setFechaFin={setFechaFin}

        limpiarFiltros={() => {
          setTipoFiltro("");
          setCategoriasFiltro([]);
          setMontoMin("");
          setMontoMax("");
          setFechaInicio(null);
          setFechaFin(null);
        }}
      />
      <Loader visible={loading} />
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  botonFiltro: {
    padding: 6,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#81A6C6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  actionsModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  actionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },

  actionText: {
    fontSize: 16,
    fontWeight: "500",
  },

  cancelBtn: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },

  cancelText: {
    fontWeight: "600",
  },
})

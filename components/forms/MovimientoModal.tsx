import { useCallback, useEffect, useState } from "react";
import {
    Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,
    Pressable, ScrollView, TouchableWithoutFeedback, Alert
} from "react-native";
import { useFocusEffect } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useCategorias } from "@/src/hooks/useCategorias";
import { useMovimientos } from "@/src/hooks/useMovimientos";
import { Loader } from "../loader";
import CategoriaModal from "./CategoriaModal";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    movimiento?: any | null;
    modoEdicion?: boolean;
    tipoInicial?: "gasto" | "ingreso";
}

export default function MovimientoModal({
    visible,
    onClose,
    onSuccess,
    movimiento,
    modoEdicion = false,
    tipoInicial,
}: Props) {
    const { categorias, fetchCategorias, addCategoria } = useCategorias();
    const { addMovimiento, editMovimiento, fetchMovimientos } = useMovimientos();

    const [loading, setLoading] = useState(false);
    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState<Date | null>(null);
    const [show, setShow] = useState(false);
    const [categoriaId, setCategoriaId] = useState("");
    const [tipo, setTipo] = useState(tipoInicial || "gasto");
    const [modalCategoriasVisible, setModalCategoriasVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                setLoading(true);
                await Promise.all([
                    fetchCategorias(),
                ]);
                setLoading(false);
            };

            cargarDatos();
        }, [])
    );

    useEffect(() => {
        if (visible && movimiento) {
            setMonto(movimiento.monto.toString());
            setDescripcion(movimiento.descripcion || "");
            setFecha(new Date(movimiento.fecha));
            setCategoriaId(movimiento.categoria_id);
            setTipo(movimiento.tipo);
        }

        if (visible && !movimiento) {
            limpiarFormulario();
        }
    }, [visible, movimiento]);

    useEffect(() => {
        setTipo(tipoInicial || "gasto");
    }, [tipoInicial, visible]);

    const limpiarFormulario = () => {
        setMonto("");
        setDescripcion("");
        setFecha(null);
        setCategoriaId("");
        setTipo("gasto");
    };

    const guardarMovimiento = async () => {
        if (!monto) {
            Alert.alert("Error", "Escribe un monto");
            return;
        }

        if (!fecha) {
            Alert.alert("Error", "Selecciona fecha");
            return;
        }

        if (!categoriaId) {
            Alert.alert("Error", "Selecciona categoría");
            return;
        }

        setLoading(true);
        const data = {
            monto: parseFloat(monto),
            descripcion,
            categoria_id: categoriaId,
            tipo,
            fecha: fecha.toISOString().split("T")[0],
        };

        if (modoEdicion && movimiento) {
            await editMovimiento(movimiento.id, data);
        } else {
            await addMovimiento(data);
        }
        await fetchMovimientos();
        setLoading(false);
        limpiarFormulario();
        onSuccess?.();
        onClose();
    };

    const guardarCategoria = async (nombre: string, tipo: "gasto" | "ingreso") => {
        setLoading(true);
        await addCategoria(nombre, tipo);
        await fetchCategorias();
        setModalCategoriasVisible(false);
        setLoading(false);
    };

    const categoriasFiltradas = categorias.filter((cat: any) => cat.tipo === tipo);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>

                        <View style={styles.modal}>
                            <Text style={styles.title}>
                                {modoEdicion ? "Editar movimiento" : "Nuevo movimiento"}
                            </Text>

                            <Text style={styles.label}>Tipo</Text>
                            <View style={styles.tipos}>
                                <TouchableOpacity
                                    style={[styles.tipoBoton, tipo === "gasto" && styles.tipoActivo]}
                                    onPress={() => setTipo("gasto")}
                                >
                                    <Text>Gasto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tipoBoton, tipo === "ingreso" && styles.tipoActivo]}
                                    onPress={() => setTipo("ingreso")}
                                >
                                    <Text>Ingreso</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Monto</Text>
                            <TextInput
                                placeholder="Monto"
                                keyboardType="numeric"
                                value={monto}
                                onChangeText={setMonto}
                                style={styles.input}
                            />

                            <Text style={styles.label}>Fecha</Text>
                            <Pressable
                                style={styles.input}
                                onPress={() => setShow(true)}
                            >
                                <Text>
                                    {fecha ? fecha.toLocaleDateString() : "Seleccionar fecha"}
                                </Text>
                            </Pressable>
                            {show && (
                                <DateTimePicker
                                    value={fecha || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(_, f) => {
                                        setShow(false);
                                        f && setFecha(f);
                                    }}
                                />
                            )}

                            <Text style={styles.label}>Categorías</Text>
                            <ScrollView
                                style={{ maxHeight: 120 }}
                            >
                                <View style={styles.categorias}>
                                    {categoriasFiltradas.map(
                                        (cat: any) => (
                                            <Pressable
                                                key={cat.id}
                                                style={[
                                                    styles.categoria,
                                                    categoriaId === cat.id &&
                                                    styles.categoriaActiva
                                                ]}
                                                onPress={() => setCategoriaId(cat.id)}
                                            >
                                                <Text>{cat.nombre}</Text>
                                            </Pressable>
                                        )
                                    )}
                                    <TouchableOpacity
                                        style={styles.categoria}
                                        onPress={() => {
                                            setCategoriaId("");
                                            setModalCategoriasVisible(true);
                                        }}>
                                        <Text>Otra</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                placeholder="Descripción"
                                value={descripcion}
                                onChangeText={setDescripcion}
                                style={styles.input}
                            />

                            <TouchableOpacity
                                style={styles.button}
                                onPress={guardarMovimiento}
                            >
                                <Text style={styles.buttonText}>
                                    {modoEdicion ? "Guardar cambios" : "Guardar movimiento"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>

            <CategoriaModal
                visible={modalCategoriasVisible}
                onClose={() => {
                    setModalCategoriasVisible(false);
                }}
                onSave={guardarCategoria}
                modoEdicion={false}
                loading={loading}
                activo={false}
                tipoCategoria={tipo}
            />
            <Loader visible={loading} />
        </Modal >
    );
}

const styles = StyleSheet.create({

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

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
    },

    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: "600",
    },

    tipos: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 15,
    },

    tipoBoton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
    },

    tipoActivo: {
        backgroundColor: "#AACDDC",
    },

    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },

    categorias: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 15,
    },

    categoria: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
    },

    categoriaActiva: {
        backgroundColor: "#AACDDC",
    },

    button: {
        backgroundColor: "#81A6C6",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },
});
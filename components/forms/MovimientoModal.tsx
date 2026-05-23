import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Modal,
    Pressable, ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

import { darkColors, lightColors } from "@/constants/theme";
import { useTheme } from "@/src/context/ThemeContext";
import { useCategorias } from "@/src/hooks/useCategorias";
import { useMovimientos } from "@/src/hooks/useMovimientos";
import dayjs from 'dayjs';
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
    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;
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
            setFecha(dayjs(movimiento.fecha, "YYYY-MM-DD").toDate());
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
        } else if (parseFloat(monto) <= 0) {
            Alert.alert("Error", "El monto tiene que ser mayor a 0");
            return;
        } else if (!fecha) {
            Alert.alert("Error", "Selecciona una fecha");
            return;
        } else if (!categoriaId) {
            Alert.alert("Error", "Selecciona una categoría");
            return;
        }
        const fechaFormat = dayjs(fecha).format('YYYY-MM-DD');

        if (dayjs(fechaFormat).isAfter(dayjs(), "day")) {
            Alert.alert("Error", "No puedes registrar movimientos futuros");
            return;
        }
        setLoading(true);
        const data = {
            monto: parseFloat(monto),
            descripcion,
            categoria_id: categoriaId,
            tipo,
            fecha: fechaFormat,
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
                <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                    <TouchableWithoutFeedback>

                        <View style={[styles.modal, { backgroundColor: colors.fondo }]}>
                            <Text style={[styles.title, { color: colors.text }]}>
                                {modoEdicion ? "Editar movimiento" : "Nuevo movimiento"}
                            </Text>

                            <Text style={[styles.label, { color: colors.text }]}>Tipo</Text>
                            <View style={styles.tipos}>
                                <TouchableOpacity
                                    style={[styles.tipoBoton, { backgroundColor: colors.chip }, tipo === "gasto" && { backgroundColor: colors.principal }]}
                                    onPress={() => {
                                        setTipo("gasto");
                                        setCategoriaId("");
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>Gasto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tipoBoton, { backgroundColor: colors.chip }, tipo === "ingreso" && { backgroundColor: colors.principal }]}
                                    onPress={() => {
                                        setTipo("ingreso");
                                        setCategoriaId("");
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>Ingreso</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.label, { color: colors.text }]}>Monto</Text>
                            <TextInput
                                placeholder="Monto"
                                placeholderTextColor={colors.text}
                                keyboardType="numeric"
                                value={monto}
                                onChangeText={setMonto}
                                style={[styles.input, { borderColor: colors.principal, color: colors.text }]}
                            />

                            <Text style={[styles.label, { color: colors.text }]}>Fecha</Text>
                            <Pressable
                                style={[styles.input, { borderColor: colors.principal }]}
                                onPress={() => setShow(true)}
                            >
                                <Text style={{ color: colors.text }}>
                                    {fecha ? dayjs(fecha).format("DD/MM/YYYY") : "Seleccionar fecha"}
                                </Text>
                            </Pressable>
                            {show && (
                                <DateTimePicker
                                    value={fecha || new Date()}
                                    mode="date"
                                    display="default"
                                    maximumDate={new Date()}
                                    onChange={(_, f) => {
                                        setShow(false);
                                        f && setFecha(f);
                                    }}
                                />
                            )}

                            <Text style={[styles.label, { color: colors.text }]}>Categorías</Text>
                            <ScrollView
                                style={{ maxHeight: 120 }}
                            >
                                <View style={styles.categorias}>
                                    {categoriasFiltradas.map(
                                        (cat: any) => (
                                            <Pressable
                                                key={cat.id}
                                                style={[
                                                    styles.categoria, { backgroundColor: colors.chip, borderColor: colors.principal },
                                                    categoriaId === cat.id &&
                                                    { backgroundColor: colors.principal }
                                                ]}
                                                onPress={() => setCategoriaId(cat.id)}
                                            >
                                                <Text style={{ color: colors.text }}>{cat.nombre}</Text>
                                            </Pressable>
                                        )
                                    )}
                                    <TouchableOpacity
                                        style={[styles.categoria, { backgroundColor: colors.chip, borderColor: colors.principal }]}
                                        onPress={() => {
                                            setCategoriaId("");
                                            setModalCategoriasVisible(true);
                                        }}>
                                        <Text style={{ color: colors.text }}>Otra</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                            <Text style={[styles.label, { color: colors.text }]}>Descripción</Text>
                            <TextInput
                                placeholder="Descripción"
                                placeholderTextColor={colors.text}
                                value={descripcion}
                                onChangeText={setDescripcion}
                                style={[styles.input, { borderColor: colors.principal, color: colors.text }]}
                            />

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.principal }]}
                                onPress={guardarMovimiento}
                            >
                                <Text style={[styles.buttonText, { color: colors.text }]}>
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
                categorias={categorias}
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
        justifyContent: "flex-end",
    },

    modal: {
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
        alignItems: "center",
    },

    input: {
        borderWidth: 1,
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
        borderWidth: 1,
    },

    button: {
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        fontWeight: "700",
    },
});
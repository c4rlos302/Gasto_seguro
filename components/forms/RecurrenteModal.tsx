import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput,
    TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";

import dayjs from "dayjs";

import { Loader } from "../loader";
import CategoriaModal from "./CategoriaModal";

import { useCategorias } from "@/src/hooks/useCategorias";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    recurrente?: any;
    recurrentes?: any[];
    modoEdicion?: boolean;
}

export default function RecurrenteModal({
    visible,
    onClose,
    onSave,
    recurrente,
    recurrentes,
    modoEdicion = false,
}: Props) {

    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;

    const { categorias, fetchCategorias, addCategoria } = useCategorias();

    const [loading, setLoading] = useState(false);

    const [nombre, setNombre] = useState("");
    const [monto, setMonto] = useState("");
    const [tipo, setTipo] = useState<"gasto" | "ingreso">("gasto");
    const [frecuencia, setFrecuencia] = useState("mensual");
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [categoriaId, setCategoriaId] = useState("");

    const [show, setShow] = useState(false);
    const [modalCategoria, setModalCategoria] = useState(false);

    const frecuencias = [
        "diario",
        "semanal",
        "quincenal",
        "mensual",
        "anual",
    ];

    useFocusEffect(
        useCallback(() => {
            fetchCategorias();
        }, [])
    );

    useEffect(() => {

        if (visible && recurrente) {
            setNombre(recurrente.nombre);
            setMonto(recurrente.monto.toString());
            setTipo(recurrente.tipo);
            setFrecuencia(recurrente.frecuencia);
            setCategoriaId(recurrente.categoria_id);
            setFechaInicio(
                dayjs(recurrente.fecha_inicio).toDate()
            );
        }

        if (visible && !recurrente) {
            limpiar();
        }

    }, [visible, recurrente]);

    const limpiar = () => {
        setNombre("");
        setMonto("");
        setTipo("gasto");
        setFrecuencia("mensual");
        setFechaInicio(new Date());
        setCategoriaId("");
    };

    const normalizar = (texto: string) =>
        texto
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const guardar = async () => {
        const existeRecurrente = recurrentes?.some((r: any) => {
            if (modoEdicion && recurrente?.id === r.id) {
                return false;
            }

            return (normalizar(r.nombre) === normalizar(nombre));
        });

        if (!nombre.trim()) {
            Alert.alert("Error", "Escribe un nombre");
            return;
        } else if (existeRecurrente) {
            Alert.alert("Error", "Ya existe un presupuesto con ese nombre");
            return;
        } else if (!monto) {
            Alert.alert("Error", "Escribe un monto");
            return;
        } else if (!monto || parseFloat(monto) <= 0) {
            Alert.alert("Error", "Escribe un monto mayor a 0");
            return;
        } else if (!categoriaId) {
            Alert.alert("Error", "Selecciona una categoría");
            return;
        }

        setLoading(true);

        await onSave({
            nombre: nombre,
            monto: parseFloat(monto),
            tipo: tipo,
            frecuencia: frecuencia,
            categoria_id: categoriaId,
            fecha_inicio: dayjs(fechaInicio).format("YYYY-MM-DD"),
            activo: true,
        });

        setLoading(false);

        limpiar();
        onClose();
    };

    const guardarCategoria = async (nombre: string, tipo: "gasto" | "ingreso") => {

        setLoading(true);

        await addCategoria(nombre, tipo);
        await fetchCategorias();

        setLoading(false);
        setModalCategoria(false);
    };

    const categoriasFiltradas = categorias.filter((c: any) => c.tipo === tipo);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <TouchableWithoutFeedback onPress={onClose}>

                <View style={[styles.overlay, { backgroundColor: colors.overlay }]} >
                    <TouchableWithoutFeedback>
                        <View style={[styles.modal, { backgroundColor: colors.fondo }]} >

                            <Text style={[styles.title, { color: colors.text }]} >
                                {modoEdicion ? "Editar movimiento recurrente" : "Nuevo movimiento recurrente"}
                            </Text>

                            <Text style={[styles.label, { color: colors.text }]}>
                                Nombre
                            </Text>

                            <TextInput
                                value={nombre}
                                onChangeText={setNombre}
                                placeholder="Asigna un nombre al movimiento"
                                placeholderTextColor={colors.text}
                                style={[
                                    styles.input,
                                    { borderColor: colors.principal, color: colors.text }
                                ]}
                            />

                            <Text style={[styles.label, { color: colors.text }]}>
                                Tipo
                            </Text>

                            <View style={styles.tipos}>
                                <TouchableOpacity
                                    style={[
                                        styles.tipoBoton,
                                        { backgroundColor: colors.chip },
                                        tipo === "gasto" &&
                                        { backgroundColor: colors.principal }
                                    ]}
                                    onPress={() => {
                                        setTipo("gasto");
                                        setCategoriaId("");
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>
                                        Gasto
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.tipoBoton,
                                        { backgroundColor: colors.chip },
                                        tipo === "ingreso" &&
                                        { backgroundColor: colors.principal }
                                    ]}
                                    onPress={() => {
                                        setTipo("ingreso");
                                        setCategoriaId("");
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>
                                        Ingreso
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.label, { color: colors.text }]}>
                                Monto
                            </Text>

                            <TextInput
                                keyboardType="numeric"
                                value={monto}
                                onChangeText={setMonto}
                                style={[
                                    styles.input,
                                    { borderColor: colors.principal, color: colors.text }
                                ]}
                            />

                            <Text style={[styles.label, { color: colors.text }]}>
                                Frecuencia
                            </Text>

                            <View style={styles.categorias}>
                                {frecuencias.map((f) => (
                                    <Pressable
                                        key={f}
                                        style={[
                                            styles.categoria,
                                            {
                                                backgroundColor: colors.chip,
                                                borderColor: colors.principal
                                            },
                                            frecuencia === f &&
                                            {
                                                backgroundColor:
                                                    colors.principal
                                            }
                                        ]}
                                        onPress={() => setFrecuencia(f)}
                                    >
                                        <Text style={{ color: colors.text }} >
                                            {f}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>

                            <Text style={[styles.label, { color: colors.text }]}>
                                Fecha inicio
                            </Text>

                            <Pressable
                                style={[
                                    styles.input,
                                    { borderColor: colors.principal }
                                ]}
                                onPress={() => setShow(true)}
                            >
                                <Text style={{ color: colors.text }}>
                                    {dayjs(fechaInicio).format("DD/MM/YYYY")}
                                </Text>
                            </Pressable>

                            {show && (
                                <DateTimePicker
                                    value={fechaInicio}
                                    mode="date"
                                    maximumDate={new Date()}
                                    onChange={(_, d) => {
                                        setShow(false);
                                        d && setFechaInicio(d);
                                    }}
                                />
                            )}

                            <Text style={[styles.label, { color: colors.text }]}>
                                Categoría
                            </Text>

                            <ScrollView style={{ maxHeight: 120 }} >
                                <View style={styles.categorias}>

                                    {categoriasFiltradas.map(
                                        (cat: any) => (
                                            <Pressable
                                                key={cat.id}
                                                style={[
                                                    styles.categoria,
                                                    {
                                                        backgroundColor: colors.chip,
                                                        borderColor: colors.principal
                                                    },
                                                    categoriaId === cat.id &&
                                                    {
                                                        backgroundColor: colors.principal
                                                    }
                                                ]}
                                                onPress={() => setCategoriaId(cat.id)}
                                            >
                                                <Text style={{ color: colors.text }} >
                                                    {cat.nombre}
                                                </Text>
                                            </Pressable>
                                        )
                                    )}

                                    <TouchableOpacity
                                        style={[
                                            styles.categoria,
                                            {
                                                backgroundColor: colors.chip,
                                                borderColor: colors.principal
                                            }
                                        ]}
                                        onPress={() => setModalCategoria(true)}
                                    >
                                        <Text style={{ color: colors.text }} >
                                            Otra
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </ScrollView>
                            <View style={styles.botons}>
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: colors.fondo }]}
                                    onPress={onClose}
                                >
                                    <Text style={[styles.buttonText, { color: colors.text }]} >
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: colors.principal }]}
                                    onPress={guardar}
                                >
                                    <Text style={[styles.buttonText, { color: colors.text }]} >
                                        {modoEdicion ? "Guardar cambios" : "Guardar"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>

            <CategoriaModal
                visible={modalCategoria}
                onClose={() => setModalCategoria(false)}
                onSave={guardarCategoria}
                categorias={categorias}
                tipoCategoria={tipo}
            />

            <Loader visible={loading} />
        </Modal>
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

    botons: {
        display: "flex",
        flexDirection: "row",
    },

    button: {
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        width: "50%",
        marginTop: 10,
    },

    buttonText: {
        fontWeight: "700",
    },
});
import { useState } from "react";
import {
    Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet,
    TextInput, Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
    visible: boolean;
    onClose: () => void;
    tipoFiltro: string;
    setTipoFiltro: (value: string) => void;
    categorias: any[];
    categoriasFiltro: string[];
    seleccionarCategoria: (id: string) => void;
    montoMin: string;
    setMontoMin: (value: string) => void;
    montoMax: string;
    setMontoMax: (value: string) => void;
    fechaInicio: Date | null;
    setFechaInicio: (value: Date | null) => void;
    fechaFin: Date | null;
    setFechaFin: (value: Date | null) => void;
    limpiarFiltros: () => void;
}

export default function FiltroMovimientosModal({

    visible,
    onClose,

    tipoFiltro,
    setTipoFiltro,

    categorias,
    categoriasFiltro,
    seleccionarCategoria,

    montoMin,
    setMontoMin,

    montoMax,
    setMontoMax,

    fechaInicio,
    setFechaInicio,

    fechaFin,
    setFechaFin,

    limpiarFiltros,

}: Props) {

    const [
        mostrarCalendarioInicio,
        setMostrarCalendarioInicio
    ] = useState(false);

    const [
        mostrarCalendarioFin,
        setMostrarCalendarioFin
    ] = useState(false);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <TouchableWithoutFeedback onPress={onClose} >
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modal}>

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Filtros</Text>
                                <TouchableOpacity onPress={onClose} >
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
                                    onPress={limpiarFiltros}
                                >
                                    <Text>Limpiar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.applyBtn}
                                    onPress={onClose}
                                >
                                    <Text style={{ color: "#fff" }}>Aplicar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
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
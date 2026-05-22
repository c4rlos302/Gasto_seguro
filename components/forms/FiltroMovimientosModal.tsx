import { useState } from "react";
import {
    Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet,
    TextInput, Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";

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
    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;

    const [mostrarCalendarioInicio, setMostrarCalendarioInicio] = useState(false);
    const [mostrarCalendarioFin, setMostrarCalendarioFin] = useState(false);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
        >
            <TouchableWithoutFeedback onPress={onClose} >
                <View style={[styles.overlay, {backgroundColor: colors.overlay}]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modal, {backgroundColor: colors.fondo}]}>

                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, {color: colors.text}]}>Filtros</Text>
                                <TouchableOpacity onPress={onClose} >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color={colors.text}
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.label, {color: colors.text}]}>Tipo</Text>
                            <View style={styles.chips}>
                                <TouchableOpacity
                                    style={[
                                        styles.chip, {backgroundColor: colors.chip, borderColor: colors.principal},
                                        tipoFiltro === "gasto" && {backgroundColor: colors.principal}
                                    ]}
                                    onPress={() => setTipoFiltro(
                                        tipoFiltro === "gasto" ? "" : "gasto"
                                    )
                                    }
                                >
                                    <Text style={{color: colors.text}}>Gasto</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.chip, {backgroundColor: colors.chip, borderColor: colors.principal},
                                        tipoFiltro === "ingreso" && {backgroundColor: colors.principal}
                                    ]}
                                    onPress={() => setTipoFiltro(
                                        tipoFiltro === "ingreso" ? "" : "ingreso"
                                    )
                                    }
                                >
                                    <Text style={{color: colors.text}}>Ingreso</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.label, {color: colors.text}]}>Categoría</Text>
                            <View style={styles.chips}>
                                {categorias.map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.chip, {backgroundColor: colors.chip, borderColor: colors.principal},
                                            categoriasFiltro.includes(cat.id) &&
                                            {backgroundColor: colors.principal}
                                        ]}
                                        onPress={() => seleccionarCategoria(cat.id)}
                                    >
                                        <Text style={{color: colors.text}}>{cat.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.label, {color: colors.text}]}>Monto</Text>
                            <View style={styles.inputs}>
                                <TextInput
                                    placeholder="Mínimo"
                                    placeholderTextColor={colors.text}
                                    keyboardType="numeric"
                                    value={montoMin}
                                    onChangeText={setMontoMin}
                                    style={[styles.input, {borderColor: colors.principal, color: colors.text}]}
                                />
                                <TextInput
                                    placeholder="Máximo"
                                    placeholderTextColor={colors.text}
                                    keyboardType="numeric"
                                    value={montoMax}
                                    onChangeText={setMontoMax}
                                    style={[styles.input, {borderColor: colors.principal, color: colors.text}]}
                                />
                            </View>

                            <Text style={[styles.label, {color: colors.text}]}>Fecha</Text>
                            <View style={styles.inputs}>
                                <Pressable style={[styles.input, {borderColor: colors.principal}]} onPress={() => setMostrarCalendarioInicio(true)} >
                                    <Text style={{color: colors.text}}>
                                        {fechaInicio ? fechaInicio.toLocaleDateString() : "Inicio"}
                                    </Text>
                                </Pressable>
                                {mostrarCalendarioInicio && (
                                    <DateTimePicker
                                        value={fechaInicio || new Date()}
                                        mode="date"
                                        display="default"
                                        maximumDate={new Date()}
                                        onChange={(_, f) => {
                                            setMostrarCalendarioInicio(false);
                                            f && setFechaInicio(f);
                                        }}
                                    />
                                )}

                                <Pressable style={[styles.input, {borderColor: colors.principal}]} onPress={() => setMostrarCalendarioFin(true)} >
                                    <Text style={{color: colors.text}}>
                                        {fechaFin ? fechaFin.toLocaleDateString() : "Fin"}
                                    </Text>
                                </Pressable>
                                {mostrarCalendarioFin && (
                                    <DateTimePicker
                                        value={fechaFin || new Date()}
                                        mode="date"
                                        display="default"
                                        maximumDate={new Date()}
                                        onChange={(_, f) => {
                                            setMostrarCalendarioFin(false);
                                            f && setFechaFin(f);
                                        }}
                                    />
                                )}
                            </View>

                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.clearBtn, {backgroundColor: colors.chip}]}
                                    onPress={limpiarFiltros}
                                >
                                    <Text style={{color: colors.text}}>Limpiar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.applyBtn, {backgroundColor: colors.principal}]}
                                    onPress={onClose}
                                >
                                    <Text style={{ color: Colors.blanco}}>Aplicar</Text>
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
        justifyContent: "flex-end",
    },
    modal: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        maxHeight: "100%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
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
        borderWidth: 1,
    },
    
    inputs: {
        flexDirection: "row",
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
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
        alignItems: "center",
    },
    applyBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
})
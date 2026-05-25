import {
    StyleSheet, Text, TouchableOpacity, Pressable,
    ScrollView, View, Alert
} from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from 'react'
import { useFocusEffect } from "expo-router";
import { useCategorias } from '@/src/hooks/useCategorias';
import CategoriaModal from '@/components/forms/CategoriaModal';
import Header from '@/components/ui/Header'
import { CardContainer, CardView } from '@/components/ui/Card'
import { Loader } from '@/components/loader';
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from "@/constants/colors";

export default function Categorias() {
    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;

    const { categorias, fetchCategorias, addCategoria, editCategoria, removeCategoria } = useCategorias();
    const categoriasGasto = categorias?.filter((cat: any) => cat.tipo === "gasto");
    const categoriasIngreso = categorias?.filter((cat: any) => cat.tipo === "ingreso");

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<any | null>(null);
    const [modoEdicion, setModoEdicion] = useState(false);

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

    const guardarCategoria = async (nombre: string, tipo: "gasto" | "ingreso") => {

        setLoading(true);

        if (modoEdicion && categoriaSeleccionada) {
            await editCategoria(categoriaSeleccionada.id, nombre, tipo);
        } else {
            await addCategoria(nombre, tipo);
        }

        setLoading(false);
        setModalVisible(false);
        setModoEdicion(false);
        setCategoriaSeleccionada(null);
    };

    const eliminarCategoria = async () => {
        if (!categoriaSeleccionada) {
            return;
        }
        Alert.alert(
            "Eliminar categoría",
            `¿Estas seguro de eliminar la categoría ${categoriaSeleccionada.nombre}?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                    onPress: () => { setCategoriaSeleccionada(null); }
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        await removeCategoria(categoriaSeleccionada.id);
                        setCategoriaSeleccionada(null);
                        setLoading(false);
                        Alert.alert("Completado", "Elemento borrado con exito");
                    }
                }
            ]
        )
    }

    return (
        <CardContainer>
            <Header title="Categorias" regresar />
            <CardView>
                <Text style={[styles.label, { color: colors.text }]}>Tipo Gasto:</Text>
                <ScrollView style={{ maxHeight: 125 }}>
                    <View style={styles.categorias}>
                        {categoriasGasto?.map((cat: any) => (
                            <Pressable
                                key={cat.id}
                                disabled={cat.usuario_id === null}
                                style={[
                                    styles.categoria,
                                    { backgroundColor: colors.fondo, borderColor: colors.principal },
                                    categoriaSeleccionada?.id === cat.id &&
                                    { backgroundColor: colors.principal, borderColor: colors.fondo },
                                    cat.usuario_id === null && { backgroundColor: colors.fondo }
                                ]}
                                onPress={() => setCategoriaSeleccionada(cat)}
                            >
                                {<Text style={{ color: colors.text }}>
                                    {cat.usuario_id === null && " 🔒"}
                                    {cat.nombre}
                                </Text>}
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
                <Text style={[styles.label, {color: colors.text}]} >Tipo Ingreso:</Text>
                <ScrollView style={{ maxHeight: 125 }}>
                    <View style={styles.categorias}>
                        {categoriasIngreso?.map((cat: any) => (
                            <Pressable
                                key={cat.id}
                                disabled={cat.usuario_id === null}
                                style={[
                                    styles.categoria,
                                    { backgroundColor: colors.fondo, borderColor: colors.principal },
                                    categoriaSeleccionada?.id === cat.id &&
                                    { backgroundColor: colors.principal, borderColor: colors.fondo },
                                    cat.usuario_id === null && { backgroundColor: colors.fondo }
                                ]}
                                onPress={() => setCategoriaSeleccionada(cat)}
                            >
                                {<Text style={{ color: colors.text }}>
                                    {cat.usuario_id === null && " 🔒"}
                                    {cat.nombre}
                                </Text>}
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </CardView>
            <CardView>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                        setCategoriaSeleccionada(null);
                        setModoEdicion(false);
                        setModalVisible(true);
                    }}
                >
                    <Ionicons name="add" size={20} color={Colors.principalLight} />
                    <Text style={[styles.optionText, {color: colors.text}]} >Crear categoria</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
                </TouchableOpacity>
            </CardView>
            <CardView>
                <TouchableOpacity
                    style={styles.option}
                    disabled={!categoriaSeleccionada}
                    onPress={() => {
                        setModoEdicion(true);
                        setModalVisible(true);
                    }}
                >
                    <Ionicons name="create" size={20} color={Colors.principalLight} />
                    <Text style={[styles.optionText, {color: colors.text}]} >Modificar categoria</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
                </TouchableOpacity>
            </CardView>
            <CardView>
                <TouchableOpacity
                    style={styles.option}
                    disabled={!categoriaSeleccionada}
                    onPress={eliminarCategoria}
                >
                    <Ionicons name="remove" size={20} color={Colors.principalLight} />
                    <Text style={[styles.optionText, {color: colors.text}]} >Eliminar categoria</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.principalLight} />
                </TouchableOpacity>
            </CardView>
            <CategoriaModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setModoEdicion(false);
                    setCategoriaSeleccionada(null);
                }}
                onSave={guardarCategoria}
                categorias={categorias}
                categoria={categoriaSeleccionada}
                modoEdicion={modoEdicion}
                loading={loading}
            />
            <Loader visible={loading} />
        </CardContainer>

    )
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

    categorias: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },

    categoria: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        display: "flex",
        flexDirection: "row",
    },

    label: {
        marginVertical: 15,
        fontSize: 20,
        fontWeight: "600",
    },

})

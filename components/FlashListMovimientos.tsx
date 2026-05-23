import { useCategorias } from '@/src/hooks/useCategorias'
import { Movimiento } from '@/src/types/movimiento'
import { formatFecha } from '@/src/utils/fecha'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";
import { Colors } from '@/constants/colors'
import { useFocusEffect } from 'expo-router'

interface Props {
    movimientos: Movimiento[];
    touch?: boolean;
    onSelect?: (movimiento: Movimiento) => void;
    movimientoSeleccionado?: Movimiento | null;
}

export default function FlashListMovimientos({
    movimientos,
    touch = false,
    onSelect,
    movimientoSeleccionado,
}: Props) {
    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;
    const { categorias, fetchCategorias } = useCategorias();
    const categoriasMap = useMemo(() => {
        return categorias.reduce(
            (acc: any, cat: any) => {
                acc[cat.id] = cat.nombre;
                return acc;
            }, {});
    }, [categorias]);

    useFocusEffect(
        useCallback(() => {
            const cargar = async () => {
                await fetchCategorias();
            };

            cargar();
        }, [])
    );

    const renderContenido = (m: Movimiento) => (
        <View style={[styles.movimiento, { borderBottomColor: colors.principal },
        movimientoSeleccionado?.id === m.id &&
        { borderRadius: 12, backgroundColor: colors.secundario }
        ]}>
            <View style={[styles.icono, { backgroundColor: colors.principal }]}>
                <Ionicons
                    name={m.tipo === "gasto" ? "card" : "trending-up"}
                    size={18}
                    color={Colors.blanco}
                />
            </View>

            <View style={styles.info}>
                <Text style={[styles.categoria, { color: colors.text }]}>
                    {categoriasMap[m.categoria_id] || "Sin categoría"}
                </Text>

                <Text style={[styles.descripcion, { color: colors.textSecondary }]}>
                    {m.descripcion || "Sin descripción"}
                </Text>

                <Text style={[styles.fecha, { color: colors.textSecondary }]}>
                    {formatFecha(m.fecha)}
                </Text>
            </View>

            <Text style={[styles.monto, { color: Colors.principalLight }]}>
                {m.tipo === "gasto" ? "-" : "+"} $ {parseFloat(m.monto).toFixed(2)}
            </Text>
        </View>

    );
    return (
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <FlashList
                data={movimientos}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: m }) => (
                    touch ? (
                        <Pressable onPress={() => onSelect?.(m)}>
                            {renderContenido(m)}
                        </Pressable>
                    ) : (renderContenido(m))
                )}

                ItemSeparatorComponent={() => (
                    <View style={{ height: 10 }} />
                )}

                ListEmptyComponent={() => (
                    <View style={styles.empty}>
                        <Ionicons
                            name="wallet-outline"
                            size={60}
                            color={colors.principal}
                        />
                        <Text style={[styles.emptyText, { color: colors.text }]}>No hay movimientos</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    movimiento: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        padding: 10,
    },
    icono: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    categoria: {
        fontSize: 15,
        fontWeight: "700",
    },
    descripcion: {
        fontSize: 13,
        marginTop: 2,
    },
    fecha: {
        fontSize: 12,
        marginTop: 4,
    },
    monto: {
        fontSize: 16,
        fontWeight: "700",
    },
    empty: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 80,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 15,
    },
})
import { useCategorias } from '@/src/hooks/useCategorias'
import { Movimiento } from '@/src/types/movimiento'
import { formatFecha } from '@/src/utils/fecha'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import React, { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface Props {
    movimientos: Movimiento[];

    touch?: boolean;

    onSelect?: (
        movimiento: Movimiento
    ) => void;

    movimientoSeleccionado?: Movimiento | null;
}

export default function FlashListMovimientos({
    movimientos,
    touch = false,
    onSelect,
    movimientoSeleccionado,
}: Props) {
    const { categorias } = useCategorias();
    const categoriasMap = useMemo(() => {
        return categorias.reduce(
            (acc: any, cat: any) => {

                acc[cat.id] = cat.nombre;

                return acc;

            },
            {}
        );
    }, [categorias]);

    const renderContenido = (
        m: Movimiento
    ) => (

        <View style={[styles.movimiento,
        movimientoSeleccionado?.id === m.id &&
        styles.movimientoActivo
        ]}>
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
                    {formatFecha(m.fecha)}
                </Text>
            </View>

            <Text style={styles.monto}>
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
                    ) : ( renderContenido(m) )
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
    )
}

const styles = StyleSheet.create({
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
    movimientoActivo: {
        backgroundColor: "#e9f3ff",
        borderRadius: 12,
    },
})
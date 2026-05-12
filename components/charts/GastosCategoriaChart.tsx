import React, { useMemo } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { PieChart } from "react-native-chart-kit";

import { useCategorias } from "@/src/hooks/useCategorias";
import { CardView } from "../ui/Card";

interface Props {
    movimientos: any[];
    title?: boolean;
}

export default function GastosCategoriaChart({
    movimientos,
    title = true,
}: Props) {

    const { categorias } = useCategorias();

    const data = useMemo(() => {

        const gastos = movimientos.filter(
            (m) => m.tipo === "gasto"
        );

        const agrupados: any = {};

        gastos.forEach((mov) => {

            const nombre = mov.categoria_id
                ? categorias.find(
                    (cat: any) =>
                        cat.id === mov.categoria_id
                )?.nombre || "Sin categoría"
                : "Sin categoría";

            if (!agrupados[nombre]) {
                agrupados[nombre] = 0;
            }

            agrupados[nombre] += parseFloat(
                mov.monto
            );
        });

        const colores = [
            "#81A6C6",
            "#AACDDC",
            "#EF4444",
            "#10B981",
            "#F59E0B",
            "#8B5CF6",
            "#EC4899",
        ];

        return Object.keys(agrupados).map(
            (key, index) => ({
                name: key,
                amount: agrupados[key],
                color:
                    key === "Sin categoría"
                        ? "#9CA3AF"
                        : colores[index % colores.length],
                legendFontColor: "#374151",
                legendFontSize: 13,
            })
        );

    }, [movimientos, categorias]);

    if (movimientos.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyText}>
                    No hay gastos registrados
                </Text>
            </View>
        );
    }

    return (
        <View>
            {title && <Text style={styles.title}>
                Gastos por categoría
            </Text>}

            <PieChart
                data={data}
                width={
                    Dimensions.get("window").width - 60
                }
                height={220}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                chartConfig={{
                    color: () => "#000",
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
        color: "#111827",
    },

    empty: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },

    emptyText: {
        color: "#9CA3AF",
    },

});
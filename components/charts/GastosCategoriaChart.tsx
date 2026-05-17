import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useCategorias } from "@/src/hooks/useCategorias";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";

interface Props {
    movimientos: any[];
    title?: boolean;
}

export default function GastosCategoriaChart({ movimientos, title = true, }: Props) {
    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;
    const { categorias } = useCategorias();

    const data = useMemo(() => {
        const gastos = movimientos.filter((m) => m.tipo === "gasto");
        const agrupados: any = {};

        gastos.forEach((mov) => {
            const nombre = mov.categoria_id ? categorias.find(
                (cat: any) => cat.id === mov.categoria_id
            )?.nombre || "Sin categoría" : "Sin categoría";

            if (!agrupados[nombre]) {
                agrupados[nombre] = 0;
            }

            agrupados[nombre] += parseFloat(mov.monto);
        });

        const colores = [
            "#81A6C6",
            "#AACDDC",
            "#EF4444",
            "#10B981",
            "#F59E0B",
            "#8B5CF6",
            "#EC4899",
            "#02A6C6",
        ];

        return Object.keys(agrupados).map(
            (key, index) => ({
                name: key,
                amount: agrupados[key],
                color: key === "Sin categoría" ? "#9CA3AF" : colores[index % colores.length],
                legendFontColor: colors.textSecondary,
                legendFontSize: 13,
            })
        );
    }, [movimientos, categorias]);

    if (movimientos.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={{color: colors.text}}>No hay gastos registrados</Text>
            </View>
        );
    }

    return (
        <View>
            {title && <Text style={[styles.title, {color: colors.text}]}>Gastos por categoría</Text>}

            <PieChart
                data={data}
                width={Dimensions.get("window").width - 60}
                height={220}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                chartConfig={{color: () => colors.textSecondary}}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
    },

    empty: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },

});
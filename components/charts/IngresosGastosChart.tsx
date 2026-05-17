import { Colors } from "@/constants/colors";
import React, { useMemo } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "@/src/context/ThemeContext";
import { darkColors, lightColors } from "@/constants/theme";

interface Props {
    movimientos: any[];
}

export default function IngresosGastosChart({ movimientos }: Props) {
    const { isDark } = useTheme();
    const colors = isDark ? darkColors : lightColors;

    const data = useMemo(() => {
        let ingresos = 0;
        let gastos = 0;
        movimientos.forEach((m) => {
            const monto = parseFloat(m.monto);
            if (m.tipo === "ingreso") {
                ingresos += monto;
            } else {
                gastos += monto;
            }
        });

        return [
            {
                name: "Ingresos",
                amount: ingresos,
                color: Colors.success,
                legendFontColor: colors.textSecondary,
                legendFontSize: 13,
            },
            {
                name: "Gastos",
                amount: gastos,
                color: Colors.error,
                legendFontColor: colors.textSecondary,
                legendFontSize: 13,
            },
        ];

    }, [movimientos]);

    if (movimientos.length === 0) {
        return (
            <View style={styles.empty} >
                <Text style={{color: colors.text}}>
                    No hay movimientos registrados
                </Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={[styles.title, {color: colors.text}]}>
                Ingresos vs Gastos
            </Text>

            <PieChart
                data={data}
                width={Dimensions.get("window").width - 60}
                height={220}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                chartConfig={{
                    color: () => colors.textSecondary,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },

    empty: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
});
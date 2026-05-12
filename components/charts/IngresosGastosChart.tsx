import React, { useMemo } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { CardView } from "../ui/Card";

interface Props {
    movimientos: any[];
}

export default function IngresosGastosChart({ movimientos }: Props) {

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
                color: "#10B981",
                legendFontColor: "#374151",
                legendFontSize: 13,
            },
            {
                name: "Gastos",
                amount: gastos,
                color: "#EF4444",
                legendFontColor: "#374151",
                legendFontSize: 13,
            },
        ];

    }, [movimientos]);

    if (movimientos.length === 0) {
        return (
            <View style={styles.empty} >
                <Text style={styles.emptyText}>
                    No hay movimientos registrados
                </Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={styles.title}>
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
        marginBottom: 10,
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
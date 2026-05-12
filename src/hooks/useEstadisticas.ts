import { useMemo } from "react";

export function useEstadisticas(movimientos: any[], categorias: any[] = []) {

    return useMemo(() => {

        let ingresos = 0;
        let gastos = 0;

        const categoriaMap: Record<string, string> = {};
        categorias.forEach((c) => {
            categoriaMap[c.id] = c.nombre;
        });

        const categoriaGastos: Record<string, number> = {};

        const fechas = movimientos.map(
            (m) => new Date(m.fecha)
        );

        const diasUnicos = new Set(
            fechas.map(f => f.toDateString())
        );

        movimientos.forEach((m) => {

            const monto = parseFloat(m.monto);

            if (m.tipo === "ingreso") {
                ingresos += monto;
            } else {
                gastos += monto;

                categoriaGastos[m.categoria_id] =
                    (categoriaGastos[m.categoria_id] || 0) + monto;
            }

        });

        const balance = ingresos - gastos;

        const topCategoriaId = Object.entries(categoriaGastos)
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        const topCategoria = topCategoriaId
            ? categoriaMap[topCategoriaId]
            : "Sin datos";

        const ahorro = ingresos > 0
            ? (balance / ingresos) * 100
            : 0;

        let totalIngresos = 0;
        let totalGastos = 0;

        movimientos.forEach((m) => {
            if (m.tipo === "ingreso") {
                totalIngresos++;
            } else {
                totalGastos++;
            }
        });

        return {
            ingresos,
            gastos,
            balance,
            ahorro,
            topCategoria,
            totalMovimientos: movimientos.length,
            totalIngresos,
            totalGastos,
        };

    }, [movimientos, categorias]);
}
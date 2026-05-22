import dayjs from "dayjs";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const mapCategorias = (movimientos: any[], categorias: any[]) => {

  const map = categorias.reduce((acc: any, c: any) => {
    acc[c.id] = c.nombre;
    return acc;
  }, {});

  return movimientos.map(m => ({
    ...m,
    categoria_nombre: map[m.categoria_id] || "Sin categoría"
  }));
};

export const exportarPDF = async (
  movimientos: any[],
  categorias: any[],
  periodo?: any,
  feIni?: any,
  feFin?: any,
) => {

  const data = mapCategorias(movimientos, categorias);

  const ingresos = data
    .filter(m => m.tipo === "ingreso")
    .reduce((a, b) => a + parseFloat(b.monto), 0);

  const gastos = data
    .filter(m => m.tipo === "gasto")
    .reduce((a, b) => a + parseFloat(b.monto), 0);

  const balance = ingresos - gastos;

  let msg = "";
  if (periodo) {
    if (periodo === "hoy") {
      msg += "de hoy";
    } else if (periodo === "semana") {
      msg += "de esta semana";
    } else if (periodo === "mes") {
      msg += "de este mes";
    } else if (periodo === "anio") {
      msg += "de este año";
    } else if (periodo === "todos") {
      msg += "generales";
    } else if (periodo === "custom") {
      msg += `del ${feIni} al ${feFin}`;
    }
  }

  const html = `
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 24px;
            background: #f5f7fb;
            color: #111827;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .title {
            font-size: 22px;
            font-weight: bold;
        }

        .subtitle {
            color: #6b7280;
            font-size: 13px;
            margin-top: 4px;
        }

        .cards {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            gap: 10px;
        }

        .card {
            flex: 1;
            background: white;
            padding: 12px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .label {
            font-size: 12px;
            color: #6b7280;
        }

        .value {
            font-size: 16px;
            font-weight: bold;
            margin-top: 4px;
        }

        .income {
            color: #10b981;
        }

        .expense {
            color: #ef4444;
        }

        .balance {
            color: #2563eb;
        }

        @page {
            margin: 24px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
        }

        thead {
            display: table-header-group;
        }

        tfoot {
            display: table-footer-group;
        }

        tr {
            page-break-inside: avoid;
        }

        th {
            background: #2563eb;
            color: white;
            font-size: 12px;
            padding: 10px;
            text-align: left;
        }

        td {
            padding: 10px;
            font-size: 12px;
            border-bottom: 1px solid #eee;
        }

        tr:nth-child(even) {
            background: #f9fafb;
        }
    </style>
</head>

<body>

    <div class="header">
        <div class="title">Reporte Financiero</div>
        <div class="subtitle">Resumen de los movimientos ${msg}</div>
    </div>

    <div class="cards">

        <div class="card">
            <div class="label">Ingresos</div>
            <div class="value income">$${ingresos.toFixed(2)}</div>
        </div>

        <div class="card">
            <div class="label">Balance</div>
            <div class="value balance">$${balance.toFixed(2)}</div>
        </div>

        <div class="card">
            <div class="label">Gastos</div>
            <div class="value expense">$${gastos.toFixed(2)}</div>
        </div>

    </div>

    <table>
        <thead>
            <tr>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Categoría</th>
                <th>Fecha</th>
            </tr>
        </thead>

        <tbody>
            ${data.map(m => `
            <tr>
                <td
                  style="
                    color: ${m.tipo?.trim().toLowerCase() === "ingreso"
      ? "#10b981"
      : "#ef4444"
    };
                    font-weight: bold;
                  "
                >
                  ${m.tipo}
                </td>

                <td>$${parseFloat(m.monto).toFixed(2)}</td>

                <td>${m.categoria_nombre}</td>

                <td>
                    ${dayjs(m.fecha).format("DD/MM/YYYY")}
                </td>
            </tr>
            `).join("")}
        </tbody>
    </table>

</body>

</html>
`;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
};

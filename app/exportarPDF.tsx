import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const exportarPDF = async (movimientos: any[]) => {

    const html = `
    <html>
      <body>
        <h1>Reporte de movimientos</h1>

        <table border="1" style="width:100%; border-collapse: collapse;">
          <tr>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Categoría</th>
            <th>Fecha</th>
          </tr>

          ${movimientos.map(m => `
            <tr>
              <td>${m.tipo}</td>
              <td>$${m.monto}</td>
              <td>${m.categoria_id}</td>
              <td>${new Date(m.fecha).toLocaleDateString()}</td>
            </tr>
          `).join("")}

        </table>
      </body>
    </html>
  `;

    const { uri } = await Print.printToFileAsync({ html });

    await Sharing.shareAsync(uri);
};
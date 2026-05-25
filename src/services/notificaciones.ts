import { getPermissionsAsync, scheduleNotificationAsync } from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function enviarNotificacion(
  titulo: string,
  mensaje: string
) {
  const config = await AsyncStorage.getItem(
    "notificacionesActivas"
  );

  const activas = config ? JSON.parse(config) : true;

  if (!activas) return;

  const permiso =
    await getPermissionsAsync();

  if (permiso.status !== "granted") return;

  await scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensaje,
    },
    trigger: null,
  });
}

export async function verificarPresupuesto(
  ingresos: number,
  gastos: number
) {
  const restante = ingresos - gastos;

  if (gastos >= ingresos) {
    await enviarNotificacion(
      "¡Presupuesto excedido!",
      "Tus gastos superaron el límite de tus ingresos"
    );
  } else if (restante <= 500) {
    await enviarNotificacion(
      "¡Poco dinero disponible!",
      "Te quedan menos de $500"
    );
  }
}


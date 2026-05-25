import * as Notifications from "expo-notifications";

export async function enviarNotificacion(
  titulo: string,
  mensaje: string
) {
  await Notifications.scheduleNotificationAsync({
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
      "Tus gastos alcanzaron el límite de tus ingresos"
    );
  } else if (restante <= 500) {
    await enviarNotificacion(
      "¡Poco dinero disponible!",
      "Te quedan menos de $500"
    );
  }
}


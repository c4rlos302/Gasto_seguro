export const formatFecha = (fecha: string) => {
  const [year, month, day] = fecha.split("-");

  const fechaLocal = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return fechaLocal.toLocaleDateString("es-MX");
};

export const normalize = (d: Date) => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
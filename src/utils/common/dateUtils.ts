// Formatea la fecha en español.
export const formatDate = (value?: string | null) => {
    if (!value) return "____/____/____";

    return new Date(value).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// Valida si una fecha está dentro de un rango.
// Incluye el día completo de inicio y de fin. Si un límite está vacío, no se aplica.
export const isDateInRange = (
    value: string,
    startDate?: string,
    endDate?: string
) => {
    const date = new Date(value);

    if (startDate && date < new Date(`${startDate}T00:00:00`)) {
        return false;
    }

    if (endDate && date > new Date(`${endDate}T23:59:59.999`)) {
        return false;
    }

    return true;
};
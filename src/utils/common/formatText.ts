// Convierte un texto en formato título: ADMIN -> Admin.
export const capitalizeText = (text: string) => {
    if (!text) return "";

    const lowerText = text.toLowerCase();

    return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
};

// Devuelve el texto legible de una opción según su valor.
export const getOptionLabel = (
    value: string | null | undefined,
    options: { label: string; value: string }[]
) => {
    if (!value) return null;

    return options.find((option) => option.value === value)?.label ?? value;
};

// Normaliza un texto para búsquedas: minúsculas, sin tildes y sin espacios sobrantes.
export const normalizeText = (text?: string | null) => {
    if (!text) return "";

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
};
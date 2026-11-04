import type { ChipProps } from "@mui/material";

// Define el color visual del estado del usuario
export const getUserStatusColor = (
    isActive?: boolean
): ChipProps["color"] => {
    if (isActive === false) return "default";

    return "success";
};

// Convierte el estado del usuario en un texto para mostrar
export const getUserStatusLabel = (
    isActive?: boolean
) => {
    if (isActive === false) return "Desactivado";

    return "Activo";
};
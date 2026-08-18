import {
    alpha,
} from "@mui/material";

import type {
    Theme,
} from "@mui/material/styles";

// Estilos reutilizables para tablas y columnas del sistema.
export const getTableStyles = (
    theme: Theme
) => ({
    rowNumber: {
        color:
            theme.palette.text.secondary,
        fontWeight: 700,
    },

    primaryActionButton: {
        backgroundColor:
            alpha(
                theme.palette.primary.main,
                0.08
            ),

        color:
            theme.palette.primary.main,

        borderRadius: "12px",

        "&:hover": {
            backgroundColor:
                alpha(
                    theme.palette.primary.main,
                    0.14
                ),
        },
    },

    neutralActionButton: {
        backgroundColor:
            theme.palette.action.hover,

        color:
            theme.palette.text.secondary,

        borderRadius: "12px",

        "&:hover": {
            backgroundColor:
                theme.palette.action.selected,
        },
    },
});
import { Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";

import type { ChipProps } from "@mui/material";
import type { ReactNode } from "react";

interface CustomChipProps
    extends Omit<ChipProps, "label" | "color"> {
    label: ReactNode;

    // Colores estándar de Material UI:
    // primary, secondary, success, error, warning e info.
    color?: ChipProps["color"];

    // Color personalizado, por ejemplo: #7B1FA2.
    customColor?: string;

    // Colores específicos opcionales.
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;

    fontWeight?: number | string;
}

// Chip reutilizable que permite usar colores del tema o colores personalizados.
const CustomChip = ({
    label,
    color = "default",
    customColor,
    backgroundColor,
    textColor,
    borderColor,
    fontWeight = 600,
    variant = "outlined",
    size = "small",
    sx,
    ...chipProps
}: CustomChipProps) => {
    const resolvedTextColor =
        textColor || customColor;

    const resolvedBorderColor =
        borderColor || customColor;

    const resolvedBackgroundColor =
        backgroundColor ||
        (
            customColor
                ? alpha(
                    customColor,
                    variant === "filled"
                        ? 0.16
                        : 0.06
                )
                : undefined
        );

    const baseStyles = {
        fontWeight,

        ...(resolvedTextColor && {
            color: resolvedTextColor,
        }),

        ...(resolvedBorderColor && {
            borderColor: resolvedBorderColor,
        }),

        ...(resolvedBackgroundColor && {
            backgroundColor:
                resolvedBackgroundColor,
        }),

        ...(resolvedTextColor && {
            "& .MuiChip-icon": {
                color: resolvedTextColor,
            },

            "& .MuiChip-deleteIcon": {
                color: resolvedTextColor,
                opacity: 0.75,

                "&:hover": {
                    color: resolvedTextColor,
                    opacity: 1,
                },
            },
        }),
    };

    return (
        <Chip
            {...chipProps}
            label={label}
            size={size}
            variant={variant}
            color={
                customColor
                    ? "default"
                    : color
            }
            sx={[
                baseStyles,
                ...(Array.isArray(sx)
                    ? sx
                    : sx
                        ? [sx]
                        : []),
            ]}
        />
    );
};

export default CustomChip;
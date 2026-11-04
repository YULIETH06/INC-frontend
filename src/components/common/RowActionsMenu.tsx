import {
    useState,
} from "react";

import type {
    MouseEvent,
} from "react";

import type {
    SxProps,
    Theme,
} from "@mui/material";

import {
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";

import {
    appIcons,
} from "../../icons/appIcons";

import type {
    AppIconName,
} from "../../icons/appIcons";

import IconActionButton from "./IconActionButton";

// Opción que se muestra dentro del menú de acciones de una fila.
export interface RowActionOption {
    label: string;
    icon: AppIconName;
    onClick: () => void;

    // Deshabilita la opción.
    disabled?: boolean;

    // Texto informativo que aparece al pasar el mouse sobre la opción.
    tooltip?: string;

    // "error" se usa para acciones delicadas, como desactivar.
    color?: "default" | "error";
}

interface RowActionsMenuProps {
    options: RowActionOption[];
    tooltip?: string;
    loading?: boolean;
    disabled?: boolean;
    sx?: SxProps<Theme>;
}

// Botón de "más opciones" que agrupa las acciones de una fila de tabla.
const RowActionsMenu = ({
    options,
    tooltip = "Más opciones",
    loading = false,
    disabled = false,
    sx,
}: RowActionsMenuProps) => {
    const [
        anchorEl,
        setAnchorEl,
    ] = useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);

    // Abre el menú junto al botón.
    const handleOpenMenu = (
        event: MouseEvent<HTMLElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    // Cierra el menú.
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Cierra el menú y ejecuta la acción seleccionada.
    // Si la opción está deshabilitada no hace nada.
    const handleSelectOption = (
        option: RowActionOption
    ) => {
        if (option.disabled) {
            return;
        }

        handleCloseMenu();
        option.onClick();
    };

    return (
        <>
            <IconActionButton
                icon="moreOptions"
                tooltip={tooltip}
                loading={loading}
                disabled={disabled}
                active={open}
                onClick={handleOpenMenu}
                sx={sx}
            />

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 230,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow:
                                "0 16px 38px rgba(15, 23, 42, 0.10)",
                        },
                    },
                }}
            >
                {options.map((option) => {
                    const IconComponent =
                        appIcons[option.icon];

                    const isError =
                        option.color === "error";

                    return (
                        <Tooltip
                            key={option.label}
                            title={option.tooltip ?? ""}
                            placement="left"
                            arrow
                        >
                            <MenuItem
                                onClick={() =>
                                    handleSelectOption(
                                        option
                                    )
                                }
                                aria-disabled={option.disabled}
                                sx={{
                                    mx: 1,
                                    my: 0.25,
                                    borderRadius: 2,
                                    color: isError
                                        ? "error.main"
                                        : "text.primary",

                                    // Se ve deshabilitada, pero permite mostrar el tooltip.
                                    ...(option.disabled && {
                                        opacity: 0.45,
                                        cursor: "not-allowed",
                                        "&:hover": {
                                            backgroundColor: "transparent",
                                        },
                                    }),
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 34,
                                        color: isError
                                            ? "error.main"
                                            : "primary.main",
                                    }}
                                >
                                    <IconComponent fontSize="small" />
                                </ListItemIcon>

                                <ListItemText
                                    primary={option.label}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                            },
                                        },
                                    }}
                                />
                            </MenuItem>
                        </Tooltip>
                    );
                })}
            </Menu>
        </>
    );
};

export default RowActionsMenu;
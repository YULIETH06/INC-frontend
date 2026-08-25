import {
    Button,
    CircularProgress,
    Tooltip,
    useMediaQuery,
} from "@mui/material";

import type {
    ButtonProps,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
    appIcons,
} from "../../icons/appIcons";

import type {
    AppIconName,
} from "../../icons/appIcons";

type ActionButtonType =
    | AppIconName
    | "custom";

interface ActionButtonProps extends ButtonProps {
    actionType?: ActionButtonType;
    loading?: boolean;
    loadingText?: string;
    iconOnlyOnMobile?: boolean;
    fullWidthOnMobile?: boolean;
    tooltip?: string;
}

// Botón general reutilizable para acciones principales del sistema.
const ActionButton = ({
    actionType = "custom",
    loading = false,
    loadingText = "Procesando...",
    iconOnlyOnMobile = false,
    fullWidthOnMobile = false,
    tooltip,
    disabled,
    children,
    startIcon,
    variant,
    color,
    size = "small",
    sx,
    ...props
}: ActionButtonProps) => {
    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("sm")
    );

    // Retorna el ícono correspondiente al tipo de acción.
    const getDefaultIcon = () => {
        // Permite reemplazar cualquier ícono predeterminado.
        if (startIcon) {
            return startIcon;
        }

        if (actionType === "custom") {
            return undefined;
        }

        const IconComponent =
            appIcons[actionType];

        return <IconComponent />;
    };

    // Retorna el color correspondiente al tipo de acción.
    const getDefaultColor =
        (): ButtonProps["color"] => {
            if (color) {
                return color;
            }

            if (
                actionType === "reject" ||
                actionType === "delete"
            ) {
                return "error";
            }

            if (actionType === "lock") {
                return "warning";
            }

            if (
                actionType === "cancel" ||
                actionType === "clear" ||
                actionType === "back"
            ) {
                return "inherit";
            }

            return "primary";
        };

    // Retorna la variante correspondiente al tipo de acción.
    const getDefaultVariant =
        (): ButtonProps["variant"] => {
            if (variant) {
                return variant;
            }

            if (actionType === "open") {
                return "text";
            }

            if (
                actionType === "cancel" ||
                actionType === "reject" ||
                actionType === "delete" ||
                actionType === "clear" ||
                actionType === "back" ||
                actionType === "file" ||
                actionType === "upload" ||
                actionType === "lock" ||
                actionType === "unlock"
            ) {
                return "outlined";
            }

            return "contained";
        };

    const buttonText =
        loading && loadingText
            ? loadingText
            : iconOnlyOnMobile && isMobile
                ? ""
                : children;

    const button = (
        <Button
            {...props}
            size={size}
            variant={getDefaultVariant()}
            color={getDefaultColor()}
            disabled={
                disabled ||
                loading
            }
            startIcon={
                loading ? (
                    <CircularProgress
                        size={16}
                        color="inherit"
                    />
                ) : (
                    getDefaultIcon()
                )
            }
            sx={{
                minWidth:
                    iconOnlyOnMobile &&
                        isMobile
                        ? 40
                        : undefined,

                width:
                    fullWidthOnMobile &&
                        isMobile
                        ? "100%"
                        : undefined,

                whiteSpace: "nowrap",

                "& .MuiButton-startIcon": {
                    marginRight:
                        iconOnlyOnMobile &&
                            isMobile
                            ? 0
                            : undefined,

                    marginLeft:
                        iconOnlyOnMobile &&
                            isMobile
                            ? 0
                            : undefined,
                },

                ...sx,
            }}
        >
            {buttonText}
        </Button>
    );

    if (
        tooltip ||
        (
            iconOnlyOnMobile &&
            isMobile &&
            children
        )
    ) {
        return (
            <Tooltip
                title={
                    tooltip ||
                    String(children)
                }
            >
                <span>{button}</span>
            </Tooltip>
        );
    }

    return button;
};

export default ActionButton;
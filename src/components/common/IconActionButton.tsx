import {
    CircularProgress,
    IconButton,
    Tooltip,
} from "@mui/material";

import type {
    IconButtonProps,
} from "@mui/material";

import {
    appIcons,
} from "../../icons/appIcons";

import type {
    AppIconName,
} from "../../icons/appIcons";

interface IconActionButtonProps
    extends Omit<
        IconButtonProps,
        "children"
    > {
    icon: AppIconName;
    tooltip: string;
    loading?: boolean;
    active?: boolean;
}

// Botón reutilizable para acciones compactas mediante íconos.
const IconActionButton = ({
    icon,
    tooltip,
    loading = false,
    active = false,
    disabled,
    sx,
    ...props
}: IconActionButtonProps) => {
    const IconComponent =
        appIcons[icon];

    return (
        <Tooltip
            title={tooltip}
            arrow
        >
            <span>
                <IconButton
                    {...props}
                    aria-label={tooltip}
                    disabled={
                        disabled ||
                        loading
                    }
                    sx={{
                        width: 36,
                        height: 36,
                        color: active
                            ? "primary.main"
                            : "text.secondary",
                        bgcolor: active
                            ? "action.selected"
                            : "transparent",

                        "&:hover": {
                            bgcolor:
                                "action.hover",
                            color:
                                "text.primary",
                        },

                        ...sx,
                    }}
                >
                    {loading ? (
                        <CircularProgress
                            size={18}
                            color="inherit"
                        />
                    ) : (
                        <IconComponent />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default IconActionButton;
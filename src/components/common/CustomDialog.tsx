import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

import type {
    DialogProps,
    SxProps,
    Theme,
} from "@mui/material";

import type {
    ReactNode,
} from "react";

import IconActionButton from "./IconActionButton";

type DialogSize =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | false;

interface CustomDialogProps
    extends Omit<
        DialogProps,
        | "open"
        | "onClose"
        | "children"
        | "maxWidth"
        | "title"
    > {
    open: boolean;
    onClose?: () => void;

    title?: ReactNode;
    subtitle?: ReactNode;

    size?: DialogSize;
    showCloseButton?: boolean;

    children: ReactNode;
    actions?: ReactNode;

    contentSx?: SxProps<Theme>;
    actionsSx?: SxProps<Theme>;
}

const CustomDialog = ({
    open,
    onClose,
    title,
    subtitle,
    size = "sm",
    showCloseButton = true,
    children,
    actions,
    contentSx,
    actionsSx,
    ...dialogProps
}: CustomDialogProps) => {
    const showHeader =
        Boolean(title) ||
        Boolean(subtitle) ||
        Boolean(
            showCloseButton &&
            onClose
        );

    return (
        <Dialog
            {...dialogProps}
            open={open}
            onClose={() => {
                onClose?.();
            }}
            fullWidth
            maxWidth={size}
        >
            {showHeader && (
                <DialogTitle
                    component="div"
                    sx={{
                        pb: subtitle
                            ? 1
                            : 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            {title && (
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    sx={{
                                        fontWeight: 600,
                                    }}
                                >
                                    {title}
                                </Typography>
                            )}

                            {subtitle && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: title
                                            ? 0.5
                                            : 0,
                                    }}
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>

                        {showCloseButton &&
                            onClose && (
                                <IconActionButton
                                    icon="cancel"
                                    tooltip="Cerrar"
                                    onClick={onClose}
                                    sx={{
                                        mt: -0.5,
                                        mr: -0.5,
                                    }}
                                />
                            )}
                    </Box>
                </DialogTitle>
            )}

            <DialogContent
                sx={{
                    pt: showHeader
                        ? 1
                        : 3,
                    ...contentSx,
                }}
            >
                {children}
            </DialogContent>

            {actions && (
                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                        pt: 1.5,
                        ...actionsSx,
                    }}
                >
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default CustomDialog;
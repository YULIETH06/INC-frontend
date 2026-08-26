import {
    Box,
    IconButton,
    Typography,
} from "@mui/material";

import {
    alpha,
    useTheme,
} from "@mui/material/styles";

import type {
    ReactNode,
} from "react";

import { appIcons } from "../../../icons/appIcons";

import {
    formatFileSize,
} from "../../../utils/common/fileUtils";

interface FileInputProps {
    label: string;
    value: File | null;

    accept?: string;
    required?: boolean;
    disabled?: boolean;

    error?: string;
    hint?: ReactNode;

    onChange: (file: File | null) => void;
    onRemove: () => void;
}

// Campo reutilizable para seleccionar y visualizar archivos.
const FileInput = ({
    label,
    value,

    accept,
    required = false,
    disabled = false,

    error,
    hint,

    onChange,
    onRemove,
}: FileInputProps) => {
    const theme = useTheme();

    const UploadIcon = appIcons.upload;
    const FileIcon = appIcons.file;
    const RemoveIcon = appIcons.cancel;

    return (
        <Box sx={{ width: "100%" }}>
            {!value ? (
                <Box
                    component="label"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,

                        px: 1.5,
                        py: 1.1,

                        borderRadius: 2,

                        border: `1px solid ${error
                            ? theme.palette.error.main
                            : theme.palette.divider
                            }`,

                        backgroundColor: alpha(
                            theme.palette.common.white,
                            0.02
                        ),

                        cursor: disabled
                            ? "not-allowed"
                            : "pointer",

                        opacity: disabled
                            ? 0.6
                            : 1,

                        transition: "all 0.2s ease",

                        "&:hover": disabled
                            ? {}
                            : {
                                borderColor: error
                                    ? theme.palette.error.main
                                    : alpha(
                                        theme.palette.primary.main,
                                        0.45
                                    ),

                                backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.05
                                ),
                            },
                    }}
                >
                    <input
                        type="file"
                        hidden
                        disabled={disabled}
                        accept={accept}
                        onChange={(event) =>
                            onChange(
                                event.target.files?.[0] ??
                                null
                            )
                        }
                    />

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                        }}
                    >
                        <UploadIcon
                            sx={{
                                color: error
                                    ? theme.palette.error.main
                                    : theme.palette.text.secondary,

                                fontSize: 18,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "0.92rem",
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "0.82rem",
                            color: theme.palette.text.secondary,
                            flexShrink: 0,
                        }}
                    >
                        {required
                            ? "Obligatorio"
                            : "Opcional"}
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,

                        px: 1.2,
                        py: 1,

                        borderRadius: 2,

                        border: `1px solid ${error
                            ? theme.palette.error.main
                            : theme.palette.divider
                            }`,

                        backgroundColor: alpha(
                            theme.palette.common.white,
                            0.03
                        ),
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                        }}
                    >
                        <Box
                            sx={{
                                width: 32,
                                height: 32,

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                borderRadius: 1.5,

                                backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.12
                                ),

                                color: theme.palette.primary.main,

                                flexShrink: 0,
                            }}
                        >
                            <FileIcon
                                sx={{
                                    fontSize: 18,
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,

                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",

                                    maxWidth: {
                                        xs: 150,
                                        sm: 280,
                                    },
                                }}
                            >
                                {value.name}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.72rem",
                                    color: theme.palette.text.secondary,
                                    mt: 0.15,
                                }}
                            >
                                {formatFileSize(
                                    value.size
                                )}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        size="small"
                        disabled={disabled}
                        onClick={onRemove}
                        aria-label="Quitar archivo"
                        sx={{
                            color: theme.palette.text.secondary,

                            "&:hover": {
                                color: theme.palette.error.main,

                                backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.08
                                ),
                            },
                        }}
                    >
                        <RemoveIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}

            {error && (
                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        mt: 0.75,
                        ml: 1.5,
                        color: "error.main",
                    }}
                >
                    {error}
                </Typography>
            )}

            {hint && !error && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mt: 0.75,
                        ml: 1.5,
                    }}
                >
                    {hint}
                </Typography>
            )}
        </Box>
    );
};

export default FileInput;
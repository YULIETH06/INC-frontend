import {
    CircularProgress,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

interface SelectOption {
    label: string;
    value: string;
}

interface ClearableSelectProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    size?: "small" | "medium";
    minWidth?: string;
    placeholder?: string;
    clearable?: boolean;
    loading?: boolean;
    loadingText?: string;
    emptyMessage?: string;
}

const ClearableSelect = ({
    label,
    value,
    options,
    onChange,
    error = "",
    required = false,
    disabled = false,
    size = "medium",
    minWidth = "220px",
    placeholder,
    clearable = false,
    loading = false,
    loadingText = "Cargando opciones...",
    emptyMessage = "No hay opciones disponibles.",
}: ClearableSelectProps) => {
    const theme = useTheme();

    return (
        <FormControl
            fullWidth
            required={required}
            disabled={disabled || loading}
            error={!!error}
            size={size}
            sx={{
                minWidth,
                position: "relative",
            }}
        >
            <InputLabel required={required}>{label}</InputLabel>

            <Select
                label={label}
                value={value}
                required={required}
                disabled={disabled || loading}
                onChange={(e) => onChange(e.target.value)}
                MenuProps={{
                    // El menú se abre debajo del campo.
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                    },

                    // El inicio del menú se alinea con la parte inferior del Select.
                    transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                    },

                    slotProps: {
                        paper: {
                            sx: {
                                // Pequeña separación entre el campo y las opciones.
                                mt: 0.5,

                                // Altura máxima adaptable según el tamaño de pantalla.
                                maxHeight: {
                                    xs: "260px",
                                    sm: "320px",
                                },

                                // Muestra scroll cuando hay muchas opciones.
                                overflowY: "auto",
                            },
                        },
                    },
                }}
                sx={{
                    pr:
                        clearable && value
                            ? 5
                            : loading
                                ? 4
                                : 0,

                    "& .MuiSelect-icon": {
                        display: loading ? "none" : "block",
                    },
                }}
            >
                {/* <MenuItem value="">
                    <em>
                        {placeholder ??
                            `Seleccionar ${label.toLowerCase()}`}
                    </em>
                </MenuItem> */}

                {loading ? (
                    <MenuItem disabled>{loadingText}</MenuItem>
                ) : options.length === 0 ? (
                    <MenuItem disabled>{emptyMessage}</MenuItem>
                ) : (
                    options.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </MenuItem>
                    ))
                )}
            </Select>

            {loading && (
                <CircularProgress
                    size={20}
                    sx={{
                        position: "absolute",
                        right: 16,
                        top:
                            size === "small"
                                ? 10
                                : 18,
                        zIndex: 2,
                    }}
                />
            )}

            {clearable && value && !disabled && (
                <IconButton
                    size="small"
                    disabled={disabled}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onChange("")}
                    sx={{
                        position: "absolute",
                        right: 32,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        color: theme.palette.text.secondary,
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}

            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default ClearableSelect;
import {
    Autocomplete,
    TextField,
} from "@mui/material";

import type {
    ReactNode,
} from "react";

export interface SearchableSelectOption {
    label: string;
    value: string;

    // Grupo opcional para mostrar las opciones agrupadas, por ejemplo por área.
    group?: string;

    // Permite mostrar una opción sin que pueda seleccionarse.
    disabled?: boolean;
}

interface SearchableSelectProps {
    label: string;
    value: string;
    options: SearchableSelectOption[];
    onChange: (value: string) => void;
    error?: string;
    hint?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    size?: "small" | "medium";
    placeholder?: string;
    loading?: boolean;
    loadingText?: string;
    emptyMessage?: string;
}

// Selector reutilizable con buscador para listas largas de opciones.
// Recibe y devuelve el valor como texto, igual que ClearableSelect.
const SearchableSelect = ({
    label,
    value,
    options,
    onChange,
    error = "",
    hint,
    required = false,
    disabled = false,
    size = "medium",
    placeholder,
    loading = false,
    loadingText = "Cargando opciones...",
    emptyMessage = "No se encontraron opciones.",
}: SearchableSelectProps) => {
    // Agrupar solo funciona si las opciones están ordenadas por grupo.
    const hasGroups = options.some(
        (option) => Boolean(option.group)
    );

    const sortedOptions = hasGroups
        ? [...options].sort((a, b) =>
            (a.group ?? "").localeCompare(
                b.group ?? ""
            )
        )
        : options;

    // Opción que corresponde al valor actual.
    const selectedOption =
        sortedOptions.find(
            (option) => option.value === value
        ) ?? null;

    return (
        <Autocomplete
            fullWidth
            options={sortedOptions}
            value={selectedOption}
            onChange={(_event, option) =>
                onChange(option?.value ?? "")
            }
            groupBy={
                hasGroups
                    ? (option) =>
                        option.group ?? ""
                    : undefined
            }
            getOptionLabel={(option) =>
                option.label
            }
            isOptionEqualToValue={(
                option,
                currentValue
            ) =>
                option.value ===
                currentValue.value
            }
            getOptionDisabled={(option) =>
                Boolean(option.disabled)
            }
            loading={loading}
            loadingText={loadingText}
            noOptionsText={emptyMessage}
            disabled={disabled}
            size={size}
            slotProps={{
                paper: {
                    sx: {
                        // Pequeña separación entre el campo y las opciones.
                        mt: 0.5,
                    },
                },
                listbox: {
                    sx: {
                        // Altura máxima adaptable según el tamaño de pantalla.
                        maxHeight: {
                            xs: "260px",
                            sm: "320px",
                        },
                    },
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    required={required}
                    placeholder={placeholder}
                    error={Boolean(error)}
                    helperText={error || hint}
                />
            )}
        />
    );
};

export default SearchableSelect;

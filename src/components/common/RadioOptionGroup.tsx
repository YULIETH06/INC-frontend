import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material";

interface RadioOption {
    label: string;
    value: string;
}

interface RadioOptionGroupProps {
    label?: string;
    value: string;
    options: RadioOption[];
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    row?: boolean;
}

// Grupo reutilizable para seleccionar una única opción.
const RadioOptionGroup = ({
    label,
    value,
    options,
    onChange,
    error = "",
    required = false,
    disabled = false,
    row = true,
}: RadioOptionGroupProps) => {
    return (
        <FormControl
            error={Boolean(error)}
            required={required}
            disabled={disabled}
        >
            {/* El label es opcional para evitar títulos repetidos. */}
            {label && (
                <FormLabel>
                    {label}
                </FormLabel>
            )}

            <RadioGroup
                row={row}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        disabled={disabled}
                    />
                ))}
            </RadioGroup>

            {error && (
                <FormHelperText>
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default RadioOptionGroup;
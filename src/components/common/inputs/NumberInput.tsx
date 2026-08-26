import {
    Box,
    TextField,
    Typography,
} from "@mui/material";

import type {
    ReactNode,
} from "react";

import type {
    TextFieldProps,
} from "@mui/material";

import { cleanNumberInput } from "../../../utils/common/numberUtils";

type NumberInputProps = Omit<
    TextFieldProps,
    "type" | "value" | "onChange"
> & {
    value: string;
    onChange: (value: string) => void;
    hint?: ReactNode;
};

// Campo reutilizable para valores numéricos enteros.
const NumberInput = ({
    value,
    onChange,
    hint,
    error,
    helperText,
    disabled,
    ...props
}: NumberInputProps) => {
    // Limpia cualquier carácter que no sea numérico.
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onChange(
            cleanNumberInput(event.target.value)
        );
    };

    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                {...props}
                fullWidth
                type="text"
                value={value}
                error={error}
                helperText={helperText}
                disabled={disabled}
                onChange={handleChange}
                slotProps={{
                    htmlInput: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                    },
                }}
            />

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

export default NumberInput;
import {
    Box,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";

import type {
    ReactNode,
} from "react";

import type {
    TextFieldProps,
} from "@mui/material";

import {
    cleanNumberInput,
    formatNumberInput,
} from "../../../utils/common/numberUtils";

type MoneyInputProps = Omit<
    TextFieldProps,
    "type" | "value" | "onChange"
> & {
    value: string;
    onChange: (value: string) => void;
    hint?: ReactNode;
};

// Campo reutilizable para valores monetarios.
const MoneyInput = ({
    value,
    onChange,
    hint,
    error,
    helperText,
    disabled,
    ...props
}: MoneyInputProps) => {
    // Limpia el valor y conserva únicamente los números.
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const cleanValue =
            cleanNumberInput(event.target.value);

        onChange(cleanValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                {...props}
                fullWidth
                type="text"
                value={
                    value
                        ? formatNumberInput(value)
                        : ""
                }
                error={error}
                helperText={helperText}
                disabled={disabled}
                onChange={handleChange}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                $
                            </InputAdornment>
                        ),
                    },

                    htmlInput: {
                        inputMode: "numeric",
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

export default MoneyInput;
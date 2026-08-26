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

type TextInputProps = Omit<
    TextFieldProps,
    "value" | "onChange" | "multiline"
> & {
    value: string;
    onChange?: (value: string) => void;
    hint?: ReactNode;
    readOnly?: boolean;
};

// Campo reutilizable para textos de una sola línea.
const TextInput = ({
    value,
    onChange,
    hint,
    readOnly = false,
    error,
    helperText,
    disabled,
    ...props
}: TextInputProps) => {
    const isDisabled = disabled || readOnly;

    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                {...props}
                fullWidth
                value={value}
                error={error}
                helperText={helperText}
                disabled={isDisabled}
                onChange={(event) =>
                    onChange?.(event.target.value)
                }
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

export default TextInput;
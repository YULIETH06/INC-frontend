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

type TextAreaInputProps = Omit<
    TextFieldProps,
    "value" | "onChange" | "multiline" | "rows"
> & {
    value: string;
    onChange: (value: string) => void;
    hint?: ReactNode;
    rows?: number;
};

// Campo reutilizable para observaciones, comentarios y textos extensos.
const TextAreaInput = ({
    value,
    onChange,
    hint,
    rows = 4,
    error,
    helperText,
    disabled,
    ...props
}: TextAreaInputProps) => {
    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                {...props}
                fullWidth
                multiline
                rows={rows}
                value={value}
                error={error}
                helperText={helperText}
                disabled={disabled}
                onChange={(event) =>
                    onChange(event.target.value)
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

export default TextAreaInput;
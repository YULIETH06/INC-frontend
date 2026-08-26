import {
    Box,
    IconButton,
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

import { useState } from "react";

import { appIcons } from "../../../icons/appIcons";

type PasswordInputProps = Omit<
    TextFieldProps,
    "type" | "value" | "onChange"
> & {
    value: string;
    onChange: (value: string) => void;
    hint?: ReactNode;
};

// Campo reutilizable para contraseñas con opción de mostrar u ocultar.
const PasswordInput = ({
    value,
    onChange,
    hint,
    error,
    helperText,
    disabled,
    ...props
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] =
        useState(false);

    const VisiblePasswordIcon = appIcons.view;
    const HiddenPasswordIcon = appIcons.hide;

    // Alterna la visibilidad de la contraseña.
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                {...props}
                fullWidth
                type={
                    showPassword
                        ? "text"
                        : "password"
                }
                value={value}
                error={error}
                helperText={helperText}
                disabled={disabled}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    disabled={disabled}
                                    onClick={
                                        togglePasswordVisibility
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                >
                                    {showPassword ? (
                                        <VisiblePasswordIcon />
                                    ) : (
                                        <HiddenPasswordIcon />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
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

export default PasswordInput;
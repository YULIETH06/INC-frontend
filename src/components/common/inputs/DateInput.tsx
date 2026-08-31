import {
    TextField,
    Typography,
} from "@mui/material";

import type {
    TextFieldProps,
} from "@mui/material";

interface DateInputProps
    extends Omit<
        TextFieldProps,
        | "type"
        | "value"
        | "onChange"
        | "slotProps"
    > {
    value: string;
    onChange: (
        value: string
    ) => void;

    hint?: string;

    minDate?: string;
    maxDate?: string;

    readOnly?: boolean;
}

// Campo reutilizable para seleccionar fechas.
const DateInput = ({
    value,
    onChange,

    hint,

    minDate,
    maxDate,

    readOnly = false,

    error,
    helperText,
    disabled,

    size = "small",

    ...props
}: DateInputProps) => {
    return (
        <>
            <TextField
                {...props}
                fullWidth
                type="date"
                size={size}
                value={value}
                error={error}
                helperText={
                    helperText
                }
                disabled={
                    disabled
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target
                            .value
                    )
                }
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },

                    htmlInput: {
                        min: minDate,
                        max: maxDate,
                        readOnly,
                    },
                }}
            />

            {hint &&
                !error && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display:
                                "block",
                            mt: 0.75,
                            ml: 1.5,
                        }}
                    >
                        {hint}
                    </Typography>
                )}
        </>
    );
};

export default DateInput;
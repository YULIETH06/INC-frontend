import {
    Box,
    Typography,
} from "@mui/material";

interface FormatLineProps {
    label: string;
    value?: string | number | null;
    labelWidth?: string;
}

// Muestra una línea de información dentro del formato.
const FormatLine = ({
    label,
    value,
    labelWidth = "190px",
}: FormatLineProps) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns:
                    `${labelWidth} minmax(0, 1fr)`,
                alignItems: "end",
                columnGap: 0.5,
                mb: 0.6,
            }}
        >
            <Typography
                sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                }}
            >
                {label}:
            </Typography>

            <Box
                sx={{
                    minWidth: 0,
                    minHeight: "18px",
                    px: 0.8,
                    borderBottom: "1px solid #000",
                    fontSize: "11px",
                    overflowWrap: "anywhere",
                }}
            >
                {value ?? ""}
            </Box>
        </Box>
    );
};

export default FormatLine;
import {
    Box,
    Typography,
} from "@mui/material";

interface FormatOptionBoxProps {
    label: string;
    checked: boolean;
}

// Muestra una casilla seleccionable dentro del formato imprimible.
const FormatOptionBox = ({
    label,
    checked,
}: FormatOptionBoxProps) => {
    return (
        <Typography
            component="div"
            sx={{
                display: "flex",
                alignItems: "center",
                minHeight: "18px",
                fontSize: "11px",
            }}
        >
            <Box
                component="span"
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: "18px",
                    height: "16px",
                    mr: 0.8,
                    border: "1px solid #000",
                    boxSizing: "border-box",
                    fontSize: "11px",
                    fontWeight: 700,
                }}
            >
                {checked ? "X" : ""}
            </Box>

            {label}
        </Typography>
    );
};

export default FormatOptionBox;
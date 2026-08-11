import {
    Box,
    Typography,
} from "@mui/material";

interface FormatSectionTitleProps {
    title: string;
}

// Muestra el título de una sección del formato.
const FormatSectionTitle = ({
    title,
}: FormatSectionTitleProps) => {
    return (
        <Box
            sx={{
                py: 0.3,
                borderTop: "1px solid #000",
                borderBottom: "1px solid #000",
                backgroundColor: "#f2f2f2",
                textAlign: "center",
            }}
        >
            <Typography
                sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};

export default FormatSectionTitle;
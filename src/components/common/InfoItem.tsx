import { Box, Typography } from "@mui/material";

import type { ReactNode } from "react";

interface InfoItemProps {
    label: string;
    value?: ReactNode;
}

// Muestra un dato informativo cuando contiene un valor.
const InfoItem = ({
    label,
    value,
}: InfoItemProps) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return (
        <Box>
            <Typography
                variant="caption"
                sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                }}
            >
                {label}
            </Typography>

            <Typography
                component="div"
                variant="body2"
                sx={{
                    mt: 0.4,
                    fontWeight: 500,
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default InfoItem;
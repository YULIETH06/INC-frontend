import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import type { ReactNode } from "react";

interface SectionCardProps {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
}

const SectionCard = ({
    title,
    subtitle,
    actions,
    children,
}: SectionCardProps) => {
    const hasHeader =
        Boolean(title) ||
        Boolean(subtitle) ||
        Boolean(actions);

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor:
                    "background.paper",
                boxShadow:
                    "0 4px 14px rgba(15, 23, 42, 0.08)",
                p: 3,
            }}
        >
            {hasHeader && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "flex-start",
                        mb: 2,
                        gap: 2,
                    }}
                >
                    <Box>
                        {title && (
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {title}
                            </Typography>
                        )}

                        {subtitle && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: title
                                        ? 0.5
                                        : 0,
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {actions}
                </Box>
            )}

            {children}
        </Paper>
    );
};

export default SectionCard;
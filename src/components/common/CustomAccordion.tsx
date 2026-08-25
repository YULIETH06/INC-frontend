import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
} from "@mui/material";

import type {
    ReactNode,
    SyntheticEvent,
} from "react";

import {
    useState,
} from "react";

import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

interface CustomAccordionProps {
    title: ReactNode;
    children: ReactNode;

    defaultExpanded?: boolean;
    disabled?: boolean;

    titleAdornment?: ReactNode;
}

// Accordion reutilizable para mostrar contenido expandible personalizado.
const CustomAccordion = ({
    title,
    children,
    defaultExpanded = false,
    disabled = false,
    titleAdornment,
}: CustomAccordionProps) => {
    // Controla si el accordion está abierto o cerrado.
    const [expanded, setExpanded] =
        useState(defaultExpanded);

    // Actualiza el estado de expansión.
    const handleChange = (
        _event: SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded);
    };

    return (
        <Accordion
            expanded={expanded}
            onChange={handleChange}
            disabled={disabled}
            disableGutters
            elevation={0}
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: "8px !important",
                overflow: "hidden",
            }}
        >
            <AccordionSummary
                aria-controls="accordion-content"
                sx={{
                    minHeight: 52,
                    px: 2,

                    "&.Mui-expanded": {
                        minHeight: 52,
                    },

                    "& .MuiAccordionSummary-content": {
                        my: 1.5,
                    },

                    "& .MuiAccordionSummary-content.Mui-expanded": {
                        my: 1.5,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            component="div"
                            variant="subtitle2"
                            sx={{
                                fontWeight: 700,
                                minWidth: 0,
                            }}
                        >
                            {title}
                        </Typography>

                        {titleAdornment}
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.secondary",
                            flexShrink: 0,
                        }}
                    >
                        {expanded ? (
                            <KeyboardArrowUpOutlinedIcon />
                        ) : (
                            <KeyboardArrowDownOutlinedIcon />
                        )}
                    </Box>
                </Box>
            </AccordionSummary>

            <AccordionDetails
                sx={{
                    px: 2,
                    pt: 0,
                    pb: 2,
                    borderTop: 1,
                    borderColor: "divider",
                }}
            >
                <Box
                    sx={{
                        pt: 2,
                    }}
                >
                    {children}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default CustomAccordion;
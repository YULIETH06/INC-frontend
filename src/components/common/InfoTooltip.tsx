import {
    Box,
    ClickAwayListener,
    Fade,
    IconButton,
    Paper,
    Popper,
    Typography,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useTheme } from "@mui/material/styles";

import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";

import type { ReactNode } from "react";
import type { PopperPlacementType } from "@mui/material/Popper";

type InfoTooltipSide =
    | "top"
    | "bottom"
    | "left"
    | "right";

type InfoTooltipAlign =
    | "start"
    | "center"
    | "end";

type InfoTooltipSize =
    | "sm"
    | "md";

interface InfoTooltipProps {
    title?: string;
    children: ReactNode;
    side?: InfoTooltipSide;
    align?: InfoTooltipAlign;
    size?: InfoTooltipSize;
    label?: string;
}

// Componente reutilizable para mostrar información adicional
// dentro de un panel flotante.
const InfoTooltip = ({
    title,
    children,
    side = "top",
    align = "center",
    size = "sm",
    label = "Mostrar información",
}: InfoTooltipProps) => {
    const theme = useTheme();

    const generatedId = useId().replace(/:/g, "");

    const panelId = `info-tooltip-${generatedId}`;
    const titleId = `info-tooltip-title-${generatedId}`;

    const anchorRef = useRef<HTMLButtonElement | null>(null);

    const [
        arrowElement,
        setArrowElement,
    ] = useState<HTMLSpanElement | null>(null);

    const [open, setOpen] = useState(false);

    // Convierte las propiedades side y align al formato
    // utilizado por el componente Popper de Material UI.
    const placement = useMemo<PopperPlacementType>(() => {
        if (align === "center") {
            return side;
        }

        return `${side}-${align}` as PopperPlacementType;
    }, [side, align]);

    const iconButtonSize = size === "sm" ? 28 : 34;
    const iconSize = size === "sm" ? 18 : 21;

    const handleToggle = () => {
        setOpen((previousOpen) => !previousOpen);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Cierra el panel con Escape y devuelve el foco
    // al botón que abrió la información.
    useEffect(() => {
        if (!open) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;

            setOpen(false);
            anchorRef.current?.focus();
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [open]);

    return (
        <Box
            component="span"
            sx={{
                display: "inline-flex",
                alignItems: "center",
            }}
        >
            <IconButton
                ref={anchorRef}
                type="button"
                size="small"
                aria-label={label}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                aria-haspopup="dialog"
                onClick={handleToggle}
                sx={{
                    width: iconButtonSize,
                    height: iconButtonSize,
                    color: "text.secondary",
                    backgroundColor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: theme.transitions.create(
                        [
                            "color",
                            "background-color",
                            "border-color",
                            "transform",
                        ],
                        {
                            duration:
                                theme.transitions.duration.shorter,
                        }
                    ),

                    "&:hover": {
                        color: "primary.main",
                        backgroundColor: "primary.50",
                        borderColor: "primary.main",
                        transform: "translateY(-1px)",
                    },

                    "&.Mui-focusVisible": {
                        color: "primary.main",
                        borderColor: "primary.main",
                        outline: `3px solid ${theme.palette.primary.main}33`,
                        outlineOffset: 2,
                    },
                }}
            >
                <InfoOutlinedIcon
                    sx={{
                        fontSize: iconSize,
                    }}
                />
            </IconButton>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement={placement}
                transition
                modifiers={[
                    {
                        name: "offset",
                        options: {
                            offset: [0, 10],
                        },
                    },
                    {
                        name: "arrow",
                        enabled: true,
                        options: {
                            element: arrowElement,
                        },
                    },
                    {
                        name: "flip",
                        enabled: true,
                        options: {
                            fallbackPlacements: [
                                "top",
                                "bottom",
                                "right",
                                "left",
                            ],
                        },
                    },
                    {
                        name: "preventOverflow",
                        enabled: true,
                        options: {
                            padding: 12,
                        },
                    },
                ]}
                sx={{
                    zIndex: theme.zIndex.tooltip,
                }}
            >
                {({ TransitionProps }) => (
                    <Fade
                        {...TransitionProps}
                        timeout={160}
                    >
                        <Box
                            sx={{
                                position: "relative",

                                "&[data-popper-placement^='bottom'] .InfoTooltip-arrow":
                                {
                                    top: -5,

                                    "&::before": {
                                        borderRight: 0,
                                        borderBottom: 0,
                                    },
                                },

                                "&[data-popper-placement^='top'] .InfoTooltip-arrow":
                                {
                                    bottom: -5,

                                    "&::before": {
                                        borderLeft: 0,
                                        borderTop: 0,
                                    },
                                },

                                "&[data-popper-placement^='right'] .InfoTooltip-arrow":
                                {
                                    left: -5,

                                    "&::before": {
                                        borderRight: 0,
                                        borderTop: 0,
                                    },
                                },

                                "&[data-popper-placement^='left'] .InfoTooltip-arrow":
                                {
                                    right: -5,

                                    "&::before": {
                                        borderLeft: 0,
                                        borderBottom: 0,
                                    },
                                },
                            }}
                        >
                            <Box
                                ref={setArrowElement}
                                component="span"
                                className="InfoTooltip-arrow"
                                sx={{
                                    position: "absolute",
                                    width: 10,
                                    height: 10,

                                    "&::before": {
                                        content: '""',
                                        display: "block",
                                        width: 10,
                                        height: 10,
                                        backgroundColor:
                                            "background.paper",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        transform: "rotate(45deg)",
                                        boxSizing: "border-box",
                                    },
                                }}
                            />

                            <ClickAwayListener
                                onClickAway={(event) => {
                                    const clickedElement =
                                        event.target as Node;

                                    // Evita que ClickAway cierre el panel
                                    // antes de que el botón pueda alternarlo.
                                    if (
                                        anchorRef.current?.contains(
                                            clickedElement
                                        )
                                    ) {
                                        return;
                                    }

                                    handleClose();
                                }}
                            >
                                <Paper
                                    id={panelId}
                                    role="dialog"
                                    aria-modal="false"
                                    aria-labelledby={
                                        title
                                            ? titleId
                                            : undefined
                                    }
                                    elevation={0}
                                    sx={{
                                        width: "max-content",
                                        minWidth: 220,
                                        maxWidth: {
                                            xs: "calc(100vw - 32px)",
                                            sm: 340,
                                        },
                                        p: 1.8,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2.5,
                                        backgroundColor:
                                            "background.paper",
                                        boxShadow:
                                            theme.shadows[6],
                                    }}
                                >
                                    {title && (
                                        <Typography
                                            id={titleId}
                                            variant="subtitle2"
                                            sx={{
                                                mb: 0.8,
                                                color: "text.primary",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {title}
                                        </Typography>
                                    )}

                                    <Box
                                        sx={{
                                            color: "text.secondary",

                                            "& p": {
                                                margin: 0,
                                            },

                                            "& ul, & ol": {
                                                my: 0.5,
                                                pl: 2.5,
                                            },
                                        }}
                                    >
                                        {children}
                                    </Box>
                                </Paper>
                            </ClickAwayListener>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </Box>
    );
};

export default InfoTooltip;
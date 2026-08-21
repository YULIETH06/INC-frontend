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
import CloseIcon from "@mui/icons-material/Close";

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

    // Convierte side y align al formato
    // utilizado por Popper de Material UI.
    const placement = useMemo<PopperPlacementType>(() => {
        if (align === "center") {
            return side;
        }

        return `${side}-${align}` as PopperPlacementType;
    }, [side, align]);

    const iconButtonSize = size === "sm" ? 28 : 34;
    const iconSize = size === "sm" ? 18 : 21;

    // Abre o cierra el panel informativo.
    const handleToggle = () => {
        setOpen((previousOpen) => !previousOpen);
    };

    // Cierra el panel.
    const handleClose = () => {
        setOpen(false);
    };

    // Cierra el panel con Escape y devuelve
    // el foco al botón que lo abrió.
    useEffect(() => {
        if (!open) return;

        const handleEscape = (
            event: KeyboardEvent
        ) => {
            if (
                event.key !== "Escape"
            ) {
                return;
            }

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
            {/* Botón que abre la información. */}
            <IconButton
                ref={anchorRef}
                type="button"
                size="small"
                aria-label={label}
                aria-expanded={open}
                aria-controls={
                    open
                        ? panelId
                        : undefined
                }
                aria-haspopup="dialog"
                onClick={handleToggle}
                sx={{
                    width:
                        iconButtonSize,
                    height:
                        iconButtonSize,

                    color: open
                        ? "primary.main"
                        : "text.secondary",

                    backgroundColor: open
                        ? "primary.50"
                        : "transparent",

                    borderRadius: "50%",

                    transition:
                        theme.transitions.create(
                            [
                                "color",
                                "background-color",
                                "transform",
                            ],
                            {
                                duration:
                                    theme
                                        .transitions
                                        .duration
                                        .shorter,
                            }
                        ),

                    "&:hover": {
                        color:
                            "primary.main",
                        backgroundColor:
                            "primary.50",
                        transform:
                            "scale(1.06)",
                    },

                    "&.Mui-focusVisible":
                    {
                        color:
                            "primary.main",
                        backgroundColor:
                            "primary.50",
                        outline: `3px solid ${theme.palette.primary.main}26`,
                        outlineOffset: 2,
                    },
                }}
            >
                <InfoOutlinedIcon
                    sx={{
                        fontSize:
                            iconSize,
                    }}
                />
            </IconButton>

            {/* Panel flotante. */}
            <Popper
                open={open}
                anchorEl={
                    anchorRef.current
                }
                placement={placement}
                transition
                modifiers={[
                    {
                        name: "offset",
                        options: {
                            offset: [
                                0,
                                10,
                            ],
                        },
                    },
                    {
                        name: "arrow",
                        enabled: true,
                        options: {
                            element:
                                arrowElement,
                        },
                    },
                    {
                        name: "flip",
                        enabled: true,
                        options: {
                            fallbackPlacements:
                                [
                                    "top",
                                    "bottom",
                                    "right",
                                    "left",
                                ],
                        },
                    },
                    {
                        name:
                            "preventOverflow",
                        enabled: true,
                        options: {
                            padding: 12,
                        },
                    },
                ]}
                sx={{
                    zIndex:
                        theme.zIndex
                            .tooltip,
                }}
            >
                {({
                    TransitionProps,
                }) => (
                    <Fade
                        {...TransitionProps}
                        timeout={160}
                    >
                        <Box
                            sx={{
                                position:
                                    "relative",

                                "&[data-popper-placement^='bottom'] .InfoTooltip-arrow":
                                {
                                    top: -5,

                                    "&::before":
                                    {
                                        borderRight:
                                            0,
                                        borderBottom:
                                            0,
                                    },
                                },

                                "&[data-popper-placement^='top'] .InfoTooltip-arrow":
                                {
                                    bottom: -5,

                                    "&::before":
                                    {
                                        borderLeft:
                                            0,
                                        borderTop:
                                            0,
                                    },
                                },

                                "&[data-popper-placement^='right'] .InfoTooltip-arrow":
                                {
                                    left: -5,

                                    "&::before":
                                    {
                                        borderRight:
                                            0,
                                        borderTop:
                                            0,
                                    },
                                },

                                "&[data-popper-placement^='left'] .InfoTooltip-arrow":
                                {
                                    right: -5,

                                    "&::before":
                                    {
                                        borderLeft:
                                            0,
                                        borderBottom:
                                            0,
                                    },
                                },
                            }}
                        >
                            {/* Flecha que conecta el panel con el botón. */}
                            <Box
                                ref={
                                    setArrowElement
                                }
                                component="span"
                                className="InfoTooltip-arrow"
                                sx={{
                                    position:
                                        "absolute",
                                    width: 10,
                                    height: 10,

                                    "&::before":
                                    {
                                        content:
                                            '""',
                                        display:
                                            "block",
                                        width: 10,
                                        height: 10,
                                        backgroundColor:
                                            "background.paper",
                                        border:
                                            "1px solid",
                                        borderColor:
                                            "divider",
                                        transform:
                                            "rotate(45deg)",
                                        boxSizing:
                                            "border-box",
                                    },
                                }}
                            />

                            <ClickAwayListener
                                onClickAway={(
                                    event
                                ) => {
                                    const clickedElement =
                                        event.target as Node;

                                    // Evita que el clic en el botón
                                    // cierre el panel antes de alternarlo.
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
                                    id={
                                        panelId
                                    }
                                    role="dialog"
                                    aria-modal="false"
                                    aria-labelledby={
                                        title
                                            ? titleId
                                            : undefined
                                    }
                                    elevation={
                                        0
                                    }
                                    sx={{
                                        width:
                                            "max-content",
                                        minWidth:
                                            260,
                                        maxWidth:
                                        {
                                            xs: "calc(100vw - 32px)",
                                            sm: 360,
                                        },

                                        overflow:
                                            "hidden",

                                        border:
                                            "1px solid",
                                        borderColor:
                                            "divider",

                                        borderRadius:
                                            2,

                                        backgroundColor:
                                            "background.paper",

                                        boxShadow:
                                            "0 8px 28px rgba(15, 23, 42, 0.14)",
                                    }}
                                >
                                    {/* Encabezado del panel. */}
                                    {title && (
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "space-between",
                                                gap: 1.5,

                                                px: 2,
                                                py: 1.4,

                                                borderBottom:
                                                    "1px solid",
                                                borderColor:
                                                    "divider",
                                            }}
                                        >
                                            <Typography
                                                id={titleId}
                                                variant="subtitle2"
                                                sx={{
                                                    color: "text.primary",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {title}
                                            </Typography>

                                            <IconButton
                                                type="button"
                                                size="small"
                                                aria-label="Cerrar información"
                                                onClick={
                                                    handleClose
                                                }
                                                sx={{
                                                    width:
                                                        28,
                                                    height:
                                                        28,
                                                    flexShrink:
                                                        0,
                                                    color:
                                                        "text.secondary",

                                                    "&:hover":
                                                    {
                                                        color:
                                                            "text.primary",
                                                        backgroundColor:
                                                            "action.hover",
                                                    },
                                                }}
                                            >
                                                <CloseIcon
                                                    sx={{
                                                        fontSize:
                                                            18,
                                                    }}
                                                />
                                            </IconButton>
                                        </Box>
                                    )}

                                    {/* Contenido informativo. */}
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1.7,

                                            color:
                                                "text.secondary",

                                            backgroundColor:
                                                "background.paper",

                                            "& p":
                                            {
                                                margin:
                                                    0,
                                            },

                                            "& ul, & ol":
                                            {
                                                my: 0.5,
                                                pl: 2.5,
                                            },
                                        }}
                                    >
                                        {
                                            children
                                        }
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
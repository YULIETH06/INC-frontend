import {
    Box,
    IconButton,
    InputAdornment,
    Menu,
    TextField,
    Typography,
} from "@mui/material";

import type {
    ReactNode,
} from "react";

import {
    useState,
} from "react";

import IconActionButton from "./IconActionButton";

import {
    appIcons,
} from "../../icons/appIcons";

interface ListToolbarProps {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    searchTooltip?: string;

    filterContent?: ReactNode;
    filterActive?: boolean;
    filterTitle?: string;
    filterTooltip?: string;

    onRefresh?: () => void | Promise<void>;
    refreshLoading?: boolean;
    refreshTooltip?: string;

    actions?: ReactNode;
}

const SearchIcon = appIcons.search;
const CloseIcon = appIcons.cancel;

// Barra reutilizable para búsquedas, filtros y acciones de listados.
const ListToolbar = ({
    searchValue = "",
    onSearchChange,
    searchPlaceholder = "Buscar...",
    searchTooltip = "Buscar",
    filterContent,
    filterActive = false,
    filterTitle,
    filterTooltip = "Filtrar",
    onRefresh,
    refreshLoading = false,
    refreshTooltip = "Actualizar",
    actions,
}: ListToolbarProps) => {
    const [showSearch, setShowSearch] =
        useState(Boolean(searchValue));

    const [
        filterAnchorEl,
        setFilterAnchorEl,
    ] = useState<HTMLElement | null>(null);

    const filterOpen =
        Boolean(filterAnchorEl);

    const handleToggleSearch = () => {
        setShowSearch(
            (current) => !current
        );
    };

    const handleCloseSearch = () => {
        onSearchChange?.("");
        setShowSearch(false);
    };

    const handleOpenFilter = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setFilterAnchorEl(
            event.currentTarget
        );
    };

    const handleCloseFilter = () => {
        setFilterAnchorEl(null);
    };

    const handleRefresh = () => {
        if (!onRefresh) {
            return;
        }

        void onRefresh();
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: 1,
                width: "100%",
            }}
        >
            {onSearchChange && (
                <>
                    {showSearch ? (
                        <Box
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: 280,
                                },
                                flexShrink: 0,
                            }}
                        >
                            <TextField
                                fullWidth
                                autoFocus
                                size="small"
                                placeholder={
                                    searchPlaceholder
                                }
                                value={
                                    searchValue
                                }
                                onChange={(
                                    event
                                ) =>
                                    onSearchChange(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                slotProps={{
                                    input: {
                                        startAdornment:
                                            (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        endAdornment:
                                            (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={
                                                            handleCloseSearch
                                                        }
                                                        aria-label="Cerrar búsqueda"
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                    },
                                }}
                            />
                        </Box>
                    ) : (
                        <IconActionButton
                            icon="search"
                            tooltip={
                                searchTooltip
                            }
                            active={Boolean(
                                searchValue
                            )}
                            onClick={
                                handleToggleSearch
                            }
                        />
                    )}
                </>
            )}

            {filterContent && (
                <>
                    <IconActionButton
                        icon="filter"
                        tooltip={
                            filterTooltip
                        }
                        active={
                            filterActive
                        }
                        onClick={
                            handleOpenFilter
                        }
                    />

                    <Menu
                        anchorEl={
                            filterAnchorEl
                        }
                        open={
                            filterOpen
                        }
                        onClose={
                            handleCloseFilter
                        }
                        anchorOrigin={{
                            vertical:
                                "bottom",
                            horizontal:
                                "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal:
                                "right",
                        }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,

                                    // Mantiene el mismo ancho en todos los filtros.
                                    width: {
                                        xs: 300,
                                        sm: 340,
                                    },

                                    // Evita que el menú se salga de pantallas pequeñas.
                                    maxWidth:
                                        "calc(100vw - 32px)",

                                    p: 2,
                                    borderRadius: 2,
                                },
                            },
                        }}
                    >
                        {filterTitle && (
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 1.5,
                                    fontWeight: 600,
                                }}
                            >
                                {
                                    filterTitle
                                }
                            </Typography>
                        )}

                        {filterContent}
                    </Menu>
                </>
            )}

            {onRefresh && (
                <IconActionButton
                    icon="refresh"
                    tooltip={
                        refreshTooltip
                    }
                    loading={
                        refreshLoading
                    }
                    disabled={
                        refreshLoading
                    }
                    onClick={
                        handleRefresh
                    }
                />
            )}

            {actions}
        </Box>
    );
};

export default ListToolbar;
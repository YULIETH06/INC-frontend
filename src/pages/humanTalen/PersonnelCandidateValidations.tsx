import {
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import type {
    DataTableColumn,
} from "../../components/common/DataTable";

import type {
    PersonnelCandidateValidationListItem,
} from "../../interfaces/humanTalent/personnelCandidateValidation.interface";

import {
    usePersonnelCandidateValidations,
} from "../../hooks/humanTalent/usePersonnelCandidateValidations";

import DataTable from "../../components/common/DataTable";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomChip from "../../components/common/CustomChip";

import { getFilterStyles } from "../../styles/filterStyles";
import { getTableStyles } from "../../styles/tableStyles";

// Página principal de validación de cargo y postulante.
const PersonnelCandidateValidations = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const filterStyles = getFilterStyles(theme);
    const tableStyles = getTableStyles(theme);

    const {
        candidates,
        canManageValidation,

        loadingCandidates,
        loadError,

        loadCandidates,
    } = usePersonnelCandidateValidations();

    const [page, setPage] =
        useState(0);

    const [
        rowsPerPage,
        setRowsPerPage,
    ] = useState(10);

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        showSearch,
        setShowSearch,
    ] = useState(false);

    // Cambia la página actual.
    const handleChangePage = (
        _event: unknown,
        newPage: number
    ) => {
        setPage(newPage);
    };

    // Cambia la cantidad de registros visibles.
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(
            Number(event.target.value)
        );

        setPage(0);
    };

    // Actualiza el texto de búsqueda.
    const handleSearchChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(
            event.target.value
        );

        setPage(0);
    };

    // Muestra u oculta el campo de búsqueda.
    const toggleSearch = () => {
        setShowSearch(
            (previous) => !previous
        );
    };

    // Limpia la búsqueda.
    const clearSearch = () => {
        setSearchTerm("");
        setShowSearch(false);
        setPage(0);
    };

    // Filtra candidatos por nombre, identificación, cargo o área.
    const filteredCandidates =
        useMemo(() => {
            const normalizedSearch =
                searchTerm
                    .toLowerCase()
                    .trim();

            return candidates.filter(
                (candidate) => {
                    const identificationType =
                        candidate.identificationType.code ||
                        candidate.identificationType.name;

                    return (
                        candidate.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||

                        candidate.identificationNumber
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||

                        identificationType
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||

                        candidate.requisition.position.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||

                        candidate.requisition.department.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            )
                    );
                }
            );
        }, [
            candidates,
            searchTerm,
        ]);

    // Obtiene la etiqueta visible del estado.
    const getValidationStatusLabel = (
        status:
            PersonnelCandidateValidationListItem["validationStatus"]
    ) => {
        switch (status) {
            case "SIN_INICIAR":
                return "Sin iniciar";

            case "CONCEPTO_APLICACION_COMPLETADO":
                return "Concepto de aplicación";

            case "VALIDACION_CARGO_COMPLETADA":
                return "Validación de cargo";

            case "VALIDACION_COMPLETADA":
                return "Validación completada";

            default:
                return status;
        }
    };

    // Obtiene el color visual del estado.
    const getValidationStatusColor = (
        status:
            PersonnelCandidateValidationListItem["validationStatus"]
    ):
        | "default"
        | "warning"
        | "info"
        | "success" => {
        switch (status) {
            case "SIN_INICIAR":
                return "default";

            case "CONCEPTO_APLICACION_COMPLETADO":
                return "warning";

            case "VALIDACION_CARGO_COMPLETADA":
                return "info";

            case "VALIDACION_COMPLETADA":
                return "success";

            default:
                return "default";
        }
    };

    // Navega al proceso de validación del candidato seleccionado.
    const goToCandidateValidation = (
        candidateId: number
    ) => {
        navigate(
            `/dashboard/human-talent/candidate-validations/${candidateId}`
        );
    };

    // Define las columnas del listado.
    const columns:
        DataTableColumn<PersonnelCandidateValidationListItem>[] =
        [
            {
                id: "number",
                label: "#",

                render: (
                    _candidate,
                    index
                ) => (
                    <Typography
                        sx={tableStyles.rowNumber}
                    >
                        {index + 1}
                    </Typography>
                ),
            },

            {
                id: "name",
                label: "Postulante",

                render: (candidate) => (
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color:
                                "text.primary",
                        }}
                    >
                        {candidate.name}
                    </Typography>
                ),
            },

            {
                id: "identification",
                label: "Identificación",

                render: (candidate) =>
                    `${candidate.identificationType.code ||
                    candidate.identificationType.name
                    } ${candidate.identificationNumber
                    }`,
            },

            {
                id: "position",
                label: "Cargo",

                render: (candidate) =>
                    candidate.requisition
                        .position.name,
            },

            {
                id: "department",
                label: "Área",

                render: (candidate) =>
                    candidate.requisition
                        .department.name,
            },

            {
                id: "status",
                label: "Estado",

                render: (candidate) => (
                    <CustomChip
                        label={getValidationStatusLabel(
                            candidate.validationStatus
                        )}
                        color={getValidationStatusColor(
                            candidate.validationStatus
                        )}
                        size="small"
                    />
                ),
            },

            {
                id: "action",
                label: "Acción",
                align: "center",

                render: (candidate) => {
                    const canStart =
                        canManageValidation &&
                        candidate.validationStatus ===
                        "SIN_INICIAR";

                    const canContinue =
                        canManageValidation &&
                        candidate.validationStatus !==
                        "SIN_INICIAR" &&
                        candidate.validationStatus !==
                        "VALIDACION_COMPLETADA";

                    const tooltip = canStart
                        ? "Iniciar validación"
                        : canContinue
                            ? "Continuar validación"
                            : "Ver validación";

                    return (
                        <Tooltip
                            title={tooltip}
                        >
                            <IconButton
                                onClick={() =>
                                    goToCandidateValidation(
                                        candidate.id
                                    )
                                }
                                sx={
                                    tableStyles.primaryActionButton
                                }
                            >
                                {canStart ||
                                    canContinue ? (
                                    <PlayArrowOutlinedIcon />
                                ) : (
                                    <VisibilityOutlinedIcon />
                                )}
                            </IconButton>
                        </Tooltip>
                    );
                },
            },
        ];

    if (loadingCandidates) {
        return <LoadingBox />;
    }

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100%",
            }}
        >
            {loadError && (
                <Alert
                    severity="error"
                    sx={{
                        marginBottom:
                            "16px",
                    }}
                >
                    {loadError}
                </Alert>
            )}

            {candidates.length === 0 ? (
                <EmptyState
                    title="No hay candidatos disponibles"
                    description="Cuando existan candidatos habilitados para validación, aparecerán en este listado."
                />
            ) : (
                <DataTable
                    title="Validación de cargo y postulante"
                    subtitle="Consulta y gestiona los candidatos disponibles para el proceso de validación."
                    actions={
                        <>
                            {showSearch ? (
                                <TextField
                                    placeholder="Buscar candidato, identificación, cargo o área"
                                    value={
                                        searchTerm
                                    }
                                    onChange={
                                        handleSearchChange
                                    }
                                    size="small"
                                    autoFocus
                                    sx={
                                        filterStyles.searchInput
                                    }
                                    slotProps={{
                                        input: {
                                            startAdornment:
                                                (
                                                    <InputAdornment position="start">
                                                        <SearchOutlinedIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),

                                            endAdornment:
                                                (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            size="small"
                                                            onClick={
                                                                clearSearch
                                                            }
                                                        >
                                                            <CloseOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                        },
                                    }}
                                />
                            ) : (
                                <Tooltip title="Buscar candidato">
                                    <IconButton
                                        onClick={
                                            toggleSearch
                                        }
                                        sx={
                                            searchTerm
                                                ? filterStyles.activeIconButton
                                                : filterStyles.iconButton
                                        }
                                    >
                                        <SearchOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

                            <Tooltip title="Actualizar lista">
                                <IconButton
                                    onClick={() =>
                                        loadCandidates()
                                    }
                                    sx={
                                        filterStyles.iconButton
                                    }
                                >
                                    <RefreshOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                    columns={columns}
                    rows={
                        filteredCandidates
                    }
                    page={page}
                    rowsPerPage={
                        rowsPerPage
                    }
                    onPageChange={
                        handleChangePage
                    }
                    onRowsPerPageChange={
                        handleChangeRowsPerPage
                    }
                />
            )}

            {candidates.length > 0 &&
                filteredCandidates.length ===
                0 && (
                    <Box
                        sx={{
                            marginTop:
                                "16px",
                        }}
                    >
                        <EmptyState
                            title="No se encontraron candidatos"
                            description="Intenta buscar con otro nombre, identificación, cargo o área."
                        />
                    </Box>
                )}
        </Box>
    );
};

export default PersonnelCandidateValidations;
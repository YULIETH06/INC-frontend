import {
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
} from "@mui/material";

import type {
    PqrPriority,
    PqrStatus,
} from "../../../interfaces/pqrs/pqr.interface";

import {
    useAgentPqrs,
} from "../../../hooks/pqrs/useAgentPqrs";

import {
    usePqrChat,
} from "../../../hooks/pqrs/usePqrChat";

import {
    useAuth,
} from "../../../context/AuthContext";

import {
    pqrPriorityOptions,
    pqrStatusOptions,
} from "../../../data/pqrOptions";

import {
    getCaseTypeLabel,
} from "../../../utils/pqrs/pqrUtils";

import {
    filterStyles,
} from "../../../styles/filterStyles";

import {
    appIcons,
} from "../../../icons/appIcons";

import PageHeader from "../../../components/common/PageHeader";
import LoadingBox from "../../../components/common/LoadingBox";
import EmptyState from "../../../components/common/EmptyState";
import CustomSnackbar from "../../../components/common/CustomSnackbar";
import StatsSummary from "../../../components/common/StatsSummary";
import ViewToggleButtons from "../../../components/common/ViewToggleButtons";
import ListToolbar from "../../../components/common/ListToolbar";
import ClearableSelect from "../../../components/common/ClearableSelect";
import ActionButton from "../../../components/common/ActionButton";

import {
    PqrChatView,
} from "../../../components/pqrs/PqrChatView";

import PqrTicketCard from "../../../components/pqrs/PqrTicketCard";

// Página del agente para tomar PQR,
// responderlas por chat y cambiar su estado y prioridad.
const AgentPqrs = () => {

    const FolderOpenIcon = appIcons.folderOpen;

    const AssignmentIcon = appIcons.assignment;

    const PendingIcon = appIcons.pending;

    const CompletedIcon = appIcons.completed;

    const {
        availablePqrs,
        assignedPqrs,

        loading,
        error,
        takingPqrId,
        updatingStatusId,
        updatingPriorityId,

        activeView,
        setActiveView,

        statusByPqrId,
        priorityByPqrId,

        selectedChatPqrId,
        selectedChatPqr,
        openPqrChat,
        closePqrChat,

        message,
        messageType,
        openMessage,
        closeMessage,

        loadAgentPqrs,
        handleTakePqr,
        handleStatusChange,
        handleUpdateStatus,
        handlePriorityChange,
        handleUpdatePriority,
    } = useAgentPqrs();

    // Token y usuario utilizados por el chat.
    const {
        token,
        user,
    } = useAuth();

    const {
        messages,
        messageText,
        setMessageText,
        selectedFile,
        handleSelectFile,
        handleRemoveSelectedFile,
        loadingMessages,
        sendingAttachment,
        chatError,
        setChatError,
        handleSendMessage,
    } = usePqrChat({
        pqrId:
            selectedChatPqrId,
        token,
    });

    // Texto utilizado para buscar dentro del listado actual.
    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    // Filtro por estado.
    const [
        statusFilter,
        setStatusFilter,
    ] = useState<
        "ALL" | PqrStatus
    >("ALL");

    // Filtro por prioridad.
    const [
        priorityFilter,
        setPriorityFilter,
    ] = useState<
        "ALL" | PqrPriority
    >("ALL");

    // Filtro por tipo de caso.
    const [
        caseTypeFilter,
        setCaseTypeFilter,
    ] = useState("ALL");

    // Limpia todos los filtros aplicados.
    const clearFilters = () => {
        setStatusFilter("ALL");
        setPriorityFilter("ALL");
        setCaseTypeFilter("ALL");
    };

    // Verifica si existe algún filtro activo.
    const hasActiveFilters =
        statusFilter !== "ALL" ||
        priorityFilter !== "ALL" ||
        caseTypeFilter !== "ALL";

    // Cuenta las PQR asignadas que aún están en seguimiento.
    const pendingAssigned =
        assignedPqrs.filter(
            (pqr) =>
                pqr.status !==
                "CERRADA"
        ).length;

    // Cuenta las PQR asignadas ya cerradas.
    const closedAssigned =
        assignedPqrs.filter(
            (pqr) =>
                pqr.status ===
                "CERRADA"
        ).length;

    // Información mostrada en las tarjetas de resumen.
    const summaryItems = [
        {
            label:
                "Disponibles",
            value:
                availablePqrs.length,
            icon: (
                <FolderOpenIcon fontSize="small" />
            ),
        },
        {
            label:
                "Asignadas a mí",
            value:
                assignedPqrs.length,
            icon: (
                <AssignmentIcon fontSize="small" />
            ),
        },
        {
            label:
                "En seguimiento",
            value:
                pendingAssigned,
            icon: (
                <PendingIcon fontSize="small" />
            ),
        },
        {
            label:
                "Cerradas",
            value:
                closedAssigned,
            icon: (
                <CompletedIcon fontSize="small" />
            ),
        },
    ];

    // Opciones para alternar entre PQR disponibles y asignadas.
    const viewOptions = [
        {
            value:
                "AVAILABLE" as const,
            label:
                "Disponibles",
            count:
                availablePqrs.length,
            icon: (
                <FolderOpenIcon />
            ),
        },
        {
            value:
                "ASSIGNED" as const,
            label:
                "Mis asignadas",
            count:
                assignedPqrs.length,
            icon: (
                <AssignmentIcon />
            ),
        },
    ];

    // Define qué listado se muestra según la vista seleccionada.
    const currentPqrs =
        activeView ===
            "AVAILABLE"
            ? availablePqrs
            : assignedPqrs;

    // Obtiene los tipos de caso disponibles en la vista actual.
    const caseTypeOptions =
        useMemo(() => {
            return Array.from(
                new Set(
                    currentPqrs
                        .map(
                            (pqr) =>
                                pqr.caseType
                        )
                        .filter(
                            Boolean
                        )
                )
            );
        }, [
            currentPqrs,
        ]);

    // Opciones disponibles para el filtro por estado.
    const statusFilterOptions = [
        {
            label:
                "Todos los estados",
            value: "ALL",
        },
        ...pqrStatusOptions,
    ];

    // Opciones disponibles para el filtro por prioridad.
    const priorityFilterOptions = [
        {
            label:
                "Todas las prioridades",
            value: "ALL",
        },
        ...pqrPriorityOptions,
    ];

    // Opciones disponibles para el filtro por tipo de caso.
    const caseTypeFilterOptions = [
        {
            label:
                "Todos los tipos de caso",
            value: "ALL",
        },
        ...caseTypeOptions.map(
            (caseType) => ({
                label:
                    getCaseTypeLabel(
                        caseType
                    ),
                value:
                    caseType,
            })
        ),
    ];

    /*
     * Filtra las PQR.
     *
     * La búsqueda solo incluye campos que no tienen
     * un filtro específico:
     *
     * - ID
     * - descripción
     * - nombre del usuario
     * - correo del usuario
     *
     * Estado, prioridad y tipo de caso se manejan
     * exclusivamente desde sus filtros.
     */
    const filteredPqrs =
        useMemo(() => {
            const normalizedSearch =
                searchTerm
                    .toLowerCase()
                    .trim();

            return currentPqrs.filter(
                (pqr) => {
                    const matchesSearch =
                        !normalizedSearch ||
                        `${pqr.id}`.includes(
                            normalizedSearch
                        ) ||
                        `pqr-${pqr.id}`.includes(
                            normalizedSearch
                        ) ||
                        `#pqr-${pqr.id}`.includes(
                            normalizedSearch
                        ) ||
                        pqr.description
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        pqr.user?.name
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        pqr.user?.email
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            );

                    const matchesStatus =
                        statusFilter ===
                        "ALL" ||
                        pqr.status ===
                        statusFilter;

                    const matchesPriority =
                        priorityFilter ===
                        "ALL" ||
                        pqr.priority ===
                        priorityFilter;

                    const matchesCaseType =
                        caseTypeFilter ===
                        "ALL" ||
                        pqr.caseType ===
                        caseTypeFilter;

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesPriority &&
                        matchesCaseType
                    );
                }
            );
        }, [
            currentPqrs,
            searchTerm,
            statusFilter,
            priorityFilter,
            caseTypeFilter,
        ]);

    const style = {
        container: {
            width: "100%",
        },

        topBar: {
            mb: 2,
            display: "flex",
            justifyContent:
                "space-between",
            alignItems: {
                xs: "stretch",
                sm: "center",
            },
            flexDirection: {
                xs: "column",
                sm: "row",
            },
            gap: 1.5,
        },

        toolbarContainer: {
            flex: 1,
            display: "flex",
            justifyContent:
                "flex-end",
        },

        list: {
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                xl: "1fr 1fr 1fr",
            },
            gap: 1.5,
            alignItems:
                "start",
        },
    };

    if (loading) {
        return <LoadingBox />;
    }

    // Muestra el chat cuando existe una PQR seleccionada.
    if (
        selectedChatPqr &&
        user
    ) {
        return (
            <>
                <PqrChatView
                    pqr={
                        selectedChatPqr
                    }
                    messages={
                        messages
                    }
                    messageText={
                        messageText
                    }
                    selectedFile={
                        selectedFile
                    }
                    loadingMessages={
                        loadingMessages
                    }
                    sendingAttachment={
                        sendingAttachment
                    }
                    chatError={
                        chatError
                    }
                    currentUserRole={
                        user.role
                    }
                    onBack={
                        closePqrChat
                    }
                    onMessageChange={
                        setMessageText
                    }
                    onSendMessage={
                        handleSendMessage
                    }
                    onSelectFile={
                        handleSelectFile
                    }
                    onRemoveSelectedFile={
                        handleRemoveSelectedFile
                    }
                    onClearError={() =>
                        setChatError("")
                    }
                />

                <CustomSnackbar
                    open={
                        openMessage
                    }
                    message={
                        message
                    }
                    severity={
                        messageType
                    }
                    onClose={
                        closeMessage
                    }
                />
            </>
        );
    }

    return (
        <Box
            sx={
                style.container
            }
        >
            <PageHeader
                title="PQR del agente"
                subtitle="Consulta las PQR disponibles, toma solicitudes para atenderlas y revisa las PQR asignadas a tu usuario."
            />

            <StatsSummary
                items={
                    summaryItems
                }
            />

            <Box
                sx={
                    style.topBar
                }
            >
                <ViewToggleButtons
                    value={
                        activeView
                    }
                    options={
                        viewOptions
                    }
                    onChange={
                        setActiveView
                    }
                />

                <Box
                    sx={
                        style.toolbarContainer
                    }
                >
                    <ListToolbar
                        searchValue={
                            searchTerm
                        }
                        onSearchChange={
                            setSearchTerm
                        }
                        searchPlaceholder="Buscar PQR..."
                        searchTooltip="Buscar PQR"
                        filterActive={
                            hasActiveFilters
                        }
                        filterTitle="Filtrar PQR"
                        filterTooltip="Filtrar PQR"
                        filterContent={
                            <Box
                                sx={
                                    filterStyles.filterMenuContent
                                }
                            >
                                <ClearableSelect
                                    label="Estado"
                                    value={
                                        statusFilter
                                    }
                                    options={
                                        statusFilterOptions
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setStatusFilter(
                                            value as
                                            | "ALL"
                                            | PqrStatus
                                        )
                                    }
                                    size="small"
                                    minWidth="100%"
                                />

                                <ClearableSelect
                                    label="Prioridad"
                                    value={
                                        priorityFilter
                                    }
                                    options={
                                        priorityFilterOptions
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setPriorityFilter(
                                            value as
                                            | "ALL"
                                            | PqrPriority
                                        )
                                    }
                                    size="small"
                                    minWidth="100%"
                                />

                                <ClearableSelect
                                    label="Tipo de caso"
                                    value={
                                        caseTypeFilter
                                    }
                                    options={
                                        caseTypeFilterOptions
                                    }
                                    onChange={
                                        setCaseTypeFilter
                                    }
                                    size="small"
                                    minWidth="100%"
                                />

                                <ActionButton
                                    actionType="clear"
                                    fullWidth
                                    variant="text"
                                    onClick={
                                        clearFilters
                                    }
                                    disabled={
                                        !hasActiveFilters
                                    }
                                    sx={
                                        filterStyles.clearFilterButton
                                    }
                                >
                                    Limpiar filtros
                                </ActionButton>
                            </Box>
                        }
                        onRefresh={
                            loadAgentPqrs
                        }
                        refreshTooltip="Actualizar lista"
                    />
                </Box>
            </Box>

            {/* Mensaje de error al cargar las PQR. */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Estado vacío según la vista seleccionada. */}
            {filteredPqrs.length ===
                0 ? (
                <EmptyState
                    title="No se encontraron PQR"
                    description={
                        activeView ===
                            "AVAILABLE"
                            ? "No hay solicitudes disponibles o no coinciden con los filtros aplicados."
                            : "No tienes solicitudes asignadas o no coinciden con los filtros aplicados."
                    }
                />
            ) : (
                <Box
                    sx={
                        style.list
                    }
                >
                    {filteredPqrs.map(
                        (pqr) => (
                            <PqrTicketCard
                                key={
                                    pqr.id
                                }
                                pqr={
                                    pqr
                                }
                                activeView={
                                    activeView
                                }
                                takingPqrId={
                                    takingPqrId
                                }
                                updatingStatusId={
                                    updatingStatusId
                                }
                                updatingPriorityId={
                                    updatingPriorityId
                                }
                                statusValue={
                                    statusByPqrId[
                                    pqr.id
                                    ] ||
                                    pqr.status
                                }
                                priorityValue={
                                    priorityByPqrId[
                                    pqr.id
                                    ] ||
                                    pqr.priority ||
                                    ""
                                }
                                onTakePqr={
                                    handleTakePqr
                                }
                                onStatusChange={
                                    handleStatusChange
                                }
                                onUpdateStatus={
                                    handleUpdateStatus
                                }
                                onPriorityChange={
                                    handlePriorityChange
                                }
                                onUpdatePriority={
                                    handleUpdatePriority
                                }
                                onOpenChat={
                                    openPqrChat
                                }
                            />
                        )
                    )}
                </Box>
            )}

            {/* Mensajes de éxito, error o advertencia. */}
            <CustomSnackbar
                open={
                    openMessage
                }
                message={
                    message
                }
                severity={
                    messageType
                }
                onClose={
                    closeMessage
                }
            />
        </Box>
    );
};

export default AgentPqrs;
import {
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
    useAdminPqrs,
} from "../../../hooks/pqrs/useAdminPqrs";

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

import PageHeader from "../../../components/common/PageHeader";
import LoadingBox from "../../../components/common/LoadingBox";
import EmptyState from "../../../components/common/EmptyState";
import CustomSnackbar from "../../../components/common/CustomSnackbar";
import ListToolbar from "../../../components/common/ListToolbar";
import ClearableSelect from "../../../components/common/ClearableSelect";
import ActionButton from "../../../components/common/ActionButton";
import DateInput from "../../../components/common/inputs/DateInput";

import {
    PqrChatView,
} from "../../../components/pqrs/PqrChatView";

import PqrTicketCard from "../../../components/pqrs/PqrTicketCard";

// Página administrativa para consultar, cambiar estados,
// prioridades y dar seguimiento a las PQR.
const AdminPqrs = () => {

    const {
        pqrs,
        agents,
        loading,
        error,

        updatingStatusId,
        updatingPriorityId,
        assigningPqrId,

        statusChanges,
        priorityChanges,
        agentChanges,

        message,
        messageType,
        openMessage,
        closeMessage,

        loadAllPqrs,
        handleStatusChange,
        handleUpdateStatus,
        handlePriorityChange,
        handleUpdatePriority,
        handleAgentChange,
        handleAssignPqr,
    } = useAdminPqrs();

    const {
        token,
        user,
    } = useAuth();

    // Controla el texto escrito en el buscador.
    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    // Controla el filtro por estado.
    const [
        statusFilter,
        setStatusFilter,
    ] = useState<
        "ALL" | PqrStatus
    >("ALL");

    // Controla el filtro por prioridad.
    const [
        priorityFilter,
        setPriorityFilter,
    ] = useState<
        "ALL" | PqrPriority
    >("ALL");

    // Controla el filtro por tipo de caso.
    const [
        caseTypeFilter,
        setCaseTypeFilter,
    ] = useState("ALL");

    // Controla si la PQR tiene agente asignado.
    const [
        agentFilter,
        setAgentFilter,
    ] = useState<
        | "ALL"
        | "WITH_AGENT"
        | "WITHOUT_AGENT"
    >("ALL");

    // Controla la fecha inicial.
    const [
        startDateFilter,
        setStartDateFilter,
    ] = useState("");

    // Controla la fecha final.
    const [
        endDateFilter,
        setEndDateFilter,
    ] = useState("");

    // Controla la PQR cuyo chat está abierto.
    const [
        selectedChatPqrId,
        setSelectedChatPqrId,
    ] = useState<number | null>(
        null
    );

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

    // Limpia todos los filtros.
    const clearFilters = () => {
        setStatusFilter("ALL");
        setPriorityFilter("ALL");
        setCaseTypeFilter("ALL");
        setAgentFilter("ALL");
        setStartDateFilter("");
        setEndDateFilter("");
    };

    // Abre el chat de una PQR.
    const openPqrChat = (
        pqrId: number
    ) => {
        setSelectedChatPqrId(
            pqrId
        );
    };

    // Cierra el chat activo.
    const closePqrChat = () => {
        setSelectedChatPqrId(
            null
        );
    };

    const selectedChatPqr =
        pqrs.find(
            (pqr) =>
                pqr.id ===
                selectedChatPqrId
        );

    // Verifica si existen filtros activos.
    const hasActiveFilters =
        statusFilter !== "ALL" ||
        priorityFilter !== "ALL" ||
        caseTypeFilter !== "ALL" ||
        agentFilter !== "ALL" ||
        startDateFilter !== "" ||
        endDateFilter !== "";

    // Obtiene los tipos de caso existentes.
    const caseTypes =
        Array.from(
            new Set(
                pqrs.map(
                    (pqr) =>
                        pqr.caseType
                )
            )
        );

    // Opciones reutilizadas por ClearableSelect.
    const statusFilterOptions = [
        {
            label:
                "Todos los estados",
            value: "ALL",
        },
        ...pqrStatusOptions,
    ];

    const priorityFilterOptions = [
        {
            label:
                "Todas las prioridades",
            value: "ALL",
        },
        ...pqrPriorityOptions,
    ];

    const caseTypeFilterOptions = [
        {
            label:
                "Todos los tipos de caso",
            value: "ALL",
        },
        ...caseTypes.map(
            (caseType) => ({
                label:
                    getCaseTypeLabel(
                        caseType
                    ),
                value: caseType,
            })
        ),
    ];

    const agentFilterOptions = [
        {
            label:
                "Todas las PQR",
            value: "ALL",
        },
        {
            label:
                "Con agente asignado",
            value: "WITH_AGENT",
        },
        {
            label:
                "Sin agente asignado",
            value: "WITHOUT_AGENT",
        },
    ];

    // Filtra las PQR según búsqueda y filtros activos.
    const filteredPqrs =
        pqrs.filter((pqr) => {
            const normalizedSearch =
                searchTerm
                    .toLowerCase()
                    .trim();

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

            const matchesAgent =
                agentFilter ===
                "ALL" ||
                (
                    agentFilter ===
                    "WITH_AGENT" &&
                    Boolean(
                        pqr.assignedTo
                    )
                ) ||
                (
                    agentFilter ===
                    "WITHOUT_AGENT" &&
                    !pqr.assignedTo
                );

            const createdDate =
                new Date(
                    pqr.createdAt
                );

            const startDate =
                startDateFilter
                    ? new Date(
                        `${startDateFilter}T00:00:00`
                    )
                    : null;

            const endDate =
                endDateFilter
                    ? new Date(
                        `${endDateFilter}T23:59:59.999`
                    )
                    : null;

            const matchesStartDate =
                !startDate ||
                createdDate >=
                startDate;

            const matchesEndDate =
                !endDate ||
                createdDate <=
                endDate;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesCaseType &&
                matchesAgent &&
                matchesStartDate &&
                matchesEndDate
            );
        });

    const style = {
        container: {
            width: "100%",
        },

        list: {
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                xl: "1fr 1fr 1fr",
            },
            gap: 1.5,
            alignItems: "start",
        },

        errorAlert: {
            mb: 2,
            borderRadius: 2,
        },
    };

    if (loading) {
        return <LoadingBox />;
    }

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
                title="Todas las PQR"
                subtitle="Administra y revisa las peticiones, quejas, reclamos o solicitudes registradas por los usuarios."
                actions={
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
                        filterTitle="Filtros de PQR"
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

                                <ClearableSelect
                                    label="Asignación"
                                    value={
                                        agentFilter
                                    }
                                    options={
                                        agentFilterOptions
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setAgentFilter(
                                            value as
                                            | "ALL"
                                            | "WITH_AGENT"
                                            | "WITHOUT_AGENT"
                                        )
                                    }
                                    size="small"
                                    minWidth="100%"
                                />

                                <Box
                                    sx={
                                        filterStyles.filterDateRow
                                    }
                                >
                                    <DateInput
                                        label="Desde"
                                        value={
                                            startDateFilter
                                        }
                                        onChange={
                                            setStartDateFilter
                                        }
                                        maxDate={
                                            endDateFilter ||
                                            undefined
                                        }
                                        sx={
                                            filterStyles.filterDateInput
                                        }
                                    />

                                    <DateInput
                                        label="Hasta"
                                        value={
                                            endDateFilter
                                        }
                                        onChange={
                                            setEndDateFilter
                                        }
                                        minDate={
                                            startDateFilter ||
                                            undefined
                                        }
                                        sx={
                                            filterStyles.filterDateInput
                                        }
                                    />
                                </Box>

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
                            loadAllPqrs
                        }
                        refreshTooltip="Actualizar lista"
                    />
                }
            />

            {error && (
                <Alert
                    severity="error"
                    sx={
                        style.errorAlert
                    }
                >
                    {error}
                </Alert>
            )}

            {filteredPqrs.length ===
                0 ? (
                <EmptyState
                    title="No hay PQR registradas"
                    description="Cuando los usuarios creen PQR, aparecerán en este espacio."
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
                                activeView="ASSIGNED"
                                takingPqrId={
                                    null
                                }
                                onTakePqr={() => { }}
                                updatingStatusId={
                                    updatingStatusId
                                }
                                updatingPriorityId={
                                    updatingPriorityId
                                }
                                statusValue={
                                    statusChanges[
                                    pqr.id
                                    ] ||
                                    pqr.status
                                }
                                priorityValue={
                                    priorityChanges[
                                    pqr.id
                                    ] ||
                                    pqr.priority ||
                                    ""
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
                                agents={
                                    agents
                                }
                                selectedAgentId={
                                    agentChanges[
                                    pqr.id
                                    ] ||
                                    pqr.assignedToId ||
                                    ""
                                }
                                assigningPqrId={
                                    assigningPqrId
                                }
                                onAgentChange={
                                    handleAgentChange
                                }
                                onAssignPqr={
                                    handleAssignPqr
                                }
                            />
                        )
                    )}
                </Box>
            )}

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

export default AdminPqrs;
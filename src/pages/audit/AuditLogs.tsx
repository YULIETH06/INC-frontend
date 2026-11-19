import {
    useMemo,
    useState,
} from "react";

import {
    Alert,
    Box,
    Typography,
} from "@mui/material";

import type {
    DataTableColumn,
} from "../../components/common/DataTable";

import type {
    AuditLog,
} from "../../interfaces/audit/auditLog.interface";

import {
    useAuditLogs,
} from "../../hooks/audit/useAuditLogs";

import type {
    AuditModuleTab,
} from "../../hooks/audit/useAuditLogs";

import {
    getAuditActionLabel,
    getAuditActionOptions,
    getAuditModuleLabel,
    isFailedAuditAction,
} from "../../utils/audit/auditLogUtils";

import {
    AUDIT_MODULE_LABELS,
    AUDIT_MODULE_ORDER,
} from "../../data/auditOptions";

import {
    getUserRoleLabel,
} from "../../utils/users/userRoleUtils";
import { formatDateTime } from "../../utils/common/dateUtils";

import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import ListToolbar from "../../components/common/ListToolbar";
import ActionButton from "../../components/common/ActionButton";
import ViewToggleButtons from "../../components/common/ViewToggleButtons";
import SearchableSelect from "../../components/common/inputs/SearchableSelect";
import DateInput from "../../components/common/inputs/DateInput";

import {
    filterStyles,
} from "../../styles/filterStyles";

// Pestañas: "Todos" y un módulo por pestaña.
const moduleTabOptions: {
    value: AuditModuleTab;
    label: string;
}[] = [
        {
            value: "ALL",
            label: "Todos",
        },
        ...AUDIT_MODULE_ORDER.map((module) => ({
            value: module,
            label: AUDIT_MODULE_LABELS[module],
        })),
    ];

// Página de auditoría: lista de las acciones realizadas en el sistema.
const AuditLogs = () => {
    const {
        moduleTab,
        actionFilter,
        userFilter,
        dateFrom,
        dateTo,
        hasActiveFilters,

        logs,
        total,
        loading,
        refreshing,
        error,

        users,
        loadingUsers,

        loadLogs,
        changeModuleTab,
        setActionFilter,
        setUserFilter,
        setDateFrom,
        setDateTo,
        clearFilters,
    } = useAuditLogs();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    // Opciones del filtro "Usuario".
    const userOptions = useMemo(
        () =>
            users.map((user) => ({
                label: `${user.name} – ${user.email}`,
                value: String(user.id),
            })),
        [users]
    );

    // Opciones del filtro "Acción" según la pestaña.
    const actionOptions = useMemo(
        () => getAuditActionOptions(moduleTab),
        [moduleTab]
    );

    // Cambia la página actual de la tabla.
    const handleChangePage = (
        _event: unknown,
        newPage: number
    ) => {
        setPage(newPage);
    };

    // Cambia la cantidad de registros visibles por página.
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    // Cada cambio de pestaña, búsqueda o filtro regresa a la primera página.
    const handleModuleTabChange = (
        value: AuditModuleTab
    ) => {
        changeModuleTab(value);
        setPage(0);
    };

    const handleSearchChange = (
        value: string
    ) => {
        setSearchTerm(value);
        setPage(0);
    };

    const handleFilterChange =
        (setter: (value: string) => void) =>
            (value: string) => {
                setter(value);
                setPage(0);
            };

    const handleClearFilters = () => {
        clearFilters();
        setPage(0);
    };

    // Busca dentro de los registros consultados.
    const filteredLogs = useMemo(() => {
        const normalizedSearch =
            searchTerm.toLowerCase().trim();

        if (!normalizedSearch) {
            return logs;
        }

        return logs.filter((log) =>
            [
                log.actorName ?? "",
                log.actorEmail ?? "",
                log.description,
                getAuditActionLabel(log.action),
            ].some((text) =>
                text
                    .toLowerCase()
                    .includes(normalizedSearch)
            )
        );
    }, [logs, searchTerm]);

    // Columnas de la tabla. "Módulo" solo aparece en la pestaña "Todos".
    const columns: DataTableColumn<AuditLog>[] = [
        {
            id: "createdAt",
            label: "Fecha y hora",
            render: (log) => (
                <Typography
                    variant="body2"
                    sx={{
                        whiteSpace: "nowrap",
                    }}
                >
                    {formatDateTime(log.createdAt)}
                </Typography>
            ),
        },
        {
            id: "actor",
            label: "Usuario",
            render: (log) => (
                <Box>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary",
                        }}
                    >
                        {log.actorName ?? log.actorEmail ?? "Desconocido"}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {log.actorRole
                            ? getUserRoleLabel(log.actorRole)
                            : "Sin sesión"}
                    </Typography>
                </Box>
            ),
        },
        ...(moduleTab === "ALL"
            ? [
                {
                    id: "module",
                    label: "Módulo",
                    render: (log: AuditLog) =>
                        getAuditModuleLabel(log.module),
                },
            ]
            : []),
        {
            id: "action",
            label: "Acción",
            render: (log) => (
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: isFailedAuditAction(log.action)
                            ? "error.main"
                            : "text.primary",
                    }}
                >
                    {getAuditActionLabel(log.action)}
                </Typography>
            ),
        },
        {
            id: "description",
            label: "Descripción",
            render: (log) => (
                <Typography variant="body2">
                    {log.description}
                </Typography>
            ),
        },
    ];

    if (loading) {
        return <LoadingBox />;
    }

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100%",
            }}
        >
            {/* Pestañas por módulo. */}
            <Box
                sx={{
                    marginBottom: "16px",
                }}
            >
                <ViewToggleButtons
                    value={moduleTab}
                    options={moduleTabOptions}
                    onChange={handleModuleTabChange}
                />
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        marginBottom: "16px",
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Aviso cuando hay más registros de los que se muestran. */}
            {total > logs.length && (
                <Alert
                    severity="info"
                    sx={{
                        marginBottom: "16px",
                    }}
                >
                    Se muestran los {logs.length} registros más recientes de {total}.
                    Usa los filtros para acotar la búsqueda.
                </Alert>
            )}

            <DataTable
                title="Auditoría"
                subtitle="Registro de las acciones realizadas en el sistema."
                actions={
                    <ListToolbar
                        searchValue={searchTerm}
                        onSearchChange={handleSearchChange}
                        searchPlaceholder="Buscar usuario, acción o descripción"
                        searchTooltip="Buscar en la auditoría"
                        filterActive={hasActiveFilters}
                        filterTitle="Filtrar auditoría"
                        filterTooltip="Filtrar por usuario, acción o fecha"
                        filterContent={
                            <Box sx={filterStyles.filterMenuContent}>
                                <SearchableSelect
                                    label="Usuario"
                                    value={userFilter}
                                    options={userOptions}
                                    onChange={handleFilterChange(setUserFilter)}
                                    size="small"
                                    loading={loadingUsers}
                                    placeholder="Todos los usuarios"
                                />

                                <SearchableSelect
                                    label="Acción"
                                    value={actionFilter}
                                    options={actionOptions}
                                    onChange={handleFilterChange(setActionFilter)}
                                    size="small"
                                    placeholder="Todas las acciones"
                                />

                                <Box sx={filterStyles.filterDateRow}>
                                    <DateInput
                                        label="Desde"
                                        value={dateFrom}
                                        onChange={handleFilterChange(setDateFrom)}
                                        maxDate={dateTo || undefined}
                                        sx={filterStyles.filterDateInput}
                                    />

                                    <DateInput
                                        label="Hasta"
                                        value={dateTo}
                                        onChange={handleFilterChange(setDateTo)}
                                        minDate={dateFrom || undefined}
                                        sx={filterStyles.filterDateInput}
                                    />
                                </Box>

                                <ActionButton
                                    actionType="clear"
                                    fullWidth
                                    variant="text"
                                    onClick={handleClearFilters}
                                    disabled={!hasActiveFilters}
                                    sx={filterStyles.clearFilterButton}
                                >
                                    Limpiar filtros
                                </ActionButton>
                            </Box>
                        }
                        onRefresh={() => loadLogs()}
                        refreshLoading={refreshing}
                    />
                }
                minWidth={900}
                columns={columns}
                rows={filteredLogs}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {filteredLogs.length === 0 && (
                <Box
                    sx={{
                        marginTop: "16px",
                    }}
                >
                    <EmptyState
                        title="No hay registros"
                        description={
                            logs.length === 0
                                ? "No hay acciones registradas con la pestaña y los filtros seleccionados."
                                : "Intenta buscar con otro nombre, acción o descripción."
                        }
                    />
                </Box>
            )}
        </Box>
    );
};

export default AuditLogs;
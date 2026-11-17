import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    AuditLog,
    AuditModule,
} from "../../interfaces/audit/auditLog.interface";

import type {
    User,
} from "../../interfaces/users/user.interface";

import {
    getAuditLogs,
} from "../../services/audit/auditLogService";

import {
    getAllUsers,
} from "../../services/users/userService";

import {
    getErrorMessage,
} from "../../utils/common/getErrorMessage";

// Pestaña seleccionada: todos los módulos o uno en particular.
export type AuditModuleTab = "ALL" | AuditModule;

// Hook encargado de consultar y filtrar la auditoría.
export const useAuditLogs = () => {
    // Pestaña y filtros.
    const [
        moduleTab,
        setModuleTab,
    ] = useState<AuditModuleTab>("ALL");

    const [actionFilter, setActionFilter] = useState("");
    const [userFilter, setUserFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Resultado de la consulta.
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(0);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // Usuarios para el filtro "Usuario".
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Consulta la auditoría con la pestaña y los filtros actuales.
    const loadLogs = useCallback(async () => {
        try {
            setRefreshing(true);
            setError("");

            const data = await getAuditLogs({
                module:
                    moduleTab === "ALL"
                        ? undefined
                        : moduleTab,
                action: actionFilter || undefined,
                actorUserId: userFilter
                    ? Number(userFilter)
                    : undefined,
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined,
            });

            setLogs(data.logs);
            setTotal(data.total);
            setLimit(data.limit);
        } catch (error) {
            console.error(error);

            setError(
                getErrorMessage(
                    error,
                    "Error al consultar la auditoría."
                )
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [
        moduleTab,
        actionFilter,
        userFilter,
        dateFrom,
        dateTo,
    ]);

    // Consulta de nuevo cada vez que cambia la pestaña o un filtro.
    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    // Carga los usuarios una sola vez.
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoadingUsers(true);

                const data = await getAllUsers();

                setUsers(data.users);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUsers(false);
            }
        };

        loadUsers();
    }, []);

    // Cambia de pestaña. El filtro de acción se limpia,
    // porque cada módulo tiene acciones distintas.
    const changeModuleTab = (
        value: AuditModuleTab
    ) => {
        setModuleTab(value);
        setActionFilter("");
    };

    // Limpia todos los filtros, sin cambiar la pestaña.
    const clearFilters = () => {
        setActionFilter("");
        setUserFilter("");
        setDateFrom("");
        setDateTo("");
    };

    // Indica si hay algún filtro aplicado.
    const hasActiveFilters =
        Boolean(actionFilter) ||
        Boolean(userFilter) ||
        Boolean(dateFrom) ||
        Boolean(dateTo);

    return {
        moduleTab,
        actionFilter,
        userFilter,
        dateFrom,
        dateTo,
        hasActiveFilters,

        logs,
        total,
        limit,
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
    };
};
import api from "../../api/axios";

import type {
    AuditLogFilters,
    AuditLogsResponse,
} from "../../interfaces/audit/auditLog.interface";

// Consulta los registros de la auditoría. Endpoint usado por ADMIN.
// Los filtros vacíos no se envían.
export const getAuditLogs = async (
    filters: AuditLogFilters
): Promise<AuditLogsResponse> => {
    const response = await api.get<AuditLogsResponse>(
        "/audit-logs",
        {
            params: filters,
        }
    );

    return response.data;
};
import type { UserRole } from "../users/user.interface";

// Módulos del sistema que registran acciones en la auditoría.
export type AuditModule =
    | "AUTH"
    | "USERS"
    | "PQRS"
    | "POSITION_MANAGEMENT"
    | "HUMAN_TALENT";

// Registro de la auditoría tal como lo devuelve el backend.
export interface AuditLog {
    id: number;
    actorUserId: number | null;
    actorName: string | null;
    actorEmail: string | null;
    actorRole: UserRole | null;
    module: AuditModule;
    action: string;
    entityType: string;
    entityId: number | null;
    description: string;
    createdAt: string;
}

// Filtros que se envían al backend.
export interface AuditLogFilters {
    module?: AuditModule;
    action?: string;
    actorUserId?: number;
    dateFrom?: string;
    dateTo?: string;
}

// Respuesta del backend al consultar la auditoría.
export interface AuditLogsResponse {
    logs: AuditLog[];
    total: number;
    limit: number;
}
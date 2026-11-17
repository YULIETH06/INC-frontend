import type {
    AuditModule,
} from "../../interfaces/audit/auditLog.interface";

// Nombre legible de cada módulo. También son los textos de las pestañas.
export const AUDIT_MODULE_LABELS: Record<AuditModule, string> = {
    AUTH: "Inicio de sesión",
    USERS: "Usuarios",
    PQRS: "PQR",
    POSITION_MANAGEMENT: "Perfiles de cargo",
    HUMAN_TALENT: "Talento Humano",
};

// Orden en que aparecen las pestañas.
export const AUDIT_MODULE_ORDER: AuditModule[] = [
    "AUTH",
    "USERS",
    "PQRS",
    "POSITION_MANAGEMENT",
    "HUMAN_TALENT",
];

// Acciones de cada módulo con su nombre legible.
export const AUDIT_ACTIONS_BY_MODULE: Record<
    AuditModule,
    {
        value: string;
        label: string;
    }[]
> = {
    AUTH: [
        { value: "LOGIN_SUCCESS", label: "Inició sesión" },
        { value: "LOGIN_FAILED", label: "Intento fallido" },
        { value: "USER_REGISTERED", label: "Se registró" },
        { value: "OWN_PASSWORD_CHANGED", label: "Cambió su contraseña" },
    ],
    USERS: [
        { value: "USER_ROLE_CHANGED", label: "Cambió rol" },
        { value: "USER_EMAIL_CHANGED", label: "Cambió correo" },
        { value: "USER_PASSWORD_RESET", label: "Restableció contraseña" },
        { value: "USER_DEACTIVATED", label: "Desactivó usuario" },
        { value: "USER_ACTIVATED", label: "Activó usuario" },
        { value: "USER_POSITION_ASSIGNED", label: "Asignó cargo" },
        { value: "USER_POSITION_ENDED", label: "Retiró cargo" },
        { value: "USERS_BULK_UPLOADED", label: "Carga masiva" },
        { value: "USER_SIGNATURE_UPDATED", label: "Registró firma" },
    ],
    PQRS: [
        { value: "PQR_CREATED", label: "Creó PQR" },
        { value: "PQR_TAKEN", label: "Tomó PQR" },
        { value: "PQR_AGENT_ASSIGNED", label: "Asignó agente" },
        { value: "PQR_AGENT_UNASSIGNED", label: "Quitó agente" },
        { value: "PQR_STATUS_CHANGED", label: "Cambió estado" },
        { value: "PQR_PRIORITY_CHANGED", label: "Cambió prioridad" },
        { value: "PQR_RATED", label: "Calificó PQR" },
    ],
    POSITION_MANAGEMENT: [
        { value: "POSITION_REVISION_CREATED", label: "Creó revisión" },
        { value: "POSITION_REVISION_UPDATED", label: "Editó revisión" },
        { value: "POSITION_REVISION_PUBLISHED", label: "Publicó revisión" },
        { value: "POSITION_REQUIREMENT_ADDED", label: "Agregó requisito" },
        { value: "POSITION_REQUIREMENT_UPDATED", label: "Editó requisito" },
        { value: "POSITION_REQUIREMENT_DELETED", label: "Eliminó requisito" },
        { value: "POSITION_COMPETENCY_ADDED", label: "Agregó competencia" },
        { value: "POSITION_COMPETENCY_UPDATED", label: "Editó competencia" },
        { value: "POSITION_COMPETENCY_DELETED", label: "Eliminó competencia" },
    ],
    HUMAN_TALENT: [
        { value: "REQUISITION_CREATED", label: "Creó requisición" },
        { value: "REQUISITION_APPROVED", label: "Aprobó requisición" },
        { value: "REQUISITION_REJECTED", label: "Rechazó requisición" },
        { value: "REQUISITION_CANCELLED", label: "Canceló requisición" },
        { value: "HIRING_CONFIRMATION_CREATED", label: "Creó confirmación" },
        { value: "HIRING_CONFIRMATION_APPROVED", label: "Aprobó contratación" },
        { value: "HIRING_CONFIRMATION_REJECTED", label: "Rechazó contratación" },
        { value: "HIRING_CONFIRMATION_CANCELLED", label: "Canceló contratación" },
        { value: "CANDIDATE_UPLOADED", label: "Cargó candidato" },
        { value: "CANDIDATE_UPDATED", label: "Editó candidato" },
        { value: "CANDIDATE_DELETED", label: "Eliminó candidato" },
        { value: "CANDIDATE_SUBMISSION_CLOSED", label: "Cerró recepción" },
        { value: "CANDIDATE_SUBMISSION_REOPENED", label: "Reabrió recepción" },
        { value: "CANDIDATES_PRESELECTED", label: "Preseleccionó candidatos" },
        { value: "CANDIDATE_VALIDATION_STARTED", label: "Inició validación" },
        { value: "CANDIDATE_POSITION_VALIDATED", label: "Validó cargo" },
        { value: "CANDIDATE_REQUIREMENTS_VALIDATED", label: "Validó postulante" },
        { value: "TECHNICAL_EVALUATION_SAVED", label: "Registró evaluación técnica" },
        { value: "TECHNICAL_EVALUATION_APPROVED", label: "Aprobó evaluación técnica" },
        { value: "COMPETENCY_EVALUATION_COMPLETED", label: "Registró evaluación de competencias" },
    ],
};

// Nombre legible de cada acción, sin importar el módulo.
const auditActionLabels: Record<string, string> =
    Object.fromEntries(
        Object.values(AUDIT_ACTIONS_BY_MODULE)
            .flat()
            .map((action) => [
                action.value,
                action.label,
            ])
    );

// Convierte el código del módulo en un nombre legible.
export const getAuditModuleLabel = (
    module: AuditModule
) => {
    return AUDIT_MODULE_LABELS[module] ?? module;
};

// Convierte el código de la acción en un nombre legible.
export const getAuditActionLabel = (
    action: string
) => {
    return auditActionLabels[action] ?? action;
};

// Opciones del filtro "Acción" según la pestaña.
// En "Todos" se muestran todas, agrupadas por módulo.
export const getAuditActionOptions = (
    moduleTab: "ALL" | AuditModule
) => {
    if (moduleTab !== "ALL") {
        return AUDIT_ACTIONS_BY_MODULE[moduleTab];
    }

    return AUDIT_MODULE_ORDER.flatMap((module) =>
        AUDIT_ACTIONS_BY_MODULE[module].map((action) => ({
            ...action,
            group: AUDIT_MODULE_LABELS[module],
        }))
    );
};

// Indica si la acción es un intento fallido, para resaltarla en la tabla.
export const isFailedAuditAction = (
    action: string
) => {
    return action === "LOGIN_FAILED";
};

// Formatea la fecha y hora del registro. Ejemplo: 06/11/2026, 2:30 p. m.
export const formatAuditDateTime = (
    value: string
) => {
    return new Date(value).toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
    });
};
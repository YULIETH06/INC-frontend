import type {
    AuditModule,
} from "../../interfaces/audit/auditLog.interface";

import {
    AUDIT_ACTIONS_BY_MODULE,
    AUDIT_MODULE_LABELS,
    AUDIT_MODULE_ORDER,
} from "../../data/auditOptions";

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
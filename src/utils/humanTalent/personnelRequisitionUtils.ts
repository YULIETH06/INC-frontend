import type { ChipProps } from "@mui/material";

import type {
    PersonnelHiringConfirmationApproval,
    PersonnelRequisition,
    PersonnelRequisitionApproval,
} from "../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

import { formatMoney } from "../common/numberUtils";

export interface ApprovalSlot<T> {
    title: string;
    approval?: T;
}

type ApprovalWithComment =
    | PersonnelRequisitionApproval
    | PersonnelHiringConfirmationApproval;

// Valida si un valor contiene información.
export const hasValue = (
    value?: string | number | null
): boolean => {
    return (
        value !== null &&
        value !== undefined &&
        value !== ""
    );
};

// Formatea valores monetarios únicamente cuando existen.
export const formatOptionalMoney = (
    value?: string | number | null
): string => {
    if (!hasValue(value)) return "";

    return formatMoney(value as string | number);
};

// Devuelve el color visual del estado general.
export const getRequisitionStatusColor = (
    status: PersonnelRequisition["status"]
): ChipProps["color"] => {
    if (status === "APROBADA") {
        return "success";
    }

    if (
        status === "RECHAZADA" ||
        status === "CANCELADA"
    ) {
        return "error";
    }

    return "warning";
};

// Organiza las aprobaciones iniciales en los espacios del formato.
export const getRequisitionApprovalSlots = (
    approvals?: PersonnelRequisitionApproval[]
): ApprovalSlot<PersonnelRequisitionApproval>[] => {
    const sortedApprovals = [...(approvals || [])].sort(
        (a, b) => a.approvalOrder - b.approvalOrder
    );

    if (sortedApprovals.length >= 3) {
        return [
            {
                title: "Jefe de área",
                approval: sortedApprovals[0],
            },
            {
                title: "Jefe de departamento",
                approval: sortedApprovals[1],
            },
            {
                title: "Gerente general",
                approval: sortedApprovals[2],
            },
        ];
    }

    if (sortedApprovals.length === 2) {
        return [
            {
                title: "Jefe de área",
                approval: undefined,
            },
            {
                title: "Jefe de departamento",
                approval: sortedApprovals[0],
            },
            {
                title: "Gerente general",
                approval: sortedApprovals[1],
            },
        ];
    }

    if (sortedApprovals.length === 1) {
        return [
            {
                title: "Jefe de área",
                approval: undefined,
            },
            {
                title: "Jefe de departamento",
                approval: undefined,
            },
            {
                title: "Gerente general",
                approval: sortedApprovals[0],
            },
        ];
    }

    return [
        {
            title: "Jefe de área",
            approval: undefined,
        },
        {
            title: "Jefe de departamento",
            approval: undefined,
        },
        {
            title: "Gerente general",
            approval: undefined,
        },
    ];
};

// Organiza las aprobaciones de Talento Humano.
export const getHiringApprovalSlots = (
    approvals?: PersonnelHiringConfirmationApproval[]
): ApprovalSlot<PersonnelHiringConfirmationApproval>[] => {
    return [
        {
            title: "Analista de Talento Humano",
            approval: approvals?.[0],
        },
        {
            title: "Jefe de Talento Humano",
            approval: approvals?.[1],
        },
    ];
};

// Obtiene el comentario relacionado con el estado final.
export const getRequisitionStatusComment = (
    requisition: PersonnelRequisition
) => {
    const allApprovals: ApprovalWithComment[] = [
        ...(requisition.approvals || []),
        ...(requisition.hiringConfirmation?.approvals || []),
    ];

    const latestDecisionWithComment = [...allApprovals]
        .filter((approval) =>
            Boolean(approval.comment?.trim())
        )
        .sort((a, b) => {
            const dateA = a.decidedAt
                ? new Date(a.decidedAt).getTime()
                : 0;

            const dateB = b.decidedAt
                ? new Date(b.decidedAt).getTime()
                : 0;

            return dateB - dateA;
        })[0];

    const comment =
        latestDecisionWithComment?.comment?.trim() || "";

    const isCommentRequired =
        requisition.status === "RECHAZADA" ||
        requisition.status === "CANCELADA";

    const title =
        requisition.status === "RECHAZADA"
            ? "Motivo del rechazo"
            : requisition.status === "CANCELADA"
                ? "Motivo de la cancelación"
                : "";

    return {
        comment,
        title,
        showComment:
            isCommentRequired && Boolean(comment),
    };
};
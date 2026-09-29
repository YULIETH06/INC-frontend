import type { PositionProfileRevisionStatus } from "../../interfaces/positionManagement/positionProfileRevision.interface";

export const revisionStatusConfig: Record<
    PositionProfileRevisionStatus,
    {
        label: string;
        color: "warning" | "success" | "default";
    }
> = {
    BORRADOR: {
        label: "Borrador",
        color: "warning",
    },
    VIGENTE: {
        label: "Vigente",
        color: "success",
    },
    OBSOLETA: {
        label: "Obsoleta",
        color: "default",
    },
};
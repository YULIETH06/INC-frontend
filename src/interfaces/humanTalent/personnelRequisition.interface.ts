import type { City } from "../common/city.interface";
import type {
    IdentificationType
} from "../common/identificationType.interface";
import type {
    PositionProfileRevision
} from "../positionManagement/positionProfileRevision.interface";

// Motivos permitidos para una requisición de personal.
export type RequisitionReason =
    | "CARGO_NUEVO"
    | "REEMPLAZO_RETIRO"
    | "INCREMENTO_PRODUCCION"
    | "SOLICITUD_PRACTICANTES"
    | "OTROS";

// Tipos principales de contratación permitidos.
export type ContractType = "DIRECTO" | "TEMPORAL" | "PRACTICANTE";

// Tipos de contrato directo permitidos.
export type DirectContractType = "INDEFINIDO" | "FIJO";

// Tipos de practicante permitidos.
export type InternContractType = "APRENDIZ" | "PASANTE" | "ROTANTE";

// Decisiones permitidas en el flujo de aprobación.
export type ApprovalDecision = "APROBADA" | "RECHAZADA" | "CANCELADA";

// Estados actuales de una requisición de personal.
export type RequisitionStatus =
    | "EN_APROBACION"
    | "PENDIENTE_CONFIRMACION_TALENTO_HUMANO"
    | "PENDIENTE_APROBACION_TALENTO_HUMANO"
    | "APROBADA"
    | "RECHAZADA"
    | "CANCELADA";

// Estados permitidos para el cargue de candidatos.
export type CandidateSubmissionStatus =
    | "NO_INICIADA"
    | "ABIERTA"
    | "CERRADA";

// Acciones registradas en el historial del cargue de candidatos.
export type CandidateSubmissionHistoryAction =
    | "REAPERTURA"
    | "CIERRE";

// Estados de la confirmación final de contratación.
export type HiringConfirmationStatus =
    | "PENDIENTE_APROBACION"
    | "APROBADA"
    | "RECHAZADA"
    | "CANCELADA";

// Área relacionada con una requisición de personal.
export interface Department {
    id: number;
    code: string;
    name: string;
}

// Perfil de cargo relacionado con una requisición de personal.
export interface PositionProfile {
    id: number;
    code: string;
    name: string;
}

// Usuario relacionado con una requisición o aprobación.
export interface RequisitionUser {
    id: number;
    name: string;
    email: string;
    role: string;
    signatureUrl?: string | null;
}

// Candidato registrado en una requisición de personal.
export interface PersonnelRequisitionCandidate {
    id: number;
    requisitionId: number;

    identificationTypeId: number;
    identificationType: IdentificationType;
    identificationNumber: string;

    name: string;
    observation: string | null;

    originalName: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;

    uploadedById: number;
    uploadedBy?: RequisitionUser;

    createdAt: string;
    updatedAt: string;
}

// Datos manejados en el formulario de candidatos.
export interface PersonnelRequisitionCandidateForm {
    identificationTypeId: string;
    identificationNumber: string;

    name: string;
    observation: string;
    file: File | null;
}

// Errores de validación YUP del formulario de candidatos.
export interface PersonnelRequisitionCandidateFormErrors {
    identificationTypeId: string;
    identificationNumber: string;

    name: string;
    observation: string;
    file: string;
}

// Aprobación jerárquica de una requisición.
export interface PersonnelRequisitionApproval {
    id: number;
    requisitionId: number;

    approvalOrder: number;

    departmentId: number;
    department?: Department;

    approverPositionId: number;
    approverPosition?: PositionProfile;

    approverAssignmentId: number;

    approverUserId: number;
    approverUser?: RequisitionUser;

    decision: ApprovalDecision | null;

    decidedById: number | null;
    decidedBy?: RequisitionUser | null;

    assignedAt: string;
    decidedAt: string | null;

    comment: string | null;
    isCurrent: boolean;

    createdAt: string;
    updatedAt: string;
}

// Confirmación final de contratación registrada por Talento Humano.
export interface PersonnelHiringConfirmation {
    id: number;
    requisitionId: number;

    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;

    approvedSalary: string;
    status: HiringConfirmationStatus;

    createdById: number;
    createdBy?: RequisitionUser;

    approvals?: PersonnelHiringConfirmationApproval[];

    createdAt: string;
    updatedAt: string;
}

// Aprobación de la confirmación de contratación.
export interface PersonnelHiringConfirmationApproval {
    id: number;
    hiringConfirmationId: number;

    approvalOrder: number;

    approverPositionId: number;
    approverPosition?: PositionProfile;

    approverAssignmentId: number;

    approverUserId: number;
    approverUser?: RequisitionUser;

    decision: ApprovalDecision | null;

    decidedById: number | null;
    decidedBy?: RequisitionUser | null;

    assignedAt: string;
    decidedAt: string | null;

    comment: string | null;
    isCurrent: boolean;

    createdAt: string;
    updatedAt: string;
}

// Estructura principal de una requisición de personal.
export interface PersonnelRequisition {
    id: number;
    requestDate: string;

    departmentId: number;
    department: Department;

    positionId: number;
    position: PositionProfile;

    positionRevisionId: number | null;
    positionRevision: PositionProfileRevision | null;

    reason: RequisitionReason;
    otherReason: string | null;

    cityId: number;
    city: City;

    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;

    proposedSalary: string;
    status: RequisitionStatus;

    candidateSubmissionStatus: CandidateSubmissionStatus;
    candidateSubmissionDeadlineAt: string | null;
    candidateSubmissionClosedAt: string | null;
    candidateSubmissionLateReason: string | null;

    createdById: number;
    createdBy?: RequisitionUser;

    approvals?: PersonnelRequisitionApproval[];
    hiringConfirmation?: PersonnelHiringConfirmation | null;

    createdAt: string;
    updatedAt: string;
}

// Datos del formulario para crear una requisición de personal.
export interface PersonnelRequisitionForm {
    departmentId: string;
    positionId: string;
    positionRevisionId: string;
    reason: RequisitionReason | "";
    otherReason: string;
    cityId: string;

    contractType: ContractType | "";
    directContractType: DirectContractType | "";
    contractDurationMonths: string;
    internContractType: InternContractType | "";

    proposedSalary: string;
}

// Datos enviados al backend para crear una requisición de personal.
export interface CreatePersonnelRequisitionData {
    departmentId: number;
    positionId: number;
    positionRevisionId: number;
    reason: RequisitionReason;
    otherReason: string;
    cityId: number;

    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;

    proposedSalary: number;
}

// Datos enviados al backend para aprobar, rechazar o cancelar una requisición.
export interface DecidePersonnelRequisitionData {
    decision: ApprovalDecision;
    comment?: string | null;
}

// Datos enviados al backend para registrar la confirmación final de contratación.
export interface CreatePersonnelHiringConfirmationData {
    contractType: ContractType;
    directContractType: DirectContractType | null;
    contractDurationMonths: number | null;
    internContractType: InternContractType | null;
    approvedSalary: number;
}

// Datos enviados al backend para aprobar, rechazar o cancelar una confirmación de contratación.
export interface DecidePersonnelHiringConfirmationData {
    decision: ApprovalDecision;
    comment?: string | null;
}

// Respuesta al crear una requisición de personal.
export interface CreatePersonnelRequisitionResponse {
    message: string;
    requisition: PersonnelRequisition;
}

// Respuesta al aprobar, rechazar o cancelar una requisición.
export interface DecidePersonnelRequisitionResponse {
    message: string;
    approval: PersonnelRequisitionApproval;
}

// Respuesta al obtener múltiples requisiciones de personal.
export interface PersonnelRequisitionResponse {
    message: string;
    requisitions: PersonnelRequisition[];
}

// Respuesta al obtener las áreas activas.
export interface DepartmentsResponse {
    message: string;
    departments: Department[];
}

// Respuesta al registrar una confirmación final de contratación.
export interface CreatePersonnelHiringConfirmationResponse {
    message: string;
    hiringConfirmation: PersonnelHiringConfirmation;
}

// Respuesta al aprobar, rechazar o cancelar una confirmación de contratación.
export interface DecidePersonnelHiringConfirmationResponse {
    message: string;
    approval: PersonnelHiringConfirmationApproval;
}

// Errores de validación del formulario para crear una requisición.
export interface CreatePersonnelRequisitionFormErrors {
    departmentId: string;
    positionId: string;
    positionRevisionId: string;
    reason: string;
    otherReason: string;
    cityId: string;
    contractType: string;
    directContractType: string;
    contractDurationMonths: string;
    internContractType: string;
    proposedSalary: string;
}

// Respuesta al registrar, actualizar o eliminar un candidato.
export interface PersonnelRequisitionCandidateResponse {
    message: string;
    candidate: PersonnelRequisitionCandidate;
}

// Respuesta al consultar los candidatos de una requisición.
export interface PersonnelRequisitionCandidatesResponse {
    message: string;
    candidates: PersonnelRequisitionCandidate[];
    isCandidateManager: boolean;
}

// Movimiento registrado después del primer cierre del cargue.
export interface PersonnelCandidateSubmissionHistory {
    id: number;
    requisitionId: number;

    action: CandidateSubmissionHistoryAction;
    reason: string | null;

    performedById: number;
    performedAt: string;

    performedBy: RequisitionUser;
}

// Respuesta al consultar el historial del cargue de candidatos.
export interface PersonnelCandidateSubmissionHistoryResponse {
    message: string;
    history: PersonnelCandidateSubmissionHistory[];
}

// Datos enviados para cerrar el cargue.
export interface ClosePersonnelRequisitionCandidatesData {
    lateReason?: string;
}

// Datos enviados para reabrir el cargue.
export interface ReopenPersonnelRequisitionCandidatesData {
    reason: string;
}

// Respuesta al cambiar el estado del cargue de candidatos.
export interface PersonnelRequisitionCandidateSubmissionResponse {
    message: string;

    requisition: {
        id: number;
        status: RequisitionStatus;

        // Puede cambiar entre ABIERTA y CERRADA
        // según la acción realizada sobre el cargue.
        candidateSubmissionStatus: CandidateSubmissionStatus;

        // Conserva siempre la fecha del primer cierre.
        candidateSubmissionClosedAt: string | null;

        // Se devuelve actualmente en la respuesta del cierre.
        candidateSubmissionDeadlineAt?: string | null;

        // Se devuelve actualmente en la respuesta del cierre.
        candidateSubmissionLateReason?: string | null;

        updatedAt: string;

        _count: {
            candidates: number;
        };
    };
}
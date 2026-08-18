import type { IdentificationType } from "../common/identificationType.interface";

import type {
    CandidateSubmissionStatus,
    Department,
    PositionProfile,
    RequisitionUser,
} from "./personnelRequisition.interface";

import type {
    PositionProfileRevisionStatus,
} from "../positionManagement/positionProfileRevision.interface";

// Conceptos permitidos en la Fase 1.
export type CandidateApplicationConcept =
    | "INGRESO"
    | "MODIFICACION_CARGO";

// Tipos de cargo permitidos en la Fase 2.
export type CandidatePositionType =
    | "NUEVO_CARGO"
    | "CARGO_EXISTENTE";

// Estados calculados del proceso de validación.
export type CandidateValidationStatus =
    | "SIN_INICIAR"
    | "CONCEPTO_APLICACION_COMPLETADO"
    | "VALIDACION_CARGO_COMPLETADA"
    | "VALIDACION_COMPLETADA";

// Resumen de una validación dentro del listado.
export interface PersonnelCandidateValidationSummary {
    id: number;
    applicationConcept: CandidateApplicationConcept;
    positionType: CandidatePositionType | null;
    isPositionProfileCurrent: boolean | null;
    isSuitable: boolean | null;
    completedStep: number;
    validatedAt: string | null;
}

// Candidato mostrado en el listado de validaciones.
export interface PersonnelCandidateValidationListItem {
    id: number;
    requisitionId: number;
    identificationNumber: string;
    name: string;

    identificationType: IdentificationType;

    requisition: {
        id: number;
        candidateSubmissionStatus:
            CandidateSubmissionStatus;
        department: Department;
        position: PositionProfile;
    };

    validation:
        PersonnelCandidateValidationSummary | null;

    validationStatus:
        CandidateValidationStatus;
}

// Respuesta del listado de candidatos.
export interface PersonnelCandidateValidationsResponse {
    message: string;

    candidates:
        PersonnelCandidateValidationListItem[];

    canManageValidation: boolean;
}

// Descripción de un requisito usada en la validación.
export interface CandidateValidationRequirementDescription {
    id: number;
    description: string;

    requirement: {
        id: number;
        name: string;
    };
}

// Revisión exacta utilizada por la requisición.
export interface CandidateValidationPositionRevision {
    id: number;
    revisionNumber: number;
    status: PositionProfileRevisionStatus;

    requirementDescriptions:
        CandidateValidationRequirementDescription[];
}

// Evaluación ya registrada para una descripción.
export interface PersonnelCandidateRequirementValidation {
    id: number;
    requirementDescriptionId: number;
    complies: boolean;
    evidence: string | null;
    gapClosure: string | null;
}

// Validación completa guardada para el candidato.
export interface PersonnelCandidateValidation {
    id: number;

    applicationConcept:
        CandidateApplicationConcept;

    positionType:
        CandidatePositionType | null;

    changeControlCode: string | null;

    isPositionProfileCurrent:
        boolean | null;

    isSuitable:
        boolean | null;

    completedStep: number;

    validatedAt:
        string | null;

    performedBy:
        Pick<RequisitionUser, "id" | "name"> | null;

    requirementValidations:
        PersonnelCandidateRequirementValidation[];
}

// Candidato mostrado en el detalle.
export interface PersonnelCandidateValidationCandidate {
    id: number;
    requisitionId: number;
    identificationNumber: string;
    name: string;

    identificationType:
        IdentificationType;

    requisition: {
        id: number;

        candidateSubmissionStatus:
            CandidateSubmissionStatus;

        positionRevisionId: number;

        department:
            Department;

        position:
            PositionProfile;

        positionRevision:
            CandidateValidationPositionRevision;
    };

    validation:
        PersonnelCandidateValidation | null;
}

// Respuesta del detalle.
export interface PersonnelCandidateValidationDetailResponse {
    message: string;

    candidate:
        PersonnelCandidateValidationCandidate;

    canManageValidation: boolean;
}

// Formulario de la Fase 1.
export interface CandidateApplicationConceptForm {
    applicationConcept:
        CandidateApplicationConcept | "";
}

// Errores Yup de la Fase 1.
export interface CandidateApplicationConceptFormErrors {
    applicationConcept: string;
}

// Formulario de la Fase 2.
export interface CandidatePositionValidationForm {
    positionType:
        CandidatePositionType | "";

    changeControlCode: string;
}

// Errores Yup de la Fase 2.
export interface CandidatePositionValidationFormErrors {
    positionType: string;
    changeControlCode: string;
}

// Evaluación editable de una descripción.
export interface CandidateRequirementValidationForm {
    requirementDescriptionId: number;
    complies: boolean | null;
    evidence: string;
    gapClosure: string;
}

// Formulario de la Fase 3.
export interface CandidateValidationForm {
    isSuitable: boolean | null;

    requirementValidations:
        CandidateRequirementValidationForm[];
}

// Errores de una descripción evaluada en la Fase 3.
export interface CandidateRequirementValidationFormErrors {
    complies: string;
    evidence: string;
    gapClosure: string;
}

// Errores Yup de la Fase 3.
export interface CandidateValidationFormErrors {
    isSuitable: string;

    requirementValidations:
        CandidateRequirementValidationFormErrors[];
}

// Datos enviados al backend en la Fase 1.
export interface CreatePersonnelCandidateValidationData {
    applicationConcept:
        CandidateApplicationConcept;
}

// Datos enviados al backend en la Fase 2.
export interface UpdatePersonnelCandidatePositionValidationData {
    positionType:
        CandidatePositionType;

    changeControlCode:
        string | null;
}

// Evaluación enviada al backend en la Fase 3.
export interface CandidateRequirementValidationData {
    requirementDescriptionId: number;
    complies: boolean;
    evidence: string | null;
    gapClosure: string | null;
}

// Datos enviados al backend en la Fase 3.
export interface CompletePersonnelCandidateValidationData {
    isSuitable: boolean;

    requirementValidations:
        CandidateRequirementValidationData[];
}

// Respuesta general al guardar una fase de validación.
export interface PersonnelCandidateValidationActionResponse {
    message: string;
}
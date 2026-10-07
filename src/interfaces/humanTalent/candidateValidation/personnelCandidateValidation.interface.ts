import type { IdentificationType } from "../../common/identificationType.interface";

import type {
    CandidateSubmissionStatus,
    Department,
    PositionProfile,
    RequisitionUser,
} from "../requisitions/personnelRequisition.interface";

import type {
    PositionProfileRevisionStatus,
} from "../../positionManagement/positionProfileRevision.interface";

// Conceptos permitidos en la Fase 1.
export type CandidateApplicationConcept =
    | "INGRESO"
    | "MODIFICACION_CARGO";

// Tipos de cargo permitidos en la Fase 2.
export type CandidatePositionType =
    | "NUEVO_CARGO"
    | "CARGO_EXISTENTE";

// Estados internos de la Fase 4.
export type CandidateTechnicalEvaluationStatus =
    | "EN_REGISTRO"
    | "PENDIENTE_APROBACION"
    | "APROBADA";

// Resultados permitidos para una competencia en la Fase 5.
export type CandidateCompetencyResult =
    | "Destacada"
    | "Por destacar";

// Estados calculados del proceso de validación.
export type CandidateValidationStatus =
    | "SIN_INICIAR"
    | "CONCEPTO_APLICACION_COMPLETADO"
    | "VALIDACION_CARGO_COMPLETADA"
    | "VALIDACION_COMPLETADA"
    | "EVALUACION_TECNICA_EN_REGISTRO"
    | "EVALUACION_TECNICA_PENDIENTE_APROBACION"
    | "EVALUACION_TECNICA_COMPLETADA"
    | "EVALUACION_COMPETENCIAS_COMPLETADA";

// Resumen de la Evaluación Técnica dentro del listado.
export interface PersonnelCandidateTechnicalEvaluationSummary {
    status: CandidateTechnicalEvaluationStatus;
    isSuitable: boolean | null;
}

// Resumen de la Evaluación de Competencias dentro del listado.
export interface PersonnelCandidateCompetencyEvaluationSummary {
    isSuitable: boolean;
}

// Resumen de una validación dentro del listado.
export interface PersonnelCandidateValidationSummary {
    id: number;
    applicationConcept: CandidateApplicationConcept;
    positionType: CandidatePositionType | null;
    isPositionProfileCurrent: boolean | null;
    isSuitable: boolean | null;
    completedStep: number;
    validatedAt: string | null;

    personnelCandidateTechnicalEvaluation:
    PersonnelCandidateTechnicalEvaluationSummary | null;

    competencyEvaluation:
    PersonnelCandidateCompetencyEvaluationSummary | null;
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

// Competencia configurada en la revisión del cargo.
export interface CandidateValidationCompetencyDescription {
    id: number;
    competency: string;

    competencyType: {
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

    positionCompetencyDescriptions:
    CandidateValidationCompetencyDescription[];
}

// Evaluación ya registrada para una descripción.
export interface PersonnelCandidateRequirementValidation {
    id: number;
    requirementDescriptionId: number;
    complies: boolean;
    evidence: string | null;
    gapClosure: string | null;
}

// Evaluación Técnica registrada en la Fase 4.
export interface PersonnelCandidateTechnicalEvaluation {
    id: number;

    interviewScore: string | null;
    interviewRecordedAt: string | null;

    examScore: string | null;
    examRecordedAt: string | null;

    examEvidenceOriginalName: string | null;
    examEvidenceFileName: string | null;
    examEvidenceFileUrl: string | null;
    examEvidenceMimeType: string | null;
    examEvidenceFileSize: number | null;
    examEvidenceUploadedAt: string | null;

    status:
    CandidateTechnicalEvaluationStatus;

    isSuitable: boolean | null;

    enteredById: number;

    enteredBy:
    Pick<RequisitionUser, "id" | "name">;

    approvedById: number | null;

    approvedBy:
    Pick<RequisitionUser, "id" | "name"> | null;

    approvedAt: string | null;
}

// Prueba psicotécnica registrada en la Fase 5.
export interface PersonnelCandidatePsychotechnicalTest {
    id: number;
    appliedTest: string;
    appliedAt: string;
    evaluationAspects: string;
    resultDescription: string;
    createdById: number;
    createdAt: string;
    updatedAt: string;

    createdBy:
    Pick<RequisitionUser, "id" | "name">;
}

// Competencia evaluada en la Fase 5.
export interface PersonnelCandidateCompetencyValidation {
    id: number;
    competencyDescriptionId: number;
    result: CandidateCompetencyResult;

    competencyDescription:
    CandidateValidationCompetencyDescription;
}

// Cierre general de la Fase 5.
export interface PersonnelCandidateCompetencyEvaluation {
    id: number;
    candidateValidationId: number;
    generalConcept: string;
    isSuitable: boolean;
    validatedAt: string;
    performedById: number;
    createdAt: string;
    updatedAt: string;

    performedBy:
    Pick<RequisitionUser, "id" | "name">;
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

    personnelCandidateRequirementValidations:
    PersonnelCandidateRequirementValidation[];

    personnelCandidateTechnicalEvaluation:
    PersonnelCandidateTechnicalEvaluation | null;

    psychotechnicalTests:
    PersonnelCandidatePsychotechnicalTest[];

    competencyValidations:
    PersonnelCandidateCompetencyValidation[];

    competencyEvaluation:
    PersonnelCandidateCompetencyEvaluation | null;
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

        createdById: number;

        createdBy:
        Pick<RequisitionUser, "id" | "name">;

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

    canApproveTechnicalEvaluation: boolean;
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

// Formulario de calificaciones y evidencia de la Fase 4.
export interface CandidateTechnicalEvaluationForm {
    interviewScore: number | null;
    examScore: number | null;
    examEvidenceFile: File | null;
}

// Errores de las calificaciones y evidencia de la Fase 4.
export interface CandidateTechnicalEvaluationFormErrors {
    interviewScore: string;
    examScore: string;
    examEvidenceFile: string;
}

// Formulario de confirmación de la Fase 4.
export interface CandidateTechnicalEvaluationApprovalForm {
    isSuitable: boolean | null;
}

// Errores de confirmación de la Fase 4.
export interface CandidateTechnicalEvaluationApprovalFormErrors {
    isSuitable: string;
}

// Prueba psicotécnica editable de la Fase 5.
export interface CandidatePsychotechnicalTestForm {
    appliedTest: string;
    evaluationAspects: string;
    resultDescription: string;
}

// Competencia editable de la Fase 5.
export interface CandidateCompetencyValidationForm {
    competencyDescriptionId: number;
    result: CandidateCompetencyResult | "";
}

// Formulario de la Fase 5.
export interface CandidateCompetencyEvaluationForm {
    psychotechnicalTests:
    CandidatePsychotechnicalTestForm[];

    competencyValidations:
    CandidateCompetencyValidationForm[];

    generalConcept: string;

    isSuitable: boolean | null;
}

// Errores de una prueba psicotécnica de la Fase 5.
export interface CandidatePsychotechnicalTestFormErrors {
    appliedTest: string;
    evaluationAspects: string;
    resultDescription: string;
}

// Errores de una competencia de la Fase 5.
export interface CandidateCompetencyValidationFormErrors {
    result: string;
}

// Errores Yup de la Fase 5.
export interface CandidateCompetencyEvaluationFormErrors {
    psychotechnicalTests:
    CandidatePsychotechnicalTestFormErrors[];

    competencyValidations:
    CandidateCompetencyValidationFormErrors[];

    generalConcept: string;

    isSuitable: string;
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

// Datos enviados al confirmar la Fase 4.
export interface ApprovePersonnelCandidateTechnicalEvaluationData {
    isSuitable: boolean;
}

// Prueba psicotécnica enviada al backend en la Fase 5.
export interface CandidatePsychotechnicalTestData {
    appliedTest: string;
    evaluationAspects: string;
    resultDescription: string;
}

// Competencia enviada al backend en la Fase 5.
export interface CandidateCompetencyValidationData {
    competencyDescriptionId: number;
    result: CandidateCompetencyResult;
}

// Datos enviados al backend en la Fase 5.
export interface CompletePersonnelCandidateCompetencyEvaluationData {
    psychotechnicalTests:
    CandidatePsychotechnicalTestData[];

    competencyValidations:
    CandidateCompetencyValidationData[];

    generalConcept: string;

    isSuitable: boolean;
}

// Respuesta general al guardar una fase de validación.
export interface PersonnelCandidateValidationActionResponse {
    message: string;
}
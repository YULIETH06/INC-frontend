// Estados permitidos para una revisión de perfil de cargo.
export type PositionProfileRevisionStatus =
    | "BORRADOR"
    | "VIGENTE"
    | "OBSOLETA";

// Información resumida del perfil de cargo.
export interface PositionProfileRevisionPosition {
    id: number;
    code: string;
    name: string;
    homeDepartmentId: number;
    isActive?: boolean;
}

// Información general de una revisión.
export interface PositionProfileRevision {
    id: number;
    positionProfileId: number;
    revisionNumber: number;
    revisionDate: string;
    status: PositionProfileRevisionStatus;
    changeObservation: string | null;
    deletedAt?: string | null;
    updatedAt: string;
    positionProfile?: PositionProfileRevisionPosition;
}

// Descripción registrada dentro de un requisito.
export interface PositionRequirementDescription {
    id: number;
    revisionId: number;
    requirementId: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

// Requisito fijo del perfil de cargo.
export interface PositionRequirement {
    id: number;
    name: string;
    descriptions: PositionRequirementDescription[];
}

// Detalle completo de una revisión.
export interface PositionProfileRevisionDetail
    extends PositionProfileRevision {
    positionProfile: PositionProfileRevisionPosition;
    requirements: PositionRequirement[];
}

// Datos para crear una revisión.
export interface CreatePositionProfileRevisionData {
    changeObservation?: string;
}

// Datos para actualizar la observación de una revisión.
export interface UpdatePositionProfileRevisionData {
    changeObservation: string | null;
}

// Datos para registrar o actualizar una descripción.
export interface PositionRequirementDescriptionData {
    description: string;
}

// Datos manejados en el formulario de creación o edición de una revisión.
export interface PositionProfileRevisionForm {
    changeObservation: string;
}

// Errores de validación del formulario de revisión.
export interface PositionProfileRevisionFormErrors {
    changeObservation: string;
}

// Datos manejados en el formulario de descripciones.
export interface PositionRequirementDescriptionForm {
    description: string;
}

// Errores de validación del formulario de descripciones.
export interface PositionRequirementDescriptionFormErrors {
    description: string;
}

// Respuesta al crear, actualizar, eliminar o publicar una revisión.
export interface PositionProfileRevisionResponse {
    message: string;
    revision: PositionProfileRevision;
}

// Respuesta al obtener las revisiones de un perfil de cargo.
export interface PositionProfileRevisionsResponse {
    message: string;
    positionProfile: PositionProfileRevisionPosition;
    revisions: PositionProfileRevision[];
}

// Respuesta al obtener la revisión vigente de un perfil de cargo.
export interface CurrentPositionProfileRevisionResponse {
    message: string;
    revision: PositionProfileRevision | null;
}

// Respuesta al obtener el detalle de una revisión.
export interface PositionProfileRevisionDetailResponse {
    message: string;
    revision: PositionProfileRevisionDetail;
}

// Respuesta al crear, actualizar o eliminar una descripción.
export interface PositionRequirementDescriptionResponse {
    message: string;
    requirementDescription: PositionRequirementDescription & {
        requirement: {
            id: number;
            name: string;
        };
    };
}
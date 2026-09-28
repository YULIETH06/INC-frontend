import api from "../../api/axios";

import type {
    CreatePositionProfileRevisionData,
    CurrentPositionProfileRevisionResponse,
    PositionProfileRevisionDetailResponse,
    PositionProfileRevisionResponse,
    PositionProfileRevisionsResponse,
    PositionRequirementData,
    PositionRequirementResponse,
    UpdatePositionProfileRevisionData,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

// Crea una nueva revisión en borrador para un perfil de cargo.
export const createPositionProfileRevision = async (
    positionProfileId: number,
    data: CreatePositionProfileRevisionData
): Promise<PositionProfileRevisionResponse> => {
    const response = await api.post<PositionProfileRevisionResponse>(
        `/position-management/position-profiles/${positionProfileId}/revisions`,
        data
    );

    return response.data;
};

// Obtiene las revisiones de un perfil de cargo.
export const getPositionProfileRevisions = async (
    positionProfileId: number
): Promise<PositionProfileRevisionsResponse> => {
    const response = await api.get<PositionProfileRevisionsResponse>(
        `/position-management/position-profiles/${positionProfileId}/revisions`
    );

    return response.data;
};

// Obtiene la revisión vigente de un perfil de cargo.
export const getCurrentPositionProfileRevision = async (
    positionProfileId: number
): Promise<CurrentPositionProfileRevisionResponse> => {
    const response =
        await api.get<CurrentPositionProfileRevisionResponse>(
            `/position-management/position-profiles/${positionProfileId}/current-revision`
        );

    return response.data;
};

// Obtiene el detalle de una revisión con requisitos, competencias y sus descripciones.
export const getPositionProfileRevisionDetail = async (
    positionProfileId: number,
    revisionId: number
): Promise<PositionProfileRevisionDetailResponse> => {
    const response =
        await api.get<PositionProfileRevisionDetailResponse>(
            `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}`
        );

    return response.data;
};

// Actualiza la observación de una revisión en borrador.
export const updatePositionProfileRevision = async (
    positionProfileId: number,
    revisionId: number,
    data: UpdatePositionProfileRevisionData
): Promise<PositionProfileRevisionResponse> => {
    const response = await api.patch<PositionProfileRevisionResponse>(
        `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}`,
        data
    );

    return response.data;
};

// Elimina lógicamente una revisión en borrador.
export const deletePositionProfileRevision = async (
    positionProfileId: number,
    revisionId: number
): Promise<PositionProfileRevisionResponse> => {
    const response = await api.delete<PositionProfileRevisionResponse>(
        `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}`
    );

    return response.data;
};

// Publica una revisión y la convierte en la revisión vigente.
export const publishPositionProfileRevision = async (
    positionProfileId: number,
    revisionId: number
): Promise<PositionProfileRevisionResponse> => {
    const response = await api.patch<PositionProfileRevisionResponse>(
        `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/publish`
    );

    return response.data;
};

// Agrega un requisito a una revisión.
export const createPositionRequirement = async (
    positionProfileId: number,
    revisionId: number,
    requirementId: number,
    data: PositionRequirementData
): Promise<PositionRequirementResponse> => {
    const response =
        await api.post<PositionRequirementResponse>(
            `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/requirements/${requirementId}/descriptions`,
            data
        );

    return response.data;
};

// Actualiza un requisito de una revisión.
export const updatePositionRequirement = async (
    positionProfileId: number,
    revisionId: number,
    requirementId: number,
    descriptionId: number,
    data: PositionRequirementData
): Promise<PositionRequirementResponse> => {
    const response =
        await api.patch<PositionRequirementResponse>(
            `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/requirements/${requirementId}/descriptions/${descriptionId}`,
            data
        );

    return response.data;
};

// Elimina lógicamente un requisito de una revisión.
export const deletePositionRequirement = async (
    positionProfileId: number,
    revisionId: number,
    requirementId: number,
    descriptionId: number
): Promise<PositionRequirementResponse> => {
    const response =
        await api.delete<PositionRequirementResponse>(
            `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/requirements/${requirementId}/descriptions/${descriptionId}`
        );

    return response.data;
};

// Agrega una competencia a una revisión de perfil de cargo.
export const createPositionCompetency = async (
    positionProfileId: number,
    revisionId: number,
    data: {
        competencyTypeId: number;
        competency: string;
    }
) => {
    const response = await api.post(
        `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/competencies`,
        data
    );

    return response.data;
};

// Actualiza una competencia de una revisión.
export const updatePositionCompetency = async (
    positionProfileId: number,
    revisionId: number,
    competencyId: number,
    data: {
        competency: string;
    }
) => {
    const response = await api.patch(
        `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/competencies/${competencyId}`,
        data
    );

    return response.data;
};

// Elimina lógicamente una competencia de una revisión.
export const deletePositionCompetency = async (
    positionProfileId: number,
    revisionId: number,
    competencyId: number
) => {
    const response = await api.delete(
        `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/competencies/${competencyId}`
    );

    return response.data;
};
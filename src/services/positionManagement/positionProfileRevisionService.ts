import api from "../../api/axios";

import type {
    CreatePositionProfileRevisionData,
    CurrentPositionProfileRevisionResponse,
    PositionProfileRevisionDetailResponse,
    PositionProfileRevisionResponse,
    PositionProfileRevisionsResponse,
    PositionRequirementDescriptionData,
    PositionRequirementDescriptionResponse,
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

// Obtiene el detalle de una revisión con sus requisitos y descripciones.
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

// Agrega una descripción a un requisito de una revisión.
export const createPositionRequirementDescription = async (
    positionProfileId: number,
    revisionId: number,
    requirementId: number,
    data: PositionRequirementDescriptionData
): Promise<PositionRequirementDescriptionResponse> => {
    const response =
        await api.post<PositionRequirementDescriptionResponse>(
            `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/requirements/${requirementId}/descriptions`, data
        );

    return response.data;
};

// Actualiza una descripción de un requisito de una revisión.
export const updatePositionRequirementDescription = async (
    positionProfileId: number,
    revisionId: number,
    requirementId: number,
    descriptionId: number,
    data: PositionRequirementDescriptionData
): Promise<PositionRequirementDescriptionResponse> => {
    const response =
        await api.patch<PositionRequirementDescriptionResponse>(
            `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/requirements/${requirementId}/descriptions/${descriptionId}`,
            data
        );

    return response.data;
};

// Elimina lógicamente una descripción de un requisito.
export const deletePositionRequirementDescription = async (
    positionProfileId: number,
    revisionId: number,
    requirementId: number,
    descriptionId: number
): Promise<PositionRequirementDescriptionResponse> => {
    const response =
        await api.delete<PositionRequirementDescriptionResponse>(
            `/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}/requirements/${requirementId}/descriptions/${descriptionId}`
        );

    return response.data;
};
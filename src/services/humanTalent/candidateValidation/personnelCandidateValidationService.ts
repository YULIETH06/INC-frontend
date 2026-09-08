import api from "../../../api/axios";

import type {
    ApprovePersonnelCandidateTechnicalEvaluationData,
    CompletePersonnelCandidateValidationData,
    CreatePersonnelCandidateValidationData,
    PersonnelCandidateValidationActionResponse,
    PersonnelCandidateValidationDetailResponse,
    PersonnelCandidateValidationsResponse,
    SavePersonnelCandidateTechnicalEvaluationData,
    UpdatePersonnelCandidatePositionValidationData,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

// Consulta los candidatos disponibles para validación.
export const getPersonnelCandidateValidations =
    async (): Promise<PersonnelCandidateValidationsResponse> => {
        const response =
            await api.get<PersonnelCandidateValidationsResponse>(
                "/human-talent/candidate-validations"
            );

        return response.data;
    };

// Consulta el detalle de un candidato.
export const getPersonnelCandidateValidationDetail = async (
    candidateId: number
): Promise<PersonnelCandidateValidationDetailResponse> => {
    const response =
        await api.get<PersonnelCandidateValidationDetailResponse>(
            `/human-talent/candidate-validations/${candidateId}`
        );

    return response.data;
};

// Guarda la Fase 1.
export const createPersonnelCandidateValidation = async (
    candidateId: number,
    data: CreatePersonnelCandidateValidationData
): Promise<PersonnelCandidateValidationActionResponse> => {
    const response =
        await api.post<PersonnelCandidateValidationActionResponse>(
            `/human-talent/candidate-validations/${candidateId}`,
            data
        );

    return response.data;
};

// Guarda la Fase 2.
export const updatePersonnelCandidatePositionValidation = async (
    candidateId: number,
    data: UpdatePersonnelCandidatePositionValidationData
): Promise<PersonnelCandidateValidationActionResponse> => {
    const response =
        await api.patch<PersonnelCandidateValidationActionResponse>(
            `/human-talent/candidate-validations/${candidateId}/position`,
            data
        );

    return response.data;
};

// Completa la Fase 3.
export const completePersonnelCandidateValidation = async (
    candidateId: number,
    data: CompletePersonnelCandidateValidationData
): Promise<PersonnelCandidateValidationActionResponse> => {
    const response =
        await api.patch<PersonnelCandidateValidationActionResponse>(
            `/human-talent/candidate-validations/${candidateId}/candidate`,
            data
        );

    return response.data;
};

// Guarda las calificaciones de la Fase 4.
export const savePersonnelCandidateTechnicalEvaluation = async (
    candidateId: number,
    data: SavePersonnelCandidateTechnicalEvaluationData
): Promise<PersonnelCandidateValidationActionResponse> => {
    const response =
        await api.patch<PersonnelCandidateValidationActionResponse>(
            `/human-talent/candidate-validations/${candidateId}/technical-evaluation`,
            data
        );

    return response.data;
};

// Confirma la Fase 4.
export const approvePersonnelCandidateTechnicalEvaluation = async (
    candidateId: number,
    data: ApprovePersonnelCandidateTechnicalEvaluationData
): Promise<PersonnelCandidateValidationActionResponse> => {
    const response =
        await api.patch<PersonnelCandidateValidationActionResponse>(
            `/human-talent/candidate-validations/${candidateId}/technical-evaluation/approve`,
            data
        );

    return response.data;
};
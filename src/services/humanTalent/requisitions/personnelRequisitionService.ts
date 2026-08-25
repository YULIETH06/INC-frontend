import api from "../../../api/axios";
import type {
    ClosePersonnelRequisitionCandidatesData,
    PersonnelCandidateSubmissionBatchesResponse,
    PersonnelCandidateSubmissionHistoryResponse,
    PersonnelRequisitionCandidateSubmissionResponse,
    PreselectPersonnelRequisitionCandidatesData,
    PreselectPersonnelRequisitionCandidatesResponse,
    ReopenPersonnelRequisitionCandidatesData,
    CreatePersonnelHiringConfirmationData,
    CreatePersonnelHiringConfirmationResponse,
    CreatePersonnelRequisitionData,
    CreatePersonnelRequisitionResponse,
    DecidePersonnelHiringConfirmationData,
    DecidePersonnelHiringConfirmationResponse,
    DecidePersonnelRequisitionData,
    DecidePersonnelRequisitionResponse,
    DepartmentsResponse,
    PersonnelRequisition,
    PersonnelRequisitionCandidateForm,
    PersonnelRequisitionCandidateResponse,
    PersonnelRequisitionCandidatesResponse,
    PersonnelRequisitionResponse,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

// Obtiene las áreas activas disponibles para crear una requisición de personal.
export const getDepartments = async (): Promise<DepartmentsResponse> => {
    const response = await api.get<DepartmentsResponse>(
        "/human-talent/departments"
    );

    return response.data;
};

// Crea una nueva requisición de personal.
export const createPersonnelRequisition = async (
    data: CreatePersonnelRequisitionData
): Promise<CreatePersonnelRequisitionResponse> => {
    const response = await api.post<CreatePersonnelRequisitionResponse>(
        "/human-talent/requisitions",
        data
    );

    return response.data;
};

// Obtiene las requisiciones donde el usuario autenticado participa.
export const getPersonnelRequisitions =
    async (): Promise<PersonnelRequisitionResponse> => {
        const response = await api.get<PersonnelRequisitionResponse>(
            "/human-talent/requisitions"
        );

        return response.data;
    };

export const getPersonnelRequisitionById = async (
    requisitionId: number
): Promise<{ requisition: PersonnelRequisition }> => {
    const response = await api.get<{ requisition: PersonnelRequisition }>(
        `/human-talent/requisitions/${requisitionId}`
    );

    return response.data;
};

// Aprueba, rechaza o cancela una requisición de personal.
export const decidePersonnelRequisition = async (
    requisitionId: number,
    data: DecidePersonnelRequisitionData
): Promise<DecidePersonnelRequisitionResponse> => {
    const response = await api.patch<DecidePersonnelRequisitionResponse>(
        `/human-talent/requisitions/${requisitionId}/decision`,
        data
    );

    return response.data;
};

// Registra la confirmación final de contratación de una requisición.
export const createPersonnelHiringConfirmation = async (
    requisitionId: number,
    data: CreatePersonnelHiringConfirmationData
): Promise<CreatePersonnelHiringConfirmationResponse> => {
    const response = await api.post<CreatePersonnelHiringConfirmationResponse>(
        `/human-talent/requisitions/${requisitionId}/hiring-confirmation`,
        data
    );

    return response.data;
};

// Aprueba, rechaza o cancela una confirmación de contratación.
export const decidePersonnelHiringConfirmation = async (
    hiringConfirmationId: number,
    data: DecidePersonnelHiringConfirmationData
): Promise<DecidePersonnelHiringConfirmationResponse> => {
    const response = await api.patch<DecidePersonnelHiringConfirmationResponse>(
        `/human-talent/hiring-confirmations/${hiringConfirmationId}/decision`,
        data
    );

    return response.data;
};

// Registra un candidato y su hoja de vida en una requisición.
export const createPersonnelRequisitionCandidate = async (
    requisitionId: number,
    data: PersonnelRequisitionCandidateForm
): Promise<PersonnelRequisitionCandidateResponse> => {
    const formData = new FormData();

    formData.append(
        "identificationTypeId",
        data.identificationTypeId
    );

    formData.append(
        "identificationNumber",
        data.identificationNumber
    );

    formData.append("name", data.name);
    formData.append("observation", data.observation);

    if (data.file) {
        formData.append("file", data.file);
    }

    const response =
        await api.post<PersonnelRequisitionCandidateResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates`,
            formData
        );

    return response.data;
};

// Obtiene los candidatos registrados en una requisición.
export const getPersonnelRequisitionCandidates = async (
    requisitionId: number
): Promise<PersonnelRequisitionCandidatesResponse> => {
    const response =
        await api.get<PersonnelRequisitionCandidatesResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates`
        );

    return response.data;
};

// Actualiza los datos o la hoja de vida de un candidato.
export const updatePersonnelRequisitionCandidate = async (
    requisitionId: number,
    candidateId: number,
    data: PersonnelRequisitionCandidateForm
): Promise<PersonnelRequisitionCandidateResponse> => {
    const formData = new FormData();

    formData.append(
        "identificationTypeId",
        data.identificationTypeId
    );

    formData.append(
        "identificationNumber",
        data.identificationNumber
    );

    formData.append("name", data.name);
    formData.append("observation", data.observation);

    if (data.file) {
        formData.append("file", data.file);
    }

    const response =
        await api.patch<PersonnelRequisitionCandidateResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates/${candidateId}`,
            formData
        );

    return response.data;
};

// Elimina un candidato y su hoja de vida.
export const deletePersonnelRequisitionCandidate = async (
    requisitionId: number,
    candidateId: number
): Promise<PersonnelRequisitionCandidateResponse> => {
    const response =
        await api.delete<PersonnelRequisitionCandidateResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates/${candidateId}`
        );

    return response.data;
};

// Cierra el proceso de cargue de candidatos.
export const closePersonnelRequisitionCandidates = async (
    requisitionId: number,
    data: ClosePersonnelRequisitionCandidatesData = {}
): Promise<PersonnelRequisitionCandidateSubmissionResponse> => {
    const response =
        await api.patch<PersonnelRequisitionCandidateSubmissionResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates/close`,
            data
        );

    return response.data;
};

// Reabre el proceso de cargue de candidatos.
export const reopenPersonnelRequisitionCandidates = async (
    requisitionId: number,
    data: ReopenPersonnelRequisitionCandidatesData
): Promise<PersonnelRequisitionCandidateSubmissionResponse> => {
    const response =
        await api.patch<PersonnelRequisitionCandidateSubmissionResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates/reopen`,
            data
        );

    return response.data;
};

// Obtiene el historial de reaperturas y cierres posteriores del cargue.
export const getPersonnelCandidateSubmissionHistory = async (
    requisitionId: number
): Promise<PersonnelCandidateSubmissionHistoryResponse> => {
    const response =
        await api.get<PersonnelCandidateSubmissionHistoryResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates/history`
        );

    return response.data;
};

// Obtiene las fotografías históricas generadas en cada cierre del cargue.
export const getPersonnelCandidateSubmissionBatches = async (
    requisitionId: number
): Promise<PersonnelCandidateSubmissionBatchesResponse> => {
    const response =
        await api.get<PersonnelCandidateSubmissionBatchesResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates/batches`
        );

    return response.data;
};

// Confirma la preselección de uno o varios candidatos.
export const preselectPersonnelRequisitionCandidates = async (
    requisitionId: number,
    data: PreselectPersonnelRequisitionCandidatesData
): Promise<PreselectPersonnelRequisitionCandidatesResponse> => {
    const response =
        await api.patch<PreselectPersonnelRequisitionCandidatesResponse>(
            `/human-talent/requisitions/${requisitionId}/candidates/preselect`,
            data
        );

    return response.data;
};
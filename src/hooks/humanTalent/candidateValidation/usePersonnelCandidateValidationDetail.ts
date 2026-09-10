import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getPersonnelCandidateValidationDetail,
} from "../../../services/humanTalent/candidateValidation/personnelCandidateValidationService";

import { getErrorMessage } from "../../../utils/common/getErrorMessage";

import type { MessageType } from "../../../interfaces/common/message.interface";

import type {
    PersonnelCandidateValidationCandidate,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

import {
    useApplicationConceptValidation,
} from "./useApplicationConceptValidation";

import {
    usePositionValidation,
} from "./usePositionValidation";

import {
    useCandidateRequirementValidation,
} from "./useCandidateRequirementValidation";

import {
    useTechnicalEvaluation,
} from "./useTechnicalEvaluation";

interface UsePersonnelCandidateValidationDetailProps {
    candidateId: number;
    enabled?: boolean;
}

// Hook coordinador del detalle y las etapas de validación del candidato.
export const usePersonnelCandidateValidationDetail = ({
    candidateId,
    enabled = true,
}: UsePersonnelCandidateValidationDetailProps) => {
    // Candidato consultado.
    const [
        candidate,
        setCandidate,
    ] =
        useState<PersonnelCandidateValidationCandidate | null>(
            null
        );

    // Permiso para gestionar la validación.
    const [
        canManageValidation,
        setCanManageValidation,
    ] = useState(false);

    // Permiso para confirmar la Evaluación Técnica.
    const [
        canApproveTechnicalEvaluation,
        setCanApproveTechnicalEvaluation,
    ] = useState(false);

    // Estado de carga del detalle.
    const [
        loadingDetail,
        setLoadingDetail,
    ] = useState(false);

    // Error producido al consultar el detalle.
    const [
        detailError,
        setDetailError,
    ] = useState("");

    // Mensaje visual compartido por las fases.
    const [
        message,
        setMessage,
    ] = useState("");

    const [
        openMessage,
        setOpenMessage,
    ] = useState(false);

    const [
        messageSeverity,
        setMessageSeverity,
    ] = useState<MessageType>(
        "success"
    );

    // Limpia el mensaje visual.
    const clearMessage =
        useCallback(() => {
            setMessage("");
            setOpenMessage(false);
        }, []);

    // Muestra un mensaje visual.
    const showMessage =
        useCallback(
            (
                newMessage: string,
                severity: MessageType
            ) => {
                setMessage(newMessage);
                setMessageSeverity(severity);
                setOpenMessage(true);
            },
            []
        );

    // Consulta el detalle del candidato indicado.
    const loadCandidateDetail =
        useCallback(async () => {
            if (
                !enabled ||
                !Number.isInteger(candidateId) ||
                candidateId <= 0
            ) {
                setCandidate(null);
                setCanManageValidation(false);
                setCanApproveTechnicalEvaluation(
                    false
                );

                return;
            }

            try {
                setLoadingDetail(true);
                setDetailError("");

                const response =
                    await getPersonnelCandidateValidationDetail(
                        candidateId
                    );

                setCandidate(
                    response.candidate
                );

                setCanManageValidation(
                    response.canManageValidation
                );

                setCanApproveTechnicalEvaluation(
                    response.canApproveTechnicalEvaluation
                );
            } catch (error: unknown) {
                console.error(error);

                setCandidate(null);
                setCanManageValidation(false);
                setCanApproveTechnicalEvaluation(
                    false
                );

                setDetailError(
                    getErrorMessage(
                        error,
                        "Error al cargar el detalle del candidato."
                    )
                );
            } finally {
                setLoadingDetail(false);
            }
        }, [
            candidateId,
            enabled,
        ]);

    // Fase 1 - Concepto de aplicación.
    const applicationConcept =
        useApplicationConceptValidation({
            candidate,
            reloadCandidateDetail:
                loadCandidateDetail,
            clearMessage,
            showMessage,
        });

    // Fase 2 - Validación de cargo.
    const positionValidation =
        usePositionValidation({
            candidate,
            reloadCandidateDetail:
                loadCandidateDetail,
            clearMessage,
            showMessage,
        });

    // Fase 3 - Validación del postulante.
    const candidateRequirementValidation =
        useCandidateRequirementValidation({
            candidate,
            reloadCandidateDetail:
                loadCandidateDetail,
            clearMessage,
            showMessage,
        });

    // Fase 4 - Evaluación Técnica.
    const technicalEvaluation =
        useTechnicalEvaluation({
            candidate,
            reloadCandidateDetail:
                loadCandidateDetail,
            clearMessage,
            showMessage,
        });

    // Cierra el mensaje visual.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Consulta inicial del detalle.
    useEffect(() => {
        void loadCandidateDetail();
    }, [loadCandidateDetail]);

    return {
        candidate,
        canManageValidation,
        canApproveTechnicalEvaluation,

        // Fase 1.
        applicationConceptForm:
            applicationConcept.applicationConceptForm,

        applicationConceptErrors:
            applicationConcept.applicationConceptErrors,

        loadingApplicationConcept:
            applicationConcept.loadingApplicationConcept,

        handleApplicationConceptChange:
            applicationConcept.handleApplicationConceptChange,

        handleSaveApplicationConcept:
            applicationConcept.handleSaveApplicationConcept,

        // Fase 2.
        positionValidationForm:
            positionValidation.positionValidationForm,

        positionValidationErrors:
            positionValidation.positionValidationErrors,

        loadingPositionValidation:
            positionValidation.loadingPositionValidation,

        handlePositionTypeChange:
            positionValidation.handlePositionTypeChange,

        handleChangeControlCodeChange:
            positionValidation.handleChangeControlCodeChange,

        handleSavePositionValidation:
            positionValidation.handleSavePositionValidation,

        // Fase 3.
        candidateValidationForm:
            candidateRequirementValidation.candidateValidationForm,

        candidateValidationErrors:
            candidateRequirementValidation.candidateValidationErrors,

        loadingCandidateValidation:
            candidateRequirementValidation.loadingCandidateValidation,

        handleRequirementCompliesChange:
            candidateRequirementValidation.handleRequirementCompliesChange,

        handleRequirementEvidenceChange:
            candidateRequirementValidation.handleRequirementEvidenceChange,

        handleRequirementGapClosureChange:
            candidateRequirementValidation.handleRequirementGapClosureChange,

        handleSuitableChange:
            candidateRequirementValidation.handleSuitableChange,

        handleSaveCandidateValidation:
            candidateRequirementValidation.handleSaveCandidateValidation,

        // Fase 4.
        technicalEvaluationForm:
            technicalEvaluation.technicalEvaluationForm,

        technicalEvaluationApprovalForm:
            technicalEvaluation.technicalEvaluationApprovalForm,

        technicalEvaluationErrors:
            technicalEvaluation.technicalEvaluationErrors,

        technicalEvaluationApprovalErrors:
            technicalEvaluation.technicalEvaluationApprovalErrors,

        loadingTechnicalEvaluation:
            technicalEvaluation.loadingTechnicalEvaluation,

        loadingTechnicalEvaluationApproval:
            technicalEvaluation.loadingTechnicalEvaluationApproval,

        handleInterviewScoreChange:
            technicalEvaluation.handleInterviewScoreChange,

        handleExamScoreChange:
            technicalEvaluation.handleExamScoreChange,

        handleTechnicalEvaluationSuitableChange:
            technicalEvaluation.handleTechnicalEvaluationSuitableChange,

        handleSaveTechnicalEvaluation:
            technicalEvaluation.handleSaveTechnicalEvaluation,

        handleApproveTechnicalEvaluation:
            technicalEvaluation.handleApproveTechnicalEvaluation,

        // Estado general.
        loadingDetail,
        detailError,

        message,
        openMessage,
        messageSeverity,

        loadCandidateDetail,
        closeMessage,
    };
};
import {
    useEffect,
    useState,
} from "react";

import { ValidationError } from "yup";

import {
    approvePersonnelCandidateTechnicalEvaluation,
    savePersonnelCandidateTechnicalEvaluation,
} from "../../../services/humanTalent/candidateValidation/personnelCandidateValidationService";

import {
    candidateTechnicalEvaluationApprovalSchema,
    candidateTechnicalEvaluationSchema,
} from "../../../validations/humanTalent/candidateValidation/personnelCandidateValidation";

import { getErrorMessage } from "../../../utils/common/getErrorMessage";

import type { MessageType } from "../../../interfaces/common/message.interface";

import type {
    ApprovePersonnelCandidateTechnicalEvaluationData,
    CandidateTechnicalEvaluationApprovalForm,
    CandidateTechnicalEvaluationApprovalFormErrors,
    CandidateTechnicalEvaluationForm,
    CandidateTechnicalEvaluationFormErrors,
    PersonnelCandidateValidationCandidate,
    SavePersonnelCandidateTechnicalEvaluationData,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface UseTechnicalEvaluationProps {
    candidate:
    PersonnelCandidateValidationCandidate | null;

    reloadCandidateDetail:
    () => Promise<void>;

    clearMessage:
    () => void;

    showMessage:
    (
        message: string,
        severity: MessageType
    ) => void;
}

// Estado inicial de las calificaciones de la Fase 4.
const initialTechnicalEvaluationForm:
    CandidateTechnicalEvaluationForm = {
    interviewScore: null,
    examScore: null,
};

// Errores iniciales de las calificaciones de la Fase 4.
const initialTechnicalEvaluationErrors:
    CandidateTechnicalEvaluationFormErrors = {
    interviewScore: "",
    examScore: "",
};

// Estado inicial de la confirmación de la Fase 4.
const initialTechnicalEvaluationApprovalForm:
    CandidateTechnicalEvaluationApprovalForm = {
    isSuitable: null,
};

// Errores iniciales de la confirmación de la Fase 4.
const initialTechnicalEvaluationApprovalErrors:
    CandidateTechnicalEvaluationApprovalFormErrors = {
    isSuitable: "",
};

// Hook encargado de la Fase 4 - Evaluación Técnica.
export const useTechnicalEvaluation = ({
    candidate,
    reloadCandidateDetail,
    clearMessage,
    showMessage,
}: UseTechnicalEvaluationProps) => {
    const [
        technicalEvaluationForm,
        setTechnicalEvaluationForm,
    ] = useState<CandidateTechnicalEvaluationForm>(
        initialTechnicalEvaluationForm
    );

    const [
        technicalEvaluationApprovalForm,
        setTechnicalEvaluationApprovalForm,
    ] =
        useState<CandidateTechnicalEvaluationApprovalForm>(
            initialTechnicalEvaluationApprovalForm
        );

    const [
        technicalEvaluationErrors,
        setTechnicalEvaluationErrors,
    ] =
        useState<CandidateTechnicalEvaluationFormErrors>(
            initialTechnicalEvaluationErrors
        );

    const [
        technicalEvaluationApprovalErrors,
        setTechnicalEvaluationApprovalErrors,
    ] =
        useState<CandidateTechnicalEvaluationApprovalFormErrors>(
            initialTechnicalEvaluationApprovalErrors
        );

    const [
        loadingTechnicalEvaluation,
        setLoadingTechnicalEvaluation,
    ] = useState(false);

    const [
        loadingTechnicalEvaluationApproval,
        setLoadingTechnicalEvaluationApproval,
    ] = useState(false);

    // Sincroniza los formularios con la información consultada.
    useEffect(() => {
        const technicalEvaluation =
            candidate?.validation
                ?.technicalEvaluation;

        setTechnicalEvaluationForm({
            interviewScore:
                technicalEvaluation?.interviewScore !== null &&
                    technicalEvaluation?.interviewScore !== undefined
                    ? Number(
                        technicalEvaluation.interviewScore
                    )
                    : null,

            examScore:
                technicalEvaluation?.examScore !== null &&
                    technicalEvaluation?.examScore !== undefined
                    ? Number(
                        technicalEvaluation.examScore
                    )
                    : null,
        });

        setTechnicalEvaluationApprovalForm({
            isSuitable:
                technicalEvaluation?.isSuitable ??
                null,
        });

        setTechnicalEvaluationErrors(
            initialTechnicalEvaluationErrors
        );

        setTechnicalEvaluationApprovalErrors(
            initialTechnicalEvaluationApprovalErrors
        );
    }, [candidate]);

    // Actualiza la calificación de la entrevista.
    const handleInterviewScoreChange = (
        value: number | null
    ) => {
        setTechnicalEvaluationForm(
            (previous) => ({
                ...previous,
                interviewScore: value,
            })
        );

        setTechnicalEvaluationErrors(
            (previous) => ({
                ...previous,
                interviewScore: "",
            })
        );
    };

    // Actualiza la calificación del examen.
    const handleExamScoreChange = (
        value: number | null
    ) => {
        setTechnicalEvaluationForm(
            (previous) => ({
                ...previous,
                examScore: value,
            })
        );

        setTechnicalEvaluationErrors(
            (previous) => ({
                ...previous,
                examScore: "",
            })
        );
    };

    // Actualiza la decisión final de aptitud.
    const handleTechnicalEvaluationSuitableChange = (
        value: boolean
    ) => {
        setTechnicalEvaluationApprovalForm({
            isSuitable: value,
        });

        setTechnicalEvaluationApprovalErrors({
            isSuitable: "",
        });
    };

    // Guarda las calificaciones de la Fase 4.
    const handleSaveTechnicalEvaluation =
        async () => {
            if (!candidate) {
                return;
            }

            try {
                await candidateTechnicalEvaluationSchema.validate(
                    technicalEvaluationForm,
                    {
                        abortEarly: false,
                    }
                );

                setLoadingTechnicalEvaluation(
                    true
                );

                setTechnicalEvaluationErrors(
                    initialTechnicalEvaluationErrors
                );

                clearMessage();

                const data:
                    SavePersonnelCandidateTechnicalEvaluationData =
                    {};

                if (
                    technicalEvaluationForm.interviewScore !==
                    null
                ) {
                    data.interviewScore =
                        technicalEvaluationForm.interviewScore;
                }

                if (
                    technicalEvaluationForm.examScore !==
                    null
                ) {
                    data.examScore =
                        technicalEvaluationForm.examScore;
                }

                const response =
                    await savePersonnelCandidateTechnicalEvaluation(
                        candidate.id,
                        data
                    );

                await reloadCandidateDetail();

                showMessage(
                    response.message ||
                    "Evaluación técnica guardada correctamente.",
                    "success"
                );
            } catch (error: unknown) {
                if (
                    error instanceof
                    ValidationError
                ) {
                    const errors:
                        CandidateTechnicalEvaluationFormErrors =
                    {
                        ...initialTechnicalEvaluationErrors,
                    };

                    error.inner.forEach(
                        (validationError) => {
                            if (
                                validationError.path ===
                                "interviewScore"
                            ) {
                                errors.interviewScore =
                                    validationError.message;
                            }

                            if (
                                validationError.path ===
                                "examScore"
                            ) {
                                errors.examScore =
                                    validationError.message;
                            }
                        }
                    );

                    setTechnicalEvaluationErrors(
                        errors
                    );

                    const hasFieldError =
                        Boolean(
                            errors.interviewScore
                        ) ||
                        Boolean(
                            errors.examScore
                        );

                    if (!hasFieldError) {
                        showMessage(
                            error.errors[0] ||
                            "Debe diligenciar por lo menos una calificación.",
                            "warning"
                        );
                    } else {
                        clearMessage();
                    }

                    return;
                }

                console.error(error);

                showMessage(
                    getErrorMessage(
                        error,
                        "Error al guardar la Evaluación Técnica."
                    ),
                    "error"
                );
            } finally {
                setLoadingTechnicalEvaluation(
                    false
                );
            }
        };

    // Confirma la decisión final de la Fase 4.
    const handleApproveTechnicalEvaluation =
        async () => {
            if (!candidate) {
                return;
            }

            try {
                await candidateTechnicalEvaluationApprovalSchema.validate(
                    technicalEvaluationApprovalForm,
                    {
                        abortEarly: false,
                    }
                );

                if (
                    technicalEvaluationApprovalForm.isSuitable ===
                    null
                ) {
                    return;
                }

                setLoadingTechnicalEvaluationApproval(
                    true
                );

                setTechnicalEvaluationApprovalErrors(
                    initialTechnicalEvaluationApprovalErrors
                );

                clearMessage();

                const data:
                    ApprovePersonnelCandidateTechnicalEvaluationData =
                {
                    isSuitable:
                        technicalEvaluationApprovalForm.isSuitable,
                };

                const response =
                    await approvePersonnelCandidateTechnicalEvaluation(
                        candidate.id,
                        data
                    );

                await reloadCandidateDetail();

                showMessage(
                    response.message ||
                    "Evaluación técnica confirmada correctamente.",
                    "success"
                );
            } catch (error: unknown) {
                if (
                    error instanceof
                    ValidationError
                ) {
                    const errors:
                        CandidateTechnicalEvaluationApprovalFormErrors =
                    {
                        ...initialTechnicalEvaluationApprovalErrors,
                    };

                    error.inner.forEach(
                        (validationError) => {
                            if (
                                validationError.path ===
                                "isSuitable"
                            ) {
                                errors.isSuitable =
                                    validationError.message;
                            }
                        }
                    );

                    setTechnicalEvaluationApprovalErrors(
                        errors
                    );

                    clearMessage();
                    return;
                }

                console.error(error);

                showMessage(
                    getErrorMessage(
                        error,
                        "Error al confirmar la Evaluación Técnica."
                    ),
                    "error"
                );
            } finally {
                setLoadingTechnicalEvaluationApproval(
                    false
                );
            }
        };

    return {
        technicalEvaluationForm,
        technicalEvaluationApprovalForm,

        technicalEvaluationErrors,
        technicalEvaluationApprovalErrors,

        loadingTechnicalEvaluation,
        loadingTechnicalEvaluationApproval,

        handleInterviewScoreChange,
        handleExamScoreChange,
        handleTechnicalEvaluationSuitableChange,

        handleSaveTechnicalEvaluation,
        handleApproveTechnicalEvaluation,
    };
};
import {
    useEffect,
    useState,
} from "react";

import { ValidationError } from "yup";

import {
    completePersonnelCandidateValidation,
} from "../../../services/humanTalent/candidateValidation/personnelCandidateValidationService";

import {
    candidateValidationSchema,
} from "../../../validations/humanTalent/candidateValidation/personnelCandidateValidation";

import { getErrorMessage } from "../../../utils/common/getErrorMessage";

import type { MessageType } from "../../../interfaces/common/message.interface";

import type {
    CandidateRequirementValidationFormErrors,
    CandidateValidationForm,
    CandidateValidationFormErrors,
    CompletePersonnelCandidateValidationData,
    PersonnelCandidateValidationCandidate,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface UseCandidateRequirementValidationProps {
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

// Estado inicial de la Fase 3.
const initialCandidateValidationForm:
    CandidateValidationForm = {
    isSuitable: null,
    requirementValidations: [],
};

// Hook encargado de la Fase 3 - Validación del postulante.
export const useCandidateRequirementValidation = ({
    candidate,
    reloadCandidateDetail,
    clearMessage,
    showMessage,
}: UseCandidateRequirementValidationProps) => {
    const [
        candidateValidationForm,
        setCandidateValidationForm,
    ] = useState<CandidateValidationForm>(
        initialCandidateValidationForm
    );

    const [
        candidateValidationErrors,
        setCandidateValidationErrors,
    ] = useState<CandidateValidationFormErrors>({
        isSuitable: "",
        requirementValidations: [],
    });

    const [
        loadingCandidateValidation,
        setLoadingCandidateValidation,
    ] = useState(false);

    // Sincroniza el formulario con los requisitos del candidato.
    useEffect(() => {
        if (!candidate) {
            setCandidateValidationForm(
                initialCandidateValidationForm
            );

            setCandidateValidationErrors({
                isSuitable: "",
                requirementValidations: [],
            });

            return;
        }

        const validation =
            candidate.validation;

        const requirementValidations =
            candidate.requisition.positionRevision
                .requirementDescriptions.map(
                    (description) => {
                        const savedValidation =
                            validation?.requirementValidations.find(
                                (item) =>
                                    item.requirementDescriptionId ===
                                    description.id
                            );

                        return {
                            requirementDescriptionId:
                                description.id,

                            complies:
                                savedValidation?.complies ??
                                null,

                            evidence:
                                savedValidation?.evidence ??
                                "",

                            gapClosure:
                                savedValidation?.gapClosure ??
                                "",
                        };
                    }
                );

        setCandidateValidationForm({
            isSuitable:
                validation?.isSuitable ?? null,

            requirementValidations,
        });

        setCandidateValidationErrors({
            isSuitable: "",

            requirementValidations:
                requirementValidations.map(
                    () => ({
                        complies: "",
                        evidence: "",
                        gapClosure: "",
                    })
                ),
        });
    }, [candidate]);

    // Limpia el error de un campo evaluado.
    const clearRequirementError = (
        index: number,
        field:
            keyof CandidateRequirementValidationFormErrors
    ) => {
        setCandidateValidationErrors(
            (previous) => ({
                ...previous,

                requirementValidations:
                    previous.requirementValidations.map(
                        (
                            error,
                            errorIndex
                        ) =>
                            errorIndex === index
                                ? {
                                    ...error,
                                    [field]: "",
                                }
                                : error
                    ),
            })
        );
    };

    // Actualiza el cumplimiento de una descripción.
    const handleRequirementCompliesChange = (
        index: number,
        value: boolean
    ) => {
        setCandidateValidationForm(
            (previous) => ({
                ...previous,

                requirementValidations:
                    previous.requirementValidations.map(
                        (
                            requirement,
                            requirementIndex
                        ) =>
                            requirementIndex === index
                                ? {
                                    ...requirement,

                                    complies: value,

                                    evidence:
                                        value
                                            ? requirement.evidence
                                            : "",

                                    gapClosure:
                                        value
                                            ? ""
                                            : requirement.gapClosure,
                                }
                                : requirement
                    ),
            })
        );

        setCandidateValidationErrors(
            (previous) => ({
                ...previous,

                requirementValidations:
                    previous.requirementValidations.map(
                        (
                            error,
                            errorIndex
                        ) =>
                            errorIndex === index
                                ? {
                                    complies: "",
                                    evidence: "",
                                    gapClosure: "",
                                }
                                : error
                    ),
            })
        );
    };

    // Actualiza la evidencia de una descripción.
    const handleRequirementEvidenceChange = (
        index: number,
        value: string
    ) => {
        setCandidateValidationForm(
            (previous) => ({
                ...previous,

                requirementValidations:
                    previous.requirementValidations.map(
                        (
                            requirement,
                            requirementIndex
                        ) =>
                            requirementIndex === index
                                ? {
                                    ...requirement,
                                    evidence: value,
                                }
                                : requirement
                    ),
            })
        );

        clearRequirementError(
            index,
            "evidence"
        );
    };

    // Actualiza el cierre de brecha.
    const handleRequirementGapClosureChange = (
        index: number,
        value: string
    ) => {
        setCandidateValidationForm(
            (previous) => ({
                ...previous,

                requirementValidations:
                    previous.requirementValidations.map(
                        (
                            requirement,
                            requirementIndex
                        ) =>
                            requirementIndex === index
                                ? {
                                    ...requirement,
                                    gapClosure: value,
                                }
                                : requirement
                    ),
            })
        );

        clearRequirementError(
            index,
            "gapClosure"
        );
    };

    // Actualiza el resultado final del postulante.
    const handleSuitableChange = (
        value: boolean
    ) => {
        setCandidateValidationForm(
            (previous) => ({
                ...previous,
                isSuitable: value,
            })
        );

        setCandidateValidationErrors(
            (previous) => ({
                ...previous,
                isSuitable: "",
            })
        );
    };

    // Guarda la Fase 3.
    const handleSaveCandidateValidation =
        async () => {
            if (!candidate) {
                return;
            }

            try {
                await candidateValidationSchema.validate(
                    candidateValidationForm,
                    {
                        abortEarly: false,
                    }
                );

                if (
                    candidateValidationForm.isSuitable ===
                    null
                ) {
                    return;
                }

                setLoadingCandidateValidation(true);

                clearMessage();

                const data:
                    CompletePersonnelCandidateValidationData =
                {
                    isSuitable:
                        candidateValidationForm.isSuitable,

                    requirementValidations:
                        candidateValidationForm.requirementValidations.map(
                            (requirement) => ({
                                requirementDescriptionId:
                                    requirement.requirementDescriptionId,

                                complies:
                                    requirement.complies ===
                                    true,

                                evidence:
                                    requirement.complies ===
                                        true
                                        ? requirement.evidence.trim()
                                        : null,

                                gapClosure:
                                    requirement.complies ===
                                        false
                                        ? requirement.gapClosure.trim()
                                        : null,
                            })
                        ),
                };

                const response =
                    await completePersonnelCandidateValidation(
                        candidate.id,
                        data
                    );

                await reloadCandidateDetail();

                showMessage(
                    response.message ||
                    "Validación del postulante completada correctamente.",
                    "success"
                );
            } catch (error: unknown) {
                if (
                    error instanceof
                    ValidationError
                ) {
                    const errors:
                        CandidateValidationFormErrors =
                    {
                        isSuitable: "",

                        requirementValidations:
                            candidateValidationForm.requirementValidations.map(
                                () => ({
                                    complies: "",
                                    evidence: "",
                                    gapClosure: "",
                                })
                            ),
                    };

                    error.inner.forEach(
                        (validationError) => {
                            const path =
                                validationError.path;

                            if (
                                path ===
                                "isSuitable"
                            ) {
                                errors.isSuitable =
                                    validationError.message;

                                return;
                            }

                            const match =
                                path?.match(
                                    /^requirementValidations\[(\d+)\]\.(complies|evidence|gapClosure)$/
                                );

                            if (!match) {
                                return;
                            }

                            const index =
                                Number(match[1]);

                            const field =
                                match[2] as
                                keyof CandidateRequirementValidationFormErrors;

                            if (
                                errors.requirementValidations[
                                index
                                ]
                            ) {
                                errors.requirementValidations[
                                    index
                                ][field] =
                                    validationError.message;
                            }
                        }
                    );

                    setCandidateValidationErrors(
                        errors
                    );

                    clearMessage();
                    return;
                }

                console.error(error);

                showMessage(
                    getErrorMessage(
                        error,
                        "Error al completar la validación del postulante."
                    ),
                    "error"
                );
            } finally {
                setLoadingCandidateValidation(false);
            }
        };

    return {
        candidateValidationForm,
        candidateValidationErrors,
        loadingCandidateValidation,

        handleRequirementCompliesChange,
        handleRequirementEvidenceChange,
        handleRequirementGapClosureChange,
        handleSuitableChange,

        handleSaveCandidateValidation,
    };
};
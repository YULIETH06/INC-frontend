import {
    useEffect,
    useState,
} from "react";

import { ValidationError } from "yup";

import {
    createPersonnelCandidateValidation,
} from "../../../services/humanTalent/candidateValidation/personnelCandidateValidationService";

import {
    candidateApplicationConceptSchema,
} from "../../../validations/humanTalent/candidateValidation/personnelCandidateValidation";

import { getErrorMessage } from "../../../utils/common/getErrorMessage";

import type { MessageType } from "../../../interfaces/common/message.interface";

import type {
    CandidateApplicationConceptForm,
    CandidateApplicationConceptFormErrors,
    PersonnelCandidateValidationCandidate,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface UseApplicationConceptValidationProps {
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

// Estado inicial de la Fase 1.
const initialApplicationConceptForm:
    CandidateApplicationConceptForm = {
    applicationConcept: "",
};

// Errores iniciales de la Fase 1.
const initialApplicationConceptErrors:
    CandidateApplicationConceptFormErrors = {
    applicationConcept: "",
};

// Hook encargado de la Fase 1 - Concepto de aplicación.
export const useApplicationConceptValidation = ({
    candidate,
    reloadCandidateDetail,
    clearMessage,
    showMessage,
}: UseApplicationConceptValidationProps) => {
    const [
        applicationConceptForm,
        setApplicationConceptForm,
    ] = useState<CandidateApplicationConceptForm>(
        initialApplicationConceptForm
    );

    const [
        applicationConceptErrors,
        setApplicationConceptErrors,
    ] =
        useState<CandidateApplicationConceptFormErrors>(
            initialApplicationConceptErrors
        );

    const [
        loadingApplicationConcept,
        setLoadingApplicationConcept,
    ] = useState(false);

    // Sincroniza el formulario con la información consultada.
    useEffect(() => {
        setApplicationConceptForm({
            applicationConcept:
                candidate?.validation
                    ?.applicationConcept ?? "",
        });

        setApplicationConceptErrors(
            initialApplicationConceptErrors
        );
    }, [candidate]);

    // Actualiza el concepto de aplicación.
    const handleApplicationConceptChange = (
        value:
            CandidateApplicationConceptForm["applicationConcept"]
    ) => {
        setApplicationConceptForm({
            applicationConcept: value,
        });

        setApplicationConceptErrors({
            applicationConcept: "",
        });
    };

    // Guarda la Fase 1.
    const handleSaveApplicationConcept =
        async () => {
            if (!candidate) {
                return;
            }

            try {
                await candidateApplicationConceptSchema.validate(
                    applicationConceptForm,
                    {
                        abortEarly: false,
                    }
                );

                if (
                    !applicationConceptForm.applicationConcept
                ) {
                    return;
                }

                setLoadingApplicationConcept(true);

                setApplicationConceptErrors(
                    initialApplicationConceptErrors
                );

                clearMessage();

                const response =
                    await createPersonnelCandidateValidation(
                        candidate.id,
                        {
                            applicationConcept:
                                applicationConceptForm.applicationConcept,
                        }
                    );

                await reloadCandidateDetail();

                showMessage(
                    response.message ||
                    "Concepto de aplicación guardado correctamente.",
                    "success"
                );
            } catch (error: unknown) {
                if (
                    error instanceof
                    ValidationError
                ) {
                    const errors:
                        CandidateApplicationConceptFormErrors =
                    {
                        ...initialApplicationConceptErrors,
                    };

                    error.inner.forEach(
                        (validationError) => {
                            const path =
                                validationError.path as
                                keyof CandidateApplicationConceptFormErrors;

                            if (path) {
                                errors[path] =
                                    validationError.message;
                            }
                        }
                    );

                    setApplicationConceptErrors(
                        errors
                    );

                    clearMessage();
                    return;
                }

                console.error(error);

                showMessage(
                    getErrorMessage(
                        error,
                        "Error al guardar el concepto de aplicación."
                    ),
                    "error"
                );
            } finally {
                setLoadingApplicationConcept(false);
            }
        };

    return {
        applicationConceptForm,
        applicationConceptErrors,
        loadingApplicationConcept,

        handleApplicationConceptChange,
        handleSaveApplicationConcept,
    };
};
import {
    useEffect,
    useState,
} from "react";

import { ValidationError } from "yup";

import {
    updatePersonnelCandidatePositionValidation,
} from "../../../services/humanTalent/candidateValidation/personnelCandidateValidationService";

import {
    candidatePositionValidationSchema,
} from "../../../validations/humanTalent/candidateValidation/personnelCandidateValidation";

import { getErrorMessage } from "../../../utils/common/getErrorMessage";

import type { MessageType } from "../../../interfaces/common/message.interface";

import type {
    CandidatePositionValidationForm,
    CandidatePositionValidationFormErrors,
    PersonnelCandidateValidationCandidate,
    UpdatePersonnelCandidatePositionValidationData,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface UsePositionValidationProps {
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

// Estado inicial de la Fase 2.
const initialPositionValidationForm:
    CandidatePositionValidationForm = {
    positionType: "",
    changeControlCode: "",
};

// Errores iniciales de la Fase 2.
const initialPositionValidationErrors:
    CandidatePositionValidationFormErrors = {
    positionType: "",
    changeControlCode: "",
};

// Hook encargado de la Fase 2 - Validación de cargo.
export const usePositionValidation = ({
    candidate,
    reloadCandidateDetail,
    clearMessage,
    showMessage,
}: UsePositionValidationProps) => {
    const [
        positionValidationForm,
        setPositionValidationForm,
    ] = useState<CandidatePositionValidationForm>(
        initialPositionValidationForm
    );

    const [
        positionValidationErrors,
        setPositionValidationErrors,
    ] =
        useState<CandidatePositionValidationFormErrors>(
            initialPositionValidationErrors
        );

    const [
        loadingPositionValidation,
        setLoadingPositionValidation,
    ] = useState(false);

    // Sincroniza el formulario con la información consultada.
    useEffect(() => {
        setPositionValidationForm({
            positionType:
                candidate?.validation
                    ?.positionType ?? "",

            changeControlCode:
                candidate?.validation
                    ?.changeControlCode ?? "",
        });

        setPositionValidationErrors(
            initialPositionValidationErrors
        );
    }, [candidate]);

    // Actualiza el tipo de cargo.
    const handlePositionTypeChange = (
        value:
            CandidatePositionValidationForm["positionType"]
    ) => {
        setPositionValidationForm(
            (previous) => ({
                ...previous,

                positionType: value,

                changeControlCode:
                    value === "NUEVO_CARGO"
                        ? previous.changeControlCode
                        : "",
            })
        );

        setPositionValidationErrors(
            initialPositionValidationErrors
        );
    };

    // Actualiza el código de control de cambios.
    const handleChangeControlCodeChange = (
        value: string
    ) => {
        setPositionValidationForm(
            (previous) => ({
                ...previous,
                changeControlCode: value,
            })
        );

        setPositionValidationErrors(
            (previous) => ({
                ...previous,
                changeControlCode: "",
            })
        );
    };

    // Guarda la Fase 2.
    const handleSavePositionValidation =
        async () => {
            if (!candidate) {
                return;
            }

            try {
                await candidatePositionValidationSchema.validate(
                    positionValidationForm,
                    {
                        abortEarly: false,
                    }
                );

                if (
                    !positionValidationForm.positionType
                ) {
                    return;
                }

                setLoadingPositionValidation(true);

                setPositionValidationErrors(
                    initialPositionValidationErrors
                );

                clearMessage();

                const data:
                    UpdatePersonnelCandidatePositionValidationData =
                {
                    positionType:
                        positionValidationForm.positionType,

                    changeControlCode:
                        positionValidationForm.positionType ===
                            "NUEVO_CARGO"
                            ? positionValidationForm.changeControlCode.trim()
                            : null,
                };

                const response =
                    await updatePersonnelCandidatePositionValidation(
                        candidate.id,
                        data
                    );

                await reloadCandidateDetail();

                showMessage(
                    response.message ||
                    "Validación de cargo guardada correctamente.",
                    "success"
                );
            } catch (error: unknown) {
                if (
                    error instanceof
                    ValidationError
                ) {
                    const errors:
                        CandidatePositionValidationFormErrors =
                    {
                        ...initialPositionValidationErrors,
                    };

                    error.inner.forEach(
                        (validationError) => {
                            const path =
                                validationError.path as
                                keyof CandidatePositionValidationFormErrors;

                            if (path) {
                                errors[path] =
                                    validationError.message;
                            }
                        }
                    );

                    setPositionValidationErrors(
                        errors
                    );

                    clearMessage();
                    return;
                }

                console.error(error);

                showMessage(
                    getErrorMessage(
                        error,
                        "Error al guardar la validación de cargo."
                    ),
                    "error"
                );
            } finally {
                setLoadingPositionValidation(false);
            }
        };

    return {
        positionValidationForm,
        positionValidationErrors,
        loadingPositionValidation,

        handlePositionTypeChange,
        handleChangeControlCodeChange,
        handleSavePositionValidation,
    };
};
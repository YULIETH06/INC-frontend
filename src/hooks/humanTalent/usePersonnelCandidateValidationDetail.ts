import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { ValidationError } from "yup";

import {
    completePersonnelCandidateValidation,
    createPersonnelCandidateValidation,
    getPersonnelCandidateValidationDetail,
    updatePersonnelCandidatePositionValidation,
} from "../../services/humanTalent/personnelCandidateValidationService";

import {
    candidateApplicationConceptSchema,
    candidatePositionValidationSchema,
    candidateValidationSchema,
} from "../../validations/humanTalent/personnelCandidateValidation";

import { getErrorMessage } from "../../utils/common/getErrorMessage";

import type { MessageType } from "../../interfaces/common/message.interface";

import type {
    CandidateApplicationConceptForm,
    CandidateApplicationConceptFormErrors,
    CandidatePositionValidationForm,
    CandidatePositionValidationFormErrors,
    CandidateRequirementValidationFormErrors,
    CandidateValidationForm,
    CandidateValidationFormErrors,
    CompletePersonnelCandidateValidationData,
    PersonnelCandidateValidationCandidate,
    UpdatePersonnelCandidatePositionValidationData,
} from "../../interfaces/humanTalent/personnelCandidateValidation.interface";

interface UsePersonnelCandidateValidationDetailProps {
    candidateId: number;
    enabled?: boolean;
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

// Estado inicial de la Fase 3.
const initialCandidateValidationForm:
    CandidateValidationForm = {
    isSuitable: null,
    requirementValidations: [],
};

// Errores iniciales de la Fase 3.
const initialCandidateValidationErrors:
    CandidateValidationFormErrors = {
    isSuitable: "",
    requirementValidations: [],
};

// Hook encargado del detalle y las etapas de validación del candidato.
export const usePersonnelCandidateValidationDetail = ({
    candidateId,
    enabled = true,
}: UsePersonnelCandidateValidationDetailProps) => {
    // Candidato consultado.
    const [
        candidate,
        setCandidate,
    ] = useState<PersonnelCandidateValidationCandidate | null>(
        null
    );

    // Permiso para gestionar la validación.
    const [
        canManageValidation,
        setCanManageValidation,
    ] = useState(false);

    // Formularios de las etapas.
    const [
        applicationConceptForm,
        setApplicationConceptForm,
    ] = useState<CandidateApplicationConceptForm>(
        initialApplicationConceptForm
    );

    const [
        positionValidationForm,
        setPositionValidationForm,
    ] = useState<CandidatePositionValidationForm>(
        initialPositionValidationForm
    );

    const [
        candidateValidationForm,
        setCandidateValidationForm,
    ] = useState<CandidateValidationForm>(
        initialCandidateValidationForm
    );

    // Errores Yup de las etapas.
    const [
        applicationConceptErrors,
        setApplicationConceptErrors,
    ] = useState<CandidateApplicationConceptFormErrors>(
        initialApplicationConceptErrors
    );

    const [
        positionValidationErrors,
        setPositionValidationErrors,
    ] = useState<CandidatePositionValidationFormErrors>(
        initialPositionValidationErrors
    );

    const [
        candidateValidationErrors,
        setCandidateValidationErrors,
    ] = useState<CandidateValidationFormErrors>(
        initialCandidateValidationErrors
    );

    // Estados de carga.
    const [
        loadingDetail,
        setLoadingDetail,
    ] = useState(false);

    const [
        loadingApplicationConcept,
        setLoadingApplicationConcept,
    ] = useState(false);

    const [
        loadingPositionValidation,
        setLoadingPositionValidation,
    ] = useState(false);

    const [
        loadingCandidateValidation,
        setLoadingCandidateValidation,
    ] = useState(false);

    // Error producido al consultar el detalle.
    const [detailError, setDetailError] =
        useState("");

    // Mensaje visual.
    const [message, setMessage] =
        useState("");

    const [
        openMessage,
        setOpenMessage,
    ] = useState(false);

    const [
        messageSeverity,
        setMessageSeverity,
    ] = useState<MessageType>("success");

    // Inicializa los formularios con la información consultada.
    const initializeForms = useCallback(
        (
            selectedCandidate:
                PersonnelCandidateValidationCandidate
        ) => {
            const validation =
                selectedCandidate.validation;

            setApplicationConceptForm({
                applicationConcept:
                    validation?.applicationConcept ?? "",
            });

            setPositionValidationForm({
                positionType:
                    validation?.positionType ?? "",

                changeControlCode:
                    validation?.changeControlCode ?? "",
            });

            const requirementValidations =
                selectedCandidate.requisition.positionRevision
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

            setApplicationConceptErrors(
                initialApplicationConceptErrors
            );

            setPositionValidationErrors(
                initialPositionValidationErrors
            );

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

                initializeForms(
                    response.candidate
                );
            } catch (error: unknown) {
                console.error(error);

                setCandidate(null);
                setCanManageValidation(false);

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
            initializeForms,
        ]);

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

    // Limpia el error de un campo evaluado en la Fase 3.
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

                setMessage("");
                setOpenMessage(false);

                const response =
                    await createPersonnelCandidateValidation(
                        candidate.id,
                        {
                            applicationConcept:
                                applicationConceptForm.applicationConcept,
                        }
                    );

                await loadCandidateDetail();

                setMessage(
                    response.message ||
                    "Concepto de aplicación guardado correctamente."
                );

                setMessageSeverity("success");
                setOpenMessage(true);
            } catch (error: unknown) {
                if (error instanceof ValidationError) {
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

                    setMessage("");
                    setOpenMessage(false);
                    return;
                }

                console.error(error);

                setMessage(
                    getErrorMessage(
                        error,
                        "Error al guardar el concepto de aplicación."
                    )
                );

                setMessageSeverity("error");
                setOpenMessage(true);
            } finally {
                setLoadingApplicationConcept(false);
            }
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

                setMessage("");
                setOpenMessage(false);

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

                await loadCandidateDetail();

                setMessage(
                    response.message ||
                    "Validación de cargo guardada correctamente."
                );

                setMessageSeverity("success");
                setOpenMessage(true);
            } catch (error: unknown) {
                if (error instanceof ValidationError) {
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

                    setMessage("");
                    setOpenMessage(false);
                    return;
                }

                console.error(error);

                setMessage(
                    getErrorMessage(
                        error,
                        "Error al guardar la validación de cargo."
                    )
                );

                setMessageSeverity("error");
                setOpenMessage(true);
            } finally {
                setLoadingPositionValidation(false);
            }
        };

    // Completa la Fase 3.
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

                setMessage("");
                setOpenMessage(false);

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

                await loadCandidateDetail();

                setMessage(
                    response.message ||
                    "Validación del postulante completada correctamente."
                );

                setMessageSeverity("success");
                setOpenMessage(true);
            } catch (error: unknown) {
                if (error instanceof ValidationError) {
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

                    setMessage("");
                    setOpenMessage(false);
                    return;
                }

                console.error(error);

                setMessage(
                    getErrorMessage(
                        error,
                        "Error al completar la validación del postulante."
                    )
                );

                setMessageSeverity("error");
                setOpenMessage(true);
            } finally {
                setLoadingCandidateValidation(false);
            }
        };

    // Cierra el mensaje visual.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    useEffect(() => {
        void loadCandidateDetail();
    }, [loadCandidateDetail]);

    return {
        candidate,
        canManageValidation,

        applicationConceptForm,
        positionValidationForm,
        candidateValidationForm,

        applicationConceptErrors,
        positionValidationErrors,
        candidateValidationErrors,

        loadingDetail,
        loadingApplicationConcept,
        loadingPositionValidation,
        loadingCandidateValidation,

        detailError,

        message,
        openMessage,
        messageSeverity,

        loadCandidateDetail,

        handleApplicationConceptChange,

        handlePositionTypeChange,
        handleChangeControlCodeChange,

        handleRequirementCompliesChange,
        handleRequirementEvidenceChange,
        handleRequirementGapClosureChange,
        handleSuitableChange,

        handleSaveApplicationConcept,
        handleSavePositionValidation,
        handleSaveCandidateValidation,

        closeMessage,
    };
};
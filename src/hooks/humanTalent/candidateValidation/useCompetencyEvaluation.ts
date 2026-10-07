import {
    useEffect,
    useState,
} from "react";

import { ValidationError } from "yup";

import {
    completePersonnelCandidateCompetencyEvaluation,
} from "../../../services/humanTalent/candidateValidation/personnelCandidateValidationService";

import {
    candidateCompetencyEvaluationSchema,
} from "../../../validations/humanTalent/candidateValidation/personnelCandidateValidation";

import { getErrorMessage } from "../../../utils/common/getErrorMessage";

import type { MessageType } from "../../../interfaces/common/message.interface";

import type {
    CandidateCompetencyEvaluationForm,
    CandidateCompetencyEvaluationFormErrors,
    CandidateCompetencyResult,
    CandidatePsychotechnicalTestForm,
    CandidatePsychotechnicalTestFormErrors,
    CompletePersonnelCandidateCompetencyEvaluationData,
    PersonnelCandidateValidationCandidate,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface UseCompetencyEvaluationProps {
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

// Prueba psicotécnica vacía utilizada al agregar un nuevo registro.
const emptyPsychotechnicalTest:
    CandidatePsychotechnicalTestForm = {
    appliedTest: "",
    evaluationAspects: "",
    resultDescription: "",
};

// Errores vacíos de una prueba psicotécnica.
const emptyPsychotechnicalTestErrors:
    CandidatePsychotechnicalTestFormErrors = {
    appliedTest: "",
    evaluationAspects: "",
    resultDescription: "",
};

// Estado inicial de la Fase 5.
const initialCompetencyEvaluationForm:
    CandidateCompetencyEvaluationForm = {
    psychotechnicalTests: [
        {
            ...emptyPsychotechnicalTest,
        },
    ],
    competencyValidations: [],
    generalConcept: "",
    isSuitable: null,
};

// Errores iniciales de la Fase 5.
const initialCompetencyEvaluationErrors:
    CandidateCompetencyEvaluationFormErrors = {
    psychotechnicalTests: [
        {
            ...emptyPsychotechnicalTestErrors,
        },
    ],
    competencyValidations: [],
    generalConcept: "",
    isSuitable: "",
};

// Hook encargado de la Fase 5 - Evaluación de Competencias.
export const useCompetencyEvaluation = ({
    candidate,
    reloadCandidateDetail,
    clearMessage,
    showMessage,
}: UseCompetencyEvaluationProps) => {
    const [
        competencyEvaluationForm,
        setCompetencyEvaluationForm,
    ] = useState<CandidateCompetencyEvaluationForm>(
        initialCompetencyEvaluationForm
    );

    const [
        competencyEvaluationErrors,
        setCompetencyEvaluationErrors,
    ] =
        useState<CandidateCompetencyEvaluationFormErrors>(
            initialCompetencyEvaluationErrors
        );

    const [
        loadingCompetencyEvaluation,
        setLoadingCompetencyEvaluation,
    ] = useState(false);

    // Sincroniza el formulario con la información consultada.
    useEffect(() => {
        if (!candidate) {
            setCompetencyEvaluationForm(
                initialCompetencyEvaluationForm
            );

            setCompetencyEvaluationErrors(
                initialCompetencyEvaluationErrors
            );

            return;
        }

        const validation =
            candidate.validation;

        // Pruebas guardadas o un registro vacío para iniciar.
        const savedTests =
            validation?.psychotechnicalTests ?? [];

        const psychotechnicalTests:
            CandidatePsychotechnicalTestForm[] =
            savedTests.length > 0
                ? savedTests.map((test) => ({
                    appliedTest:
                        test.appliedTest,

                    evaluationAspects:
                        test.evaluationAspects,

                    resultDescription:
                        test.resultDescription,
                }))
                : [
                    {
                        ...emptyPsychotechnicalTest,
                    },
                ];

        // Competencias configuradas en la revisión del cargo.
        const competencyValidations =
            candidate.requisition.positionRevision
                .positionCompetencyDescriptions.map(
                    (description) => {
                        const savedValidation =
                            validation?.competencyValidations?.find(
                                (item) =>
                                    item.competencyDescriptionId ===
                                    description.id
                            );

                        return {
                            competencyDescriptionId:
                                description.id,

                            result:
                                savedValidation?.result ??
                                ("" as const),
                        };
                    }
                );

        const competencyEvaluation =
            validation?.competencyEvaluation;

        setCompetencyEvaluationForm({
            psychotechnicalTests,
            competencyValidations,

            generalConcept:
                competencyEvaluation?.generalConcept ??
                "",

            isSuitable:
                competencyEvaluation?.isSuitable ??
                null,
        });

        setCompetencyEvaluationErrors({
            psychotechnicalTests:
                psychotechnicalTests.map(
                    () => ({
                        ...emptyPsychotechnicalTestErrors,
                    })
                ),

            competencyValidations:
                competencyValidations.map(
                    () => ({
                        result: "",
                    })
                ),

            generalConcept: "",
            isSuitable: "",
        });
    }, [candidate]);

    // Agrega un nuevo formulario de prueba psicotécnica.
    const handleAddPsychotechnicalTest = () => {
        setCompetencyEvaluationForm(
            (previous) => ({
                ...previous,

                psychotechnicalTests: [
                    ...previous.psychotechnicalTests,
                    {
                        ...emptyPsychotechnicalTest,
                    },
                ],
            })
        );

        setCompetencyEvaluationErrors(
            (previous) => ({
                ...previous,

                psychotechnicalTests: [
                    ...previous.psychotechnicalTests,
                    {
                        ...emptyPsychotechnicalTestErrors,
                    },
                ],
            })
        );
    };

    // Elimina un formulario de prueba psicotécnica.
    // Siempre debe permanecer por lo menos uno.
    const handleRemovePsychotechnicalTest = (
        index: number
    ) => {
        setCompetencyEvaluationForm(
            (previous) => {
                if (
                    previous.psychotechnicalTests
                        .length <= 1
                ) {
                    return previous;
                }

                return {
                    ...previous,

                    psychotechnicalTests:
                        previous.psychotechnicalTests.filter(
                            (
                                _test,
                                testIndex
                            ) =>
                                testIndex !== index
                        ),
                };
            }
        );

        setCompetencyEvaluationErrors(
            (previous) => {
                if (
                    previous.psychotechnicalTests
                        .length <= 1
                ) {
                    return previous;
                }

                return {
                    ...previous,

                    psychotechnicalTests:
                        previous.psychotechnicalTests.filter(
                            (
                                _error,
                                errorIndex
                            ) =>
                                errorIndex !== index
                        ),
                };
            }
        );
    };

    // Actualiza un campo de una prueba psicotécnica.
    const handlePsychotechnicalTestChange = (
        index: number,
        field:
            keyof CandidatePsychotechnicalTestForm,
        value: string
    ) => {
        setCompetencyEvaluationForm(
            (previous) => ({
                ...previous,

                psychotechnicalTests:
                    previous.psychotechnicalTests.map(
                        (
                            test,
                            testIndex
                        ) =>
                            testIndex === index
                                ? {
                                    ...test,
                                    [field]: value,
                                }
                                : test
                    ),
            })
        );

        setCompetencyEvaluationErrors(
            (previous) => ({
                ...previous,

                psychotechnicalTests:
                    previous.psychotechnicalTests.map(
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

    // Actualiza el resultado de una competencia.
    const handleCompetencyResultChange = (
        index: number,
        value: CandidateCompetencyResult
    ) => {
        setCompetencyEvaluationForm(
            (previous) => ({
                ...previous,

                competencyValidations:
                    previous.competencyValidations.map(
                        (
                            competency,
                            competencyIndex
                        ) =>
                            competencyIndex === index
                                ? {
                                    ...competency,
                                    result: value,
                                }
                                : competency
                    ),
            })
        );

        setCompetencyEvaluationErrors(
            (previous) => ({
                ...previous,

                competencyValidations:
                    previous.competencyValidations.map(
                        (
                            error,
                            errorIndex
                        ) =>
                            errorIndex === index
                                ? {
                                    result: "",
                                }
                                : error
                    ),
            })
        );
    };

    // Actualiza el concepto general.
    const handleGeneralConceptChange = (
        value: string
    ) => {
        setCompetencyEvaluationForm(
            (previous) => ({
                ...previous,
                generalConcept: value,
            })
        );

        setCompetencyEvaluationErrors(
            (previous) => ({
                ...previous,
                generalConcept: "",
            })
        );
    };

    // Actualiza el resultado final del postulante.
    const handleCompetencyEvaluationSuitableChange = (
        value: boolean
    ) => {
        setCompetencyEvaluationForm(
            (previous) => ({
                ...previous,
                isSuitable: value,
            })
        );

        setCompetencyEvaluationErrors(
            (previous) => ({
                ...previous,
                isSuitable: "",
            })
        );
    };

    // Guarda la Fase 5 en una sola petición.
    const handleSaveCompetencyEvaluation =
        async () => {
            if (!candidate) {
                return;
            }

            try {
                await candidateCompetencyEvaluationSchema.validate(
                    competencyEvaluationForm,
                    {
                        abortEarly: false,
                    }
                );

                if (
                    competencyEvaluationForm.isSuitable ===
                    null
                ) {
                    return;
                }

                setLoadingCompetencyEvaluation(true);

                clearMessage();

                const data:
                    CompletePersonnelCandidateCompetencyEvaluationData =
                {
                    psychotechnicalTests:
                        competencyEvaluationForm.psychotechnicalTests.map(
                            (test) => ({
                                appliedTest:
                                    test.appliedTest.trim(),

                                evaluationAspects:
                                    test.evaluationAspects.trim(),

                                resultDescription:
                                    test.resultDescription.trim(),
                            })
                        ),

                    competencyValidations:
                        competencyEvaluationForm.competencyValidations.map(
                            (competency) => ({
                                competencyDescriptionId:
                                    competency.competencyDescriptionId,

                                result:
                                    competency.result as
                                    CandidateCompetencyResult,
                            })
                        ),

                    generalConcept:
                        competencyEvaluationForm.generalConcept.trim(),

                    isSuitable:
                        competencyEvaluationForm.isSuitable,
                };

                const response =
                    await completePersonnelCandidateCompetencyEvaluation(
                        candidate.id,
                        data
                    );

                await reloadCandidateDetail();

                showMessage(
                    response.message ||
                    "Evaluación de Competencias finalizada correctamente.",
                    "success"
                );
            } catch (error: unknown) {
                if (
                    error instanceof
                    ValidationError
                ) {
                    const errors:
                        CandidateCompetencyEvaluationFormErrors =
                    {
                        psychotechnicalTests:
                            competencyEvaluationForm.psychotechnicalTests.map(
                                () => ({
                                    ...emptyPsychotechnicalTestErrors,
                                })
                            ),

                        competencyValidations:
                            competencyEvaluationForm.competencyValidations.map(
                                () => ({
                                    result: "",
                                })
                            ),

                        generalConcept: "",
                        isSuitable: "",
                    };

                    // Errores que no corresponden a un campo específico.
                    const generalErrors: string[] = [];

                    error.inner.forEach(
                        (validationError) => {
                            const path =
                                validationError.path;

                            if (
                                path ===
                                "generalConcept"
                            ) {
                                errors.generalConcept =
                                    validationError.message;

                                return;
                            }

                            if (
                                path ===
                                "isSuitable"
                            ) {
                                errors.isSuitable =
                                    validationError.message;

                                return;
                            }

                            const testMatch =
                                path?.match(
                                    /^psychotechnicalTests\[(\d+)\]\.(appliedTest|evaluationAspects|resultDescription)$/
                                );

                            if (testMatch) {
                                const index =
                                    Number(testMatch[1]);

                                const field =
                                    testMatch[2] as
                                    keyof CandidatePsychotechnicalTestFormErrors;

                                if (
                                    errors.psychotechnicalTests[
                                    index
                                    ]
                                ) {
                                    errors.psychotechnicalTests[
                                        index
                                    ][field] =
                                        validationError.message;
                                }

                                return;
                            }

                            const competencyMatch =
                                path?.match(
                                    /^competencyValidations\[(\d+)\]\.result$/
                                );

                            if (competencyMatch) {
                                const index =
                                    Number(
                                        competencyMatch[1]
                                    );

                                if (
                                    errors.competencyValidations[
                                    index
                                    ]
                                ) {
                                    errors.competencyValidations[
                                        index
                                    ].result =
                                        validationError.message;
                                }

                                return;
                            }

                            generalErrors.push(
                                validationError.message
                            );
                        }
                    );

                    setCompetencyEvaluationErrors(
                        errors
                    );

                    // Muestra errores generales, por ejemplo,
                    // cuando la revisión no tiene competencias.
                    if (generalErrors.length > 0) {
                        showMessage(
                            generalErrors[0],
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
                        "Error al finalizar la Evaluación de Competencias."
                    ),
                    "error"
                );
            } finally {
                setLoadingCompetencyEvaluation(false);
            }
        };

    return {
        competencyEvaluationForm,
        competencyEvaluationErrors,
        loadingCompetencyEvaluation,

        handleAddPsychotechnicalTest,
        handleRemovePsychotechnicalTest,
        handlePsychotechnicalTestChange,
        handleCompetencyResultChange,
        handleGeneralConceptChange,
        handleCompetencyEvaluationSuitableChange,

        handleSaveCompetencyEvaluation,
    };
};
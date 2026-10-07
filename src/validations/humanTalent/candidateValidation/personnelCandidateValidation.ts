import * as Yup from "yup";

// Validación de la Fase 1: concepto de aplicación.
export const candidateApplicationConceptSchema =
    Yup.object({
        applicationConcept: Yup.string()
            .oneOf(
                [
                    "INGRESO",
                    "MODIFICACION_CARGO",
                ],
                "Seleccione una opción válida."
            )
            .required("Campo obligatorio."),
    });

// Validación de la Fase 2: validación de cargo.
export const candidatePositionValidationSchema =
    Yup.object({
        positionType: Yup.string()
            .oneOf(
                [
                    "NUEVO_CARGO",
                    "CARGO_EXISTENTE",
                ],
                "Seleccione una opción válida."
            )
            .required("Campo obligatorio."),

        changeControlCode: Yup.string()
            .trim()
            .max(
                100,
                "Máximo 100 caracteres."
            )
            .when("positionType", {
                is: "NUEVO_CARGO",
                then: (schema) =>
                    schema.required(
                        "Campo obligatorio."
                    ),
                otherwise: (schema) =>
                    schema.notRequired(),
            }),
    });

// Validación de cada requisito evaluado en la Fase 3.
const candidateRequirementValidationSchema =
    Yup.object({
        requirementDescriptionId: Yup.number()
            .integer()
            .positive()
            .required(),

        complies: Yup.boolean()
            .nullable()
            .required("Campo obligatorio."),

        evidence: Yup.string()
            .trim()
            .max(
                1000,
                "Máximo 1000 caracteres."
            )
            .when("complies", {
                is: true,
                then: (schema) =>
                    schema.required(
                        "Campo obligatorio."
                    ),
                otherwise: (schema) =>
                    schema.notRequired(),
            }),

        gapClosure: Yup.string()
            .trim()
            .max(
                1000,
                "Máximo 1000 caracteres."
            )
            .when("complies", {
                is: false,
                then: (schema) =>
                    schema.required(
                        "Campo obligatorio."
                    ),
                otherwise: (schema) =>
                    schema.notRequired(),
            }),
    });

// Validación de la Fase 3: validación del postulante.
export const candidateValidationSchema =
    Yup.object({
        isSuitable: Yup.boolean()
            .nullable()
            .required("Campo obligatorio."),

        requirementValidations: Yup.array()
            .of(
                candidateRequirementValidationSchema
            )
            .min(
                1,
                "Debe existir al menos un requisito para validar."
            )
            .required(),
    });

// Validación de las calificaciones de la Fase 4.
export const candidateTechnicalEvaluationSchema =
    Yup.object({
        interviewScore: Yup.number()
            .nullable()
            .typeError(
                "Ingrese una calificación válida."
            )
            .min(
                0,
                "La calificación debe estar entre 0.0 y 5.0."
            )
            .max(
                5,
                "La calificación debe estar entre 0.0 y 5.0."
            )
            .test(
                "one-decimal",
                "La calificación solo puede tener un decimal.",
                (value) =>
                    value === null ||
                    value === undefined ||
                    Number(value.toFixed(1)) === value
            ),

        examScore: Yup.number()
            .nullable()
            .typeError(
                "Ingrese una calificación válida."
            )
            .min(
                0,
                "La calificación debe estar entre 0.0 y 5.0."
            )
            .max(
                5,
                "La calificación debe estar entre 0.0 y 5.0."
            )
            .test(
                "one-decimal",
                "La calificación solo puede tener un decimal.",
                (value) =>
                    value === null ||
                    value === undefined ||
                    Number(value.toFixed(1)) === value
            ),
        examEvidenceFile: Yup.mixed<File>()
            .nullable()
            .test(
                "exam-evidence-required",
                "Debe adjuntar el archivo PDF del examen.",
                function (value) {
                    const {
                        examScore,
                    } = this.parent;

                    if (
                        examScore !== null &&
                        examScore !== undefined
                    ) {
                        return value instanceof File;
                    }

                    return true;
                }
            ),
    })
        .test(
            "at-least-one-score",
            "Debe diligenciar por lo menos una calificación.",
            (value) =>
                value?.interviewScore !== null &&
                value?.interviewScore !== undefined ||
                value?.examScore !== null &&
                value?.examScore !== undefined
        );

// Validación de la confirmación de la Fase 4.
export const candidateTechnicalEvaluationApprovalSchema =
    Yup.object({
        isSuitable: Yup.boolean()
            .nullable()
            .required(
                "Debe indicar si el postulante es apto para continuar."
            ),
    });

// Validación de cada prueba psicotécnica de la Fase 5.
const candidatePsychotechnicalTestSchema =
    Yup.object({
        appliedTest: Yup.string()
            .trim()
            .max(
                150,
                "Máximo 150 caracteres."
            )
            .required("Campo obligatorio."),

        evaluationAspects: Yup.string()
            .trim()
            .max(
                1000,
                "Máximo 1000 caracteres."
            )
            .required("Campo obligatorio."),

        resultDescription: Yup.string()
            .trim()
            .max(
                5000,
                "Máximo 5000 caracteres."
            )
            .required("Campo obligatorio."),
    });

// Validación de cada competencia evaluada en la Fase 5.
const candidateCompetencyValidationSchema =
    Yup.object({
        competencyDescriptionId: Yup.number()
            .integer()
            .positive()
            .required(),

        result: Yup.string()
            .oneOf(
                [
                    "Destacada",
                    "Por destacar",
                ],
                "Campo obligatorio."
            )
            .required("Campo obligatorio."),
    });

// Validación de la Fase 5: evaluación de competencias.
export const candidateCompetencyEvaluationSchema =
    Yup.object({
        psychotechnicalTests: Yup.array()
            .of(
                candidatePsychotechnicalTestSchema
            )
            .min(
                1,
                "Debe registrar por lo menos una prueba psicotécnica."
            )
            .required()
            .test(
                "unique-applied-test",
                "La prueba psicotécnica está repetida.",
                function (tests) {
                    if (!tests) {
                        return true;
                    }

                    const seenNames =
                        new Set<string>();

                    for (
                        const [index, test]
                        of tests.entries()
                    ) {
                        const normalizedName =
                            test.appliedTest
                                ?.trim()
                                .toLowerCase();

                        if (!normalizedName) {
                            continue;
                        }

                        if (
                            seenNames.has(
                                normalizedName
                            )
                        ) {
                            // Ubica el error en la prueba repetida.
                            return this.createError({
                                path: `psychotechnicalTests[${index}].appliedTest`,
                                message:
                                    "Esta prueba ya fue agregada.",
                            });
                        }

                        seenNames.add(
                            normalizedName
                        );
                    }

                    return true;
                }
            ),

        competencyValidations: Yup.array()
            .of(
                candidateCompetencyValidationSchema
            )
            .min(
                1,
                "Debe existir al menos una competencia para evaluar."
            )
            .required(),

        generalConcept: Yup.string()
            .trim()
            .max(
                500,
                "Máximo 500 caracteres."
            )
            .required("Campo obligatorio."),

        isSuitable: Yup.boolean()
            .nullable()
            .required("Campo obligatorio."),
    });
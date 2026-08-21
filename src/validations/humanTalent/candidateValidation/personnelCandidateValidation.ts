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
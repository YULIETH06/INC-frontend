import * as Yup from "yup";

// Validación común para la observación de una revisión.
const changeObservationSchema = Yup.string()
    .trim()
    .max(500, "Máximo 500 caracteres.");

// Validación común para el valor de un requisito.
const requirementValueSchema = Yup.string()
    .trim()
    .required("Campo obligatorio.")
    .max(500, "Máximo 500 caracteres.");

// Validación para crear una revisión de perfil de cargo.
export const createPositionProfileRevisionSchema =
    Yup.object({
        changeObservation: changeObservationSchema,
    });

// Validación para actualizar la observación de una revisión.
export const updatePositionProfileRevisionSchema =
    Yup.object({
        changeObservation:
            changeObservationSchema.nullable(),
    });

// Validación para registrar un requisito.
export const createPositionRequirementSchema =
    Yup.object({
        description: requirementValueSchema,
    });

// Validación para actualizar un requisito.
export const updatePositionRequirementSchema =
    Yup.object({
        description: requirementValueSchema,
    });
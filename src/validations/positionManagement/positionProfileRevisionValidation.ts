import * as Yup from "yup";

// Validación común para la observación de una revisión.
const changeObservationSchema = Yup.string()
    .trim()
    .max(500, "Máximo 500 caracteres.");

// Validación común para la descripción de un requisito.
const requirementDescriptionSchema = Yup.string()
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

// Validación para registrar una descripción de requisito.
export const createPositionRequirementDescriptionSchema =
    Yup.object({
        description: requirementDescriptionSchema,
    });

// Validación para actualizar una descripción de requisito.
export const updatePositionRequirementDescriptionSchema =
    Yup.object({
        description: requirementDescriptionSchema,
    });
import * as Yup from "yup";

// Tipos de archivo permitidos para las hojas de vida.
const allowedCandidateFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Tamaño máximo permitido: 5 MB.
const maxCandidateFileSize = 5 * 1024 * 1024;

// Validación común para la hoja de vida.
const candidateFileSchema = Yup.mixed<File>()
    .nullable()
    .test(
        "fileType",
        "Solo se permiten archivos PDF, DOC o DOCX.",
        (file) => {
            if (!file) return true;

            return allowedCandidateFileTypes.includes(
                file.type
            );
        }
    )
    .test(
        "fileSize",
        "La hoja de vida no puede superar los 5 MB.",
        (file) => {
            if (!file) return true;

            return file.size <= maxCandidateFileSize;
        }
    );

// Validación común del tipo de identificación (opcional).
// Si se escribe el número, el tipo es obligatorio.
const candidateIdentificationTypeIdSchema = Yup.string()
    .trim()
    .test(
        "requiredWithNumber",
        "Campo obligatorio si indicas el número.",
        function (value) {
            const identificationNumber =
                this.parent.identificationNumber?.trim();

            return !identificationNumber || Boolean(value);
        }
    );

// Validación común del número de identificación (opcional).
// Si se selecciona el tipo, el número es obligatorio.
const candidateIdentificationNumberSchema = Yup.string()
    .trim()
    .max(50, "Máximo 50 caracteres.")
    .matches(/^[0-9]+$/, {
        message: "Solo puede contener números.",
        excludeEmptyString: true,
    })
    .test(
        "requiredWithType",
        "Campo obligatorio si indicas el tipo.",
        function (value) {
            const identificationTypeId =
                this.parent.identificationTypeId;

            return !identificationTypeId || Boolean(value);
        }
    );

    // Validación para registrar un candidato.
export const createPersonnelRequisitionCandidateSchema =
    Yup.object({
                identificationTypeId:
            candidateIdentificationTypeIdSchema,

        identificationNumber:
            candidateIdentificationNumberSchema,

        name: Yup.string()
            .trim()
            .required("Campo obligatorio.")
            .min(3, "Mínimo 3 caracteres.")
            .max(150, "Máximo 150 caracteres.")
            .matches(
                /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/,
                "Solo puede contener letras."
            ),

        observation: Yup.string()
            .trim()
            .max(500, "Máximo 500 caracteres."),

        file: candidateFileSchema.required(
            "La hoja de vida es obligatoria."
        ),
    });

// Validación para actualizar un candidato.
export const updatePersonnelRequisitionCandidateSchema =
    Yup.object({
               identificationTypeId:
            candidateIdentificationTypeIdSchema,

        identificationNumber:
            candidateIdentificationNumberSchema,
        name: Yup.string()
            .trim()
            .required("Campo obligatorio.")
            .min(3, "Mínimo 3 caracteres.")
            .max(150, "Máximo 150 caracteres.")
            .matches(
                /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/,
                "Solo puede contener letras."
            ),

        observation: Yup.string()
            .trim()
            .max(500, "Máximo 500 caracteres."),

        // Al editar puede conservarse la hoja de vida actual.
        file: candidateFileSchema,
    });

// Validación del motivo de retraso en el primer cierre.
export const closePersonnelRequisitionCandidatesSchema =
    Yup.object({
        lateReason: Yup.string()
            .trim()
            .max(500, "Máximo 500 caracteres.")
            .test(
                "minimumLength",
                "Mínimo 3 caracteres.",
                (value) => {
                    if (!value) return true;

                    return value.length >= 3;
                }
            ),
    });

// Validación del motivo requerido para reabrir el cargue.
export const reopenPersonnelRequisitionCandidatesSchema =
    Yup.object({
        reason: Yup.string()
            .trim()
            .required("El motivo de reapertura es obligatorio.")
            .min(3, "Mínimo 3 caracteres.")
            .max(500, "Máximo 500 caracteres."),
    });
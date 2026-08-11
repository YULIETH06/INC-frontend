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

// Validación para registrar un candidato.
export const createPersonnelRequisitionCandidateSchema =
    Yup.object({
        identificationTypeId: Yup.string()
            .trim()
            .required("Campo obligatorio."),

        identificationNumber: Yup.string()
            .trim()
            .required("Campo obligatorio.")
            .max(50, "Máximo 50 caracteres.")
            .matches(
                /^[0-9]+$/,
                "Solo puede contener números."
            ),

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
        identificationTypeId: Yup.string()
            .trim()
            .required("Campo obligatorio."),

        identificationNumber: Yup.string()
            .trim()
            .required("Campo obligatorio.")
            .max(50, "Máximo 50 caracteres.")
            .matches(
                /^[0-9]+$/,
                "Solo puede contener números."
            ),

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
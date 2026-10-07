import type {
    CandidateValidationStatus,
} from "../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

// Devuelve la etiqueta visible del estado de la validación.
export const getValidationStatusLabel = (
    status: CandidateValidationStatus
): string => {
    switch (status) {
        case "SIN_INICIAR":
            return "Sin iniciar";

        case "CONCEPTO_APLICACION_COMPLETADO":
            return "Concepto de aplicación";

        case "VALIDACION_CARGO_COMPLETADA":
            return "Validación de cargo";

        case "VALIDACION_COMPLETADA":
            return "Validación del postulante";

        case "EVALUACION_TECNICA_EN_REGISTRO":
            return "Evaluación técnica en registro";

        case "EVALUACION_TECNICA_PENDIENTE_APROBACION":
            return "Evaluación técnica aprobación pendiente";

        case "EVALUACION_TECNICA_COMPLETADA":
            return "Evaluación técnica";

        case "EVALUACION_COMPETENCIAS_COMPLETADA":
            return "Evaluación de competencias";

        default:
            return status;
    }
};

// Devuelve el color visual del estado de la validación.
export const getValidationStatusColor = (
    status: CandidateValidationStatus
):
    | "default"
    | "warning"
    | "info"
    | "success" => {
    switch (status) {
        case "SIN_INICIAR":
            return "default";

        case "CONCEPTO_APLICACION_COMPLETADO":
            return "warning";

        case "VALIDACION_CARGO_COMPLETADA":
            return "info";

        case "VALIDACION_COMPLETADA":
            return "success";

        case "EVALUACION_TECNICA_EN_REGISTRO":
            return "warning";

        case "EVALUACION_TECNICA_PENDIENTE_APROBACION":
            return "info";

        case "EVALUACION_TECNICA_COMPLETADA":
            return "success";

        case "EVALUACION_COMPETENCIAS_COMPLETADA":
            return "success";

        default:
            return "default";
    }
};
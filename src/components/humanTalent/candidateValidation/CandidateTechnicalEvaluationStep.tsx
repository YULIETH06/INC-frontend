import {
    Alert,
    Box,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";
import FormGrid from "../../common/FormGrid";
import InfoItem from "../../common/InfoItem";
import RadioOptionGroup from "../../common/RadioOptionGroup";
import SectionCard from "../../common/SectionCard";

import { formatDate } from "../../../utils/common/dateUtils";

import type {
    CandidateTechnicalEvaluationApprovalForm,
    CandidateTechnicalEvaluationApprovalFormErrors,
    CandidateTechnicalEvaluationForm,
    CandidateTechnicalEvaluationFormErrors,
    PersonnelCandidateValidationCandidate,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface CandidateTechnicalEvaluationStepProps {
    candidate:
    PersonnelCandidateValidationCandidate;

    form:
    CandidateTechnicalEvaluationForm;

    formErrors:
    CandidateTechnicalEvaluationFormErrors;

    approvalForm:
    CandidateTechnicalEvaluationApprovalForm;

    approvalFormErrors:
    CandidateTechnicalEvaluationApprovalFormErrors;

    canManageValidation: boolean;
    canApproveTechnicalEvaluation: boolean;

    completedStep: number;

    loading: boolean;
    loadingApproval: boolean;

    onInterviewScoreChange: (
        value: number | null
    ) => void;

    onExamScoreChange: (
        value: number | null
    ) => void;

    onSuitableChange: (
        value: boolean
    ) => void;

    onSave: () => void;
    onApprove: () => void;
}

const suitableOptions = [
    {
        value: "true",
        label: "Sí",
    },
    {
        value: "false",
        label: "No",
    },
];

// Obtiene la clasificación correspondiente a una calificación.
const getScoreLabel = (
    score: number | null
) => {
    if (
        score === null ||
        score < 0 ||
        score > 5
    ) {
        return undefined;
    }

    if (score <= 3.4) {
        return "Deficiente";
    }

    if (score <= 3.9) {
        return "Aceptable";
    }

    if (score <= 4.4) {
        return "Bueno";
    }

    return "Excelente";
};

// Fase 4 del proceso: Evaluación Técnica.
const CandidateTechnicalEvaluationStep = ({
    candidate,
    form,
    formErrors,
    approvalForm,
    approvalFormErrors,
    canManageValidation,
    canApproveTechnicalEvaluation,
    completedStep,
    loading,
    loadingApproval,
    onInterviewScoreChange,
    onExamScoreChange,
    onSuitableChange,
    onSave,
    onApprove,
}: CandidateTechnicalEvaluationStepProps) => {
    const technicalEvaluation =
        candidate.validation?.technicalEvaluation;

    const status =
        technicalEvaluation?.status;

    const isCompleted =
        completedStep >= 4;

    const scoresLocked =
        !canManageValidation ||
        isCompleted ||
        status === "PENDIENTE_APROBACION" ||
        status === "APROBADA";

    const canSaveScores =
        canManageValidation &&
        completedStep === 3 &&
        candidate.validation?.isSuitable === true &&
        (
            !status ||
            status === "EN_REGISTRO"
        );

    const canConfirm =
        canApproveTechnicalEvaluation &&
        status === "PENDIENTE_APROBACION" &&
        !isCompleted;

    const suitableValue =
        approvalForm.isSuitable === null
            ? ""
            : String(
                approvalForm.isSuitable
            );

    const statusLabel =
        status === "EN_REGISTRO"
            ? "En registro"
            : status === "PENDIENTE_APROBACION"
                ? "Pendiente de confirmación"
                : status === "APROBADA"
                    ? "Confirmada"
                    : "Sin iniciar";

    return (
        <SectionCard
            title="4. Evaluación técnica"
            subtitle="Registra las calificaciones obtenidas en entrevista y examen."
        >
            <Stack spacing={3}>

                {/* Calificaciones. */}
                <FormGrid
                    columns={{
                        xs: "1fr",
                        sm: "1fr 1fr",
                    }}
                >
                    <TextField
                        label="Calificación entrevista"
                        type="number"
                        value={
                            form.interviewScore ??
                            ""
                        }
                        onChange={(event) =>
                            onInterviewScoreChange(
                                event.target.value ===
                                    ""
                                    ? null
                                    : Number(
                                        event.target
                                            .value
                                    )
                            )
                        }
                        error={Boolean(
                            formErrors.interviewScore
                        )}
                        helperText={
                            formErrors.interviewScore ||
                            "Calificación entre 0.0 y 5.0"
                        }
                        disabled={
                            scoresLocked ||
                            loading
                        }
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                max: 5,
                                step: 0.1,
                            },
                        }}
                    />

                    <TextField
                        label="Calificación examen"
                        type="number"
                        value={
                            form.examScore ??
                            ""
                        }
                        onChange={(event) =>
                            onExamScoreChange(
                                event.target.value ===
                                    ""
                                    ? null
                                    : Number(
                                        event.target
                                            .value
                                    )
                            )
                        }
                        error={Boolean(
                            formErrors.examScore
                        )}
                        helperText={
                            formErrors.examScore ||
                            "Calificación entre 0.0 y 5.0"
                        }
                        disabled={
                            scoresLocked ||
                            loading
                        }
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                max: 5,
                                step: 0.1,
                            },
                        }}
                    />
                </FormGrid>

                {/* Clasificación de las calificaciones. */}
                {(form.interviewScore !== null ||
                    form.examScore !== null) && (
                        <FormGrid
                            columns={{
                                xs: "1fr",
                                sm: "1fr 1fr",
                            }}
                        >
                            <InfoItem
                                label="Resultado entrevista"
                                value={
                                    getScoreLabel(
                                        form.interviewScore
                                    )
                                }
                            />

                            <InfoItem
                                label="Resultado examen"
                                value={
                                    getScoreLabel(
                                        form.examScore
                                    )
                                }
                            />
                        </FormGrid>
                    )}

                {/* Fechas registradas automáticamente. */}
                {technicalEvaluation && (
                    <>
                        <Divider />

                        <FormGrid
                            columns={{
                                xs: "1fr",
                                sm: "1fr 1fr",
                                md: "repeat(3, 1fr)",
                            }}
                        >
                            <InfoItem
                                label="Fecha entrevista"
                                value={
                                    technicalEvaluation
                                        .interviewRecordedAt
                                        ? formatDate(
                                            technicalEvaluation
                                                .interviewRecordedAt
                                        )
                                        : undefined
                                }
                            />

                            <InfoItem
                                label="Fecha examen"
                                value={
                                    technicalEvaluation
                                        .examRecordedAt
                                        ? formatDate(
                                            technicalEvaluation
                                                .examRecordedAt
                                        )
                                        : undefined
                                }
                            />

                            <InfoItem
                                label="Calificaciones registradas por"
                                value={
                                    technicalEvaluation
                                        .enteredBy
                                        ?.name
                                }
                            />
                        </FormGrid>
                    </>
                )}

                {/* Acción para guardar las calificaciones. */}
                {canSaveScores && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                        }}
                    >
                        <ActionButton
                            actionType="save"
                            loading={loading}
                            loadingText="Guardando..."
                            fullWidthOnMobile
                            onClick={onSave}
                        >
                            Guardar calificaciones
                        </ActionButton>
                    </Box>
                )}

                {/* Espera de confirmación. */}
                {status ===
                    "PENDIENTE_APROBACION" &&
                    !canApproveTechnicalEvaluation && (
                        <Alert severity="info">
                            Las calificaciones están
                            completas. La Evaluación
                            Técnica está pendiente de
                            confirmación por el usuario
                            que creó la requisición.
                        </Alert>
                    )}

                {/* Confirmación del creador de la requisición. */}
                {(canConfirm ||
                    isCompleted) && (
                        <>
                            <Divider />

                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 0.5,
                                    }}
                                >
                                    Resultado de la
                                    Evaluación Técnica
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            "text.secondary",
                                        mb: 1,
                                    }}
                                >
                                    ¿Postulante apto para
                                    seguir en proceso de
                                    selección?
                                </Typography>

                                <RadioOptionGroup
                                    value={
                                        suitableValue
                                    }
                                    options={
                                        suitableOptions
                                    }
                                    onChange={(value) =>
                                        onSuitableChange(
                                            value ===
                                            "true"
                                        )
                                    }
                                    error={
                                        approvalFormErrors
                                            .isSuitable
                                    }
                                    required
                                    disabled={
                                        !canConfirm ||
                                        loadingApproval
                                    }
                                />
                            </Box>
                        </>
                    )}

                {/* Acción para confirmar la Fase 4. */}
                {canConfirm && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                        }}
                    >
                        <ActionButton
                            actionType="approve"
                            loading={
                                loadingApproval
                            }
                            loadingText="Confirmando..."
                            fullWidthOnMobile
                            onClick={onApprove}
                        >
                            Confirmar evaluación
                        </ActionButton>
                    </Box>
                )}

                {/* Información final de la Fase 4. */}
                {isCompleted &&
                    technicalEvaluation && (
                        <>
                            <Divider />

                            <FormGrid
                                columns={{
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                }}
                            >
                                <InfoItem
                                    label="Fecha de confirmación"
                                    value={
                                        technicalEvaluation
                                            .approvedAt
                                            ? formatDate(
                                                technicalEvaluation
                                                    .approvedAt
                                            )
                                            : undefined
                                    }
                                />

                                <InfoItem
                                    label="Realizado por"
                                    value={
                                        technicalEvaluation
                                            .approvedBy
                                            ?.name
                                    }
                                />
                            </FormGrid>
                        </>
                    )}
            </Stack>
        </SectionCard>
    );
};

export default CandidateTechnicalEvaluationStep;
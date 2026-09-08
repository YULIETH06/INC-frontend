import {
    Alert,
    Box,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

    return (
        <SectionCard
            title="4. Evaluación técnica"
            subtitle="Evalúa los resultados obtenidos por el postulante en entrevista y examen."
        >
            <Stack spacing={3}>
                {/* Tabla de resultados técnicos. */}
                <TableContainer
                    sx={{
                        width: "100%",
                        overflowX: "auto",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                    }}
                >
                    <Table
                        size="small"
                        sx={{
                            minWidth: 760,
                            tableLayout: "fixed",

                            "& .MuiTableCell-root": {
                                borderColor: "divider",
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor:
                                        "background.default",
                                }}
                            >
                                <TableCell
                                    sx={{
                                        width: "20%",
                                        fontWeight: 700,
                                        py: 1.25,
                                        px: 1.5,
                                    }}
                                >
                                    Evaluación
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: "32%",
                                        fontWeight: 700,
                                        py: 1.25,
                                        px: 1.5,
                                    }}
                                >
                                    Calificación
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: "24%",
                                        fontWeight: 700,
                                        py: 1.25,
                                        px: 1.5,
                                    }}
                                >
                                    Resultado
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: "24%",
                                        fontWeight: 700,
                                        py: 1.25,
                                        px: 1.5,
                                    }}
                                >
                                    Fecha
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        verticalAlign:
                                            "middle",
                                        fontWeight: 700,
                                        bgcolor:
                                            "background.default",
                                        py: 1.5,
                                        px: 1.5,
                                    }}
                                >
                                    Entrevista
                                </TableCell>

                                <TableCell
                                    sx={{
                                        verticalAlign:
                                            "middle",
                                        py: 1,
                                        px: 1.5,
                                    }}
                                >
                                    <TextField
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
                                        size="small"
                                        slotProps={{
                                            htmlInput: {
                                                min: 0,
                                                max: 5,
                                                step: 0.1,
                                            },
                                        }}
                                    />
                                </TableCell>

                                <TableCell
                                    sx={{
                                        verticalAlign:
                                            "middle",
                                        py: 1.5,
                                        px: 1.5,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                        }}
                                    >
                                        {
                                            getScoreLabel(
                                                form.interviewScore
                                            ) ?? "—"
                                        }
                                    </Typography>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        verticalAlign:
                                            "middle",
                                        py: 1.5,
                                        px: 1.5,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                    >
                                        {
                                            technicalEvaluation
                                                ?.interviewRecordedAt
                                                ? formatDate(
                                                    technicalEvaluation
                                                        .interviewRecordedAt
                                                )
                                                : "—"
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0,
                                    },
                                }}
                            >
                                <TableCell
                                    sx={{
                                        verticalAlign:
                                            "middle",
                                        fontWeight: 700,
                                        bgcolor:
                                            "background.default",
                                        py: 1.5,
                                        px: 1.5,
                                    }}
                                >
                                    Examen
                                </TableCell>

                                <TableCell
                                    sx={{
                                        verticalAlign:
                                            "middle",
                                        py: 1,
                                        px: 1.5,
                                    }}
                                >
                                    <TextField
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
                                        size="small"
                                        slotProps={{
                                            htmlInput: {
                                                min: 0,
                                                max: 5,
                                                step: 0.1,
                                            },
                                        }}
                                    />
                                </TableCell>

                                <TableCell
                                    sx={{
                                        verticalAlign:
                                            "middle",
                                        py: 1.5,
                                        px: 1.5,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                        }}
                                    >
                                        {
                                            getScoreLabel(
                                                form.examScore
                                            ) ?? "—"
                                        }
                                    </Typography>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        verticalAlign:
                                            "middle",
                                        py: 1.5,
                                        px: 1.5,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                    >
                                        {
                                            technicalEvaluation
                                                ?.examRecordedAt
                                                ? formatDate(
                                                    technicalEvaluation
                                                        .examRecordedAt
                                                )
                                                : "—"
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

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

                {/* Resultado general de la evaluación técnica. */}
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
                                    Resultado de la Evaluación Técnica
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            "text.secondary",
                                        mb: 1,
                                    }}
                                >
                                    ¿Postulante apto para seguir en proceso de selección?
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

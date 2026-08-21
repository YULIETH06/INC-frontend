import {
    Box,
    Stack,
    TextField,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";
import FormGrid from "../../common/FormGrid";
import InfoItem from "../../common/InfoItem";
import RadioOptionGroup from "../../common/RadioOptionGroup";
import SectionCard from "../../common/SectionCard";

import {
    candidatePositionTypeOptions,
} from "../../../data/humanTalentOptions";

import type {
    CandidatePositionValidationForm,
    CandidatePositionValidationFormErrors,
    PersonnelCandidateValidationCandidate,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface CandidatePositionValidationStepProps {
    candidate:
    PersonnelCandidateValidationCandidate;

    form:
    CandidatePositionValidationForm;

    formErrors:
    CandidatePositionValidationFormErrors;

    canManageValidation: boolean;
    completedStep: number;
    loading: boolean;

    onPositionTypeChange: (
        value: CandidatePositionValidationForm["positionType"]
    ) => void;

    onChangeControlCodeChange: (
        value: string
    ) => void;

    onSave: () => void;
}

// Fase 2 del proceso: validación del cargo.
const CandidatePositionValidationStep = ({
    candidate,
    form,
    formErrors,
    canManageValidation,
    completedStep,
    loading,
    onPositionTypeChange,
    onChangeControlCodeChange,
    onSave,
}: CandidatePositionValidationStepProps) => {
    const isCompleted =
        completedStep >= 2;

    const isReadOnly =
        !canManageValidation ||
        isCompleted;

    return (
        <SectionCard
            title="2. Validación de cargo"
            subtitle="Verifica la información del perfil y clasifica el cargo del proceso."
        >
            <Stack spacing={3}>
                {/* Información del perfil utilizado en la requisición. */}
                <FormGrid
                    columns={{
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "repeat(3, 1fr)",
                    }}
                >

                    {form.positionType === "CARGO_EXISTENTE" && (
                        <InfoItem
                            label="Perfil de cargo vigente"
                            value={
                                (
                                    candidate.validation?.isPositionProfileCurrent ??
                                    (
                                        candidate.requisition
                                            .positionRevision
                                            .status === "VIGENTE"
                                    )
                                )
                                    ? "Sí"
                                    : "No"
                            }
                        />
                    )}

                    <InfoItem
                        label="Código del cargo"
                        value={
                            candidate.requisition
                                .position.code
                        }
                    />

                    <InfoItem
                        label="Revisión utilizada"
                        value={
                            candidate.requisition
                                .positionRevision
                                .revisionNumber
                        }
                    />
                </FormGrid>

                {/* Clasificación del cargo. */}
                <RadioOptionGroup
                    label="Tipo de cargo"
                    value={form.positionType}
                    options={
                        candidatePositionTypeOptions
                    }
                    onChange={(value) =>
                        onPositionTypeChange(
                            value as CandidatePositionValidationForm["positionType"]
                        )
                    }
                    error={
                        formErrors.positionType
                    }
                    required
                    disabled={
                        isReadOnly ||
                        loading
                    }
                />

                {/* Código requerido únicamente cuando corresponde a un nuevo cargo. */}
                {form.positionType ===
                    "NUEVO_CARGO" && (
                        <TextField
                            label="Código de control de cambios"
                            value={
                                form.changeControlCode
                            }
                            onChange={(event) =>
                                onChangeControlCodeChange(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                formErrors.changeControlCode
                            )}
                            helperText={
                                formErrors.changeControlCode ||
                                " "
                            }
                            required
                            fullWidth
                            disabled={
                                isReadOnly ||
                                loading
                            }
                            slotProps={{
                                htmlInput: {
                                    maxLength: 100,
                                },
                            }}
                        />
                    )}

                {canManageValidation &&
                    !isCompleted && (
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
                                Guardar y continuar
                            </ActionButton>
                        </Box>
                    )}
            </Stack>
        </SectionCard>
    );
};

export default CandidatePositionValidationStep;
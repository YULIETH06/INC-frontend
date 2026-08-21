import {
    Box,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";
import FormGrid from "../../common/FormGrid";
import InfoItem from "../../common/InfoItem";
import RadioOptionGroup from "../../common/RadioOptionGroup";
import SectionCard from "../../common/SectionCard";

import { formatDate } from "../../../utils/common/dateUtils";

import type {
    CandidateValidationForm,
    CandidateValidationFormErrors,
    CandidateValidationRequirementDescription,
    PersonnelCandidateValidationCandidate,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";
import CandidateRequirementValidationTable from "./CandidateRequirementValidationTable";

interface CandidateValidationStepProps {
    candidate:
    PersonnelCandidateValidationCandidate;

    form:
    CandidateValidationForm;

    formErrors:
    CandidateValidationFormErrors;

    canManageValidation: boolean;
    completedStep: number;
    loading: boolean;

    onRequirementCompliesChange: (
        index: number,
        value: boolean
    ) => void;

    onRequirementEvidenceChange: (
        index: number,
        value: string
    ) => void;

    onRequirementGapClosureChange: (
        index: number,
        value: string
    ) => void;

    onSuitableChange: (
        value: boolean
    ) => void;

    onSave: () => void;
}

interface RequirementGroup {
    requirementId: number;
    requirementName: string;

    descriptions: {
        description:
        CandidateValidationRequirementDescription;
        index: number;
    }[];
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

// Fase 3 del proceso: validación de los requisitos del postulante.
const CandidateValidationStep = ({
    candidate,
    form,
    formErrors,
    canManageValidation,
    completedStep,
    loading,
    onRequirementCompliesChange,
    onRequirementEvidenceChange,
    onRequirementGapClosureChange,
    onSuitableChange,
    onSave,
}: CandidateValidationStepProps) => {
    const isCompleted =
        completedStep >= 3;

    const isReadOnly =
        !canManageValidation ||
        isCompleted;

    const requirementDescriptions =
        candidate.requisition.positionRevision
            .requirementDescriptions;

    // Agrupa las descripciones por requisito conservando
    // el índice original utilizado por el formulario.
    const requirementGroups =
        requirementDescriptions.reduce<RequirementGroup[]>(
            (
                groups,
                description,
                index
            ) => {
                const existingGroup =
                    groups.find(
                        (group) =>
                            group.requirementId ===
                            description.requirement.id
                    );

                if (existingGroup) {
                    existingGroup.descriptions.push({
                        description,
                        index,
                    });

                    return groups;
                }

                groups.push({
                    requirementId:
                        description.requirement.id,

                    requirementName:
                        description.requirement.name,

                    descriptions: [
                        {
                            description,
                            index,
                        },
                    ],
                });

                return groups;
            },
            []
        );

    const suitableValue =
        form.isSuitable === null
            ? ""
            : String(form.isSuitable);

    return (
        <SectionCard
            title="3. Validación del postulante"
            subtitle="Evalúa cada requerimiento establecido en el perfil de cargo."
        >
            <Stack spacing={3}>
                {/* Tabla de requisitos de la revisión. */}
                <CandidateRequirementValidationTable
                    requirementGroups={
                        requirementGroups
                    }
                    form={form}
                    formErrors={formErrors}
                    disabled={
                        isReadOnly ||
                        loading
                    }
                    onCompliesChange={
                        onRequirementCompliesChange
                    }
                    onEvidenceChange={
                        onRequirementEvidenceChange
                    }
                    onGapClosureChange={
                        onRequirementGapClosureChange
                    }
                />

                <Divider />

                {/* Resultado general de la validación. */}
                <Box>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            mb: 0.5,
                        }}
                    >
                        Resultado de la validación
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color:
                                "text.secondary",
                            mb: 1,
                        }}
                    >
                        ¿Postulante apto para seguir en
                        proceso de selección?
                    </Typography>

                    <RadioOptionGroup
                        value={suitableValue}
                        options={suitableOptions}
                        onChange={(value) =>
                            onSuitableChange(
                                value === "true"
                            )
                        }
                        error={
                            formErrors.isSuitable
                        }
                        required
                        disabled={
                            isReadOnly ||
                            loading
                        }
                    />
                </Box>

                {/* Información registrada automáticamente al finalizar. */}
                {isCompleted &&
                    candidate.validation && (
                        <>
                            <Divider />

                            <FormGrid
                                columns={{
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                }}
                            >
                                <InfoItem
                                    label="Fecha de fin de validación"
                                    value={
                                        candidate.validation
                                            .validatedAt
                                            ? formatDate(
                                                candidate
                                                    .validation
                                                    .validatedAt
                                            )
                                            : undefined
                                    }
                                />

                                <InfoItem
                                    label="Realizado por"
                                    value={
                                        candidate.validation
                                            .performedBy
                                            ?.name
                                    }
                                />
                            </FormGrid>
                        </>
                    )}

                {/* Acción final de la etapa. */}
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
                                loadingText="Completando..."
                                fullWidthOnMobile
                                onClick={onSave}
                            >
                                Completar validación
                            </ActionButton>
                        </Box>
                    )}
            </Stack>
        </SectionCard>
    );
};

export default CandidateValidationStep;
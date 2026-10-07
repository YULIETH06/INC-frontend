import {
    Alert,
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
import TextAreaInput from "../../common/inputs/TextAreaInput";
import TextInput from "../../common/inputs/TextInput";

import CandidateCompetencyValidationTable from "./CandidateCompetencyValidationTable";

import {
    candidateGeneralConceptOptions,
} from "../../../data/humanTalentOptions";

import { formatDate } from "../../../utils/common/dateUtils";

import type {
    CandidateCompetencyEvaluationForm,
    CandidateCompetencyEvaluationFormErrors,
    CandidateCompetencyResult,
    CandidatePsychotechnicalTestForm,
    CandidateValidationCompetencyDescription,
    PersonnelCandidateValidationCandidate,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface CandidateCompetencyEvaluationStepProps {
    candidate:
    PersonnelCandidateValidationCandidate;

    form:
    CandidateCompetencyEvaluationForm;

    formErrors:
    CandidateCompetencyEvaluationFormErrors;

    canManageValidation: boolean;
    completedStep: number;
    loading: boolean;

    onAddPsychotechnicalTest: () => void;

    onRemovePsychotechnicalTest: (
        index: number
    ) => void;

    onPsychotechnicalTestChange: (
        index: number,
        field:
            keyof CandidatePsychotechnicalTestForm,
        value: string
    ) => void;

    onCompetencyResultChange: (
        index: number,
        value: CandidateCompetencyResult
    ) => void;

    onGeneralConceptChange: (
        value: string
    ) => void;

    onSuitableChange: (
        value: boolean
    ) => void;

    onSave: () => void;
}

interface CompetencyGroup {
    competencyTypeId: number;
    competencyTypeName: string;

    competencies: {
        description:
        CandidateValidationCompetencyDescription;
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

// Estilo común de los títulos de cada bloque.
const blockTitleSx = {
    fontWeight: 700,
    mb: 0.5,
};

// Estilo común de las descripciones de cada bloque.
const blockSubtitleSx = {
    color: "text.secondary",
    mb: 1.5,
};

// Fase 5 del proceso: Evaluación de Competencias.
const CandidateCompetencyEvaluationStep = ({
    candidate,
    form,
    formErrors,
    canManageValidation,
    completedStep,
    loading,
    onAddPsychotechnicalTest,
    onRemovePsychotechnicalTest,
    onPsychotechnicalTestChange,
    onCompetencyResultChange,
    onGeneralConceptChange,
    onSuitableChange,
    onSave,
}: CandidateCompetencyEvaluationStepProps) => {
    const isCompleted =
        completedStep >= 5;

    const isReadOnly =
        !canManageValidation ||
        isCompleted;

    const savedTests =
        candidate.validation
            ?.psychotechnicalTests ?? [];

    const competencyEvaluation =
        candidate.validation
            ?.competencyEvaluation;

    const competencyDescriptions =
        candidate.requisition.positionRevision
            .positionCompetencyDescriptions;

    // Agrupa las competencias por tipo conservando
    // el índice original utilizado por el formulario.
    const competencyGroups =
        competencyDescriptions.reduce<CompetencyGroup[]>(
            (
                groups,
                description,
                index
            ) => {
                const existingGroup =
                    groups.find(
                        (group) =>
                            group.competencyTypeId ===
                            description.competencyType.id
                    );

                if (existingGroup) {
                    existingGroup.competencies.push({
                        description,
                        index,
                    });

                    return groups;
                }

                groups.push({
                    competencyTypeId:
                        description.competencyType.id,

                    competencyTypeName:
                        description.competencyType.name,

                    competencies: [
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

    // Si el concepto guardado no está en las opciones actuales,
    // se agrega para poder mostrarlo en modo lectura.
    const generalConceptOptions =
        form.generalConcept &&
            !candidateGeneralConceptOptions.some(
                (option) =>
                    option.value ===
                    form.generalConcept
            )
            ? [
                ...candidateGeneralConceptOptions,
                {
                    value: form.generalConcept,
                    label: form.generalConcept,
                },
            ]
            : candidateGeneralConceptOptions;

    const suitableValue =
        form.isSuitable === null
            ? ""
            : String(form.isSuitable);

    return (
        <SectionCard
            title="5. Evaluación de competencias"
            subtitle="Registra las pruebas psicotécnicas, evalúa las competencias del cargo y define el concepto general."
        >
            <Stack spacing={3}>
                {/* Aviso para usuarios que solo consultan. */}
                {!canManageValidation &&
                    !isCompleted && (
                        <Alert severity="info">
                            La Evaluación de Competencias está pendiente de registro por Talento Humano.
                        </Alert>
                    )}

                {/* 1. Pruebas psicotécnicas. */}
                <Box>
                    <Typography
                        variant="subtitle1"
                        sx={blockTitleSx}
                    >
                        Pruebas psicotécnicas
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={blockSubtitleSx}
                    >
                        Describe el informe correspondiente a cada prueba aplicada.
                    </Typography>

                    <Stack spacing={2}>
                        {isReadOnly &&
                            savedTests.length > 0 &&
                            savedTests.map(
                                (
                                    test,
                                    index
                                ) => (
                                    <Box
                                        key={test.id}
                                        sx={{
                                            border: 1,
                                            borderColor:
                                                "divider",
                                            borderRadius: 1,
                                            p: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1.5,
                                            }}
                                        >
                                            Prueba psicotécnica {index + 1}
                                        </Typography>

                                        <Stack spacing={1.5}>
                                            <FormGrid
                                                columns={{
                                                    xs: "1fr",
                                                    sm: "1fr 1fr",
                                                }}
                                            >
                                                <InfoItem
                                                    label="Prueba aplicada"
                                                    value={
                                                        test.appliedTest
                                                    }
                                                />

                                                <InfoItem
                                                    label="Fecha de aplicación"
                                                    value={formatDate(
                                                        test.appliedAt
                                                    )}
                                                />
                                            </FormGrid>

                                            <InfoItem
                                                label="Aspectos para evaluar"
                                                value={
                                                    test.evaluationAspects
                                                }
                                            />

                                            <InfoItem
                                                label="Descripción de resultados"
                                                value={
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            whiteSpace:
                                                                "pre-line",
                                                            overflowWrap:
                                                                "anywhere",
                                                        }}
                                                    >
                                                        {
                                                            test.resultDescription
                                                        }
                                                    </Typography>
                                                }
                                            />
                                        </Stack>
                                    </Box>
                                )
                            )}

                        {isReadOnly &&
                            savedTests.length === 0 && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    No hay pruebas psicotécnicas registradas.
                                </Typography>
                            )}

                        {!isReadOnly &&
                            form.psychotechnicalTests.map(
                                (
                                    test,
                                    index
                                ) => {
                                    const testErrors =
                                        formErrors
                                            .psychotechnicalTests[
                                        index
                                        ];

                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                border: 1,
                                                borderColor:
                                                    "divider",
                                                borderRadius: 1,
                                                p: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 1,
                                                    mb: 1.5,
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Prueba psicotécnica {index + 1}
                                                </Typography>

                                                {form
                                                    .psychotechnicalTests
                                                    .length > 1 && (
                                                        <ActionButton
                                                            actionType="delete"
                                                            disabled={
                                                                loading
                                                            }
                                                            onClick={() =>
                                                                onRemovePsychotechnicalTest(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Quitar
                                                        </ActionButton>
                                                    )}
                                            </Box>

                                            <Stack spacing={2}>
                                                <TextInput
                                                    label="Prueba aplicada"
                                                    value={
                                                        test.appliedTest
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onPsychotechnicalTestChange(
                                                            index,
                                                            "appliedTest",
                                                            value
                                                        )
                                                    }
                                                    error={Boolean(
                                                        testErrors
                                                            ?.appliedTest
                                                    )}
                                                    helperText={
                                                        testErrors
                                                            ?.appliedTest
                                                    }
                                                    required
                                                    disabled={
                                                        loading
                                                    }
                                                    size="small"
                                                    slotProps={{
                                                        htmlInput: {
                                                            maxLength: 150,
                                                        },
                                                    }}
                                                />

                                                <TextAreaInput
                                                    label="Aspectos para evaluar"
                                                    value={
                                                        test.evaluationAspects
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onPsychotechnicalTestChange(
                                                            index,
                                                            "evaluationAspects",
                                                            value
                                                        )
                                                    }
                                                    error={Boolean(
                                                        testErrors
                                                            ?.evaluationAspects
                                                    )}
                                                    helperText={
                                                        testErrors
                                                            ?.evaluationAspects
                                                    }
                                                    rows={2}
                                                    required
                                                    disabled={
                                                        loading
                                                    }
                                                    slotProps={{
                                                        htmlInput: {
                                                            maxLength: 1000,
                                                        },
                                                    }}
                                                />

                                                <TextAreaInput
                                                    label="Descripción de resultados"
                                                    value={
                                                        test.resultDescription
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onPsychotechnicalTestChange(
                                                            index,
                                                            "resultDescription",
                                                            value
                                                        )
                                                    }
                                                    error={Boolean(
                                                        testErrors
                                                            ?.resultDescription
                                                    )}
                                                    helperText={
                                                        testErrors
                                                            ?.resultDescription
                                                    }
                                                    hint={`${test.resultDescription.length}/5000 caracteres`}
                                                    rows={6}
                                                    required
                                                    disabled={
                                                        loading
                                                    }
                                                    slotProps={{
                                                        htmlInput: {
                                                            maxLength: 5000,
                                                        },
                                                    }}
                                                />
                                            </Stack>
                                        </Box>
                                    );
                                }
                            )}

                        {!isReadOnly && (
                            <Box>
                                <ActionButton
                                    actionType="create"
                                    disabled={loading}
                                    onClick={
                                        onAddPsychotechnicalTest
                                    }
                                >
                                    Agregar prueba
                                </ActionButton>
                            </Box>
                        )}
                    </Stack>
                </Box>

                <Divider />

                {/* 2. Prueba de competencias. */}
                <Box>
                    <Typography
                        variant="subtitle1"
                        sx={blockTitleSx}
                    >
                        Prueba de competencias
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={blockSubtitleSx}
                    >
                        Evalúa cada competencia establecida en el perfil de cargo.
                    </Typography>

                    {competencyGroups.length > 0 ? (
                        <CandidateCompetencyValidationTable
                            competencyGroups={
                                competencyGroups
                            }
                            form={form}
                            formErrors={formErrors}
                            disabled={
                                isReadOnly ||
                                loading
                            }
                            onResultChange={
                                onCompetencyResultChange
                            }
                        />
                    ) : (
                        <Alert severity="warning">
                            La revisión del cargo no tiene competencias configuradas.
                        </Alert>
                    )}
                </Box>

                <Divider />

                {/* 3. Concepto general. */}
                <Box>
                    <Typography
                        variant="subtitle1"
                        sx={blockTitleSx}
                    >
                        Concepto general
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={blockSubtitleSx}
                    >
                        Selecciona el concepto que mejor describe el resultado de la evaluación.
                    </Typography>

                    <RadioOptionGroup
                        value={
                            form.generalConcept
                        }
                        options={
                            generalConceptOptions
                        }
                        onChange={
                            onGeneralConceptChange
                        }
                        error={
                            formErrors.generalConcept
                        }
                        required
                        row={false}
                        disabled={
                            isReadOnly ||
                            loading
                        }
                    />
                </Box>

                <Divider />

                {/* 4. Resultado de la validación. */}
                <Box>
                    <Typography
                        variant="subtitle1"
                        sx={blockTitleSx}
                    >
                        Resultado de la validación
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={blockSubtitleSx}
                    >
                        ¿Postulante apto para seguir en proceso de selección?
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
                    competencyEvaluation && (
                        <>
                            <Divider />

                            <FormGrid
                                columns={{
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                }}
                            >
                                <InfoItem
                                    label="Fecha de validación"
                                    value={formatDate(
                                        competencyEvaluation.validatedAt
                                    )}
                                />

                                <InfoItem
                                    label="Realizado por"
                                    value={
                                        competencyEvaluation
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

export default CandidateCompetencyEvaluationStep;
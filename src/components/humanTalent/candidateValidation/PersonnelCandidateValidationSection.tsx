import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Stack,
} from "@mui/material";

import CustomSnackbar from "../../common/CustomSnackbar";
import EmptyState from "../../common/EmptyState";
import FormGrid from "../../common/FormGrid";
import InfoItem from "../../common/InfoItem";
import LoadingBox from "../../common/LoadingBox";
import ProcessStepper from "../../common/ProcessStepper";

import CandidateApplicationConceptStep from "./CandidateApplicationConceptStep";
import CandidatePositionValidationStep from "./CandidatePositionValidationStep";
import CandidateValidationStep from "./CandidateValidationStep";

import {
    usePersonnelCandidateValidationDetail,
} from "../../../hooks/humanTalent/candidateValidation/usePersonnelCandidateValidationDetail";
import SectionCard from "../../common/SectionCard";

interface PersonnelCandidateValidationSectionProps {
    candidateId: number;
}

// Sección encargada de coordinar las etapas de validación del candidato.
const PersonnelCandidateValidationSection = ({
    candidateId,
}: PersonnelCandidateValidationSectionProps) => {
    const validCandidateId =
        Number.isInteger(candidateId) &&
        candidateId > 0;

    const [
        activeStep,
        setActiveStep,
    ] = useState(0);

    const {
        candidate,
        canManageValidation,

        applicationConceptForm,
        positionValidationForm,
        candidateValidationForm,

        applicationConceptErrors,
        positionValidationErrors,
        candidateValidationErrors,

        loadingDetail,
        loadingApplicationConcept,
        loadingPositionValidation,
        loadingCandidateValidation,

        detailError,

        message,
        openMessage,
        messageSeverity,

        handleApplicationConceptChange,

        handlePositionTypeChange,
        handleChangeControlCodeChange,

        handleRequirementCompliesChange,
        handleRequirementEvidenceChange,
        handleRequirementGapClosureChange,
        handleSuitableChange,

        handleSaveApplicationConcept,
        handleSavePositionValidation,
        handleSaveCandidateValidation,

        closeMessage,
    } = usePersonnelCandidateValidationDetail({
        candidateId,
        enabled: validCandidateId,
    });

    const completedStep =
        candidate?.validation?.completedStep ?? 0;

    // Ubica al usuario en la siguiente etapa pendiente.
    useEffect(() => {
        if (!candidate) {
            return;
        }

        setActiveStep(
            Math.min(
                completedStep,
                2
            )
        );
    }, [
        candidate,
        completedStep,
    ]);

    const steps = [
        {
            label: "Concepto de aplicación",
            completed:
                completedStep >= 1,
        },
        {
            label: "Validación de cargo",
            completed:
                completedStep >= 2,
            disabled:
                completedStep < 1,
        },
        {
            label: "Validación del postulante",
            completed:
                completedStep >= 3,
            disabled:
                completedStep < 2,
        },
    ];

    // Permite consultar únicamente las etapas habilitadas.
    const handleStepChange = (
        step: number
    ) => {
        if (
            step === 1 &&
            completedStep < 1
        ) {
            return;
        }

        if (
            step === 2 &&
            completedStep < 2
        ) {
            return;
        }

        setActiveStep(step);
    };

    if (!validCandidateId) {
        return (
            <Alert severity="error">
                El identificador del candidato no es válido.
            </Alert>
        );
    }

    return (
        <>
            {/* Estado de carga del detalle. */}
            {loadingDetail && (
                <LoadingBox
                    minHeight={220}
                    size={30}
                />
            )}

            {/* Error al consultar el candidato. */}
            {!loadingDetail &&
                detailError && (
                    <Alert severity="error">
                        {detailError}
                    </Alert>
                )}

            {/* Candidato no disponible. */}
            {!loadingDetail &&
                !detailError &&
                !candidate && (
                    <EmptyState
                        title="Candidato no disponible"
                        description="No fue posible encontrar el candidato seleccionado."
                    />
                )}

            {!loadingDetail &&
                !detailError &&
                candidate && (
                    <Stack spacing={4}>
                        {/* Navegación principal del proceso. */}
                        <Box
                            sx={{
                                width: "100%",
                                py: {
                                    xs: 1,
                                    sm: 2,
                                },
                            }}
                        >
                            <ProcessStepper
                                steps={steps}
                                activeStep={
                                    activeStep
                                }
                                onStepChange={
                                    handleStepChange
                                }
                            />
                        </Box>

                        <SectionCard
                        >
                            <FormGrid
                                columns={{
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                    md: "repeat(3, 1fr)",
                                }}
                            >
                                <InfoItem
                                    label="Cargo en proceso"
                                    value={
                                        candidate.requisition
                                            .position.name
                                    }
                                />

                                <InfoItem
                                    label="Departamento / Área"
                                    value={
                                        candidate.requisition
                                            .department.name
                                    }
                                />

                                <InfoItem
                                    label="Nombre del candidato"
                                    value={
                                        candidate.name
                                    }
                                />

                                <InfoItem
                                    label="Tipo de identificación"
                                    value={
                                        candidate
                                            .identificationType
                                            .name ||
                                        candidate
                                            .identificationType
                                            .code
                                    }
                                />

                                <InfoItem
                                    label="Número de identificación"
                                    value={
                                        candidate
                                            .identificationNumber
                                    }
                                />
                            </FormGrid>
                        </SectionCard>

                        {/* Fase 1. */}
                        {activeStep === 0 && (
                            <CandidateApplicationConceptStep
                                form={
                                    applicationConceptForm
                                }
                                formErrors={
                                    applicationConceptErrors
                                }
                                canManageValidation={
                                    canManageValidation
                                }
                                completedStep={
                                    completedStep
                                }
                                loading={
                                    loadingApplicationConcept
                                }
                                onApplicationConceptChange={
                                    handleApplicationConceptChange
                                }
                                onSave={
                                    handleSaveApplicationConcept
                                }
                            />
                        )}

                        {/* Fase 2. */}
                        {activeStep === 1 && (
                            <CandidatePositionValidationStep
                                candidate={
                                    candidate
                                }
                                form={
                                    positionValidationForm
                                }
                                formErrors={
                                    positionValidationErrors
                                }
                                canManageValidation={
                                    canManageValidation
                                }
                                completedStep={
                                    completedStep
                                }
                                loading={
                                    loadingPositionValidation
                                }
                                onPositionTypeChange={
                                    handlePositionTypeChange
                                }
                                onChangeControlCodeChange={
                                    handleChangeControlCodeChange
                                }
                                onSave={
                                    handleSavePositionValidation
                                }
                            />
                        )}

                        {/* Fase 3. */}
                        {activeStep === 2 && (
                            <CandidateValidationStep
                                candidate={
                                    candidate
                                }
                                form={
                                    candidateValidationForm
                                }
                                formErrors={
                                    candidateValidationErrors
                                }
                                canManageValidation={
                                    canManageValidation
                                }
                                completedStep={
                                    completedStep
                                }
                                loading={
                                    loadingCandidateValidation
                                }
                                onRequirementCompliesChange={
                                    handleRequirementCompliesChange
                                }
                                onRequirementEvidenceChange={
                                    handleRequirementEvidenceChange
                                }
                                onRequirementGapClosureChange={
                                    handleRequirementGapClosureChange
                                }
                                onSuitableChange={
                                    handleSuitableChange
                                }
                                onSave={
                                    handleSaveCandidateValidation
                                }
                            />
                        )}
                    </Stack>
                )}

            <CustomSnackbar
                open={openMessage}
                message={message}
                severity={messageSeverity}
                onClose={closeMessage}
            />
        </>
    );
};

export default PersonnelCandidateValidationSection;
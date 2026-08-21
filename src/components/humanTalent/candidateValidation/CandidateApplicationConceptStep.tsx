import {
    Box,
    Stack,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";
import RadioOptionGroup from "../../common/RadioOptionGroup";

import {
    candidateApplicationConceptOptions,
} from "../../../data/humanTalentOptions";

import type {
    CandidateApplicationConceptForm,
    CandidateApplicationConceptFormErrors,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";
import SectionCard from "../../common/SectionCard";

interface CandidateApplicationConceptStepProps {
    form: CandidateApplicationConceptForm;
    formErrors: CandidateApplicationConceptFormErrors;

    canManageValidation: boolean;
    completedStep: number;
    loading: boolean;

    onApplicationConceptChange: (
        value: CandidateApplicationConceptForm["applicationConcept"]
    ) => void;

    onSave: () => void;
}

// Fase 1 del proceso: concepto de aplicación.
const CandidateApplicationConceptStep = ({
    form,
    formErrors,
    canManageValidation,
    completedStep,
    loading,
    onApplicationConceptChange,
    onSave,
}: CandidateApplicationConceptStepProps) => {
    const isCompleted =
        completedStep >= 1;

    const isReadOnly =
        !canManageValidation ||
        isCompleted;

    return (
        <SectionCard
            title="1. Concepto de aplicación"
            subtitle="Seleccione el concepto de aplicación correspondiente."
        >

            <Stack spacing={3}>
                {/* Selección del concepto. */}
                <RadioOptionGroup
                    value={
                        form.applicationConcept
                    }
                    options={
                        candidateApplicationConceptOptions
                    }
                    onChange={(value) =>
                        onApplicationConceptChange(
                            value as CandidateApplicationConceptForm["applicationConcept"]
                        )
                    }
                    error={
                        formErrors.applicationConcept
                    }
                    required
                    disabled={
                        isReadOnly ||
                        loading
                    }
                />

                {/* Acción disponible mientras la etapa esté pendiente. */}
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

export default CandidateApplicationConceptStep;
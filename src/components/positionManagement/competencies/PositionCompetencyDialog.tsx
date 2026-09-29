import type {
    FormEvent,
} from "react";

import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import PositionRevisionEntryDialog from "../shared/PositionRevisionEntryDialog";

import TextAreaInput from "../../common/inputs/TextAreaInput";

import type {
    PositionCompetency,
    PositionCompetencyForm,
    PositionCompetencyFormErrors,
    PositionCompetencyType,
} from "../../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionCompetencyDialogProps {
    open: boolean;

    competencyTypes: PositionCompetencyType[];

    form: PositionCompetencyForm;
    formErrors: PositionCompetencyFormErrors;

    editingCompetency: PositionCompetency | null;

    isEditing: boolean;
    hasFormChanges: boolean;
    loadingSubmit: boolean;

    onCompetencyTypeChange: (
        value: number | ""
    ) => void;

    onCompetencyChange: (
        value: string
    ) => void;

    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void;

    onClose: () => void;
}

// Diálogo para registrar o actualizar una competencia.
const PositionCompetencyDialog = ({
    open,
    form,
    formErrors,
    editingCompetency,
    isEditing,
    hasFormChanges,
    loadingSubmit,
    onCompetencyChange,
    onSubmit,
    onClose,
}: PositionCompetencyDialogProps) => {

    return (
        <PositionRevisionEntryDialog
            open={open}
            title={
                isEditing
                    ? "Actualizar competencia"
                    : "Agregar competencia"
            }
            subtitle={
                isEditing
                    ? "Modifica la competencia registrada."
                    : "Registra una nueva competencia."
            }
            isEditing={isEditing}
            hasFormChanges={hasFormChanges}
            loadingSubmit={loadingSubmit}
            onSubmit={onSubmit}
            onClose={onClose}
        >
            <Stack spacing={3}>
                {editingCompetency && (
                    <Box
                        sx={{
                            p: 2,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            bgcolor:
                                "background.default",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                color:
                                    "text.secondary",
                            }}
                        >
                            Competencia
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {
                                editingCompetency.competency
                            }
                        </Typography>
                    </Box>
                )}

                <TextAreaInput
                    label="Competencia"
                    value={form.competency}
                    onChange={onCompetencyChange}
                    rows={4}
                    required
                    disabled={loadingSubmit}
                    placeholder="Escribe la competencia aquí..."
                    error={Boolean(
                        formErrors.competency
                    )}
                    helperText={
                        formErrors.competency
                            ? formErrors.competency
                            : `${form.competency.length}/500`
                    }
                    slotProps={{
                        htmlInput: {
                            maxLength: 500,
                        },
                    }}
                />
            </Stack>
        </PositionRevisionEntryDialog>
    );
};

export default PositionCompetencyDialog;
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
    PositionRequirementForm,
    PositionRequirementFormErrors,
} from "../../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionRequirementDialogProps {
    open: boolean;

    requirementName: string;

    form: PositionRequirementForm;
    formErrors: PositionRequirementFormErrors;

    isEditing: boolean;
    hasFormChanges: boolean;
    loadingSubmit: boolean;

    onRequirementChange: (value: string) => void;

    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void;

    onClose: () => void;
}

// Diálogo para registrar o actualizar un requisito.
const PositionRequirementDialog = ({
    open,
    requirementName,
    form,
    formErrors,
    isEditing,
    hasFormChanges,
    loadingSubmit,
    onRequirementChange,
    onSubmit,
    onClose,
}: PositionRequirementDialogProps) => {

    return (
        <PositionRevisionEntryDialog
            open={open}
            title={
                isEditing
                    ? "Actualizar requisito"
                    : "Agregar requisito"
            }
            subtitle={
                isEditing
                    ? "Modifica el requisito registrado."
                    : "Registra un nuevo requisito."
            }
            isEditing={isEditing}
            hasFormChanges={hasFormChanges}
            loadingSubmit={loadingSubmit}
            onSubmit={onSubmit}
            onClose={onClose}
        >
            <Stack spacing={3}>
                {requirementName && (
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
                                color: "text.secondary",
                            }}
                        >
                            Requisito
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {requirementName}
                        </Typography>
                    </Box>
                )}

                <TextAreaInput
                    label="Requisito"
                    value={form.description}
                    onChange={onRequirementChange}
                    rows={4}
                    required
                    disabled={loadingSubmit}
                    placeholder="Escribe el requisito aquí..."
                    error={Boolean(
                        formErrors.description
                    )}
                    helperText={
                        formErrors.description
                            ? formErrors.description
                            : `${form.description.length}/500`
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

export default PositionRequirementDialog;
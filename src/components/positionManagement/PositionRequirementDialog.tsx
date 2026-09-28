import type {
    FormEvent,
} from "react";

import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ActionButton from "../common/ActionButton";
import IconActionButton from "../common/IconActionButton";
import TextAreaInput from "../common/inputs/TextAreaInput";

import { appIcons } from "../../icons/appIcons";

import type {
    PositionRequirementForm,
    PositionRequirementFormErrors,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

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
    const SaveIcon = appIcons.save;
    const CreateIcon = appIcons.create;

    // Evita cerrar el diálogo mientras se procesa el formulario.
    const handleDialogClose = () => {
        if (loadingSubmit) {
            return;
        }

        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
        >
            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        pr: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        {isEditing ? (
                            <SaveIcon color="primary" />
                        ) : (
                            <CreateIcon color="primary" />
                        )}

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {isEditing
                                    ? "Actualizar requisito"
                                    : "Agregar requisito"}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                {isEditing
                                    ? "Modifica el requisito registrado."
                                    : "Registra un nuevo requisito."}
                            </Typography>
                        </Box>
                    </Stack>

                    <IconActionButton
                        icon="cancel"
                        tooltip="Cerrar formulario"
                        onClick={handleDialogClose}
                        disabled={loadingSubmit}
                    />
                </DialogTitle>

                <Divider />

                <DialogContent>
                    <Stack
                        spacing={3}
                        sx={{
                            pt: 1,
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2,
                                bgcolor: "background.default",
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.secondary",
                                    display: "block",
                                    mb: 0.5,
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
                                {requirementName ||
                                    "Requisito seleccionado"}
                            </Typography>
                        </Box>

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
                </DialogContent>

                <Divider />

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1,
                    }}
                >
                    <ActionButton
                        actionType="cancel"
                        onClick={handleDialogClose}
                        disabled={loadingSubmit}
                    >
                        Cancelar
                    </ActionButton>

                    <ActionButton
                        type="submit"
                        actionType={
                            isEditing
                                ? "save"
                                : "create"
                        }
                        loading={loadingSubmit}
                        loadingText={
                            isEditing
                                ? "Actualizando..."
                                : "Registrando..."
                        }
                        disabled={!hasFormChanges}
                    >
                        {isEditing
                            ? "Actualizar"
                            : "Agregar"}
                    </ActionButton>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default PositionRequirementDialog;
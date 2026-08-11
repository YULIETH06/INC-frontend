import type { FormEvent } from "react";

import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import ActionButton from "../common/ActionButton";

import type {
    PositionRequirementDescriptionForm,
    PositionRequirementDescriptionFormErrors,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionRequirementDescriptionDialogProps {
    open: boolean;

    requirementName: string;

    form: PositionRequirementDescriptionForm;
    formErrors: PositionRequirementDescriptionFormErrors;

    isEditing: boolean;
    hasFormChanges: boolean;
    loadingSubmit: boolean;

    onDescriptionChange: (value: string) => void;

    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void;

    onClose: () => void;
}

// Diálogo para registrar o actualizar una descripción de requisito.
const PositionRequirementDescriptionDialog = ({
    open,
    requirementName,
    form,
    formErrors,
    isEditing,
    hasFormChanges,
    loadingSubmit,
    onDescriptionChange,
    onSubmit,
    onClose,
}: PositionRequirementDescriptionDialogProps) => {
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
                            <SaveOutlinedIcon color="primary" />
                        ) : (
                            <AddCircleOutlineOutlinedIcon color="primary" />
                        )}

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {isEditing
                                    ? "Actualizar descripción"
                                    : "Agregar descripción"}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                {isEditing
                                    ? "Modifica la descripción registrada para este requisito."
                                    : "Registra una nueva descripción para este requisito."}
                            </Typography>
                        </Box>
                    </Stack>

                    <IconButton
                        onClick={handleDialogClose}
                        disabled={loadingSubmit}
                        aria-label="Cerrar formulario"
                    >
                        <CloseIcon />
                    </IconButton>
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

                        <TextField
                            label="Descripción"
                            value={form.description}
                            onChange={(event) =>
                                onDescriptionChange(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                formErrors.description
                            )}
                            helperText={
                                formErrors.description ||
                                `${form.description.length}/500`
                            }
                            multiline
                            minRows={4}
                            maxRows={8}
                            fullWidth
                            required
                            disabled={loadingSubmit}
                            placeholder="Escribe la formación, experiencia o conocimiento requerido."
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

export default PositionRequirementDescriptionDialog;
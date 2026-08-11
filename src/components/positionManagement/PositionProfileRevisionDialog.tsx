import type { FormEvent } from "react";

import {
    Alert,
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
    PositionProfileRevision,
    PositionProfileRevisionForm,
    PositionProfileRevisionFormErrors,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionProfileRevisionDialogProps {
    open: boolean;

    form: PositionProfileRevisionForm;
    formErrors: PositionProfileRevisionFormErrors;

    editingRevision: PositionProfileRevision | null;

    isEditing: boolean;
    hasFormChanges: boolean;
    loadingSubmit: boolean;

    onChangeObservation: (value: string) => void;

    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void;

    onClose: () => void;
}

// Diálogo para crear o actualizar una revisión de perfil de cargo.
const PositionProfileRevisionDialog = ({
    open,
    form,
    formErrors,
    editingRevision,
    isEditing,
    hasFormChanges,
    loadingSubmit,
    onChangeObservation,
    onSubmit,
    onClose,
}: PositionProfileRevisionDialogProps) => {
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
                                    ? "Actualizar revisión"
                                    : "Crear revisión"}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                {isEditing
                                    ? `Modifica la observación de la revisión ${editingRevision?.revisionNumber ?? ""}.`
                                    : "Crea una nueva revisión en estado borrador para el perfil de cargo."}
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
                        <TextField
                            label="Observación del cambio"
                            value={
                                form.changeObservation
                            }
                            onChange={(event) =>
                                onChangeObservation(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                formErrors.changeObservation
                            )}
                            helperText={
                                formErrors.changeObservation ||
                                `${form.changeObservation.length}/500`
                            }
                            multiline
                            minRows={4}
                            maxRows={7}
                            fullWidth
                            disabled={loadingSubmit}
                            placeholder="Describe brevemente el motivo o los cambios de esta revisión."
                        />
                        {!isEditing && (
                            <Alert
                                severity="info"
                            // variant="outlined"
                            >
                                La observación es opcional. La nueva revisión se
                                creará automáticamente en estado borrador.
                            </Alert>
                        )}
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
                                : "Creando..."
                        }
                        disabled={
                            isEditing &&
                            !hasFormChanges
                        }
                    >
                        {isEditing
                            ? "Actualizar"
                            : "Crear revisión"}
                    </ActionButton>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default PositionProfileRevisionDialog;
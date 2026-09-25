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

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import ActionButton from "../common/ActionButton";

import type {
    PositionCompetency,
    PositionCompetencyForm,
    PositionCompetencyFormErrors,
    PositionCompetencyType,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionCompetencyDialogProps {
    open: boolean;

    competencyTypes: PositionCompetencyType[];

    form: PositionCompetencyForm;
    formErrors: PositionCompetencyFormErrors;

    editingCompetency: PositionCompetency | null;

    isEditing: boolean;
    hasFormChanges: boolean;
    loadingSubmit: boolean;

    // Se conserva para mantener compatibilidad con el componente padre.
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

// Diálogo para crear o actualizar una competencia de una revisión.
const PositionCompetencyDialog = ({
    open,
    competencyTypes,
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
    // Obtiene automáticamente el tipo de competencia
    // asociado al competencyTypeId que ya viene seleccionado
    // desde el lugar donde se presionó "Agregar".
    const selectedCompetencyType =
        competencyTypes.find(
            (type) =>
                type.id === form.competencyTypeId
        );

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
                                    ? "Actualizar competencia"
                                    : "Agregar competencia"}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                {isEditing
                                    ? `Modifica la competencia ${editingCompetency?.competency ??
                                    ""
                                    }.`
                                    : "Registra una nueva competencia para este tipo."}
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
                        {/* Tipo de competencia seleccionado automáticamente. */}
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
                                    display: "block",
                                    color: "text.secondary",
                                    mb: 0.5,
                                }}
                            >
                                Tipo de competencia
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: 700,
                                }}
                            >
                                {selectedCompetencyType?.name ??
                                    "Tipo de competencia"}
                            </Typography>

                            {formErrors.competencyTypeId && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        mt: 0.75,
                                        color: "error.main",
                                    }}
                                >
                                    {
                                        formErrors.competencyTypeId
                                    }
                                </Typography>
                            )}
                        </Box>

                        {/* Campo de la competencia. */}
                        <TextField
                            label="Competencia"
                            value={form.competency}
                            onChange={(event) =>
                                onCompetencyChange(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                formErrors.competency
                            )}
                            helperText={
                                formErrors.competency ||
                                `${form.competency.length}/500`
                            }
                            fullWidth
                            required
                            disabled={loadingSubmit}
                            placeholder="Escribe la competencia."
                            multiline
                            minRows={3}
                            maxRows={6}
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
                        disabled={
                            isEditing &&
                            !hasFormChanges
                        }
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

export default PositionCompetencyDialog;
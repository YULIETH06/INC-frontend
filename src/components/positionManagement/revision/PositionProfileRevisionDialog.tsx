import type {
    FormEvent,
} from "react";

import {
    Alert,
    Stack,
} from "@mui/material";

import CustomDialog from "../../common/CustomDialog";
import ActionButton from "../../common/ActionButton";
import TextAreaInput from "../../common/inputs/TextAreaInput";

import type {
    PositionProfileRevision,
    PositionProfileRevisionForm,
    PositionProfileRevisionFormErrors,
} from "../../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionProfileRevisionDialogProps {
    open: boolean;

    form: PositionProfileRevisionForm;
    formErrors: PositionProfileRevisionFormErrors;

    editingRevision: PositionProfileRevision | null;

    isEditing: boolean;
    hasFormChanges: boolean;
    loadingSubmit: boolean;

    onChangeObservation: (
        value: string
    ) => void;

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

    const formId =
        "position-profile-revision-form";


    const handleDialogClose = () => {
        if (loadingSubmit) {
            return;
        }

        onClose();
    };


    return (
        <>
            <form
                id={formId}
                onSubmit={onSubmit}
                noValidate
            >
                <CustomDialog
                    open={open}
                    title={
                        isEditing
                            ? "Actualizar revisión"
                            : "Crear revisión"
                    }
                    subtitle={
                        isEditing
                            ? `Modifica la observación de la revisión ${editingRevision?.revisionNumber ?? ""
                            }.`
                            : "Crea una nueva revisión en estado borrador para el perfil de cargo."
                    }
                    size="sm"
                    onClose={handleDialogClose}
                    actions={
                        <Stack
                            direction="row"
                            spacing={1}
                        >
                            <ActionButton
                                actionType="cancel"
                                onClick={
                                    handleDialogClose
                                }
                                disabled={
                                    loadingSubmit
                                }
                            >
                                Cancelar
                            </ActionButton>

                            <ActionButton
                                type="submit"
                                form={formId}
                                actionType={
                                    isEditing
                                        ? "save"
                                        : "create"
                                }
                                loading={
                                    loadingSubmit
                                }
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
                                {
                                    isEditing
                                        ? "Actualizar"
                                        : "Crear revisión"
                                }
                            </ActionButton>
                        </Stack>
                    }
                >
                    <Stack spacing={3}>

                        <TextAreaInput
                            label="Observación del cambio"
                            value={
                                form.changeObservation
                            }
                            onChange={
                                onChangeObservation
                            }
                            rows={4}
                            required={false}
                            disabled={
                                loadingSubmit
                            }
                            placeholder="Describe brevemente el motivo o los cambios de esta revisión."
                            error={Boolean(
                                formErrors.changeObservation
                            )}
                            helperText={
                                formErrors.changeObservation
                                    ? formErrors.changeObservation
                                    : `${form.changeObservation.length}/500`
                            }
                            slotProps={{
                                htmlInput: {
                                    maxLength: 500,
                                },
                            }}
                        />

                        {!isEditing && (
                            <Alert severity="info">
                                La observación es opcional.
                                La nueva revisión se creará
                                automáticamente en estado
                                borrador.
                            </Alert>
                        )}

                    </Stack>
                </CustomDialog>
            </form>
        </>
    );
};

export default PositionProfileRevisionDialog;
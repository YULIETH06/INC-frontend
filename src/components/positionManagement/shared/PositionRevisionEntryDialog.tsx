import type {
    FormEvent,
    ReactNode,
} from "react";

import {
    Stack,
} from "@mui/material";

import CustomDialog from "../../common/CustomDialog";
import ActionButton from "../../common/ActionButton";

interface PositionRevisionEntryDialogProps {
    open: boolean;

    title: string;
    subtitle: string;

    isEditing: boolean;

    hasFormChanges: boolean;

    loadingSubmit: boolean;

    children: ReactNode;

    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void;

    onClose: () => void;
}

// Diálogo reutilizable para los registros administrados
// dentro de una revisión.
const PositionRevisionEntryDialog = ({
    open,
    title,
    subtitle,
    isEditing,
    hasFormChanges,
    loadingSubmit,
    children,
    onSubmit,
    onClose,
}: PositionRevisionEntryDialogProps) => {

    const formId =
        "position-revision-entry-form";

    const handleDialogClose = () => {
        if (loadingSubmit) {
            return;
        }

        onClose();
    };

    return (
        <CustomDialog
            open={open}
            title={title}
            subtitle={subtitle}
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
                                : "Registrando..."
                        }
                        disabled={
                            isEditing &&
                            !hasFormChanges
                        }
                    >
                        {
                            isEditing
                                ? "Actualizar"
                                : "Registrar"
                        }
                    </ActionButton>

                </Stack>
            }
        >
            <form
                id={formId}
                onSubmit={onSubmit}
                noValidate
            >
                {children}
            </form>
        </CustomDialog>
    );
};

export default PositionRevisionEntryDialog;
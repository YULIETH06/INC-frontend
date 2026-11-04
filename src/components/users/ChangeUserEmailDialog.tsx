import {
    Box,
    Typography,
} from "@mui/material";

import type {
    UpdateUserEmailErrors,
    User,
} from "../../interfaces/users/user.interface";

import CustomDialog from "../common/CustomDialog";
import ActionButton from "../common/ActionButton";
import TextInput from "../common/inputs/TextInput";

interface ChangeUserEmailDialogProps {
    open: boolean;
    selectedUser: User | null;

    newEmail: string;

    errors?: UpdateUserEmailErrors;
    loading?: boolean;

    onClose: () => void;
    onNewEmailChange: (value: string) => void;
    onSave: () => void;
}

// Diálogo utilizado por el administrador
// para cambiar el correo de un usuario.
const ChangeUserEmailDialog = ({
    open,
    selectedUser,

    newEmail,

    errors = {},
    loading = false,

    onClose,
    onNewEmailChange,
    onSave,
}: ChangeUserEmailDialogProps) => {
    // Evita cerrar el diálogo mientras se procesa la solicitud.
    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose();
    };

    // Habilita la acción cuando se escribió un correo.
    const canSave =
        Boolean(selectedUser) &&
        Boolean(newEmail.trim());

    return (
        <CustomDialog
            open={open}
            onClose={handleClose}
            title="Cambiar correo"
            size="xs"
            contentSx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
            }}
            actions={
                <>
                    <ActionButton
                        actionType="cancel"
                        onClick={handleClose}
                        disabled={loading}
                        sx={{
                            flex: 1,
                        }}
                    >
                        Cancelar
                    </ActionButton>

                    <ActionButton
                        actionType="save"
                        onClick={onSave}
                        loading={loading}
                        loadingText="Guardando..."
                        disabled={!canSave}
                        sx={{
                            flex: 1.5,
                        }}
                    >
                        Guardar correo
                    </ActionButton>
                </>
            }
        >
            {selectedUser && (
                <>
                    {/* Usuario al que se le cambiará el correo. */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "action.hover",
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Usuario seleccionado
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: "text.primary",
                            }}
                        >
                            {selectedUser.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Correo actual: {selectedUser.email}
                        </Typography>
                    </Box>

                    {/* Nuevo correo. */}
                    <TextInput
                        label="Nuevo correo"
                        type="email"
                        value={newEmail}
                        onChange={onNewEmailChange}
                        required
                        disabled={loading}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        hint={
                            selectedUser.isActive === false
                                ? "El usuario está desactivado: el correo se guardará y se validará cuando lo actives."
                                : "No puede pertenecer a otro usuario activo."
                        }
                        autoComplete="off"
                    />
                </>
            )}
        </CustomDialog>
    );
};

export default ChangeUserEmailDialog;
import {
    Box,
    Typography,
} from "@mui/material";

import type {
    ResetUserPasswordErrors,
    User,
} from "../../interfaces/users/user.interface";

import CustomDialog from "../common/CustomDialog";
import ActionButton from "../common/ActionButton";
import PasswordInput from "../common/inputs/PasswordInput";

interface ChangeUserPasswordDialogProps {
    open: boolean;
    selectedUser: User | null;

    newPassword: string;
    confirmPassword: string;

    errors?: ResetUserPasswordErrors;
    loading?: boolean;

    onClose: () => void;
    onNewPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onSave: () => void;
}

// Diálogo utilizado por el administrador
// para restablecer la contraseña de un usuario.
const ChangeUserPasswordDialog = ({
    open,
    selectedUser,

    newPassword,
    confirmPassword,

    errors = {},
    loading = false,

    onClose,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onSave,
}: ChangeUserPasswordDialogProps) => {
    // Evita cerrar el diálogo mientras se procesa la solicitud.
    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose();
    };

    // Habilita la acción cuando ambos campos contienen información.
    const canSave =
        Boolean(selectedUser) &&
        Boolean(newPassword) &&
        Boolean(confirmPassword);

    return (
        <CustomDialog
            open={open}
            onClose={handleClose}
            title="Restablecer contraseña"
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
                        loadingText="Restableciendo..."
                        disabled={!canSave}
                        sx={{
                            flex: 1.5,
                        }}
                    >
                        Restablecer
                    </ActionButton>
                </>
            }
        >
            {selectedUser && (
                <>
                    {/* Usuario al que se le restablecerá la contraseña. */}
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
                            {selectedUser.email}
                        </Typography>
                    </Box>

                    {/* Campos de contraseña. */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <PasswordInput
                            label="Nueva contraseña"
                            value={newPassword}
                            onChange={onNewPasswordChange}
                            required
                            disabled={loading}
                            error={Boolean(errors.newPassword)}
                            helperText={errors.newPassword}
                            hint="Mínimo 6 caracteres."
                            autoComplete="new-password"
                        />

                        <PasswordInput
                            label="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={onConfirmPasswordChange}
                            required
                            disabled={loading}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword}
                            autoComplete="new-password"
                        />
                    </Box>
                </>
            )}
        </CustomDialog>
    );
};

export default ChangeUserPasswordDialog;
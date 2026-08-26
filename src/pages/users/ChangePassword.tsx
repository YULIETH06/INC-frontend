import {
    Box,
    Button,
    Divider,
    Paper,
    Typography,
} from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import PasswordInput from "../../components/common/inputs/PasswordInput";

import { useChangePassword } from "../../hooks/auth/useChangePassword";

import { appIcons } from "../../icons/appIcons";

// Página para que el usuario autenticado cambie su contraseña.
const ChangePassword = () => {
    const {
        currentPassword,
        newPassword,
        confirmPassword,
        loading,

        message,
        openMessage,
        error,
        formErrors,

        handleCurrentPasswordChange,
        handleNewPasswordChange,
        handleConfirmPasswordChange,
        handleChangePassword,
        closeMessage,
    } = useChangePassword();

    const LockIcon = appIcons.lock;
    const ChangePasswordIcon = appIcons.changePassword;

    return (
        <PageContainer>
            <PageHeader
                title="Cambiar contraseña"
                subtitle="Administra la contraseña utilizada para acceder a tu cuenta."
            />

            <Paper
                variant="outlined"
                sx={{
                    width: "100%",
                    maxWidth: "620px",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                {/* Encabezado de la tarjeta. */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 3,
                        py: 2.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "10px",
                            bgcolor: "action.hover",
                            color: "text.secondary",
                            flexShrink: 0,
                        }}
                    >
                        <LockIcon fontSize="small" />
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Seguridad de la cuenta
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Ingresa tu contraseña actual y establece una nueva.
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Formulario de cambio de contraseña. */}
                <Box
                    component="form"
                    onSubmit={handleChangePassword}
                    noValidate
                    sx={{
                        p: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2.5,
                        }}
                    >
                        <PasswordInput
                            label="Contraseña actual"
                            value={currentPassword}
                            error={Boolean(
                                formErrors.currentPassword
                            )}
                            helperText={
                                formErrors.currentPassword
                            }
                            disabled={loading}
                            autoComplete="current-password"
                            onChange={
                                handleCurrentPasswordChange
                            }
                        />

                        <PasswordInput
                            label="Nueva contraseña"
                            value={newPassword}
                            error={Boolean(
                                formErrors.newPassword
                            )}
                            helperText={
                                formErrors.newPassword
                            }
                            hint="Mínimo 6 caracteres y diferente de la contraseña actual."
                            disabled={loading}
                            autoComplete="new-password"
                            onChange={
                                handleNewPasswordChange
                            }
                        />

                        <PasswordInput
                            label="Confirmar nueva contraseña"
                            value={confirmPassword}
                            error={Boolean(
                                formErrors.confirmPassword
                            )}
                            helperText={
                                formErrors.confirmPassword
                            }
                            hint="Debe coincidir con la nueva contraseña."
                            disabled={loading}
                            autoComplete="new-password"
                            onChange={
                                handleConfirmPasswordChange
                            }
                        />
                    </Box>

                    <Divider
                        sx={{
                            my: 3,
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                <ChangePasswordIcon />
                            }
                            disabled={loading}
                            sx={{
                                minWidth: "190px",
                                borderRadius: "8px",
                                fontWeight: 700,
                                textTransform: "none",
                            }}
                        >
                            {loading
                                ? "Actualizando..."
                                : "Actualizar contraseña"}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <CustomSnackbar
                open={
                    openMessage ||
                    Boolean(error)
                }
                message={error || message}
                severity={
                    error
                        ? "error"
                        : "success"
                }
                onClose={closeMessage}
            />
        </PageContainer>
    );
};

export default ChangePassword;
import { useState } from "react";
import { ValidationError } from "yup";

import { changePassword } from "../../services/auth/authService";
import { changePasswordSchema } from "../../validations/auth/authValidation";
import type {
    ChangePasswordFormErrors,
} from "../../interfaces/auth/auth.interface";
import { getErrorMessage } from "../../utils/common/getErrorMessage";

// Estado inicial de los errores del formulario.
const initialFormErrors: ChangePasswordFormErrors = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

// Hook encargado de manejar la lógica del cambio de contraseña.
export const useChangePassword = () => {
    // Contraseña actual escrita por el usuario.
    const [currentPassword, setCurrentPassword] = useState("");

    // Nueva contraseña escrita por el usuario.
    const [newPassword, setNewPassword] = useState("");

    // Confirmación de la nueva contraseña.
    const [confirmPassword, setConfirmPassword] = useState("");

    // Controla el estado de carga del botón.
    const [loading, setLoading] = useState(false);

    // Mensaje de éxito al cambiar la contraseña.
    const [message, setMessage] = useState("");

    // Controla si se muestra el mensaje visual de éxito.
    const [openMessage, setOpenMessage] = useState(false);

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Errores de validación por campo.
    const [formErrors, setFormErrors] =
        useState<ChangePasswordFormErrors>(initialFormErrors);

    // Limpia mensajes generales y el error del campo que se está editando.
    const clearFieldError = (
        field: keyof ChangePasswordFormErrors
    ) => {
        setMessage("");
        setOpenMessage(false);
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Actualiza la contraseña actual.
    const handleCurrentPasswordChange = (value: string) => {
        setCurrentPassword(value);
        clearFieldError("currentPassword");
    };

    // Actualiza la nueva contraseña.
    const handleNewPasswordChange = (value: string) => {
        setNewPassword(value);
        clearFieldError("newPassword");
    };

    // Actualiza la confirmación de la nueva contraseña.
    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        clearFieldError("confirmPassword");
    };

    // Cierra el mensaje visual de éxito.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Envía los datos al backend para cambiar la contraseña.
    const handleChangePassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const formData = {
            currentPassword,
            newPassword,
            confirmPassword,
        };

        try {
            await changePasswordSchema.validate(formData, {
                abortEarly: false,
            });

            setFormErrors(initialFormErrors);
            setError("");
            setMessage("");
            setOpenMessage(false);
            setLoading(true);

            const response = await changePassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setMessage(
                response.message ||
                "Contraseña actualizada correctamente."
            );
            setOpenMessage(true);
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: ChangePasswordFormErrors = {
                    ...initialFormErrors,
                };

                error.inner.forEach((validationError) => {
                    const path =
                        validationError.path as keyof ChangePasswordFormErrors;

                    if (path) {
                        errors[path] = validationError.message;
                    }
                });

                setFormErrors(errors);
                setMessage("");
                setOpenMessage(false);
                setError("");
                return;
            }

            console.error(error);

            setError(
                getErrorMessage(
                    error,
                    "Error al cambiar la contraseña."
                )
            );
            setMessage("");
            setOpenMessage(false);
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
};
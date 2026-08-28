import {
    useState,
} from "react";

import {
    ValidationError,
} from "yup";

import type {
    AlertColor,
} from "@mui/material";

import type {
    ResetUserPasswordErrors,
    User,
} from "../../interfaces/users/user.interface";

import {
    resetUserPassword,
} from "../../services/users/userService";

import {
    resetUserPasswordSchema,
} from "../../validations/users/userValidation";

import {
    getErrorMessage,
} from "../../utils/common/getErrorMessage";

// Estado inicial de los errores del formulario.
const initialFormErrors: ResetUserPasswordErrors = {
    newPassword: "",
    confirmPassword: "",
};

// Hook encargado del restablecimiento administrativo de la contraseña de un usuario.
export const useChangeUserPassword = () => {
    const [
        selectedPasswordUser,
        setSelectedPasswordUser,
    ] = useState<User | null>(null);

    const [
        openPasswordDialog,
        setOpenPasswordDialog,
    ] = useState(false);

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        formErrors,
        setFormErrors,
    ] = useState<ResetUserPasswordErrors>(
        initialFormErrors
    );

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        messageType,
        setMessageType,
    ] = useState<AlertColor>("success");

    const [
        openMessage,
        setOpenMessage,
    ] = useState(false);

    // Limpia los campos y errores del formulario.
    const resetForm = () => {
        setNewPassword("");
        setConfirmPassword("");
        setFormErrors(initialFormErrors);
    };

    // Abre el diálogo para el usuario seleccionado.
    const openChangePasswordDialog = (
        user: User
    ) => {
        setSelectedPasswordUser(user);

        resetForm();

        setMessage("");
        setOpenMessage(false);

        setOpenPasswordDialog(true);
    };

    // Cierra el diálogo y limpia su información.
    const closeChangePasswordDialog = () => {
        if (loading) {
            return;
        }

        setOpenPasswordDialog(false);
        setSelectedPasswordUser(null);

        resetForm();
    };

    // Limpia únicamente el error del campo editado.
    const clearFieldError = (
        field: keyof ResetUserPasswordErrors
    ) => {
        setFormErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Actualiza la nueva contraseña.
    const handleNewPasswordChange = (
        value: string
    ) => {
        setNewPassword(value);

        clearFieldError(
            "newPassword"
        );
    };

    // Actualiza la confirmación de contraseña.
    const handleConfirmPasswordChange = (
        value: string
    ) => {
        setConfirmPassword(value);

        clearFieldError(
            "confirmPassword"
        );
    };

    // Cierra el mensaje temporal.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Valida el formulario y solicita al backend
    // el restablecimiento de la contraseña.
    const handleChangePassword = async () => {
        if (!selectedPasswordUser) {
            return;
        }

        const formData = {
            newPassword,
            confirmPassword,
        };

        try {
            await resetUserPasswordSchema.validate(
                formData,
                {
                    abortEarly: false,
                }
            );

            setFormErrors(
                initialFormErrors
            );

            setLoading(true);

            const response =
                await resetUserPassword(
                    selectedPasswordUser.id,
                    {
                        newPassword,
                    }
                );

            setOpenPasswordDialog(false);
            setSelectedPasswordUser(null);

            resetForm();

            setMessage(
                response.message ||
                "Contraseña restablecida correctamente."
            );

            setMessageType("success");
            setOpenMessage(true);
        } catch (error: unknown) {
            if (
                error instanceof
                ValidationError
            ) {
                const errors:
                    ResetUserPasswordErrors = {
                    ...initialFormErrors,
                };

                error.inner.forEach(
                    (validationError) => {
                        const field =
                            validationError.path as
                            keyof ResetUserPasswordErrors;

                        if (field) {
                            errors[field] =
                                validationError.message;
                        }
                    }
                );

                setFormErrors(errors);

                return;
            }

            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al restablecer la contraseña del usuario."
                )
            );

            setMessageType("error");
            setOpenMessage(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        selectedPasswordUser,

        openPasswordDialog,

        newPassword,
        confirmPassword,

        loading,
        formErrors,

        message,
        messageType,
        openMessage,

        openChangePasswordDialog,
        closeChangePasswordDialog,

        handleNewPasswordChange,
        handleConfirmPasswordChange,
        handleChangePassword,

        closeMessage,
    };
};
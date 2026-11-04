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
    UpdateUserEmailErrors,
    User,
} from "../../interfaces/users/user.interface";

import {
    activateUser,
    deactivateUser,
    updateUserEmail,
} from "../../services/users/userService";

import {
    updateUserEmailSchema,
} from "../../validations/users/userValidation";

import {
    getErrorMessage,
} from "../../utils/common/getErrorMessage";

interface UseUserAccountActionsProps {
    // Se ejecuta después de cada cambio, para recargar el listado.
    onAccountChange: () => Promise<void> | void;
}

// Acción de estado que el administrador va a confirmar.
type UserStatusAction =
    | "activate"
    | "deactivate";

// Estado inicial de los errores del formulario de correo.
const initialEmailErrors: UpdateUserEmailErrors = {
    email: "",
};

// Hook encargado de activar, desactivar y cambiar el correo de un usuario.
export const useUserAccountActions = ({
    onAccountChange,
}: UseUserAccountActionsProps) => {
    // Confirmación de activación o desactivación.
    const [
        statusUser,
        setStatusUser,
    ] = useState<User | null>(null);

    const [
        statusAction,
        setStatusAction,
    ] = useState<UserStatusAction>("deactivate");

    const [
        updatingStatus,
        setUpdatingStatus,
    ] = useState(false);

    // Cambio de correo.
    const [
        emailUser,
        setEmailUser,
    ] = useState<User | null>(null);

    const [
        newEmail,
        setNewEmail,
    ] = useState("");

    const [
        emailErrors,
        setEmailErrors,
    ] = useState<UpdateUserEmailErrors>(
        initialEmailErrors
    );

    const [
        updatingEmail,
        setUpdatingEmail,
    ] = useState(false);

    // Mensajes visuales.
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

    // Muestra un mensaje temporal.
    const showMessage = (
        text: string,
        type: AlertColor = "success"
    ) => {
        setMessage(text);
        setMessageType(type);
        setOpenMessage(true);
    };

    // Cierra el mensaje temporal.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Abre la confirmación para activar o desactivar al usuario.
    const openStatusConfirm = (
        user: User
    ) => {
        setStatusUser(user);
        setStatusAction(
            user.isActive === false
                ? "activate"
                : "deactivate"
        );
    };

    // Cierra la confirmación de estado.
    const closeStatusConfirm = () => {
        if (updatingStatus) {
            return;
        }

        setStatusUser(null);
    };

    // Activa o desactiva al usuario seleccionado.
    const handleConfirmStatus = async () => {
        if (!statusUser) {
            return;
        }

        try {
            setUpdatingStatus(true);

            const response =
                statusAction === "deactivate"
                    ? await deactivateUser(
                        statusUser.id
                    )
                    : await activateUser(
                        statusUser.id
                    );

            showMessage(
                response.message ||
                (
                    statusAction === "deactivate"
                        ? "Usuario desactivado correctamente."
                        : "Usuario activado correctamente."
                ),
                "success"
            );

            setStatusUser(null);

            await onAccountChange();
        } catch (error) {
            console.error(error);

            showMessage(
                getErrorMessage(
                    error,
                    statusAction === "deactivate"
                        ? "Error al desactivar el usuario."
                        : "Error al activar el usuario."
                ),
                "error"
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Abre el diálogo para cambiar el correo del usuario.
    const openEmailDialog = (
        user: User
    ) => {
        setEmailUser(user);
        setNewEmail("");
        setEmailErrors(initialEmailErrors);
    };

    // Cierra el diálogo de cambio de correo.
    const closeEmailDialog = () => {
        if (updatingEmail) {
            return;
        }

        setEmailUser(null);
        setNewEmail("");
        setEmailErrors(initialEmailErrors);
    };

    // Actualiza el nuevo correo escrito por el administrador.
    const handleNewEmailChange = (
        value: string
    ) => {
        setNewEmail(value);
        setEmailErrors(initialEmailErrors);
    };

    // Valida y guarda el nuevo correo del usuario.
    const handleSaveEmail = async () => {
        if (!emailUser) {
            return;
        }

        try {
            await updateUserEmailSchema.validate(
                {
                    email: newEmail,
                },
                {
                    abortEarly: false,
                }
            );

            if (
                newEmail.trim().toLowerCase() ===
                emailUser.email.toLowerCase()
            ) {
                setEmailErrors({
                    email:
                        "El nuevo correo debe ser diferente al correo actual.",
                });

                return;
            }

            setUpdatingEmail(true);

            const response =
                await updateUserEmail(
                    emailUser.id,
                    newEmail.trim()
                );

            showMessage(
                response.message ||
                "Correo actualizado correctamente.",
                "success"
            );

            setEmailUser(null);
            setNewEmail("");

            await onAccountChange();
        } catch (error) {
            if (
                error instanceof
                ValidationError
            ) {
                setEmailErrors({
                    email:
                        error.inner[0]?.message ||
                        error.message,
                });

                return;
            }

            console.error(error);

            showMessage(
                getErrorMessage(
                    error,
                    "Error al actualizar el correo del usuario."
                ),
                "error"
            );
        } finally {
            setUpdatingEmail(false);
        }
    };

    return {
        statusUser,
        statusAction,
        updatingStatus,

        emailUser,
        newEmail,
        emailErrors,
        updatingEmail,

        message,
        messageType,
        openMessage,

        openStatusConfirm,
        closeStatusConfirm,
        handleConfirmStatus,

        openEmailDialog,
        closeEmailDialog,
        handleNewEmailChange,
        handleSaveEmail,

        closeMessage,
    };
};
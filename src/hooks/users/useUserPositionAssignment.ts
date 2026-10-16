import {
    useState,
} from "react";

import type {
    AlertColor,
} from "@mui/material";

import type {
    User,
} from "../../interfaces/users/user.interface";

import type {
    AssignablePosition,
    UserPositionAssignment,
} from "../../interfaces/users/userPositionAssignment.interface";

import {
    assignUserPosition,
    endUserPositionAssignment,
    getAssignablePositions,
    getUserPositionAssignments,
} from "../../services/users/userPositionAssignmentService";

import {
    getErrorMessage,
} from "../../utils/common/getErrorMessage";

interface UseUserPositionAssignmentProps {
    // Se ejecuta cuando se asigna o retira un cargo, para recargar el listado.
    onAssignmentChange: () => Promise<void> | void;
}

// Hook encargado de asignar, cambiar y retirar el cargo de un usuario.
export const useUserPositionAssignment = ({
    onAssignmentChange,
}: UseUserPositionAssignmentProps) => {
    // Usuario seleccionado en el listado.
    const [
        selectedPositionUser,
        setSelectedPositionUser,
    ] = useState<User | null>(null);

    const [
        openPositionDialog,
        setOpenPositionDialog,
    ] = useState(false);

    // Cargos activos disponibles para asignar.
    const [
        positions,
        setPositions,
    ] = useState<AssignablePosition[]>([]);

    const [
        loadingPositions,
        setLoadingPositions,
    ] = useState(false);

    // Cargo actual e historial del usuario seleccionado.
    const [
        currentAssignment,
        setCurrentAssignment,
    ] = useState<UserPositionAssignment | null>(null);

    const [
        assignmentHistory,
        setAssignmentHistory,
    ] = useState<UserPositionAssignment[]>([]);

    const [
        loadingAssignments,
        setLoadingAssignments,
    ] = useState(false);

    const [
        loadError,
        setLoadError,
    ] = useState("");

    // Cargo elegido en el selector.
    const [
        selectedPosition,
        setSelectedPosition,
    ] = useState<AssignablePosition | null>(null);

    const [
        positionError,
        setPositionError,
    ] = useState("");

    // Estados de las acciones.
    const [
        savingPosition,
        setSavingPosition,
    ] = useState(false);

    const [
        endingPosition,
        setEndingPosition,
    ] = useState(false);

    const [
        openEndConfirm,
        setOpenEndConfirm,
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

    // Consulta los cargos disponibles una sola vez.
    const loadPositions = async () => {
        if (positions.length > 0) {
            return;
        }

        try {
            setLoadingPositions(true);

            const data =
                await getAssignablePositions();

            setPositions(
                data.positions
            );
        } catch (error) {
            console.error(error);

            setLoadError(
                getErrorMessage(
                    error,
                    "Error al cargar los cargos disponibles."
                )
            );
        } finally {
            setLoadingPositions(false);
        }
    };

    // Consulta el cargo actual y el historial del usuario.
    const loadAssignments = async (
        userId: number
    ) => {
        try {
            setLoadingAssignments(true);

            const data =
                await getUserPositionAssignments(
                    userId
                );

            setCurrentAssignment(
                data.currentAssignment
            );

            setAssignmentHistory(
                data.history
            );
        } catch (error) {
            console.error(error);

            setCurrentAssignment(null);
            setAssignmentHistory([]);

            setLoadError(
                getErrorMessage(
                    error,
                    "Error al cargar los cargos del usuario."
                )
            );
        } finally {
            setLoadingAssignments(false);
        }
    };

    // Abre el diálogo para el usuario seleccionado.
    const openUserPositionDialog = (
        user: User
    ) => {
        setSelectedPositionUser(user);
        setSelectedPosition(null);
        setPositionError("");
        setLoadError("");
        setCurrentAssignment(null);
        setAssignmentHistory([]);

        setOpenPositionDialog(true);

        void loadPositions();
        void loadAssignments(user.id);
    };

    // Cierra el diálogo y limpia su información.
    const closeUserPositionDialog = () => {
        if (
            savingPosition ||
            endingPosition
        ) {
            return;
        }

        setOpenPositionDialog(false);
        setOpenEndConfirm(false);
        setSelectedPositionUser(null);
        setSelectedPosition(null);
        setPositionError("");
        setLoadError("");
    };

    // Actualiza el cargo elegido en el selector.
    const handlePositionChange = (
        position: AssignablePosition | null
    ) => {
        setSelectedPosition(position);
        setPositionError("");
    };

    // Asigna o cambia el cargo del usuario.
    const handleAssignPosition = async () => {
        if (!selectedPositionUser) {
            return;
        }

        if (!selectedPosition) {
            setPositionError(
                "Debe seleccionar un cargo."
            );

            return;
        }

        if (
            currentAssignment?.position.id ===
            selectedPosition.id
        ) {
            setPositionError(
                "El usuario ya tiene asignado este cargo."
            );

            return;
        }

        try {
            setSavingPosition(true);

            const data =
                await assignUserPosition(
                    selectedPositionUser.id,
                    selectedPosition.id
                );

            showMessage(
                data.message ||
                "Cargo asignado correctamente.",
                "success"
            );

            setSelectedPosition(null);

            await Promise.all([
                loadAssignments(
                    selectedPositionUser.id
                ),
                onAssignmentChange(),
            ]);
        } catch (error) {
            console.error(error);

            showMessage(
                getErrorMessage(
                    error,
                    "Error al asignar el cargo."
                ),
                "error"
            );
        } finally {
            setSavingPosition(false);
        }
    };

    // Abre la confirmación para retirar el cargo.
    const openEndPositionConfirm = () => {
        setOpenEndConfirm(true);
    };

    // Cierra la confirmación para retirar el cargo.
    const closeEndPositionConfirm = () => {
        if (endingPosition) {
            return;
        }

        setOpenEndConfirm(false);
    };

    // Retira el cargo activo del usuario.
    const handleEndPosition = async () => {
        if (!selectedPositionUser) {
            return;
        }

        try {
            setEndingPosition(true);

            const data =
                await endUserPositionAssignment(
                    selectedPositionUser.id
                );

            showMessage(
                data.message ||
                "Cargo retirado correctamente.",
                "success"
            );

            setOpenEndConfirm(false);

            await Promise.all([
                loadAssignments(
                    selectedPositionUser.id
                ),
                onAssignmentChange(),
            ]);
        } catch (error) {
            console.error(error);

            showMessage(
                getErrorMessage(
                    error,
                    "Error al retirar el cargo."
                ),
                "error"
            );
        } finally {
            setEndingPosition(false);
        }
    };

    return {
        selectedPositionUser,
        openPositionDialog,

        positions,
        loadingPositions,

        currentAssignment,
        assignmentHistory,
        loadingAssignments,
        loadError,

        selectedPosition,
        positionError,

        savingPosition,
        endingPosition,
        openEndConfirm,

        message,
        messageType,
        openMessage,

        openUserPositionDialog,
        closeUserPositionDialog,
        handlePositionChange,
        handleAssignPosition,

        openEndPositionConfirm,
        closeEndPositionConfirm,
        handleEndPosition,

        closeMessage,
    };
};

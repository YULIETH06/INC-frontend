import { useEffect, useState } from "react";

import {
    getUserSignature,
    uploadUserSignature,
} from "../../services/users/userService";

import { getErrorMessage } from "../../utils/common/getErrorMessage";

// Hook encargado de subir la firma del usuario autenticado.
export const useUserSignature = () => {
    // Archivo de firma seleccionado.
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Vista previa de la firma seleccionada.
    const [previewUrl, setPreviewUrl] = useState("");

    // Controla el estado de carga al subir la firma.
    const [loading, setLoading] = useState(false);

    // Mensaje de éxito.
    const [message, setMessage] = useState("");

    // Mensaje de error.
    const [error, setError] = useState("");

    // Firma registrada del usuario (ruta del backend) o null si no tiene.
    const [savedSignatureUrl, setSavedSignatureUrl] = useState<string | null>(null);

    // Controla la carga al consultar la firma registrada.
    const [loadingSignature, setLoadingSignature] = useState(true);

    // Consulta la firma registrada al abrir la página.
    useEffect(() => {
        const loadUserSignature = async () => {
            try {
                setLoadingSignature(true);

                const response = await getUserSignature();

                setSavedSignatureUrl(response.signatureUrl);
            } catch (error: unknown) {
                console.error(error);

                setError(
                    getErrorMessage(
                        error,
                        "Error al consultar la firma registrada."
                    )
                );
            } finally {
                setLoadingSignature(false);
            }
        };

        void loadUserSignature();
    }, []);


    // Actualiza el archivo seleccionado.
    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
        setMessage("");
        setError("");

        if (!file) {
            setPreviewUrl("");
            return;
        }

        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
    };

    // Sube la firma seleccionada.
    const handleUploadSignature = async () => {
        if (!selectedFile) {
            setError(getErrorMessage(error, "Debes seleccionar una imagen para la firma."));
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setError("");

            const response = await uploadUserSignature(selectedFile);

            setMessage(response.message || "Firma registrada correctamente.");
            setSelectedFile(null);
            setPreviewUrl("");
            setSavedSignatureUrl(response.user?.signatureUrl ?? null);
        } catch (error: unknown) {
            console.error(error);

            setError(
                getErrorMessage(
                    error,
                    "Error al registrar la firma."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    // Limpia mensajes visuales.
    const clearMessages = () => {
        setMessage("");
        setError("");
    };

    return {
        selectedFile,
        previewUrl,
        savedSignatureUrl,
        loadingSignature,
        loading,
        message,
        error,

        handleFileChange,
        handleUploadSignature,
        clearMessages,
    };
};
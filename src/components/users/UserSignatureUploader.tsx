import {
    Alert,
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import ActionButton from "../common/ActionButton";
import LoadingBox from "../common/LoadingBox";

import { buildFileUrl } from "../../utils/common/fileUrl";

import { useUserSignature } from "../../hooks/users/useUserSignature";

// Componente para subir la firma del usuario autenticado.
const UserSignatureUploader = () => {
    const {
        selectedFile,
        previewUrl,
        savedSignatureUrl,
        loadingSignature,
        loading,
        message,
        error,

        handleFileChange,
        handleUploadSignature,
    } = useUserSignature();

    // Si ya hay una firma registrada, se muestra esa.
    // Si no, se muestra la vista previa de la imagen seleccionada.
    const signatureImageUrl = savedSignatureUrl
        ? buildFileUrl(savedSignatureUrl)
        : previewUrl;

    const signatureImageLabel = savedSignatureUrl
        ? "Firma registrada"
        : "Vista previa de la firma";

    // Captura la imagen seleccionada.
    const onFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] || null;

        handleFileChange(file);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
            }}
        >
            <Stack spacing={2}>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Firma del usuario
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            mt: 0.5,
                        }}
                    >
                        {savedSignatureUrl
                            ? "Esta es la firma registrada que se usará en las aprobaciones de requisiciones."
                            : "Sube una imagen clara de tu firma. Esta se usará en las aprobaciones de requisiciones."}
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {message && (
                    <Alert severity="success">
                        {message}
                    </Alert>
                )}

                {loadingSignature && (
                    <LoadingBox
                        minHeight={120}
                        size={28}
                    />
                )}

                {signatureImageUrl && (
                    <Box
                        sx={{
                            p: 2,
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                            textAlign: "center",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                color: "text.secondary",
                            }}
                        >
                            {signatureImageLabel}
                        </Typography>

                        <Box
                            component="img"
                            src={signatureImageUrl}
                            alt={signatureImageLabel}
                            sx={{
                                maxWidth: "260px",
                                maxHeight: "120px",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                )}

                {selectedFile && (
                    <Typography variant="body2">
                        Archivo seleccionado: {selectedFile.name}
                    </Typography>
                )}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1.5}
                >
                    <ActionButton
                        actionType="upload"
                        component="label"
                        size="medium"
                        disabled={loading || Boolean(savedSignatureUrl)}
                        tooltip={
                            savedSignatureUrl
                                ? "La firma ya fue registrada y no se puede cambiar."
                                : undefined
                        }
                    >
                        Seleccionar firma
                        <input
                            hidden
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={onFileChange}
                            disabled={loading || Boolean(savedSignatureUrl)}
                        />
                    </ActionButton>

                    <ActionButton
                        actionType="save"
                        size="medium"
                        loading={loading}
                        loadingText="Guardando..."
                        disabled={!selectedFile || Boolean(savedSignatureUrl)}
                        onClick={handleUploadSignature}
                    >
                        Guardar firma
                    </ActionButton>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default UserSignatureUploader;
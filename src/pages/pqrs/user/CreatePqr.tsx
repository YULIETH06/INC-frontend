import {
    Alert,
    Box,
    Paper,
    Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import { useCreatePqr } from "../../../hooks/pqrs/useCreatePqr";

import { pqrCaseTypes } from "../../../data/pqrOptions";

import ClearableSelect from "../../../components/common/ClearableSelect";
import CustomSnackbar from "../../../components/common/CustomSnackbar";
import FileInput from "../../../components/common/inputs/FileInput";
import TextAreaInput from "../../../components/common/inputs/TextAreaInput";
import ActionButton from "../../../components/common/ActionButton";

// Página donde el usuario crea una nueva PQR.
const CreatePqr = () => {
    const theme = useTheme();

    const {
        caseType,
        description,
        selectedFile,

        message,
        openMessage,
        error,
        formErrors,

        handleCaseTypeChange,
        handleDescriptionChange,
        handleFileChange,
        handleRemoveFile,
        handleCreatePqr,
        closeMessage,
    } = useCreatePqr();

    const style = {
        container: {
            maxWidth: "800px",
            mx: "auto",
        },

        paper: {
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
        },

        title: {
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
        },

        subtitle: {
            color: theme.palette.text.secondary,
            mb: 3,
        },

        form: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
        },
    };

    return (
        <Box sx={style.container}>
            <Paper sx={style.paper}>
                <Typography
                    variant="h5"
                    sx={style.title}
                >
                    Crear nueva PQR
                </Typography>

                <Typography
                    variant="body2"
                    sx={style.subtitle}
                >
                    Registra una petición, queja, reclamo o solicitud para que sea atendida.
                </Typography>

                {/* Mensaje para errores generales del backend. */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Formulario de creación de PQR. */}
                <Box
                    component="form"
                    sx={style.form}
                    onSubmit={handleCreatePqr}
                    noValidate
                >
                    <ClearableSelect
                        label="Tipo de caso"
                        value={caseType}
                        required
                        clearable
                        options={pqrCaseTypes}
                        error={formErrors.caseType}
                        onChange={handleCaseTypeChange}
                    />

                    <TextAreaInput
                        label="Descripción"
                        required
                        placeholder="Describe tu solicitud, queja o reclamo"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows={4}
                        error={Boolean(formErrors.description)}
                        helperText={
                            formErrors.description
                                ? formErrors.description
                                : `${description.length}/500`
                        }
                        slotProps={{
                            htmlInput: {
                                maxLength: 500,
                            },
                        }}
                    />

                    <FileInput
                        label="Adjuntar evidencia"
                        value={selectedFile}
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        error={formErrors.file}
                        hint="Formatos permitidos: JPG, JPEG, PNG, WEBP o PDF."
                        onChange={handleFileChange}
                        onRemove={handleRemoveFile}
                    />

                    <ActionButton
                        actionType="custom"
                        type="submit"
                        fullWidth
                        sx={{
                            mt: 1.5,
                            py: 1.5,
                        }}
                    >
                        Crear PQR
                    </ActionButton>
                </Box>
            </Paper>

            <CustomSnackbar
                open={openMessage}
                message={message}
                severity="success"
                onClose={closeMessage}
            />
        </Box>
    );
};

export default CreatePqr;
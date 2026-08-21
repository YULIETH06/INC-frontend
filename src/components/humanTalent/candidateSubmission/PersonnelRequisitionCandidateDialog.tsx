import {
    useEffect,
    useRef,
} from "react";

import type {
    ChangeEvent,
    FormEvent,
} from "react";

import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormHelperText,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import ActionButton from "../../common/ActionButton";

import { formatFileSize } from "../../../utils/common/fileUtils";

import type {
    PersonnelRequisitionCandidate,
    PersonnelRequisitionCandidateForm,
    PersonnelRequisitionCandidateFormErrors,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";
import type {
    IdentificationType
} from "../../../interfaces/common/identificationType.interface";

interface PersonnelRequisitionCandidateDialogProps {
    open: boolean;

    form: PersonnelRequisitionCandidateForm;
    formErrors: PersonnelRequisitionCandidateFormErrors;

    identificationTypes: IdentificationType[];

    editingCandidate:
    | PersonnelRequisitionCandidate
    | null;

    isEditing: boolean;
    hasFormChanges: boolean;
    loadingSubmit: boolean;

    onIdentificationTypeChange: (value: string) => void;
    onIdentificationNumberChange: (value: string) => void;
    onNameChange: (value: string) => void;
    onObservationChange: (value: string) => void;
    onFileChange: (file: File | null) => void;

    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void;

    onClose: () => void;
}

// Diálogo para registrar o actualizar un candidato.
const PersonnelRequisitionCandidateDialog = ({
    open,
    form,
    formErrors,
    identificationTypes,
    editingCandidate,
    isEditing,
    hasFormChanges,
    loadingSubmit,
    onIdentificationTypeChange,
    onIdentificationNumberChange,
    onNameChange,
    onObservationChange,
    onFileChange,
    onSubmit,
    onClose,
}: PersonnelRequisitionCandidateDialogProps) => {
    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    // Limpia visualmente el input cuando se elimina el archivo seleccionado.
    useEffect(() => {
        if (!form.file && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [form.file]);

    // Limpia el input cada vez que se cierra el diálogo.
    useEffect(() => {
        if (!open && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [open]);

    // Recibe el archivo seleccionado por el usuario.
    const handleFileInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile =
            event.target.files?.[0] ?? null;

        onFileChange(selectedFile);
    };

    // Elimina el archivo seleccionado del formulario.
    const handleClearSelectedFile = () => {
        onFileChange(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Evita cerrar el diálogo mientras se envía el formulario.
    const handleDialogClose = () => {
        if (loadingSubmit) {
            return;
        }

        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
        >
            <Box
                component="form"
                onSubmit={onSubmit}
                noValidate
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        pr: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        {isEditing ? (
                            <SaveOutlinedIcon color="primary" />
                        ) : (
                            <PersonAddAltOutlinedIcon color="primary" />
                        )}

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {isEditing
                                    ? "Actualizar candidato"
                                    : "Registrar candidato"}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                {isEditing
                                    ? "Modifica los datos o reemplaza la hoja de vida."
                                    : "Registra la información y la hoja de vida del candidato."}
                            </Typography>
                        </Box>
                    </Stack>

                    <IconButton
                        onClick={handleDialogClose}
                        disabled={loadingSubmit}
                        aria-label="Cerrar formulario"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent>
                    <Stack
                        spacing={2}
                    >
                        <TextField
                            select
                            label="Tipo de identificación"
                            value={form.identificationTypeId}
                            onChange={(event) =>
                                onIdentificationTypeChange(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                formErrors.identificationTypeId
                            )}
                            helperText={
                                formErrors.identificationTypeId || " "
                            }
                            required
                            fullWidth
                            disabled={loadingSubmit}
                        >
                            {identificationTypes.map((type) => (
                                <MenuItem
                                    key={type.id}
                                    value={String(type.id)}
                                >
                                    {type.code} - {type.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Número de identificación"
                            value={form.identificationNumber}
                            onChange={(event) =>
                                onIdentificationNumberChange(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                formErrors.identificationNumber
                            )}
                            helperText={
                                formErrors.identificationNumber || " "
                            }
                            required
                            fullWidth
                            disabled={loadingSubmit}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 50,
                                },
                            }}
                        />
                        
                        <TextField
                            label="Nombre completo"
                            value={form.name}
                            onChange={(event) =>
                                onNameChange(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                formErrors.name
                            )}
                            helperText={
                                formErrors.name || " "
                            }
                            required
                            fullWidth
                            disabled={loadingSubmit}
                        />

                        <TextField
                            label="Observación"
                            value={form.observation}
                            onChange={(event) =>
                                onObservationChange(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                formErrors.observation
                            )}
                            helperText={
                                formErrors.observation ||
                                `${form.observation.length}/500`
                            }
                            multiline
                            minRows={3}
                            maxRows={5}
                            fullWidth
                            disabled={loadingSubmit}
                        // slotProps={{
                        //     htmlInput: {
                        //         maxLength: 500,
                        //     },
                        // }}
                        />

                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 600,
                                }}
                            >
                                Hoja de vida

                                {!isEditing && (
                                    <Box
                                        component="span"
                                        sx={{
                                            color: "error.main",
                                        }}
                                    >
                                        {" "}
                                        *
                                    </Box>
                                )}
                            </Typography>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                hidden
                                onChange={
                                    handleFileInputChange
                                }
                                disabled={loadingSubmit}
                            />

                            <ActionButton
                                actionType="upload"
                                size="medium"
                                fullWidth
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                disabled={loadingSubmit}
                                sx={{
                                    minHeight: 48,
                                    justifyContent:
                                        "flex-start",
                                }}
                            >
                                {form.file
                                    ? "Cambiar archivo seleccionado"
                                    : isEditing
                                        ? "Seleccionar nueva hoja de vida"
                                        : "Seleccionar hoja de vida"}
                            </ActionButton>

                            {formErrors.file && (
                                <FormHelperText error>
                                    {formErrors.file}
                                </FormHelperText>
                            )}
                        </Box>

                        {form.file && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "space-between",
                                    gap: 2,
                                    p: 2,
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    bgcolor:
                                        "background.default",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    sx={{
                                        alignItems: "center",
                                        minWidth: 0,
                                    }}
                                >
                                    <DescriptionOutlinedIcon color="primary" />

                                    <Box
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            {form.file.name}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color:
                                                    "text.secondary",
                                            }}
                                        >
                                            {formatFileSize(
                                                form.file.size
                                            )}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <IconButton
                                    size="small"
                                    onClick={
                                        handleClearSelectedFile
                                    }
                                    disabled={loadingSubmit}
                                    aria-label="Quitar archivo seleccionado"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}

                        {isEditing &&
                            !form.file &&
                            editingCandidate && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        p: 2,
                                        border: 1,
                                        borderColor:
                                            "divider",
                                        borderRadius: 2,
                                        bgcolor:
                                            "background.default",
                                    }}
                                >
                                    <DescriptionOutlinedIcon color="action" />

                                    <Box
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            {
                                                editingCandidate.originalName
                                            }
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color:
                                                    "text.secondary",
                                            }}
                                        >
                                            Hoja de vida actual ·{" "}
                                            {formatFileSize(
                                                editingCandidate.fileSize
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                    </Stack>
                </DialogContent>

                <Divider />

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1,
                    }}
                >
                    <ActionButton
                        actionType="cancel"
                        onClick={handleDialogClose}
                        disabled={loadingSubmit}
                    >
                        Cancelar
                    </ActionButton>

                    <ActionButton
                        type="submit"
                        actionType={
                            isEditing
                                ? "save"
                                : "create"
                        }
                        loading={loadingSubmit}
                        loadingText={
                            isEditing
                                ? "Actualizando..."
                                : "Registrando..."
                        }
                        disabled={!hasFormChanges}
                    >
                        {isEditing
                            ? "Actualizar"
                            : "Registrar"}
                    </ActionButton>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default PersonnelRequisitionCandidateDialog;
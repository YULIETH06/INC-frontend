import type {
    FormEvent,
} from "react";

import {
    Stack,
} from "@mui/material";

import CustomDialog from "../../common/CustomDialog";
import ActionButton from "../../common/ActionButton";
import FilePreviewCard from "../../common/FilePreviewCard";
import ClearableSelect from "../../common/inputs/ClearableSelect";
import TextInput from "../../common/inputs/TextInput";
import TextAreaInput from "../../common/inputs/TextAreaInput";
import FileInput from "../../common/inputs/FileInput";

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

    const formId =
        "personnel-requisition-candidate-form";

    // Opciones del selector de tipo de identificación.
    const identificationTypeOptions =
        identificationTypes.map((type) => ({
            label: `${type.code} - ${type.name}`,
            value: String(type.id),
        }));

    // Evita cerrar el diálogo mientras se envía el formulario.
    const handleDialogClose = () => {
        if (loadingSubmit) {
            return;
        }

        onClose();
    };

    return (
        <form
            id={formId}
            onSubmit={onSubmit}
            noValidate
        >
            <CustomDialog
                open={open}
                title={
                    isEditing
                        ? "Actualizar candidato"
                        : "Registrar candidato"
                }
                subtitle={
                    isEditing
                        ? "Modifica los datos o reemplaza la hoja de vida."
                        : "Registra la información y la hoja de vida del candidato."
                }
                size="sm"
                onClose={handleDialogClose}
                actions={
                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <ActionButton
                            actionType="cancel"
                            onClick={
                                handleDialogClose
                            }
                            disabled={
                                loadingSubmit
                            }
                        >
                            Cancelar
                        </ActionButton>

                        <ActionButton
                            type="submit"
                            form={formId}
                            actionType={
                                isEditing
                                    ? "save"
                                    : "create"
                            }
                            loading={
                                loadingSubmit
                            }
                            loadingText={
                                isEditing
                                    ? "Actualizando..."
                                    : "Registrando..."
                            }
                            disabled={
                                !hasFormChanges
                            }
                        >
                            {
                                isEditing
                                    ? "Actualizar"
                                    : "Registrar"
                            }
                        </ActionButton>
                    </Stack>
                }
            >

                <Stack
                    spacing={2.5}
                    sx={{ pt: 1 }}
                >
                    <ClearableSelect
                        label="Tipo de identificación"
                        value={
                            form.identificationTypeId
                        }
                        options={
                            identificationTypeOptions
                        }
                        onChange={
                            onIdentificationTypeChange
                        }
                        error={
                            formErrors.identificationTypeId
                        }
                        required
                        disabled={loadingSubmit}
                        minWidth="100%"
                    />

                    <TextInput
                        label="Número de identificación"
                        value={
                            form.identificationNumber
                        }
                        onChange={
                            onIdentificationNumberChange
                        }
                        error={Boolean(
                            formErrors.identificationNumber
                        )}
                        helperText={
                            formErrors.identificationNumber
                        }
                        required
                        disabled={loadingSubmit}
                        slotProps={{
                            htmlInput: {
                                maxLength: 50,
                            },
                        }}
                    />

                    <TextInput
                        label="Nombre completo"
                        value={form.name}
                        onChange={onNameChange}
                        error={Boolean(
                            formErrors.name
                        )}
                        helperText={
                            formErrors.name
                        }
                        required
                        disabled={loadingSubmit}
                    />

                    <TextAreaInput
                        label="Observación"
                        value={form.observation}
                        onChange={
                            onObservationChange
                        }
                        rows={3}
                        disabled={loadingSubmit}
                        placeholder="Escribe una observación sobre el candidato..."
                        error={Boolean(
                            formErrors.observation
                        )}
                        helperText={
                            formErrors.observation
                                ? formErrors.observation
                                : `${form.observation.length}/500`
                        }
                    />

                    {/* Hoja de vida registrada actualmente. */}
                    {isEditing &&
                        editingCandidate && (
                            <FilePreviewCard
                                label="Hoja de vida actual"
                                fileName={
                                    editingCandidate.originalName
                                }
                                fileUrl={
                                    editingCandidate.fileUrl
                                }
                                fileSize={
                                    editingCandidate.fileSize
                                }
                                buttonLabel="Ver hoja de vida"
                                buttonTooltip="Ver hoja de vida"
                            />
                        )}

                    <FileInput
                        label={
                            isEditing
                                ? "Reemplazar hoja de vida"
                                : "Hoja de vida"
                        }
                        value={form.file}
                        accept=".pdf,.doc,.docx"
                        required={!isEditing}
                        disabled={loadingSubmit}
                        error={formErrors.file}
                        hint={
                            isEditing
                                ? "Si no seleccionas un archivo, se conserva la hoja de vida actual."
                                : "Formatos permitidos: PDF, DOC o DOCX."
                        }
                        onChange={onFileChange}
                        onRemove={() =>
                            onFileChange(null)
                        }
                    />
                </Stack>
            </CustomDialog>
        </form>
    );
};

export default PersonnelRequisitionCandidateDialog;
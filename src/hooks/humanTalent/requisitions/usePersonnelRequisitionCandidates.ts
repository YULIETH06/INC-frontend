import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { ValidationError } from "yup";

import {
    closePersonnelRequisitionCandidates,
    createPersonnelRequisitionCandidate,
    deletePersonnelRequisitionCandidate,
    getPersonnelCandidateSubmissionBatches,
    getPersonnelCandidateSubmissionHistory,
    getPersonnelRequisitionCandidates,
    preselectPersonnelRequisitionCandidates,
    reopenPersonnelRequisitionCandidates,
    updatePersonnelRequisitionCandidate,
} from "../../../services/humanTalent/requisitions/personnelRequisitionService";

import {
    getIdentificationTypes
} from "../../../services/common/identificationTypeService";

import {
    closePersonnelRequisitionCandidatesSchema,
    createPersonnelRequisitionCandidateSchema,
    reopenPersonnelRequisitionCandidatesSchema,
    updatePersonnelRequisitionCandidateSchema,
} from "../../../validations/humanTalent/candidateSubmission/personnelRequisitionCandidateValidation";

import { getErrorMessage } from "../../../utils/common/getErrorMessage";

import type { MessageType } from "../../../interfaces/common/message.interface";

import type {
    CandidateSubmissionStatus,
    PersonnelCandidateSubmissionBatch,
    PersonnelCandidateSubmissionHistory,
    PersonnelRequisitionCandidate,
    PersonnelRequisitionCandidateForm,
    PersonnelRequisitionCandidateFormErrors,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

import type { IdentificationType } from "../../../interfaces/common/identificationType.interface";

// Datos actualizados del proceso de cargue de candidatos.
interface CandidateSubmissionUpdate {
    candidateSubmissionStatus: CandidateSubmissionStatus;
    candidateSubmissionClosedAt: string | null;
    candidateSubmissionDeadlineAt?: string | null;
    candidateSubmissionLateReason?: string | null;
}

// Propiedades recibidas por el hook.
interface UsePersonnelRequisitionCandidatesProps {
    requisitionId: number;
    enabled?: boolean;
    candidateSubmissionDeadlineAt?: string | null;
    candidateSubmissionClosedAt?: string | null;
    onSubmissionClosed?: (
        requisition: CandidateSubmissionUpdate
    ) => void | Promise<void>;

    onSubmissionReopened?: (
        requisition: CandidateSubmissionUpdate
    ) => void | Promise<void>;
}

// Estado inicial del formulario.
const initialForm: PersonnelRequisitionCandidateForm = {
    identificationTypeId: "",
    identificationNumber: "",
    name: "",
    observation: "",
    file: null,
};

// Estado inicial de los errores del formulario.
const initialFormErrors: PersonnelRequisitionCandidateFormErrors = {
    identificationTypeId: "",
    identificationNumber: "",
    name: "",
    observation: "",
    file: "",
};

// Hook encargado de manejar los candidatos de una requisición.
export const usePersonnelRequisitionCandidates = ({
    requisitionId,
    enabled = true,
    candidateSubmissionDeadlineAt = null,
    candidateSubmissionClosedAt = null,
    onSubmissionClosed,
    onSubmissionReopened,
}: UsePersonnelRequisitionCandidatesProps) => {
    // Candidatos registrados en la requisición.
    const [candidates, setCandidates] = useState<
        PersonnelRequisitionCandidate[]
    >([]);

    // Tipos de identificación activos disponibles.
    const [
        identificationTypes,
        setIdentificationTypes,
    ] = useState<IdentificationType[]>([]);

    // Indica si el usuario autenticado es el Auxiliar
    // encargado de gestionar los candidatos.
    const [
        isCandidateManager,
        setIsCandidateManager,
    ] = useState(false);

    // Datos actuales del formulario de creación o edición.
    const [form, setForm] =
        useState<PersonnelRequisitionCandidateForm>(
            initialForm
        );

    // Candidato seleccionado para editar.
    const [
        editingCandidate,
        setEditingCandidate,
    ] = useState<PersonnelRequisitionCandidate | null>(
        null
    );

    // Candidato seleccionado para eliminar.
    const [
        candidateToDelete,
        setCandidateToDelete,
    ] = useState<PersonnelRequisitionCandidate | null>(
        null
    );

    // Controla la apertura del formulario.
    const [openFormDialog, setOpenFormDialog] =
        useState(false);

    // Controla la confirmación de eliminación.
    const [openDeleteDialog, setOpenDeleteDialog] =
        useState(false);

    // Controla la confirmación de cierre del cargue.
    const [openCloseDialog, setOpenCloseDialog] =
        useState(false);

    // Controla la confirmación para reabrir el cargue.
    const [openReopenDialog, setOpenReopenDialog] =
        useState(false);

    // Motivo del retraso cuando el primer cierre está vencido.
    const [lateReason, setLateReason] = useState("");
    const [lateReasonError, setLateReasonError] =
        useState("");

    // Motivo obligatorio de reapertura.
    const [reopenReason, setReopenReason] = useState("");
    const [reopenReasonError, setReopenReasonError] =
        useState("");

    // Historial de reaperturas y cierres posteriores.
    const [submissionHistory, setSubmissionHistory] =
        useState<PersonnelCandidateSubmissionHistory[]>([]);

    const [loadingHistory, setLoadingHistory] =
        useState(false);

    // Fotografías históricas generadas en cada cierre del cargue.
    const [submissionBatches, setSubmissionBatches] =
        useState<PersonnelCandidateSubmissionBatch[]>([]);

    // Controla la consulta de las fotografías históricas.
    const [loadingBatches, setLoadingBatches] =
        useState(false);

    // Candidatos elegidos temporalmente antes de confirmar la preselección.
    const [selectedCandidateIds, setSelectedCandidateIds] =
        useState<number[]>([]);

    // Controla el diálogo de confirmación de la preselección.
    const [
        openPreselectionDialog,
        setOpenPreselectionDialog,
    ] = useState(false);

    // Controla el diálogo del historial de cargues.
    const [
        openSubmissionBatchesDialog,
        setOpenSubmissionBatchesDialog,
    ] = useState(false);

    // Controla la confirmación de la preselección.
    const [
        loadingPreselection,
        setLoadingPreselection,
    ] = useState(false);

    // Controla la carga del listado.
    const [loadingCandidates, setLoadingCandidates] =
        useState(false);

    // Controla el registro o actualización.
    const [loadingSubmit, setLoadingSubmit] =
        useState(false);

    // Controla la eliminación.
    const [loadingDelete, setLoadingDelete] =
        useState(false);

    // Controla el cierre del cargue.
    const [loadingClose, setLoadingClose] =
        useState(false);

    // Controla la reapertura del cargue.
    const [loadingReopen, setLoadingReopen] =
        useState(false);

    // Error producido al consultar los candidatos.
    const [loadError, setLoadError] = useState("");

    // Errores de validación por campo.
    const [formErrors, setFormErrors] =
        useState<PersonnelRequisitionCandidateFormErrors>(
            initialFormErrors
        );

    // Mensaje visual de respuesta.
    const [message, setMessage] = useState("");

    // Controla si se muestra el mensaje visual.
    const [openMessage, setOpenMessage] =
        useState(false);

    // Tipo visual del mensaje.
    const [messageSeverity, setMessageSeverity] =
        useState<MessageType>("success");

    // Consulta los tipos de identificación activos.
    const loadIdentificationTypes =
        useCallback(async () => {
            try {
                const response =
                    await getIdentificationTypes();

                setIdentificationTypes(
                    response.identificationTypes
                );
            } catch (error: unknown) {
                console.error(error);

                setIdentificationTypes([]);

                setMessage(
                    getErrorMessage(
                        error,
                        "Error al cargar los tipos de identificación."
                    )
                );

                setMessageSeverity("error");
                setOpenMessage(true);
            }
        }, []);

    // Consulta los candidatos registrados en la requisición.
    const loadCandidates = useCallback(async () => {
        if (
            !enabled ||
            !Number.isInteger(requisitionId) ||
            requisitionId <= 0
        ) {
            setCandidates([]);
            setIsCandidateManager(false);
            return;
        }

        try {
            setLoadingCandidates(true);
            setLoadError("");

            const response =
                await getPersonnelRequisitionCandidates(
                    requisitionId
                );

            setCandidates(response.candidates);

            setIsCandidateManager(
                response.isCandidateManager
            );
        } catch (error: unknown) {
            console.error(error);

            setCandidates([]);

            setLoadError(
                getErrorMessage(
                    error,
                    "Error al cargar los candidatos de la requisición."
                )
            );
        } finally {
            setLoadingCandidates(false);
        }
    }, [enabled, requisitionId]);

    // Consulta el historial del cargue de candidatos.
    const loadSubmissionHistory = useCallback(async () => {
        if (
            !enabled ||
            !Number.isInteger(requisitionId) ||
            requisitionId <= 0
        ) {
            setSubmissionHistory([]);
            return;
        }

        try {
            setLoadingHistory(true);

            const response =
                await getPersonnelCandidateSubmissionHistory(
                    requisitionId
                );

            setSubmissionHistory(response.history);
        } catch (error: unknown) {
            console.error(error);
            setSubmissionHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    }, [enabled, requisitionId]);

    // Consulta las fotografías históricas generadas en cada cierre.
    const loadSubmissionBatches = useCallback(async () => {
        if (
            !enabled ||
            !Number.isInteger(requisitionId) ||
            requisitionId <= 0
        ) {
            setSubmissionBatches([]);
            return;
        }

        try {
            setLoadingBatches(true);

            const response =
                await getPersonnelCandidateSubmissionBatches(
                    requisitionId
                );

            setSubmissionBatches(response.batches);
        } catch (error: unknown) {
            console.error(error);
            setSubmissionBatches([]);
        } finally {
            setLoadingBatches(false);
        }
    }, [enabled, requisitionId]);

    // Limpia mensajes generales y el error del campo editado.
    const clearFieldError = (
        field: keyof PersonnelRequisitionCandidateFormErrors
    ) => {
        setMessage("");
        setOpenMessage(false);

        setFormErrors((previous) => ({
            ...previous,
            [field]: "",
        }));
    };

    // Actualiza el tipo de identificación.
    const handleIdentificationTypeChange = (
        value: string
    ) => {
        setForm((previous) => ({
            ...previous,
            identificationTypeId: value,
        }));

        clearFieldError("identificationTypeId");
    };

    // Actualiza el número de identificación.
    const handleIdentificationNumberChange = (
        value: string
    ) => {
        setForm((previous) => ({
            ...previous,
            identificationNumber: value,
        }));

        clearFieldError("identificationNumber");
    };

    // Actualiza el nombre del candidato.
    const handleNameChange = (value: string) => {
        setForm((previous) => ({
            ...previous,
            name: value,
        }));

        clearFieldError("name");
    };

    // Actualiza la observación del candidato.
    const handleObservationChange = (
        value: string
    ) => {
        setForm((previous) => ({
            ...previous,
            observation: value,
        }));

        clearFieldError("observation");
    };

    // Guarda la hoja de vida seleccionada.
    const handleFileChange = (
        selectedFile: File | null
    ) => {
        setForm((previous) => ({
            ...previous,
            file: selectedFile,
        }));

        clearFieldError("file");
    };

    // Limpia el formulario de candidatos.
    const resetForm = () => {
        setForm(initialForm);
        setFormErrors(initialFormErrors);
        setEditingCandidate(null);
    };

    // Abre el formulario para registrar un candidato.
    const openCreateCandidateDialog = () => {
        resetForm();
        setOpenFormDialog(true);
    };

    // Abre el formulario con los datos del candidato seleccionado.
    const openEditCandidateDialog = (
        candidate: PersonnelRequisitionCandidate
    ) => {
        setEditingCandidate(candidate);

        setForm({
            identificationTypeId:
                String(candidate.identificationTypeId),

            identificationNumber:
                candidate.identificationNumber,

            name: candidate.name,

            observation:
                candidate.observation ?? "",

            file: null,
        });

        setFormErrors(initialFormErrors);
        setOpenFormDialog(true);
    };

    // Cierra el formulario.
    const closeCandidateDialog = () => {
        if (loadingSubmit) {
            return;
        }

        setOpenFormDialog(false);
        resetForm();
    };

    // Abre la confirmación para eliminar un candidato.
    const openDeleteCandidateDialog = (
        candidate: PersonnelRequisitionCandidate
    ) => {
        setCandidateToDelete(candidate);
        setOpenDeleteDialog(true);
    };

    // Cierra la confirmación de eliminación.
    const closeDeleteCandidateDialog = () => {
        if (loadingDelete) {
            return;
        }

        setCandidateToDelete(null);
        setOpenDeleteDialog(false);
    };

    // Abre la confirmación para cerrar el cargue.
    const openCloseCandidatesDialog = () => {
        setLateReason("");
        setLateReasonError("");
        setOpenCloseDialog(true);
    };

    // Cierra la confirmación del cierre.
    const closeCloseCandidatesDialog = () => {
        if (loadingClose) {
            return;
        }

        setOpenCloseDialog(false);
    };

    // Abre la confirmación para reabrir el cargue.
    const openReopenCandidatesDialog = () => {
        setReopenReason("");
        setReopenReasonError("");
        setOpenReopenDialog(true);
    };

    // Cierra la confirmación de reapertura.
    const closeReopenCandidatesDialog = () => {
        if (loadingReopen) {
            return;
        }

        setOpenReopenDialog(false);
    };

    // Determina si el primer cierre se está realizando fuera del plazo.
    const deadlineTime = candidateSubmissionDeadlineAt
        ? new Date(candidateSubmissionDeadlineAt).getTime()
        : null;

    // Es verdadero solo cuando aún no existe un primer cierre,
    // hay una fecha límite válida y el plazo ya fue superado.
    const isLateFirstClosure =
        candidateSubmissionClosedAt === null &&
        deadlineTime !== null &&
        !Number.isNaN(deadlineTime) &&
        Date.now() > deadlineTime;

    // Actualiza el motivo del retraso.
    const handleLateReasonChange = (value: string) => {
        setLateReason(value);
        setLateReasonError("");
    };

    // Actualiza el motivo de reapertura.
    const handleReopenReasonChange = (value: string) => {
        setReopenReason(value);
        setReopenReasonError("");
    };

    // Selecciona temporalmente un candidato para la preselección.
    const selectCandidate = (candidateId: number) => {
        const candidate = candidates.find(
            (currentCandidate) =>
                currentCandidate.id === candidateId
        );

        if (
            !candidate ||
            candidate.isPreselected
        ) {
            return;
        }

        setSelectedCandidateIds((previous) => {
            if (previous.includes(candidateId)) {
                return previous;
            }

            return [
                ...previous,
                candidateId,
            ];
        });
    };

    // Quita un candidato de la selección temporal.
    const unselectCandidate = (candidateId: number) => {
        setSelectedCandidateIds((previous) =>
            previous.filter(
                (currentCandidateId) =>
                    currentCandidateId !== candidateId
            )
        );
    };

    // Cancela toda la selección temporal actual.
    const cancelCandidateSelection = () => {
        setSelectedCandidateIds([]);
    };

    // Abre la confirmación de la preselección.
    const openPreselectionConfirmDialog = () => {
        if (selectedCandidateIds.length === 0) {
            return;
        }

        setOpenPreselectionDialog(true);
    };

    // Cierra la confirmación de la preselección.
    const closePreselectionConfirmDialog = () => {
        if (loadingPreselection) {
            return;
        }

        setOpenPreselectionDialog(false);
    };

    // Abre el historial de fotografías de los cargues.
    const openSubmissionBatchesHistoryDialog = () => {
        setOpenSubmissionBatchesDialog(true);
    };

    // Cierra el historial de fotografías de los cargues.
    const closeSubmissionBatchesHistoryDialog = () => {
        setOpenSubmissionBatchesDialog(false);
    };

    // Confirma definitivamente los candidatos seleccionados.
    const handleConfirmPreselection = async () => {
        if (selectedCandidateIds.length === 0) {
            return;
        }

        try {
            setLoadingPreselection(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await preselectPersonnelRequisitionCandidates(
                    requisitionId,
                    {
                        candidateIds:
                            selectedCandidateIds,
                    }
                );

            setSelectedCandidateIds([]);
            setOpenPreselectionDialog(false);

            // Consulta nuevamente los candidatos para obtener
            // la información completa de la preselección.
            await loadCandidates();

            setMessage(
                response.message ||
                "Candidatos preseleccionados correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);
        } catch (error: unknown) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al confirmar la preselección de candidatos."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingPreselection(false);
        }
    };

    // Cierra el mensaje visual.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Valida y registra o actualiza la información del candidato.
    const handleSubmitCandidate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const candidateData: PersonnelRequisitionCandidateForm = {
            identificationTypeId:
                form.identificationTypeId,

            identificationNumber:
                form.identificationNumber,

            name: form.name,
            observation: form.observation,
            file: form.file,
        };

        try {
            const validationSchema = editingCandidate
                ? updatePersonnelRequisitionCandidateSchema
                : createPersonnelRequisitionCandidateSchema;

            await validationSchema.validate(
                candidateData,
                {
                    abortEarly: false,
                }
            );

            setLoadingSubmit(true);
            setFormErrors(initialFormErrors);
            setMessage("");
            setOpenMessage(false);

            const normalizedCandidateData:
                PersonnelRequisitionCandidateForm = {
                identificationTypeId:
                    form.identificationTypeId,

                identificationNumber:
                    form.identificationNumber.trim(),

                name: form.name.trim(),

                observation:
                    form.observation.trim(),

                file: form.file,
            };

            if (editingCandidate) {
                const response =
                    await updatePersonnelRequisitionCandidate(
                        requisitionId,
                        editingCandidate.id,
                        normalizedCandidateData
                    );

                setCandidates((previous) =>
                    previous.map((candidate) =>
                        candidate.id ===
                            response.candidate.id
                            ? response.candidate
                            : candidate
                    )
                );

                setMessage(
                    response.message ||
                    "Candidato actualizado correctamente."
                );
            } else {
                const response =
                    await createPersonnelRequisitionCandidate(
                        requisitionId,
                        normalizedCandidateData
                    );

                setCandidates((previous) => [
                    ...previous,
                    response.candidate,
                ]);

                setMessage(
                    response.message ||
                    "Candidato registrado correctamente."
                );
            }

            setMessageSeverity("success");
            setOpenMessage(true);
            setOpenFormDialog(false);
            resetForm();
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: PersonnelRequisitionCandidateFormErrors =
                {
                    ...initialFormErrors,
                };

                error.inner.forEach(
                    (validationError) => {
                        const path =
                            validationError.path as keyof PersonnelRequisitionCandidateFormErrors;

                        if (path) {
                            errors[path] =
                                validationError.message;
                        }
                    }
                );

                setFormErrors(errors);
                setMessage("");
                setOpenMessage(false);
                return;
            }

            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    editingCandidate
                        ? "Error al actualizar el candidato."
                        : "Error al registrar el candidato."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingSubmit(false);
        }
    };

    // Elimina el candidato seleccionado.
    const handleDeleteCandidate = async () => {
        if (!candidateToDelete) {
            return;
        }

        try {
            setLoadingDelete(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await deletePersonnelRequisitionCandidate(
                    requisitionId,
                    candidateToDelete.id
                );

            setCandidates((previous) =>
                previous.filter(
                    (candidate) =>
                        candidate.id !==
                        candidateToDelete.id
                )
            );

            setCandidateToDelete(null);
            setOpenDeleteDialog(false);

            setMessage(
                response.message ||
                "Candidato eliminado correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);
        } catch (error: unknown) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al eliminar el candidato."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingDelete(false);
        }
    };

    // Cierra el proceso de cargue de candidatos.
    const handleCloseCandidates = async () => {
        const cleanLateReason = lateReason.trim();

        try {
            if (isLateFirstClosure && !cleanLateReason) {
                setLateReasonError(
                    "El motivo del retraso es obligatorio."
                );
                return;
            }

            await closePersonnelRequisitionCandidatesSchema.validate({
                lateReason: cleanLateReason || undefined,
            });

            setLoadingClose(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await closePersonnelRequisitionCandidates(
                    requisitionId,
                    cleanLateReason
                        ? {
                            lateReason: cleanLateReason,
                        }
                        : {}
                );

            setOpenCloseDialog(false);
            setLateReason("");
            setLateReasonError("");

            await Promise.all([
                loadSubmissionHistory(),
                loadSubmissionBatches(),
            ]);

            setMessage(
                response.message ||
                "Cargue de candidatos cerrado correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);

            if (onSubmissionClosed) {
                await onSubmissionClosed(
                    response.requisition
                );
            }
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                setLateReasonError(error.message);
                return;
            }

            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al cerrar el cargue de candidatos."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingClose(false);
        }
    };

    // Reabre el proceso de cargue de candidatos.
    const handleReopenCandidates = async () => {
        const cleanReason = reopenReason.trim();

        try {
            await reopenPersonnelRequisitionCandidatesSchema.validate({
                reason: cleanReason,
            });

            setLoadingReopen(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await reopenPersonnelRequisitionCandidates(
                    requisitionId,
                    {
                        reason: cleanReason,
                    }
                );

            setOpenReopenDialog(false);
            setReopenReason("");
            setReopenReasonError("");

            await loadSubmissionHistory();

            setMessage(
                response.message ||
                "Cargue de candidatos reabierto correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);

            if (onSubmissionReopened) {
                await onSubmissionReopened(
                    response.requisition
                );
            }
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                setReopenReasonError(error.message);
                return;
            }

            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al reabrir el cargue de candidatos."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingReopen(false);
        }
    };

    // Candidatos elegidos temporalmente antes de confirmar.
    const selectedCandidates =
        candidates.filter(
            (candidate) =>
                selectedCandidateIds.includes(
                    candidate.id
                ) &&
                !candidate.isPreselected
        );

    // Indica si existe por lo menos un candidato seleccionado.
    const hasSelectedCandidates =
        selectedCandidateIds.length > 0;

    // Indica si se está editando un candidato.
    const isEditing = Boolean(editingCandidate);

    // Indica si el formulario contiene cambios.
    const hasFormChanges = editingCandidate
        ? form.identificationTypeId !==
        String(editingCandidate.identificationTypeId) ||
        form.identificationNumber.trim() !==
        editingCandidate.identificationNumber ||
        form.name.trim() !==
        editingCandidate.name ||
        form.observation.trim() !==
        (editingCandidate.observation ?? "") ||
        form.file !== null

        : form.identificationTypeId !== "" ||
        form.identificationNumber.trim() !== "" ||
        form.name.trim() !== "" ||
        form.observation.trim() !== "" ||
        form.file !== null;

    useEffect(() => {
        loadIdentificationTypes();
    }, [loadIdentificationTypes]);

    useEffect(() => {
        loadCandidates();
    }, [loadCandidates]);

    useEffect(() => {
        loadSubmissionHistory();
    }, [loadSubmissionHistory]);

    useEffect(() => {
        loadSubmissionBatches();
    }, [loadSubmissionBatches]);

    return {
        candidates,
        isCandidateManager,
        identificationTypes,

        submissionHistory,
        loadingHistory,

        submissionBatches,
        loadingBatches,

        selectedCandidateIds,
        selectedCandidates,
        hasSelectedCandidates,

        lateReason,
        lateReasonError,
        reopenReason,
        reopenReasonError,

        isLateFirstClosure,

        form,
        formErrors,

        editingCandidate,
        candidateToDelete,

        openFormDialog,
        openDeleteDialog,
        openCloseDialog,
        openReopenDialog,
        openPreselectionDialog,
        openSubmissionBatchesDialog,

        loadingReopen,
        loadingCandidates,
        loadingSubmit,
        loadingDelete,
        loadingClose,
        loadingPreselection,

        loadError,

        message,
        openMessage,
        messageSeverity,

        isEditing,
        hasFormChanges,

        loadCandidates,
        loadSubmissionHistory,
        loadSubmissionBatches,

        handleIdentificationTypeChange,
        handleIdentificationNumberChange,
        handleNameChange,
        handleObservationChange,
        handleFileChange,

        selectCandidate,
        unselectCandidate,
        cancelCandidateSelection,

        openCreateCandidateDialog,
        openEditCandidateDialog,
        closeCandidateDialog,

        openDeleteCandidateDialog,
        closeDeleteCandidateDialog,
        handleDeleteCandidate,

        openCloseCandidatesDialog,
        closeCloseCandidatesDialog,
        handleCloseCandidates,

        openReopenCandidatesDialog,
        closeReopenCandidatesDialog,
        handleReopenCandidates,

        openPreselectionConfirmDialog,
        closePreselectionConfirmDialog,
        handleConfirmPreselection,

        openSubmissionBatchesHistoryDialog,
        closeSubmissionBatchesHistoryDialog,

        handleLateReasonChange,
        handleReopenReasonChange,

        handleSubmitCandidate,
        closeMessage,
        resetForm,
    };
};
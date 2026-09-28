import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { ValidationError } from "yup";

import {
    createPositionProfileRevision,
    createPositionRequirement,
    createPositionCompetency,
    deletePositionProfileRevision,
    deletePositionRequirement,
    deletePositionCompetency,
    getPositionProfileRevisionDetail,
    getPositionProfileRevisions,
    publishPositionProfileRevision,
    updatePositionProfileRevision,
    updatePositionRequirement,
    updatePositionCompetency,
} from "../../services/positionManagement/positionProfileRevisionService";

import {
    createPositionProfileRevisionSchema,
    createPositionRequirementSchema,
    updatePositionProfileRevisionSchema,
    updatePositionRequirementSchema,
} from "../../validations/positionManagement/positionProfileRevisionValidation";

import { getErrorMessage } from "../../utils/common/getErrorMessage";

import type { MessageType } from "../../interfaces/common/message.interface";

import type {
    PositionCompetency,
    PositionCompetencyForm,
    PositionCompetencyFormErrors,
    PositionProfileRevision,
    PositionProfileRevisionDetail,
    PositionProfileRevisionForm,
    PositionProfileRevisionFormErrors,
    PositionRequirementEntry,
    PositionRequirementForm,
    PositionRequirementFormErrors,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

// Propiedades recibidas por el hook.
interface UsePositionProfileRevisionsProps {
    positionProfileId: number;
    enabled?: boolean;
}

// Requisito seleccionado para eliminar.
interface RequirementToDelete {
    requirementId: number;
    requirement: PositionRequirementEntry;
}

// Estado inicial del formulario de revisión.
const initialRevisionForm: PositionProfileRevisionForm = {
    changeObservation: "",
};

// Estado inicial de los errores del formulario de revisión.
const initialRevisionFormErrors: PositionProfileRevisionFormErrors = {
    changeObservation: "",
};

// Estado inicial del formulario de requisito.
const initialRequirementForm: PositionRequirementForm = {
    description: "",
};

// Estado inicial de los errores del formulario de requisito.
const initialRequirementFormErrors: PositionRequirementFormErrors =
{
    description: "",
};

// Estado inicial del formulario de competencia.
const initialCompetencyForm: PositionCompetencyForm = {
    competencyTypeId: "",
    competency: "",
};

// Estado inicial de los errores del formulario de competencia.
const initialCompetencyFormErrors: PositionCompetencyFormErrors = {
    competencyTypeId: "",
    competency: "",
};

// Hook encargado de gestionar las revisiones de un perfil de cargo.
export const usePositionProfileRevisions = ({
    positionProfileId,
    enabled = true,
}: UsePositionProfileRevisionsProps) => {

    // Revisiones registradas para el perfil de cargo.
    const [revisions, setRevisions] = useState<
        PositionProfileRevision[]
    >([]);

    // Revisión seleccionada para consultar sus requisitos y competencias.
    const [
        selectedRevisionDetail,
        setSelectedRevisionDetail,
    ] = useState<PositionProfileRevisionDetail | null>(
        null
    );

    // Revisión seleccionada para actualizar su observación.
    const [
        editingRevision,
        setEditingRevision,
    ] = useState<PositionProfileRevision | null>(
        null
    );

    // Revisión seleccionada para eliminar.
    const [
        revisionToDelete,
        setRevisionToDelete,
    ] = useState<PositionProfileRevision | null>(
        null
    );

    // Revisión seleccionada para publicar.
    const [
        revisionToPublish,
        setRevisionToPublish,
    ] = useState<PositionProfileRevision | null>(
        null
    );

    // Requisito seleccionado para agregar o editar un requisito.
    const [
        selectedRequirementId,
        setSelectedRequirementId,
    ] = useState<number | null>(null);

    // Requisito seleccionado para editar.
    const [
        editingRequirement,
        setEditingRequirement,
    ] = useState<PositionRequirementEntry | null>(
        null
    );

    // Requisito seleccionado para eliminar.
    const [
        requirementToDelete,
        setRequirementToDelete,
    ] = useState<RequirementToDelete | null>(
        null
    );

    // Competencia seleccionada para editar.
    const [
        editingCompetency,
        setEditingCompetency,
    ] = useState<PositionCompetency | null>(
        null
    );

    // Datos actuales del formulario de revisión.
    const [revisionForm, setRevisionForm] =
        useState<PositionProfileRevisionForm>(
            initialRevisionForm
        );

    // Datos actuales del formulario de requisito.
    const [requirementForm, setRequirementForm] =
        useState<PositionRequirementForm>(
            initialRequirementForm
        );

    // Datos actuales del formulario de competencia.
    const [competencyForm, setCompetencyForm] =
        useState<PositionCompetencyForm>(
            initialCompetencyForm
        );

    // Errores del formulario de revisión.
    const [
        revisionFormErrors,
        setRevisionFormErrors,
    ] = useState<PositionProfileRevisionFormErrors>(
        initialRevisionFormErrors
    );

    // Errores del formulario de requisito.
    const [
        requirementFormErrors,
        setRequirementFormErrors,
    ] = useState<PositionRequirementFormErrors>(
        initialRequirementFormErrors
    );

    // Errores del formulario de competencia.
    const [
        competencyFormErrors,
        setCompetencyFormErrors,
    ] = useState<PositionCompetencyFormErrors>(
        initialCompetencyFormErrors
    );

    // Controla la apertura del formulario de revisión.
    const [
        openRevisionDialog,
        setOpenRevisionDialog,
    ] = useState(false);

    // Controla la confirmación de eliminación de una revisión.
    const [
        openDeleteRevisionDialog,
        setOpenDeleteRevisionDialog,
    ] = useState(false);

    // Controla la confirmación de publicación.
    const [
        openPublishRevisionDialog,
        setOpenPublishRevisionDialog,
    ] = useState(false);

    // Controla la apertura del formulario de requisito.
    const [
        openRequirementDialog,
        setOpenRequirementDialog,
    ] = useState(false);

    // Controla la confirmación de eliminación de un requisito.
    const [
        openDeleteRequirementDialog,
        setOpenDeleteRequirementDialog,
    ] = useState(false);

    // Controla la apertura del formulario de competencia.
    const [
        openCompetencyDialog,
        setOpenCompetencyDialog,
    ] = useState(false);

    // Controla la carga del listado de revisiones.
    const [
        loadingRevisions,
        setLoadingRevisions,
    ] = useState(false);

    // Controla la carga de los requisitos y competencias de una revisión.
    const [
        loadingRevisionDetail,
        setLoadingRevisionDetail,
    ] = useState(false);

    // Controla la creación o actualización de una revisión.
    const [
        loadingRevisionSubmit,
        setLoadingRevisionSubmit,
    ] = useState(false);

    // Controla la eliminación de una revisión.
    const [
        loadingRevisionDelete,
        setLoadingRevisionDelete,
    ] = useState(false);

    // Controla la publicación de una revisión.
    const [
        loadingPublish,
        setLoadingPublish,
    ] = useState(false);

    // Controla la creación o actualización de un requisito.
    const [
        loadingRequirementSubmit,
        setLoadingRequirementSubmit,
    ] = useState(false);

    // Controla la eliminación de un requisito.
    const [
        loadingRequirementDelete,
        setLoadingRequirementDelete,
    ] = useState(false);

    // Controla la creación o actualización de una competencia.
    const [
        loadingCompetencySubmit,
        setLoadingCompetencySubmit,
    ] = useState(false);

    // Controla la eliminación de una competencia.
    const [
        loadingCompetencyDelete,
        setLoadingCompetencyDelete,
    ] = useState(false);

    // Error producido al cargar las revisiones.
    const [loadError, setLoadError] = useState("");

    // Error producido al cargar los requisitos y competencias.
    const [detailError, setDetailError] =
        useState("");

    // Mensaje visual de respuesta.
    const [message, setMessage] = useState("");

    // Controla si se muestra el mensaje visual.
    const [openMessage, setOpenMessage] =
        useState(false);

    // Tipo visual del mensaje.
    const [messageSeverity, setMessageSeverity] =
        useState<MessageType>("success");

    // Consulta las revisiones registradas para el perfil de cargo.
    const loadRevisions = useCallback(async () => {
        if (
            !enabled ||
            !Number.isInteger(positionProfileId) ||
            positionProfileId <= 0
        ) {
            setRevisions([]);
            return;
        }

        try {
            setLoadingRevisions(true);
            setLoadError("");

            const response =
                await getPositionProfileRevisions(
                    positionProfileId
                );

            setRevisions(response.revisions);
        } catch (error: unknown) {
            console.error(error);

            setRevisions([]);

            setLoadError(
                getErrorMessage(
                    error,
                    "Error al cargar las revisiones del perfil de cargo."
                )
            );
        } finally {
            setLoadingRevisions(false);
        }
    }, [enabled, positionProfileId]);

    // Consulta los requisitos y competencias de una revisión.
    const loadRevisionDetail = useCallback(
        async (revisionId: number) => {
            if (
                !enabled ||
                !Number.isInteger(positionProfileId) ||
                positionProfileId <= 0 ||
                !Number.isInteger(revisionId) ||
                revisionId <= 0
            ) {
                setSelectedRevisionDetail(null);
                return;
            }

            try {
                setLoadingRevisionDetail(true);
                setDetailError("");

                const response =
                    await getPositionProfileRevisionDetail(
                        positionProfileId,
                        revisionId
                    );

                setSelectedRevisionDetail(
                    response.revision
                );
            } catch (error: unknown) {
                console.error(error);

                setSelectedRevisionDetail(null);

                setDetailError(
                    getErrorMessage(
                        error,
                        "Error al cargar los requisitos y competencias de la revisión."
                    )
                );
            } finally {
                setLoadingRevisionDetail(false);
            }
        },
        [enabled, positionProfileId]
    );

    // Limpia el error del formulario de revisión.
    const clearRevisionFieldError = () => {
        setMessage("");
        setOpenMessage(false);

        setRevisionFormErrors(
            initialRevisionFormErrors
        );
    };

    // Limpia el error del formulario de requisito.
    const clearRequirementFieldError = () => {
        setMessage("");
        setOpenMessage(false);

        setRequirementFormErrors(
            initialRequirementFormErrors
        );
    };

    // Limpia el error del formulario de competencia.
    const clearCompetencyFieldError = () => {
        setMessage("");
        setOpenMessage(false);

        setCompetencyFormErrors(
            initialCompetencyFormErrors
        );
    };

    // Actualiza la observación del formulario.
    const handleChangeObservation = (
        value: string
    ) => {
        setRevisionForm({
            changeObservation: value,
        });

        clearRevisionFieldError();
    };

    // Actualiza el requisito.
    const handleRequirementChange = (
        value: string
    ) => {
        setRequirementForm({
            description: value,
        });

        clearRequirementFieldError();
    };

    // Actualiza la competencia del formulario.
    const handleCompetencyChange = (
        value: string
    ) => {
        setCompetencyForm((previous) => ({
            ...previous,
            competency: value,
        }));

        clearCompetencyFieldError();
    };

    // Actualiza el tipo de competencia del formulario.
    const handleCompetencyTypeChange = (
        value: number | ""
    ) => {
        setCompetencyForm((previous) => ({
            ...previous,
            competencyTypeId: value,
        }));

        clearCompetencyFieldError();
    };

    // Limpia el formulario de revisión.
    const resetRevisionForm = () => {
        setRevisionForm(initialRevisionForm);

        setRevisionFormErrors(
            initialRevisionFormErrors
        );

        setEditingRevision(null);
    };

    // Limpia el formulario de requisito.
    const resetRequirementForm = () => {
        setRequirementForm(initialRequirementForm);

        setRequirementFormErrors(
            initialRequirementFormErrors
        );

        setSelectedRequirementId(null);
        setEditingRequirement(null);
    };

    // Limpia el formulario de competencia.
    const resetCompetencyForm = () => {
        setCompetencyForm(initialCompetencyForm);

        setCompetencyFormErrors(
            initialCompetencyFormErrors
        );

        setEditingCompetency(null);
    };

    // Abre el formulario para crear una revisión.
    const openCreateRevisionDialog = () => {
        resetRevisionForm();
        setOpenRevisionDialog(true);
    };

    // Abre el formulario para actualizar una revisión.
    const openEditRevisionDialog = (
        revision: PositionProfileRevision
    ) => {
        setEditingRevision(revision);

        setRevisionForm({
            changeObservation:
                revision.changeObservation ?? "",
        });

        setRevisionFormErrors(
            initialRevisionFormErrors
        );

        setOpenRevisionDialog(true);
    };

    // Cierra el formulario de revisión.
    const closeRevisionDialog = () => {
        if (loadingRevisionSubmit) {
            return;
        }

        setOpenRevisionDialog(false);
        resetRevisionForm();
    };

    // Abre la confirmación para eliminar una revisión.
    const openDeleteRevisionConfirmation = (
        revision: PositionProfileRevision
    ) => {
        setRevisionToDelete(revision);
        setOpenDeleteRevisionDialog(true);
    };

    // Cierra la confirmación de eliminación.
    const closeDeleteRevisionConfirmation = () => {
        if (loadingRevisionDelete) {
            return;
        }

        setRevisionToDelete(null);
        setOpenDeleteRevisionDialog(false);
    };

    // Abre la confirmación para publicar una revisión.
    const openPublishRevisionConfirmation = (
        revision: PositionProfileRevision
    ) => {
        setRevisionToPublish(revision);
        setOpenPublishRevisionDialog(true);
    };

    // Cierra la confirmación de publicación.
    const closePublishRevisionConfirmation = () => {
        if (loadingPublish) {
            return;
        }

        setRevisionToPublish(null);
        setOpenPublishRevisionDialog(false);
    };

    // Abre el formulario para agregar un requisito.
    const openCreateRequirementDialog = (
        requirementId: number
    ) => {
        resetRequirementForm();

        setSelectedRequirementId(requirementId);
        setOpenRequirementDialog(true);
    };

    // Abre el formulario para actualizar un requisito.
    const openEditRequirementDialog = (
        requirementId: number,
        requirement: PositionRequirementEntry
    ) => {
        setSelectedRequirementId(requirementId);
        setEditingRequirement(requirement);

        setRequirementForm({
            description: requirement.description,
        });

        setRequirementFormErrors(
            initialRequirementFormErrors
        );

        setOpenRequirementDialog(true);
    };

    // Cierra el formulario de requisito.
    const closeRequirementDialog = () => {
        if (loadingRequirementSubmit) {
            return;
        }

        setOpenRequirementDialog(false);
        resetRequirementForm();
    };

    // Abre el formulario para agregar una competencia.
    // El tipo de competencia queda preseleccionado.
    const openCreateCompetencyDialog = (
        competencyTypeId: number
    ) => {
        resetCompetencyForm();

        setCompetencyForm({
            competencyTypeId,
            competency: "",
        });

        setOpenCompetencyDialog(true);
    };

    // Abre el formulario para actualizar una competencia.
    // El tipo de competencia permanece fijo.
    const openEditCompetencyDialog = (
        competency: PositionCompetency
    ) => {
        setEditingCompetency(competency);

        setCompetencyForm({
            competencyTypeId:
                competency.competencyTypeId,
            competency: competency.competency,
        });

        setCompetencyFormErrors(
            initialCompetencyFormErrors
        );

        setOpenCompetencyDialog(true);
    };

    // Cierra el formulario de competencias.
    const closeCompetencyDialog = () => {
        if (loadingCompetencySubmit) {
            return;
        }

        setOpenCompetencyDialog(false);
        resetCompetencyForm();
    };

    // Abre la confirmación para eliminar un requisito.
    const openDeleteRequirementConfirmation = (
        requirementId: number,
        requirement: PositionRequirementEntry
    ) => {
        setRequirementToDelete({
            requirementId,
            requirement,
        });

        setOpenDeleteRequirementDialog(true);
    };

    // Cierra la confirmación de eliminación de requisito.
    const closeDeleteRequirementConfirmation = () => {
        if (loadingRequirementDelete) {
            return;
        }

        setRequirementToDelete(null);
        setOpenDeleteRequirementDialog(false);
    };

    // Cierra el mensaje visual.
    const closeMessage = () => {
        setOpenMessage(false);
    };

    // Crea una revisión o actualiza su observación.
    const handleSubmitRevision = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const formData: PositionProfileRevisionForm = {
            changeObservation:
                revisionForm.changeObservation,
        };

        try {
            const validationSchema = editingRevision
                ? updatePositionProfileRevisionSchema
                : createPositionProfileRevisionSchema;

            await validationSchema.validate(
                formData,
                {
                    abortEarly: false,
                }
            );

            setLoadingRevisionSubmit(true);

            setRevisionFormErrors(
                initialRevisionFormErrors
            );

            setMessage("");
            setOpenMessage(false);

            const normalizedObservation =
                revisionForm.changeObservation.trim();

            if (editingRevision) {
                const response =
                    await updatePositionProfileRevision(
                        positionProfileId,
                        editingRevision.id,
                        {
                            changeObservation:
                                normalizedObservation ||
                                null,
                        }
                    );

                setRevisions((previous) =>
                    previous.map((revision) =>
                        revision.id ===
                            response.revision.id
                            ? response.revision
                            : revision
                    )
                );

                setSelectedRevisionDetail(
                    (previous) => {
                        if (
                            !previous ||
                            previous.id !==
                            response.revision.id
                        ) {
                            return previous;
                        }

                        return {
                            ...previous,
                            ...response.revision,
                            positionProfile:
                                response.revision
                                    .positionProfile ??
                                previous.positionProfile,
                            requirements:
                                previous.requirements,
                            competencies:
                                previous.competencies,
                        };
                    }
                );

                setMessage(
                    response.message ||
                    "Revisión actualizada correctamente."
                );
            } else {
                const response =
                    await createPositionProfileRevision(
                        positionProfileId,
                        normalizedObservation
                            ? {
                                changeObservation:
                                    normalizedObservation,
                            }
                            : {}
                    );

                setRevisions((previous) => [
                    response.revision,
                    ...previous,
                ]);

                setMessage(
                    response.message ||
                    "Revisión creada correctamente."
                );

                await loadRevisionDetail(
                    response.revision.id
                );
            }

            setMessageSeverity("success");
            setOpenMessage(true);

            setOpenRevisionDialog(false);
            resetRevisionForm();
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: PositionProfileRevisionFormErrors =
                {
                    ...initialRevisionFormErrors,
                };

                error.inner.forEach(
                    (validationError) => {
                        const path =
                            validationError.path as keyof PositionProfileRevisionFormErrors;

                        if (path) {
                            errors[path] =
                                validationError.message;
                        }
                    }
                );

                setRevisionFormErrors(errors);
                setMessage("");
                setOpenMessage(false);
                return;
            }

            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    editingRevision
                        ? "Error al actualizar la revisión."
                        : "Error al crear la revisión."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingRevisionSubmit(false);
        }
    };

    // Elimina lógicamente la revisión seleccionada.
    const handleDeleteRevision = async () => {
        if (!revisionToDelete) {
            return;
        }

        try {
            setLoadingRevisionDelete(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await deletePositionProfileRevision(
                    positionProfileId,
                    revisionToDelete.id
                );

            setRevisions((previous) =>
                previous.filter(
                    (revision) =>
                        revision.id !==
                        revisionToDelete.id
                )
            );

            if (
                selectedRevisionDetail?.id ===
                revisionToDelete.id
            ) {
                setSelectedRevisionDetail(null);
                setDetailError("");
            }

            setRevisionToDelete(null);
            setOpenDeleteRevisionDialog(false);

            setMessage(
                response.message ||
                "Revisión eliminada correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);
        } catch (error: unknown) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al eliminar la revisión."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingRevisionDelete(false);
        }
    };

    // Publica la revisión seleccionada.
    const handlePublishRevision = async () => {
        if (!revisionToPublish) {
            return;
        }

        try {
            setLoadingPublish(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await publishPositionProfileRevision(
                    positionProfileId,
                    revisionToPublish.id
                );

            setRevisionToPublish(null);
            setOpenPublishRevisionDialog(false);

            setMessage(
                response.message ||
                "Revisión publicada correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);

            await loadRevisions();

            if (selectedRevisionDetail) {
                await loadRevisionDetail(
                    selectedRevisionDetail.id
                );
            }
        } catch (error: unknown) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al publicar la revisión."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingPublish(false);
        }
    };

    // Crea o actualiza un requisito.
    const handleSubmitRequirement = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !selectedRevisionDetail ||
            !selectedRequirementId
        ) {
            return;
        }

        const formData: PositionRequirementForm =
        {
            description: requirementForm.description,
        };

        try {
            const validationSchema = editingRequirement
                ? updatePositionRequirementSchema
                : createPositionRequirementSchema;

            await validationSchema.validate(
                formData,
                {
                    abortEarly: false,
                }
            );

            setLoadingRequirementSubmit(true);

            setRequirementFormErrors(
                initialRequirementFormErrors
            );

            setMessage("");
            setOpenMessage(false);

            const normalizedData = {
                description:
                    requirementForm.description.trim(),
            };

            if (editingRequirement) {
                const response =
                    await updatePositionRequirement(
                        positionProfileId,
                        selectedRevisionDetail.id,
                        selectedRequirementId,
                        editingRequirement.id,
                        normalizedData
                    );

                setMessage(
                    response.message ||
                    "Requisito actualizado correctamente."
                );
            } else {
                const response =
                    await createPositionRequirement(
                        positionProfileId,
                        selectedRevisionDetail.id,
                        selectedRequirementId,
                        normalizedData
                    );

                setMessage(
                    response.message ||
                    "Requisito registrado correctamente."
                );
            }

            await loadRevisionDetail(
                selectedRevisionDetail.id
            );

            setMessageSeverity("success");
            setOpenMessage(true);

            setOpenRequirementDialog(false);
            resetRequirementForm();
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: PositionRequirementFormErrors =
                {
                    ...initialRequirementFormErrors,
                };

                error.inner.forEach(
                    (validationError) => {
                        const path =
                            validationError.path as keyof PositionRequirementFormErrors;

                        if (path) {
                            errors[path] =
                                validationError.message;
                        }
                    }
                );

                setRequirementFormErrors(errors);
                setMessage("");
                setOpenMessage(false);
                return;
            }

            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    editingRequirement
                        ? "Error al actualizar el requisito."
                        : "Error al registrar el requisito."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingRequirementSubmit(false);
        }
    };

    // Elimina lógicamente el requisito seleccionado.
    const handleDeleteRequirement = async () => {
        if (
            !selectedRevisionDetail ||
            !requirementToDelete
        ) {
            return;
        }

        try {
            setLoadingRequirementDelete(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await deletePositionRequirement(
                    positionProfileId,
                    selectedRevisionDetail.id,
                    requirementToDelete.requirementId,
                    requirementToDelete.requirement.id
                );

            await loadRevisionDetail(
                selectedRevisionDetail.id
            );

            setRequirementToDelete(null);
            setOpenDeleteRequirementDialog(false);

            setMessage(
                response.message ||
                "Requisito eliminado correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);
        } catch (error: unknown) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al eliminar el requisito."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingRequirementDelete(false);
        }
    };

    // Registra una competencia en una revisión.
    const handleCreateCompetency = async (
        revisionId: number,
        data: {
            competencyTypeId: number;
            competency: string;
        }
    ): Promise<boolean> => {
        try {
            setLoadingCompetencySubmit(true);
            setMessage("");
            setOpenMessage(false);

            const response = await createPositionCompetency(
                positionProfileId,
                revisionId,
                data
            );

            await loadRevisionDetail(revisionId);

            setMessage(
                response.message ||
                "Competencia registrada correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);

            return true;
        } catch (error: unknown) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al registrar la competencia."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);

            return false;
        } finally {
            setLoadingCompetencySubmit(false);
        }
    };

    // Actualiza una competencia de una revisión.
    const handleUpdateCompetency = async (
        revisionId: number,
        competencyId: number,
        data: {
            competency: string;
        }
    ): Promise<boolean> => {
        try {
            setLoadingCompetencySubmit(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await updatePositionCompetency(
                    positionProfileId,
                    revisionId,
                    competencyId,
                    data
                );

            await loadRevisionDetail(revisionId);

            setMessage(
                response.message ||
                "Competencia actualizada correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);

            return true;
        } catch (error: unknown) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al actualizar la competencia."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);

            return false;
        } finally {
            setLoadingCompetencySubmit(false);
        }
    };

    // Crea o actualiza una competencia de una revisión.
    const handleSubmitCompetency = async (
        event: React.FormEvent<HTMLFormElement>,
        revisionId: number
    ) => {
        event.preventDefault();

        const errors: PositionCompetencyFormErrors = {
            ...initialCompetencyFormErrors,
        };

        const competencyTypeId =
            competencyForm.competencyTypeId;

        const normalizedCompetency =
            competencyForm.competency.trim();

        // Valida el tipo de competencia.
        if (
            typeof competencyTypeId !== "number" ||
            !Number.isInteger(competencyTypeId) ||
            competencyTypeId <= 0
        ) {
            errors.competencyTypeId =
                "El tipo de competencia es obligatorio.";
        }

        // Valida la competencia.
        if (!normalizedCompetency) {
            errors.competency =
                "La competencia es obligatoria.";
        } else if (normalizedCompetency.length > 500) {
            errors.competency =
                "La competencia no puede superar los 500 caracteres.";
        }

        // Si existen errores, no continúa con la petición.
        if (
            errors.competencyTypeId ||
            errors.competency
        ) {
            setCompetencyFormErrors(errors);
            return;
        }

        setCompetencyFormErrors(
            initialCompetencyFormErrors
        );

        // Después de la validación, el tipo siempre debe ser numérico.
        const validCompetencyTypeId =
            Number(competencyTypeId);

        let success = false;

        // Actualización.
        if (editingCompetency) {
            success = await handleUpdateCompetency(
                revisionId,
                editingCompetency.id,
                {
                    competency: normalizedCompetency,
                }
            );
        } else {
            // Creación.
            success = await handleCreateCompetency(
                revisionId,
                {
                    competencyTypeId:
                        validCompetencyTypeId,
                    competency: normalizedCompetency,
                }
            );
        }

        // Solo cierra el diálogo si la operación fue exitosa.
        if (success) {
            closeCompetencyDialog();
        }
    };

    // Elimina lógicamente una competencia de una revisión.
    const handleDeleteCompetency = async (
        revisionId: number,
        competencyId: number
    ) => {
        try {
            setLoadingCompetencyDelete(true);
            setMessage("");
            setOpenMessage(false);

            const response =
                await deletePositionCompetency(
                    positionProfileId,
                    revisionId,
                    competencyId
                );

            await loadRevisionDetail(revisionId);

            setMessage(
                response.message ||
                "Competencia eliminada correctamente."
            );

            setMessageSeverity("success");
            setOpenMessage(true);
        } catch (error: unknown) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "Error al eliminar la competencia."
                )
            );

            setMessageSeverity("error");
            setOpenMessage(true);
        } finally {
            setLoadingCompetencyDelete(false);
        }
    };

    // Limpia el contenido seleccionado cuando cambia el perfil de cargo.
    useEffect(() => {
        setSelectedRevisionDetail(null);
        setDetailError("");
    }, [positionProfileId]);

    // Carga las revisiones al iniciar o cambiar el perfil.
    useEffect(() => {
        loadRevisions();
    }, [loadRevisions]);

    // Revisión activa en estado BORRADOR.
    const activeDraft =
        revisions.find(
            (revision) =>
                revision.status === "BORRADOR"
        ) ?? null;

    // Indica si el perfil ya tiene un borrador activo.
    const hasActiveDraft = Boolean(activeDraft);

    // Indica si la revisión seleccionada es editable.
    const selectedRevisionIsDraft =
        selectedRevisionDetail?.status ===
        "BORRADOR";

    // Indica si se está actualizando una revisión.
    const isEditingRevision =
        Boolean(editingRevision);

    // Indica si se está actualizando un requisito.
    const isEditingRequirement =
        Boolean(editingRequirement);

    // Indica si se está actualizando una competencia.
    const isEditingCompetency =
        Boolean(editingCompetency);

    // Indica si el formulario de revisión tiene cambios.
    const hasRevisionFormChanges = editingRevision
        ? revisionForm.changeObservation.trim() !==
        (editingRevision.changeObservation ?? "")
        : true;

    // Indica si el formulario de requisito tiene cambios.
    const hasRequirementFormChanges =
        editingRequirement
            ? requirementForm.description.trim() !==
            editingRequirement.description
            : requirementForm.description.trim() !== "";

    // Indica si el formulario de competencia tiene cambios.
    const hasCompetencyFormChanges =
        editingCompetency
            ? competencyForm.competency.trim() !==
            editingCompetency.competency
            : competencyForm.competency.trim() !== "";

    return {
        revisions,
        selectedRevisionDetail,

        activeDraft,
        hasActiveDraft,
        selectedRevisionIsDraft,

        editingRevision,
        revisionToDelete,
        revisionToPublish,

        selectedRequirementId,
        editingRequirement,
        requirementToDelete,

        competencyForm,
        competencyFormErrors,
        editingCompetency,

        revisionForm,
        revisionFormErrors,

        requirementForm,
        requirementFormErrors,

        openRevisionDialog,
        openDeleteRevisionDialog,
        openPublishRevisionDialog,
        openRequirementDialog,
        openDeleteRequirementDialog,
        openCompetencyDialog,

        loadingRevisions,
        loadingRevisionDetail,
        loadingRevisionSubmit,
        loadingRevisionDelete,
        loadingPublish,
        loadingRequirementSubmit,
        loadingRequirementDelete,
        loadingCompetencySubmit,
        loadingCompetencyDelete,

        loadError,
        detailError,

        message,
        openMessage,
        messageSeverity,

        isEditingRevision,
        isEditingRequirement,
        isEditingCompetency,

        hasRevisionFormChanges,
        hasRequirementFormChanges,
        hasCompetencyFormChanges,

        loadRevisions,
        loadRevisionDetail,

        handleChangeObservation,
        handleRequirementChange,
        handleCompetencyChange,
        handleCompetencyTypeChange,

        handleCreateCompetency,
        handleUpdateCompetency,
        handleSubmitCompetency,
        handleDeleteCompetency,

        openCreateRevisionDialog,
        openEditRevisionDialog,
        closeRevisionDialog,
        handleSubmitRevision,

        openDeleteRevisionConfirmation,
        closeDeleteRevisionConfirmation,
        handleDeleteRevision,

        openPublishRevisionConfirmation,
        closePublishRevisionConfirmation,
        handlePublishRevision,

        openCreateRequirementDialog,
        openEditRequirementDialog,
        closeRequirementDialog,
        handleSubmitRequirement,

        openCreateCompetencyDialog,
        openEditCompetencyDialog,
        closeCompetencyDialog,

        openDeleteRequirementConfirmation,
        closeDeleteRequirementConfirmation,
        handleDeleteRequirement,

        closeMessage,
        resetRevisionForm,
        resetRequirementForm,
        resetCompetencyForm,
    };
};
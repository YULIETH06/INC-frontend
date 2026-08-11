import {
    Alert,
    Box,
    Stack,
    Typography,
} from "@mui/material";

import { useNavigate, useSearchParams } from "react-router-dom";

import ActionButton from "../common/ActionButton";
import ConfirmActionDialog from "../common/ConfirmActionDialog";
import CustomChip from "../common/CustomChip";
import CustomSnackbar from "../common/CustomSnackbar";
import EmptyState from "../common/EmptyState";
import LoadingBox from "../common/LoadingBox";
import SectionCard from "../common/SectionCard";

import PositionProfileRevisionCard from "./PositionProfileRevisionCard";
import PositionProfileRevisionDialog from "./PositionProfileRevisionDialog";

import { usePositionProfileRevisions } from "../../hooks/positionManagemen/usePositionProfileRevisions";

interface PositionProfileRevisionsSectionProps {
    positionProfileId: number;
}

// Sección encargada de listar y gestionar las revisiones de un perfil de cargo.
const PositionProfileRevisionsSection = ({
    positionProfileId,
}: PositionProfileRevisionsSectionProps) => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const selectedRevisionId = Number(
        searchParams.get("revisionId")
    );

    const {
        revisions,

        activeDraft,
        hasActiveDraft,

        editingRevision,
        revisionToDelete,
        revisionToPublish,

        revisionForm,
        revisionFormErrors,

        openRevisionDialog,
        openDeleteRevisionDialog,
        openPublishRevisionDialog,

        loadingRevisions,
        loadingRevisionSubmit,
        loadingRevisionDelete,
        loadingPublish,

        loadError,

        message,
        openMessage,
        messageSeverity,

        isEditingRevision,
        hasRevisionFormChanges,

        handleChangeObservation,

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

        closeMessage,
    } = usePositionProfileRevisions({
        positionProfileId,
    });

    // Navega a la página independiente del detalle.
    const goToRevisionDetail = (
        revisionId: number
    ) => {
        const nextSearchParams =
            new URLSearchParams(searchParams);

        nextSearchParams.set(
            "positionProfileId",
            String(positionProfileId)
        );

        nextSearchParams.set(
            "revisionId",
            String(revisionId)
        );

        navigate(
            `/dashboard/position-management/position-profiles/${positionProfileId}/revisions/${revisionId}?${nextSearchParams.toString()}`
        );
    };

    return (
        <>
            <SectionCard
                title="Revisiones del perfil de cargo"
                actions={
                    <ActionButton
                        actionType="create"
                        tooltip={
                            hasActiveDraft
                                ? "Ya existe una revisión en borrador"
                                : "Crear una nueva revisión"
                        }
                        fullWidthOnMobile
                        onClick={
                            openCreateRevisionDialog
                        }
                        disabled={
                            hasActiveDraft ||
                            loadingRevisions ||
                            Boolean(loadError)
                        }
                    >
                        Crear revisión
                    </ActionButton>
                }
            >
                <Stack spacing={2.5}>
                    {/* Resumen */}
                    {!loadingRevisions &&
                        !loadError && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: {
                                        xs: "column",
                                        md: "row",
                                    },
                                    alignItems: {
                                        xs: "stretch",
                                        md: "center",
                                    },
                                    justifyContent:
                                        "space-between",
                                    gap: 2,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        alignItems:
                                            "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <CustomChip
                                        label={
                                            revisions.length ===
                                                1
                                                ? "1 revisión"
                                                : `${revisions.length} revisiones`
                                        }
                                        color="primary"
                                        variant="outlined"
                                    />

                                    {activeDraft && (
                                        <CustomChip
                                            label={`Borrador activo: revisión ${activeDraft.revisionNumber}`}
                                            color="warning"
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>
                            </Box>
                        )}

                    {/* Información sobre el borrador activo. */}
                    {!loadingRevisions &&
                        hasActiveDraft && (
                            <Alert severity="info">
                                El perfil ya tiene una
                                revisión en borrador.
                                Debes publicarla o
                                eliminarla antes de crear
                                otra.
                            </Alert>
                        )}

                    {/* Estado de carga. */}
                    {loadingRevisions && (
                        <LoadingBox
                            minHeight={180}
                            size={28}
                        />
                    )}

                    {/* Error al consultar las revisiones. */}
                    {!loadingRevisions &&
                        loadError && (
                            <Alert severity="error">
                                {loadError}
                            </Alert>
                        )}

                    {/* Estado vacío. */}
                    {!loadingRevisions &&
                        !loadError &&
                        revisions.length === 0 && (
                            <EmptyState
                                title="No hay revisiones registradas"
                                description="Crea la primera revisión del perfil de cargo para comenzar a registrar sus requisitos."
                            />
                        )}

                    {/* Listado de revisiones. */}
                    {!loadingRevisions &&
                        !loadError &&
                        revisions.length > 0 && (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        xl: "repeat(2, minmax(0, 1fr))",
                                    },
                                    gap: 2,
                                }}
                            >
                                {revisions.map(
                                    (revision) => (
                                        <PositionProfileRevisionCard
                                            key={
                                                revision.id
                                            }
                                            revision={
                                                revision
                                            }
                                            selected={
                                                selectedRevisionId ===
                                                revision.id
                                            }
                                            onSelect={(
                                                selectedRevision
                                            ) =>
                                                goToRevisionDetail(
                                                    selectedRevision.id
                                                )
                                            }
                                            onEdit={
                                                openEditRevisionDialog
                                            }
                                            onPublish={
                                                openPublishRevisionConfirmation
                                            }
                                            onDelete={
                                                openDeleteRevisionConfirmation
                                            }
                                        />
                                    )
                                )}
                            </Box>
                        )}
                </Stack>
            </SectionCard>

            {/* Formulario para crear o editar una revisión. */}
            <PositionProfileRevisionDialog
                open={openRevisionDialog}
                form={revisionForm}
                formErrors={revisionFormErrors}
                editingRevision={editingRevision}
                isEditing={isEditingRevision}
                hasFormChanges={
                    hasRevisionFormChanges
                }
                loadingSubmit={
                    loadingRevisionSubmit
                }
                onChangeObservation={
                    handleChangeObservation
                }
                onSubmit={handleSubmitRevision}
                onClose={closeRevisionDialog}
            />

            {/* Confirmación para eliminar una revisión. */}
            <ConfirmActionDialog
                open={openDeleteRevisionDialog}
                title="Eliminar revisión"
                message={
                    <>
                        Se eliminará la revisión{" "}
                        <Box
                            component="span"
                            sx={{
                                color:
                                    "text.primary",
                                fontWeight: 700,
                            }}
                        >
                            {revisionToDelete
                                ?.revisionNumber ?? ""}
                        </Box>
                        . Esta acción no se puede
                        deshacer.
                    </>
                }
                actionType="delete"
                confirmText="Eliminar"
                loading={loadingRevisionDelete}
                loadingText="Eliminando..."
                onClose={
                    closeDeleteRevisionConfirmation
                }
                onConfirm={handleDeleteRevision}
            />

            {/* Confirmación para publicar una revisión. */}
            <ConfirmActionDialog
                open={openPublishRevisionDialog}
                title="Publicar revisión"
                message={
                    <>
                        La revisión{" "}
                        <Box
                            component="span"
                            sx={{
                                color:
                                    "text.primary",
                                fontWeight: 700,
                            }}
                        >
                            {revisionToPublish
                                ?.revisionNumber ?? ""}
                        </Box>{" "}
                        será establecida como vigente.
                    </>
                }
                actionType="save"
                confirmText="Publicar"
                loading={loadingPublish}
                loadingText="Publicando..."
                infoSeverity="warning"
                infoContent={
                    <Typography variant="body2">
                        La revisión vigente anterior
                        pasará automáticamente a estado
                        obsoleto y esta revisión ya no
                        podrá editarse.
                    </Typography>
                }
                onClose={
                    closePublishRevisionConfirmation
                }
                onConfirm={handlePublishRevision}
            />

            <CustomSnackbar
                open={openMessage}
                message={message}
                severity={messageSeverity}
                onClose={closeMessage}
            />
        </>
    );
};

export default PositionProfileRevisionsSection;
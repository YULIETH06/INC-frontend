import { useEffect } from "react";

import {
    Alert,
    Box,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ActionButton from "../common/ActionButton";
import ConfirmActionDialog from "../common/ConfirmActionDialog";
import CustomChip from "../common/CustomChip";
import CustomSnackbar from "../common/CustomSnackbar";
import EmptyState from "../common/EmptyState";
import LoadingBox from "../common/LoadingBox";
import SectionCard from "../common/SectionCard";

import PositionProfileRevisionDialog from "./PositionProfileRevisionDialog";
import PositionRequirementCard from "./PositionRequirementCard";
import PositionRequirementDialog from "./PositionRequirementDialog";

import { usePositionProfileRevisions } from "../../hooks/positionManagemen/usePositionProfileRevisions";

import { formatDate } from "../../utils/common/dateUtils";

import type {
    PositionProfileRevisionStatus,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionProfileRevisionDetailSectionProps {
    positionProfileId: number;
    revisionId: number;
}

// Configuración visual de los estados de una revisión.
const revisionStatusConfig: Record<
    PositionProfileRevisionStatus,
    {
        label: string;
        color:
        | "warning"
        | "success"
        | "default";
    }
> = {
    BORRADOR: {
        label: "Borrador",
        color: "warning",
    },
    VIGENTE: {
        label: "Vigente",
        color: "success",
    },
    OBSOLETA: {
        label: "Obsoleta",
        color: "default",
    },
};

// Sección encargada de mostrar y gestionar el detalle de una revisión.
const PositionProfileRevisionDetailSection = ({
    positionProfileId,
    revisionId,
}: PositionProfileRevisionDetailSectionProps) => {
    const validIdentifiers =
        Number.isInteger(positionProfileId) &&
        positionProfileId > 0 &&
        Number.isInteger(revisionId) &&
        revisionId > 0;

    const {
        selectedRevisionDetail,

        selectedRevisionIsDraft,

        editingRevision,
        revisionToPublish,

        selectedRequirementId,
        requirementToDelete,

        revisionForm,
        revisionFormErrors,

        requirementForm,
        requirementFormErrors,

        openRevisionDialog,
        openPublishRevisionDialog,
        openRequirementDialog,
        openDeleteRequirementDialog,

        loadingRevisionDetail,
        loadingRevisionSubmit,
        loadingPublish,
        loadingRequirementSubmit,
        loadingRequirementDelete,

        detailError,

        message,
        openMessage,
        messageSeverity,

        isEditingRevision,
        isEditingRequirement,
        hasRevisionFormChanges,
        hasRequirementFormChanges,

        loadRevisionDetail,

        handleChangeObservation,
        handleRequirementChange,

        openEditRevisionDialog,
        closeRevisionDialog,
        handleSubmitRevision,

        openPublishRevisionConfirmation,
        closePublishRevisionConfirmation,
        handlePublishRevision,

        openCreateRequirementDialog,
        openEditRequirementDialog,
        closeRequirementDialog,
        handleSubmitRequirement,

        openDeleteRequirementConfirmation,
        closeDeleteRequirementConfirmation,
        handleDeleteRequirement,

        closeMessage,
    } = usePositionProfileRevisions({
        positionProfileId,
        enabled: validIdentifiers,
    });

    // Carga el detalle indicado en la ruta.
    useEffect(() => {
        if (!validIdentifiers) {
            return;
        }

        void loadRevisionDetail(revisionId);
    }, [
        validIdentifiers,
        revisionId,
        loadRevisionDetail,
    ]);

    // Busca el nombre del requisito seleccionado.
    const selectedRequirementName =
        selectedRevisionDetail?.requirements.find(
            (requirement) =>
                requirement.id ===
                selectedRequirementId
        )?.name ?? "";

    // Identifica los tipos de requisito que aún no tienen requisitos registrados.
    const incompleteRequirements =
        selectedRevisionDetail?.requirements.filter(
            (requirement) =>
                requirement.descriptions.length === 0
        ) ?? [];

    const hasIncompleteRequirements =
        incompleteRequirements.length > 0;

    const selectedRevisionStatus =
        selectedRevisionDetail
            ? revisionStatusConfig[
            selectedRevisionDetail.status
            ]
            : null;

    const canManageRevision =
        selectedRevisionIsDraft &&
        !loadingRevisionDetail &&
        !detailError;

    if (!validIdentifiers) {
        return (
            <Alert severity="error">
                Los identificadores del perfil de cargo o de
                la revisión no son válidos.
            </Alert>
        );
    }

    return (
        <>
            {loadingRevisionDetail && (
                <LoadingBox
                    minHeight={220}
                    size={30}
                />
            )}

            {!loadingRevisionDetail &&
                detailError && (
                    <Alert severity="error">
                        {detailError}
                    </Alert>
                )}

            {!loadingRevisionDetail &&
                !detailError &&
                !selectedRevisionDetail && (
                    <EmptyState
                        title="Revisión no disponible"
                        description="No fue posible encontrar la revisión seleccionada."
                    />
                )}

            {!loadingRevisionDetail &&
                !detailError &&
                selectedRevisionDetail && (
                    <SectionCard
                        title={`Revisión ${selectedRevisionDetail.revisionNumber}`}
                        subtitle={`${selectedRevisionDetail.positionProfile.code} · ${selectedRevisionDetail.positionProfile.name}`}
                    >
                        <Stack spacing={2.5}>
                            {/* Estado, fechas y acciones principales. */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: {
                                        xs: "column",
                                        md: "row",
                                    },
                                    alignItems: {
                                        xs: "stretch",
                                        md: "flex-start",
                                    },
                                    justifyContent:
                                        "space-between",
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                            alignItems:
                                                "center",
                                            flexWrap: "wrap",
                                            mb: 1,
                                        }}
                                    >
                                        {selectedRevisionStatus && (
                                            <CustomChip
                                                label={
                                                    selectedRevisionStatus.label
                                                }
                                                color={
                                                    selectedRevisionStatus.color
                                                }
                                                variant="outlined"
                                            />
                                        )}

                                        <CustomChip
                                            label={
                                                selectedRevisionDetail
                                                    .requirements
                                                    .length ===
                                                    1
                                                    ? "1 requisito"
                                                    : `${selectedRevisionDetail.requirements.length} requisitos`
                                            }
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                "text.secondary",
                                        }}
                                    >
                                        Fecha de revisión:{" "}
                                        {formatDate(
                                            selectedRevisionDetail.revisionDate
                                        )}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                "text.secondary",
                                        }}
                                    >
                                        Última actualización:{" "}
                                        {formatDate(
                                            selectedRevisionDetail.updatedAt
                                        )}
                                    </Typography>
                                </Box>

                                {selectedRevisionIsDraft && (
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={1}
                                    >
                                        <ActionButton
                                            actionType="edit"
                                            tooltip="Editar observación"
                                            fullWidthOnMobile
                                            onClick={() =>
                                                openEditRevisionDialog(
                                                    selectedRevisionDetail
                                                )
                                            }
                                        >
                                            Editar observación
                                        </ActionButton>

                                        <ActionButton
                                            actionType="save"
                                            tooltip={
                                                hasIncompleteRequirements
                                                    ? "Todos los tipos de requisito deben tener al menos un requisito registrado para poder publicar la revisión."
                                                    : "Publicar revisión"
                                            }
                                            fullWidthOnMobile
                                            onClick={() =>
                                                openPublishRevisionConfirmation(
                                                    selectedRevisionDetail
                                                )
                                            }
                                            disabled={
                                                hasIncompleteRequirements
                                            }
                                        >
                                            Publicar revisión
                                        </ActionButton>
                                    </Stack>
                                )}
                            </Box>

                            {/* Observación de la revisión. */}
                            <Box
                                sx={{
                                    p: 2,
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    bgcolor:
                                        "background.default",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        mb: 0.5,
                                        color:
                                            "text.secondary",
                                        fontWeight: 700,
                                    }}
                                >
                                    Observación del cambio
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        whiteSpace:
                                            "pre-wrap",
                                        overflowWrap:
                                            "anywhere",
                                        color:
                                            selectedRevisionDetail.changeObservation
                                                ? "text.primary"
                                                : "text.secondary",
                                        fontStyle:
                                            selectedRevisionDetail.changeObservation
                                                ? "normal"
                                                : "italic",
                                    }}
                                >
                                    {selectedRevisionDetail.changeObservation ??
                                        "Sin observación registrada."}
                                </Typography>
                            </Box>

                            {/* Aviso para revisiones no editables. */}
                            {!selectedRevisionIsDraft && (
                                <Alert severity="info">
                                    Esta revisión es únicamente
                                    de consulta. Las revisiones
                                    vigentes u obsoletas no
                                    pueden modificarse.
                                </Alert>
                            )}

                            {/* Aviso de requisitos incompletos. */}
                            {selectedRevisionIsDraft &&
                                hasIncompleteRequirements && (
                                    <Alert severity="warning">
                                        Para publicar esta revisión debes registrar al menos un requisito en:{" "}
                                        <Box
                                            component="span"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            {incompleteRequirements
                                                .map(
                                                    (
                                                        requirement
                                                    ) =>
                                                        requirement.name
                                                )
                                                .join(", ")}
                                        </Box>
                                        .
                                    </Alert>
                                )}

                            <Divider />

                            {/* Requisitos del perfil de cargo. */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr",
                                    gap: 2,
                                }}
                            >
                                {selectedRevisionDetail.requirements.map(
                                    (requirement) => (
                                        <PositionRequirementCard
                                            key={
                                                requirement.id
                                            }
                                            requirement={
                                                requirement
                                            }
                                            canManage={
                                                canManageRevision
                                            }
                                            onCreateRequirement={
                                                openCreateRequirementDialog
                                            }
                                            onEditRequirement={
                                                openEditRequirementDialog
                                            }
                                            onDeleteRequirement={
                                                openDeleteRequirementConfirmation
                                            }
                                        />
                                    )
                                )}
                            </Box>
                        </Stack>
                    </SectionCard>
                )}

            {/* Formulario para actualizar la observación. */}
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

            {/* Formulario para crear o editar un requisito. */}
            <PositionRequirementDialog
                open={openRequirementDialog}
                requirementName={
                    selectedRequirementName
                }
                form={requirementForm}
                formErrors={
                    requirementFormErrors
                }
                isEditing={
                    isEditingRequirement
                }
                hasFormChanges={
                    hasRequirementFormChanges
                }
                loadingSubmit={
                    loadingRequirementSubmit
                }
                onRequirementChange={
                    handleRequirementChange
                }
                onSubmit={
                    handleSubmitRequirement
                }
                onClose={
                    closeRequirementDialog
                }
            />

            {/* Confirmación para publicar la revisión. */}
            <ConfirmActionDialog
                open={
                    openPublishRevisionDialog
                }
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
                onConfirm={
                    handlePublishRevision
                }
            />

            {/* Confirmación para eliminar un requisito. */}
            <ConfirmActionDialog
                open={
                    openDeleteRequirementDialog
                }
                title="Eliminar requisito"
                message="Se eliminará el requisito seleccionado. Esta acción no se puede deshacer."
                actionType="delete"
                confirmText="Eliminar"
                loading={
                    loadingRequirementDelete
                }
                loadingText="Eliminando..."
                infoContent={
                    requirementToDelete ? (
                        <Typography
                            variant="body2"
                            sx={{
                                whiteSpace:
                                    "pre-wrap",
                                overflowWrap:
                                    "anywhere",
                            }}
                        >
                            {
                                requirementToDelete
                                    .requirement
                                    .description
                            }
                        </Typography>
                    ) : undefined
                }
                onClose={
                    closeDeleteRequirementConfirmation
                }
                onConfirm={
                    handleDeleteRequirement
                }
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

export default PositionProfileRevisionDetailSection;
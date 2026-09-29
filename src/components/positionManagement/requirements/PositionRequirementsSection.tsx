import { useEffect } from "react";

import {
    Alert,
    Box,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

import ConfirmActionDialog from "../../common/ConfirmActionDialog";
import CustomChip from "../../common/CustomChip";
import CustomSnackbar from "../../common/CustomSnackbar";
import EmptyState from "../../common/EmptyState";
import LoadingBox from "../../common/LoadingBox";
import SectionCard from "../../common/SectionCard";

import PositionRevisionEntryCard from "../shared/PositionRevisionEntryCard";
import PositionRevisionEntrySection from "../shared/PositionRevisionEntrySection";

import PositionRequirementDialog from "./PositionRequirementDialog";

import { usePositionProfileRevisions } from "../../../hooks/positionManagemen/usePositionProfileRevisions";

import type {
    PositionRequirement,
} from "../../../interfaces/positionManagement/positionProfileRevision.interface";
import { revisionStatusConfig } from "../../../utils/positionManagement/revisionStatus";

interface PositionRequirementsSectionProps {
    positionProfileId: number;
    revisionId: number;
}

// Sección encargada de consultar y gestionar
// los requisitos de una revisión específica.
const PositionRequirementsSection = ({
    positionProfileId,
    revisionId,
}: PositionRequirementsSectionProps) => {
    const validIdentifiers =
        Number.isInteger(positionProfileId) &&
        positionProfileId > 0 &&
        Number.isInteger(revisionId) &&
        revisionId > 0;

    const {
        selectedRevisionDetail,
        selectedRevisionIsDraft,

        selectedRequirementId,
        requirementToDelete,

        requirementForm,
        requirementFormErrors,

        openRequirementDialog,
        openDeleteRequirementDialog,

        loadingRevisionDetail,
        loadingRequirementSubmit,
        loadingRequirementDelete,

        detailError,

        message,
        openMessage,
        messageSeverity,

        isEditingRequirement,
        hasRequirementFormChanges,

        loadRevisionDetail,

        handleRequirementChange,

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

    // Carga el detalle de la revisión seleccionada.
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

    // Busca el nombre del tipo de requisito seleccionado.
    const selectedRequirementName =
        selectedRevisionDetail?.requirements.find(
            (requirement) =>
                requirement.id ===
                selectedRequirementId
        )?.name ?? "";

    // Determina si la revisión puede ser modificada.
    const canManageRevision =
        selectedRevisionIsDraft &&
        !loadingRevisionDetail &&
        !detailError;

    // Tipos de requisito que todavía no tienen
    // ninguna descripción registrada.
    const incompleteRequirements =
        selectedRevisionDetail?.requirements.filter(
            (requirement) =>
                requirement.descriptions.length === 0
        ) ?? [];

    const hasIncompleteRequirements =
        incompleteRequirements.length > 0;

    // Cantidad total de requisitos registrados.
    const totalRequirements =
        selectedRevisionDetail?.requirements.reduce(
            (total, requirement) =>
                total +
                requirement.descriptions.length,
            0
        ) ?? 0;

    const totalRequirementsLabel =
        totalRequirements === 1
            ? "1 requisito"
            : `${totalRequirements} requisitos`;

    // Estado visual de la revisión.
    const selectedRevisionStatus =
        selectedRevisionDetail
            ? revisionStatusConfig[
            selectedRevisionDetail.status
            ]
            : null;

    if (!validIdentifiers) {
        return (
            <Alert severity="error">
                Los identificadores del perfil de cargo
                o de la revisión no son válidos.
            </Alert>
        );
    }

    return (
        <>
            {/* Estado de carga. */}
            {loadingRevisionDetail && (
                <LoadingBox
                    minHeight={220}
                    size={30}
                />
            )}

            {/* Error de consulta. */}
            {!loadingRevisionDetail &&
                detailError && (
                    <Alert severity="error">
                        {detailError}
                    </Alert>
                )}

            {/* Revisión no encontrada. */}
            {!loadingRevisionDetail &&
                !detailError &&
                !selectedRevisionDetail && (
                    <EmptyState
                        title="Revisión no disponible"
                        description="No fue posible encontrar la revisión seleccionada."
                    />
                )}

            {/* Contenido de requisitos. */}
            {!loadingRevisionDetail &&
                !detailError &&
                selectedRevisionDetail && (
                    <SectionCard
                        title={`Requisitos de la revisión ${selectedRevisionDetail.revisionNumber}`}
                        titleAdornment={
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems:
                                        "center",
                                    flexWrap:
                                        "wrap",
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
                                        totalRequirementsLabel
                                    }
                                    color="primary"
                                    variant="outlined"
                                />
                            </Stack>
                        }
                        subtitle={`${selectedRevisionDetail.positionProfile.code} · ${selectedRevisionDetail.positionProfile.name}`}
                    >
                        <Stack spacing={2.5}>
                            {/* Estado de consulta. */}
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
                                        Para publicar esta revisión
                                        debes registrar al menos un
                                        requisito en:
                                        {" "}

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

                            {selectedRevisionDetail
                                .requirements.length ===
                                0 ? (
                                <EmptyState
                                    title="No hay requisitos"
                                    description="No existen tipos de requisitos configurados para esta revisión."
                                />
                            ) : (
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr",
                                        gap: 2,
                                    }}
                                >
                                    {selectedRevisionDetail.requirements.map(
                                        (
                                            requirement: PositionRequirement
                                        ) => (
                                            <PositionRevisionEntrySection
                                                key={
                                                    requirement.id
                                                }
                                                icon={
                                                    <FactCheckOutlinedIcon />
                                                }
                                                title={
                                                    requirement.name
                                                }
                                                subtitle="Información requerida para el perfil de cargo."
                                                countLabel={
                                                    requirement
                                                        .descriptions
                                                        .length ===
                                                        1
                                                        ? "1 requisito"
                                                        : `${requirement.descriptions.length} requisitos`
                                                }
                                                entries={
                                                    requirement.descriptions
                                                }
                                                canManage={
                                                    canManageRevision
                                                }
                                                emptyMessage="No hay requisitos registrados para este tipo de requisito."
                                                emptyHint="Agrega al menos un requisito antes de publicar la revisión."
                                                addTooltip="Agregar requisito"
                                                onAdd={() =>
                                                    openCreateRequirementDialog(
                                                        requirement.id
                                                    )
                                                }
                                                renderEntry={(
                                                    requirementItem,
                                                    index
                                                ) => (
                                                    <PositionRevisionEntryCard
                                                        key={
                                                            requirementItem.id
                                                        }
                                                        label={`Requisito ${index +
                                                            1
                                                            }`}
                                                        content={
                                                            requirementItem.description
                                                        }
                                                        updatedAt={
                                                            requirementItem.updatedAt
                                                        }
                                                        canManage={
                                                            canManageRevision
                                                        }
                                                        editTooltip="Editar requisito"
                                                        deleteTooltip="Eliminar requisito"
                                                        onEdit={() =>
                                                            openEditRequirementDialog(
                                                                requirement.id,
                                                                requirementItem
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            openDeleteRequirementConfirmation(
                                                                requirement.id,
                                                                requirementItem
                                                            )
                                                        }
                                                    />
                                                )}
                                            />
                                        )
                                    )}
                                </Box>
                            )}
                        </Stack>
                    </SectionCard>
                )}

            {/* Diálogo para crear o editar requisitos. */}
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

            {/* Mensajes de operación. */}
            <CustomSnackbar
                open={openMessage}
                message={message}
                severity={messageSeverity}
                onClose={closeMessage}
            />
        </>
    );
};

export default PositionRequirementsSection;
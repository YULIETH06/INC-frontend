import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

import ConfirmActionDialog from "../../common/ConfirmActionDialog";
import CustomSnackbar from "../../common/CustomSnackbar";
import EmptyState from "../../common/EmptyState";
import LoadingBox from "../../common/LoadingBox";
import SectionCard from "../../common/SectionCard";
import CustomChip from "../../common/CustomChip";

import PositionRevisionEntryCard from "../shared/PositionRevisionEntryCard";
import PositionRevisionEntrySection from "../shared/PositionRevisionEntrySection";

import PositionCompetencyDialog from "./PositionCompetencyDialog";


import type {
    PositionCompetency,
} from "../../../interfaces/positionManagement/positionProfileRevision.interface";
import { revisionStatusConfig } from "../../../utils/positionManagement/revisionStatus";
import { usePositionProfileRevisions } from "../../../hooks/positionManagemen/usePositionProfileRevisions";

interface PositionCompetenciesSectionProps {
    positionProfileId: number;
    revisionId: number;
}

// Sección encargada de consultar y gestionar
// las competencias de una revisión específica.
const PositionCompetenciesSection = ({
    positionProfileId,
    revisionId,
}: PositionCompetenciesSectionProps) => {
    const validIdentifiers =
        Number.isInteger(positionProfileId) &&
        positionProfileId > 0 &&
        Number.isInteger(revisionId) &&
        revisionId > 0;

    const {
        selectedRevisionDetail,
        selectedRevisionIsDraft,

        competencyForm,
        competencyFormErrors,
        editingCompetency,

        openCompetencyDialog,

        loadingRevisionDetail,
        loadingCompetencySubmit,
        loadingCompetencyDelete,

        detailError,

        message,
        openMessage,
        messageSeverity,

        isEditingCompetency,
        hasCompetencyFormChanges,

        loadRevisionDetail,

        handleCompetencyChange,
        handleCompetencyTypeChange,
        handleSubmitCompetency,
        handleDeleteCompetency,

        openCreateCompetencyDialog,
        openEditCompetencyDialog,
        closeCompetencyDialog,

        closeMessage,
    } = usePositionProfileRevisions({
        positionProfileId,
        enabled: validIdentifiers,
    });

    // Competencia seleccionada para eliminar.
    const [
        competencyToDelete,
        setCompetencyToDelete,
    ] = useState<PositionCompetency | null>(null);

    // Controla la confirmación de eliminación.
    const [
        openDeleteCompetencyDialog,
        setOpenDeleteCompetencyDialog,
    ] = useState(false);

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

    // Determina si la revisión puede ser modificada.
    const canManageRevision =
        selectedRevisionIsDraft &&
        !loadingRevisionDetail &&
        !detailError;

    // Tipos de competencia que todavía no tienen
    // ninguna competencia registrada.
    const incompleteCompetencyTypes =
        selectedRevisionDetail?.competencies.filter(
            (competencyType) =>
                competencyType
                    .positionCompetencyDescriptions
                    .length === 0
        ) ?? [];

    const hasIncompleteCompetencies =
        incompleteCompetencyTypes.length > 0;

    // Cantidad total de competencias registradas.
    const totalCompetencies =
        selectedRevisionDetail?.competencies.reduce(
            (total, competencyType) =>
                total +
                competencyType
                    .positionCompetencyDescriptions
                    .length,
            0
        ) ?? 0;

    const totalCompetenciesLabel =
        totalCompetencies === 1
            ? "1 competencia"
            : `${totalCompetencies} competencias`;

    // Estado visual de la revisión.
    const selectedRevisionStatus =
        selectedRevisionDetail
            ? revisionStatusConfig[
            selectedRevisionDetail.status
            ]
            : null;

    // Abre la confirmación de eliminación.
    const openDeleteCompetencyConfirmation = (
        competency: PositionCompetency
    ) => {
        setCompetencyToDelete(competency);
        setOpenDeleteCompetencyDialog(true);
    };

    // Cierra la confirmación de eliminación.
    const closeDeleteCompetencyConfirmation = () => {
        if (loadingCompetencyDelete) {
            return;
        }

        setCompetencyToDelete(null);
        setOpenDeleteCompetencyDialog(false);
    };

    // Ejecuta la eliminación de la competencia.
    const confirmDeleteCompetency = async () => {
        if (!competencyToDelete) {
            return;
        }

        await handleDeleteCompetency(
            revisionId,
            competencyToDelete.id
        );

        setCompetencyToDelete(null);
        setOpenDeleteCompetencyDialog(false);
    };

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

            {/* Contenido de competencias. */}
            {!loadingRevisionDetail &&
                !detailError &&
                selectedRevisionDetail && (
                    <SectionCard
                        title={`Competencias de la revisión ${selectedRevisionDetail.revisionNumber}`}
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
                                        totalCompetenciesLabel
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

                            {/* Aviso de competencias incompletas. */}
                            {selectedRevisionIsDraft &&
                                hasIncompleteCompetencies && (
                                    <Alert severity="warning">
                                        Para publicar esta revisión
                                        debes registrar al menos una
                                        competencia en:
                                        {" "}

                                        <Box
                                            component="span"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            {incompleteCompetencyTypes
                                                .map(
                                                    (
                                                        competencyType
                                                    ) =>
                                                        competencyType.name
                                                )
                                                .join(", ")}
                                        </Box>
                                        .
                                    </Alert>
                                )}

                            <Divider />

                            {/* Competencias agrupadas por tipo. */}
                            {selectedRevisionDetail
                                .competencies.length ===
                                0 ? (
                                <EmptyState
                                    title="No hay competencias"
                                    description="No existen tipos de competencias configurados para esta revisión."
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
                                    {selectedRevisionDetail.competencies.map(
                                        (
                                            competencyType
                                        ) => (
                                            <PositionRevisionEntrySection
                                                key={
                                                    competencyType.id
                                                }
                                                icon={
                                                    <PsychologyOutlinedIcon />
                                                }
                                                title={
                                                    competencyType.name
                                                }
                                                subtitle="Competencias asociadas a este tipo."
                                                countLabel={
                                                    competencyType
                                                        .positionCompetencyDescriptions
                                                        .length ===
                                                        1
                                                        ? "1 competencia"
                                                        : `${competencyType.positionCompetencyDescriptions.length} competencias`
                                                }
                                                entries={
                                                    competencyType.positionCompetencyDescriptions
                                                }
                                                canManage={
                                                    canManageRevision
                                                }
                                                emptyMessage="No hay competencias registradas para este tipo."
                                                emptyHint="Agrega al menos una competencia antes de publicar la revisión."
                                                addTooltip="Agregar competencia"
                                                onAdd={() =>
                                                    openCreateCompetencyDialog(
                                                        competencyType.id
                                                    )
                                                }
                                                renderEntry={(
                                                    competency,
                                                    index
                                                ) => (
                                                    <PositionRevisionEntryCard
                                                        key={
                                                            competency.id
                                                        }
                                                        label={`Competencia ${index +
                                                            1
                                                            }`}
                                                        content={
                                                            competency.competency
                                                        }
                                                        updatedAt={
                                                            competency.updatedAt
                                                        }
                                                        canManage={
                                                            canManageRevision
                                                        }
                                                        editTooltip="Editar competencia"
                                                        deleteTooltip="Eliminar competencia"
                                                        onEdit={() =>
                                                            openEditCompetencyDialog(
                                                                competency
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            openDeleteCompetencyConfirmation(
                                                                competency
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

            {/* Formulario para crear o editar una competencia. */}
            <PositionCompetencyDialog
                open={openCompetencyDialog}
                competencyTypes={
                    selectedRevisionDetail?.competencies ??
                    []
                }
                form={competencyForm}
                formErrors={
                    competencyFormErrors
                }
                editingCompetency={
                    editingCompetency
                }
                isEditing={
                    isEditingCompetency
                }
                hasFormChanges={
                    hasCompetencyFormChanges
                }
                loadingSubmit={
                    loadingCompetencySubmit
                }
                onCompetencyTypeChange={
                    handleCompetencyTypeChange
                }
                onCompetencyChange={
                    handleCompetencyChange
                }
                onSubmit={(event) =>
                    handleSubmitCompetency(
                        event,
                        revisionId
                    )
                }
                onClose={
                    closeCompetencyDialog
                }
            />

            {/* Confirmación para eliminar una competencia. */}
            <ConfirmActionDialog
                open={
                    openDeleteCompetencyDialog
                }
                title="Eliminar competencia"
                message="Se eliminará la competencia seleccionada. Esta acción no se puede deshacer."
                actionType="delete"
                confirmText="Eliminar"
                loading={
                    loadingCompetencyDelete
                }
                loadingText="Eliminando..."
                infoContent={
                    competencyToDelete ? (
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
                                competencyToDelete.competency
                            }
                        </Typography>
                    ) : undefined
                }
                onClose={
                    closeDeleteCompetencyConfirmation
                }
                onConfirm={
                    confirmDeleteCompetency
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

export default PositionCompetenciesSection;
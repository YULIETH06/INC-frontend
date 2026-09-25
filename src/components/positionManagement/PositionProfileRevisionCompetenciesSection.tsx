import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

import CustomChip from "../common/CustomChip";
import EmptyState from "../common/EmptyState";
import LoadingBox from "../common/LoadingBox";
import SectionCard from "../common/SectionCard";
import ActionButton from "../common/ActionButton";
import ConfirmActionDialog from "../common/ConfirmActionDialog";
import CustomSnackbar from "../common/CustomSnackbar";

import PositionCompetencyCard from "./PositionCompetencyCard";
import PositionCompetencyDialog from "./PositionCompetencyDialog";

import { usePositionProfileRevisions } from "../../hooks/positionManagemen/usePositionProfileRevisions";

import { formatDate } from "../../utils/common/dateUtils";

import type {
    PositionCompetency,
    PositionProfileRevisionStatus,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionProfileRevisionCompetenciesSectionProps {
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

// Sección encargada de mostrar las competencias agrupadas por tipo.
const PositionProfileRevisionCompetenciesSection = ({
    positionProfileId,
    revisionId,
}: PositionProfileRevisionCompetenciesSectionProps) => {
    const [
        competencyToDelete,
        setCompetencyToDelete,
    ] = useState<PositionCompetency | null>(null);

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

    // Carga el detalle de la revisión indicada en la ruta.
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

    // Abre la confirmación para eliminar una competencia.
    const openDeleteCompetencyConfirmation = (
        competency: PositionCompetency
    ) => {
        setCompetencyToDelete(competency);
    };

    // Cierra la confirmación de eliminación de una competencia.
    const closeDeleteCompetencyConfirmation = () => {
        if (loadingCompetencyDelete) {
            return;
        }

        setCompetencyToDelete(null);
    };

    // Ejecuta la eliminación lógica de la competencia seleccionada.
    const handleDeleteCompetencyConfirmation = async () => {
        if (!competencyToDelete) {
            return;
        }

        await handleDeleteCompetency(
            revisionId,
            competencyToDelete.id
        );

        setCompetencyToDelete(null);
    };

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
                    <>
                        {/* Tarjeta principal de la revisión. */}
                        <SectionCard
                            title={`Revisión ${selectedRevisionDetail.revisionNumber}`}
                            subtitle={`${selectedRevisionDetail.positionProfile.code} · ${selectedRevisionDetail.positionProfile.name}`}
                        >
                            <Stack spacing={2.5}>
                                {/* Información general de la revisión. */}
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
                                                flexWrap:
                                                    "wrap",
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
                                                    selectedRevisionDetail.competencies.reduce(
                                                        (
                                                            total,
                                                            type
                                                        ) =>
                                                            total +
                                                            type
                                                                .positionCompetencyDescriptions
                                                                .length,
                                                        0
                                                    ) === 1
                                                        ? "1 competencia"
                                                        : `${selectedRevisionDetail.competencies.reduce(
                                                            (
                                                                total,
                                                                type
                                                            ) =>
                                                                total +
                                                                type
                                                                    .positionCompetencyDescriptions
                                                                    .length,
                                                            0
                                                        )} competencias`
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

                                <Divider />

                                {/* Competencias agrupadas por tipo. */}
                                {selectedRevisionDetail
                                    .competencies.length === 0 ? (
                                    <EmptyState
                                        title="Sin competencias"
                                        description="La revisión seleccionada no tiene competencias registradas."
                                    />
                                ) : (
                                    <Stack spacing={2.5}>
                                        {selectedRevisionDetail.competencies.map(
                                            (
                                                competencyType
                                            ) => (
                                                <Card
                                                    key={
                                                        competencyType.id
                                                    }
                                                    variant="outlined"
                                                    sx={{
                                                        height: "100%",
                                                        borderRadius: 2,
                                                        transition:
                                                            "border-color 0.2s ease, box-shadow 0.2s ease",
                                                        "&:hover": {
                                                            borderColor:
                                                                "primary.main",
                                                            boxShadow: 2,
                                                        },
                                                    }}
                                                >
                                                    <CardContent
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            flexDirection:
                                                                "column",
                                                            height: "100%",
                                                            p: 2.5,
                                                            "&:last-child":
                                                            {
                                                                pb: 2.5,
                                                            },
                                                        }}
                                                    >
                                                        <Stack
                                                            spacing={
                                                                2
                                                            }
                                                            sx={{
                                                                height:
                                                                    "100%",
                                                            }}
                                                        >
                                                            {/* Encabezado del tipo de competencia. */}
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                    {
                                                                        xs: "column",
                                                                        sm: "row",
                                                                    },
                                                                    alignItems:
                                                                    {
                                                                        xs: "stretch",
                                                                        sm: "center",
                                                                    },
                                                                    justifyContent:
                                                                        "space-between",
                                                                    gap: 2,
                                                                }}
                                                            >
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={
                                                                        1.5
                                                                    }
                                                                    sx={{
                                                                        alignItems:
                                                                            "center",
                                                                        minWidth:
                                                                            0,
                                                                    }}
                                                                >
                                                                    <PsychologyOutlinedIcon
                                                                        sx={{
                                                                            color: "primary.main",
                                                                            flexShrink: 0,
                                                                        }}
                                                                    />

                                                                    <Box
                                                                        sx={{
                                                                            minWidth:
                                                                                0,
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                            }}
                                                                        >
                                                                            {
                                                                                competencyType.name
                                                                            }
                                                                        </Typography>

                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                color:
                                                                                    "text.secondary",
                                                                            }}
                                                                        >
                                                                            Competencias
                                                                            asociadas
                                                                            a este
                                                                            tipo.
                                                                        </Typography>
                                                                    </Box>
                                                                </Stack>

                                                                <Stack
                                                                    direction={{
                                                                        xs: "column",
                                                                        sm: "row",
                                                                    }}
                                                                    spacing={
                                                                        1
                                                                    }
                                                                    sx={{
                                                                        alignItems:
                                                                        {
                                                                            xs: "stretch",
                                                                            sm: "center",
                                                                        },
                                                                    }}
                                                                >
                                                                    <CustomChip
                                                                        label={
                                                                            competencyType
                                                                                .positionCompetencyDescriptions
                                                                                .length ===
                                                                                1
                                                                                ? "1 competencia"
                                                                                : `${competencyType.positionCompetencyDescriptions.length} competencias`
                                                                        }
                                                                        color="primary"
                                                                        variant="outlined"
                                                                    />

                                                                    {canManageRevision && (
                                                                        <ActionButton
                                                                            actionType="create"
                                                                            tooltip="Agregar competencia"
                                                                            fullWidthOnMobile
                                                                            onClick={() =>
                                                                                openCreateCompetencyDialog(
                                                                                    competencyType.id
                                                                                )
                                                                            }
                                                                        >
                                                                            Agregar
                                                                        </ActionButton>
                                                                    )}
                                                                </Stack>
                                                            </Box>

                                                            <Divider />

                                                            {/* Competencias pertenecientes al tipo. */}
                                                            {competencyType
                                                                .positionCompetencyDescriptions
                                                                .length ===
                                                                0 ? (
                                                                <Box
                                                                    sx={{
                                                                        p: 2.5,
                                                                        border: 1,
                                                                        borderStyle:
                                                                            "dashed",
                                                                        borderColor:
                                                                            "divider",
                                                                        borderRadius: 2,
                                                                        textAlign:
                                                                            "center",
                                                                        bgcolor:
                                                                            "background.default",
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color:
                                                                                "text.secondary",
                                                                        }}
                                                                    >
                                                                        No
                                                                        hay
                                                                        competencias
                                                                        registradas
                                                                        para
                                                                        este
                                                                        tipo.
                                                                    </Typography>

                                                                    {canManageRevision && (
                                                                        <Typography
                                                                            variant="caption"
                                                                            sx={{
                                                                                display:
                                                                                    "block",
                                                                                mt: 0.5,
                                                                                color:
                                                                                    "text.secondary",
                                                                            }}
                                                                        >
                                                                            Agrega
                                                                            al
                                                                            menos
                                                                            una
                                                                            competencia
                                                                            antes
                                                                            de
                                                                            publicar
                                                                            la
                                                                            revisión.
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "grid",
                                                                        gridTemplateColumns:
                                                                            "1fr",
                                                                        gap: 2,
                                                                    }}
                                                                >
                                                                    {competencyType.positionCompetencyDescriptions.map(
                                                                        (
                                                                            competency
                                                                        ) => (
                                                                            <PositionCompetencyCard
                                                                                key={
                                                                                    competency.id
                                                                                }
                                                                                competency={
                                                                                    competency
                                                                                }
                                                                                canManage={
                                                                                    canManageRevision
                                                                                }
                                                                                onEdit={(
                                                                                    competency
                                                                                ) => {
                                                                                    openEditCompetencyDialog(
                                                                                        competency
                                                                                    );
                                                                                }}
                                                                                onDelete={
                                                                                    openDeleteCompetencyConfirmation
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            )
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        </SectionCard>

                        {/* Formulario para crear o actualizar una competencia. */}
                        <PositionCompetencyDialog
                            open={openCompetencyDialog}
                            competencyTypes={
                                selectedRevisionDetail?.competencies ??
                                []
                            }
                            form={competencyForm}
                            formErrors={competencyFormErrors}
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
                            onSubmit={(event) => {
                                void handleSubmitCompetency(
                                    event,
                                    revisionId
                                );
                            }}
                            onClose={
                                closeCompetencyDialog
                            }
                        />

                        {/* Confirmación para eliminar una competencia. */}
                        <ConfirmActionDialog
                            open={Boolean(
                                competencyToDelete
                            )}
                            title="Eliminar competencia"
                            message={
                                <>
                                    Se eliminará la competencia{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            color:
                                                "text.primary",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {competencyToDelete?.competency ??
                                            ""}
                                    </Box>
                                    . Esta acción no se puede
                                    deshacer.
                                </>
                            }
                            actionType="delete"
                            confirmText="Eliminar"
                            loading={
                                loadingCompetencyDelete
                            }
                            loadingText="Eliminando..."
                            onClose={
                                closeDeleteCompetencyConfirmation
                            }
                            onConfirm={
                                handleDeleteCompetencyConfirmation
                            }
                        />

                        {/* Mensajes de resultado de las operaciones. */}
                        <CustomSnackbar
                            open={openMessage}
                            message={message}
                            severity={messageSeverity}
                            onClose={closeMessage}
                        />
                    </>
                )}
        </>
    );
};

export default PositionProfileRevisionCompetenciesSection;
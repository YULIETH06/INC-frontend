import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";
import ConfirmActionDialog from "../../common/ConfirmActionDialog";
import CustomChip from "../../common/CustomChip";
import CustomSnackbar from "../../common/CustomSnackbar";
import EmptyState from "../../common/EmptyState";
import LoadingBox from "../../common/LoadingBox";
import InfoTooltip from "../../common/InfoTooltip";
import SectionCard from "../../common/SectionCard";
import IconActionButton from "../../common/IconActionButton";

import PersonnelCandidateSubmissionBatchesDialog from "./PersonnelCandidateSubmissionBatchesDialog";
import PersonnelCandidateSubmissionHistorySection from "./PersonnelCandidateSubmissionHistorySection";
import PersonnelRequisitionCandidateCard from "./PersonnelRequisitionCandidateCard";
import PersonnelRequisitionCandidateDialog from "./PersonnelRequisitionCandidateDialog";

import { usePersonnelRequisitionCandidates } from "../../../hooks/humanTalent/requisitions/usePersonnelRequisitionCandidates";

import { useAuth } from "../../../context/AuthContext";

import { formatDate } from "../../../utils/common/dateUtils";

import type {
    CandidateSubmissionStatus,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

interface PersonnelRequisitionCandidatesSectionProps {
    requisitionId: number;
    candidateSubmissionStatus: CandidateSubmissionStatus;
    candidateSubmissionDeadlineAt: string | null;
    candidateSubmissionClosedAt: string | null;
    candidateSubmissionLateReason: string | null;
    createdById: number;
}

// Sección encargada de mostrar y gestionar los candidatos de una requisición.
const PersonnelRequisitionCandidatesSection = ({
    requisitionId,
    candidateSubmissionStatus,
    candidateSubmissionDeadlineAt,
    candidateSubmissionClosedAt,
    candidateSubmissionLateReason,
    createdById,
}: PersonnelRequisitionCandidatesSectionProps) => {
    // Usuario autenticado.
    const { user } = useAuth();

    // Estado local del cargue para reflejar los cambios sin recargar la página.
    const [
        currentSubmissionStatus,
        setCurrentSubmissionStatus,
    ] = useState<CandidateSubmissionStatus>(
        candidateSubmissionStatus
    );

    // Fecha del primer cierre registrada por el backend.
    const [
        currentSubmissionClosedAt,
        setCurrentSubmissionClosedAt,
    ] = useState<string | null>(
        candidateSubmissionClosedAt
    );

    // Fecha límite original para realizar la presentación inicial.
    const [
        currentSubmissionDeadlineAt,
        setCurrentSubmissionDeadlineAt,
    ] = useState<string | null>(
        candidateSubmissionDeadlineAt
    );

    // Justificación registrada cuando el primer cierre fue tardío.
    const [
        currentSubmissionLateReason,
        setCurrentSubmissionLateReason,
    ] = useState<string | null>(
        candidateSubmissionLateReason
    );

    const {
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

        handleLateReasonChange,
        handleReopenReasonChange,

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

        handleSubmitCandidate,
        closeMessage,
    } = usePersonnelRequisitionCandidates({
        requisitionId,

        enabled:
            currentSubmissionStatus !==
            "NO_INICIADA",

        candidateSubmissionDeadlineAt:
            currentSubmissionDeadlineAt,

        candidateSubmissionClosedAt:
            currentSubmissionClosedAt,

        onSubmissionClosed: (
            updatedRequisition
        ) => {
            // Actualiza el estado visual después de cerrar el cargue.
            setCurrentSubmissionStatus(
                updatedRequisition
                    .candidateSubmissionStatus
            );

            // Conserva la fecha correspondiente al primer cierre.
            setCurrentSubmissionClosedAt(
                updatedRequisition
                    .candidateSubmissionClosedAt
            );

            // Actualiza la fecha límite si viene en la respuesta.
            if (
                updatedRequisition
                    .candidateSubmissionDeadlineAt !==
                undefined
            ) {
                setCurrentSubmissionDeadlineAt(
                    updatedRequisition
                        .candidateSubmissionDeadlineAt
                );
            }

            // Guarda la justificación cuando el primer cierre fue tardío.
            if (
                updatedRequisition
                    .candidateSubmissionLateReason !==
                undefined
            ) {
                setCurrentSubmissionLateReason(
                    updatedRequisition
                        .candidateSubmissionLateReason
                );
            }
        },

        onSubmissionReopened: (
            updatedRequisition
        ) => {
            // Actualiza el estado visual después de reabrir el cargue.
            setCurrentSubmissionStatus(
                updatedRequisition
                    .candidateSubmissionStatus
            );

            // La reapertura conserva la fecha del primer cierre.
            setCurrentSubmissionClosedAt(
                updatedRequisition
                    .candidateSubmissionClosedAt
            );
        },
    });

    // Sincroniza el estado local cuando cambian los datos recibidos por propiedades.
    useEffect(() => {
        setCurrentSubmissionStatus(
            candidateSubmissionStatus
        );

        setCurrentSubmissionDeadlineAt(
            candidateSubmissionDeadlineAt
        );

        setCurrentSubmissionClosedAt(
            candidateSubmissionClosedAt
        );

        setCurrentSubmissionLateReason(
            candidateSubmissionLateReason
        );
    }, [
        candidateSubmissionStatus,
        candidateSubmissionDeadlineAt,
        candidateSubmissionClosedAt,
        candidateSubmissionLateReason,
    ]);

    // Indica si el cargue se encuentra abierto.
    const isSubmissionOpen =
        currentSubmissionStatus === "ABIERTA";

    // Indica si la presentación de candidatos está cerrada.
    const isSubmissionClosed =
        currentSubmissionStatus === "CERRADA";

    // Máximo permitido por requisición.
    const maximumCandidatesReached =
        candidates.length >= 10;

    const hasCandidates =
        candidates.length > 0;

    // Permisos para registrar, editar, eliminar y cerrar.
    const canManageCandidates =
        isSubmissionOpen &&
        isCandidateManager &&
        !loadingCandidates &&
        !loadError;

    // Solo el Auxiliar de Talento Humano puede
    // reabrir un cargue previamente cerrado.
    const canReopenCandidates =
        isSubmissionClosed &&
        isCandidateManager &&
        !loadingCandidates &&
        !loadError;

    // Solo el creador de la requisición puede realizar
    // la preselección cuando el cargue está cerrado.
    const canSelectCandidates =
        isSubmissionClosed &&
        user?.id === createdById &&
        !loadingCandidates &&
        !loadError;

    // Indica si existen fotografías históricas disponibles.
    const hasSubmissionBatches =
        submissionBatches.length > 0;

    // Indica que el cargue está abierto, pero el usuario
    // no tiene permiso para consultar o gestionar candidatos.
    const isRestrictedWhileOpen =
        isSubmissionOpen &&
        Boolean(loadError);

    return (
        <>
            <SectionCard
                title="Candidatos"
                subtitle="Hojas de vida registradas para la requisición."
                titleAdornment={
                    currentSubmissionDeadlineAt ? (
                        <InfoTooltip
                            title="Fecha límite de presentación"
                            label="Ver fecha límite de presentación"
                            side="bottom"
                            align="start"
                            size="sm"
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    lineHeight: 1.6,
                                }}
                            >
                                La fecha límite para realizar la
                                presentación inicial de candidatos
                                es{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        color: "text.primary",
                                        fontWeight: 700,
                                    }}
                                >
                                    {formatDate(
                                        currentSubmissionDeadlineAt
                                    )}
                                </Box>
                                .
                            </Typography>
                        </InfoTooltip>
                    ) : undefined
                }
            >
                <Stack spacing={2.5}>
                    {/* Estado, contador y acciones principales. */}
                    {!loadingCandidates &&
                        !isRestrictedWhileOpen && (
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
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <CustomChip
                                        label={
                                            isSubmissionOpen
                                                ? "Cargue abierto"
                                                : "Cargue cerrado"
                                        }
                                        color={
                                            isSubmissionOpen
                                                ? "success"
                                                : "default"
                                        }
                                        variant="outlined"
                                    />

                                    <CustomChip
                                        label={`${candidates.length} de 10 candidatos`}
                                        color={
                                            maximumCandidatesReached
                                                ? "warning"
                                                : "primary"
                                        }
                                        variant="outlined"
                                    />
                                </Stack>

                                {/* Acciones disponibles según el estado y permisos del usuario. */}
                                {(canManageCandidates ||
                                    canReopenCandidates ||
                                    canSelectCandidates ||
                                    (!loadingBatches &&
                                        hasSubmissionBatches)) && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: {
                                                    xs: "column",
                                                    sm: "row",
                                                },
                                                justifyContent:
                                                    "flex-end",
                                                flexWrap: "wrap",
                                                gap: 1,
                                            }}
                                        >
                                            {/* Acciones del Auxiliar mientras el cargue está abierto. */}
                                            {canManageCandidates && (
                                                <>
                                                    <ActionButton
                                                        actionType="lock"
                                                        tooltip={
                                                            hasCandidates
                                                                ? "Cerrar cargue de candidatos"
                                                                : "Debe registrar al menos un candidato antes de cerrar"
                                                        }
                                                        fullWidthOnMobile
                                                        onClick={
                                                            openCloseCandidatesDialog
                                                        }
                                                        disabled={
                                                            loadingClose ||
                                                            !hasCandidates
                                                        }
                                                    >
                                                        Cerrar cargue
                                                    </ActionButton>

                                                    <ActionButton
                                                        actionType="create"
                                                        tooltip="Registrar candidato"
                                                        fullWidthOnMobile
                                                        onClick={
                                                            openCreateCandidateDialog
                                                        }
                                                        disabled={
                                                            maximumCandidatesReached
                                                        }
                                                    >
                                                        Registrar candidato
                                                    </ActionButton>
                                                </>
                                            )}

                                            {/* Acción del Auxiliar cuando el cargue está cerrado. */}
                                            {canReopenCandidates && (
                                                <ActionButton
                                                    actionType="unlock"
                                                    tooltip="Reabrir cargue para realizar ajustes"
                                                    fullWidthOnMobile
                                                    loading={
                                                        loadingReopen
                                                    }
                                                    loadingText="Reabriendo..."
                                                    onClick={
                                                        openReopenCandidatesDialog
                                                    }
                                                >
                                                    Reabrir cargue
                                                </ActionButton>
                                            )}

                                            {/* Acciones del creador durante la preselección. */}
                                            {canSelectCandidates && (
                                                <>
                                                    <ActionButton
                                                        actionType="cancel"
                                                        tooltip="Cancelar la selección actual"
                                                        fullWidthOnMobile
                                                        onClick={
                                                            cancelCandidateSelection
                                                        }
                                                        disabled={
                                                            !hasSelectedCandidates ||
                                                            loadingPreselection
                                                        }
                                                    >
                                                        Cancelar selección
                                                    </ActionButton>

                                                    <ActionButton
                                                        actionType="approve"
                                                        tooltip="Confirmar candidatos seleccionados"
                                                        fullWidthOnMobile
                                                        onClick={
                                                            openPreselectionConfirmDialog
                                                        }
                                                        disabled={
                                                            !hasSelectedCandidates
                                                        }
                                                    >
                                                        Confirmar selección
                                                    </ActionButton>
                                                </>
                                            )}

                                            {/* Consulta de las fotografías históricas de los cargues. */}
                                            {!loadingBatches &&
                                                hasSubmissionBatches && (
                                                    <IconActionButton
                                                        icon="history"
                                                        tooltip="Ver historial de cargues"
                                                        active={
                                                            openSubmissionBatchesDialog
                                                        }
                                                        onClick={
                                                            openSubmissionBatchesHistoryDialog
                                                        }
                                                    />
                                                )}
                                        </Box>
                                    )}
                            </Box>
                        )}

                    {/* Justificación del retraso del primer cierre. */}
                    {currentSubmissionLateReason && (
                        <Alert severity="warning">
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Justificación del retraso:
                            </Box>{" "}
                            {currentSubmissionLateReason}
                        </Alert>
                    )}

                    {/* Aviso de límite máximo. */}
                    {maximumCandidatesReached &&
                        isSubmissionOpen && (
                            <Alert severity="warning">
                                La requisición alcanzó el
                                máximo permitido de 10
                                candidatos.
                            </Alert>
                        )}

                    {/* Estado de carga. */}
                    {loadingCandidates && (
                        <LoadingBox
                            minHeight={160}
                            size={28}
                        />
                    )}

                    {/* Información para usuarios sin acceso durante el cargue abierto. */}
                    {!loadingCandidates &&
                        isRestrictedWhileOpen && (
                            <Alert severity="info">
                                El cargue de candidatos está
                                siendo gestionado por Talento
                                Humano. Las hojas de vida
                                estarán disponibles cuando el
                                proceso sea cerrado.
                            </Alert>
                        )}

                    {/* Error real al consultar candidatos. */}
                    {!loadingCandidates &&
                        loadError &&
                        !isRestrictedWhileOpen && (
                            <Alert severity="error">
                                {loadError}
                            </Alert>
                        )}

                    {/* Estado vacío. */}
                    {!loadingCandidates &&
                        !loadError &&
                        candidates.length === 0 && (
                            <EmptyState
                                title="No hay candidatos registrados"
                                description={
                                    isSubmissionOpen
                                        ? "Registra el primer candidato y adjunta su hoja de vida."
                                        : "El cargue fue cerrado sin candidatos registrados."
                                }
                            />
                        )}

                    {/* Listado de candidatos. */}
                    {!loadingCandidates &&
                        !loadError &&
                        candidates.length > 0 && (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        lg: "repeat(2, minmax(0, 1fr))",
                                    },
                                    gap: 2,
                                }}
                            >
                                {candidates.map(
                                    (candidate) => (
                                        <PersonnelRequisitionCandidateCard
                                            key={
                                                candidate.id
                                            }
                                            candidate={
                                                candidate
                                            }
                                            canManage={
                                                canManageCandidates
                                            }
                                            canSelect={
                                                canSelectCandidates
                                            }
                                            isSelected={
                                                selectedCandidateIds.includes(
                                                    candidate.id
                                                )
                                            }
                                            onEdit={
                                                openEditCandidateDialog
                                            }
                                            onDelete={
                                                openDeleteCandidateDialog
                                            }
                                            onSelect={(
                                                selectedCandidate
                                            ) =>
                                                selectCandidate(
                                                    selectedCandidate.id
                                                )
                                            }
                                            onUnselect={(
                                                selectedCandidate
                                            ) =>
                                                unselectCandidate(
                                                    selectedCandidate.id
                                                )
                                            }
                                        />
                                    )
                                )}
                            </Box>
                        )}
                </Stack>
            </SectionCard>

            {/* Historial de reaperturas y cierres posteriores. */}
            <PersonnelCandidateSubmissionHistorySection
                history={submissionHistory}
                loading={loadingHistory}
            />

            {/* Confirmación definitiva de la preselección. */}
            <ConfirmActionDialog
                open={openPreselectionDialog}
                title="Confirmar selección"
                message={
                    <Stack spacing={2}>
                        <Typography variant="body2">
                            Se confirmará la preselección de
                            los siguientes candidatos:
                        </Typography>

                        <Stack spacing={1}>
                            {selectedCandidates.map(
                                (candidate) => (
                                    <Box
                                        key={candidate.id}
                                        sx={{
                                            p: 1.25,
                                            border: 1,
                                            borderColor:
                                                "divider",
                                            borderRadius: 1,
                                            bgcolor:
                                                "background.default",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            {candidate.identificationType
                                                ?.code ??
                                                candidate
                                                    .identificationType
                                                    ?.name ??
                                                "Documento"}{" "}
                                            {
                                                candidate.identificationNumber
                                            }{" "}
                                            - {candidate.name}
                                        </Typography>
                                    </Box>
                                )
                            )}
                        </Stack>
                    </Stack>
                }
                actionType="approve"
                confirmText="Confirmar"
                loading={loadingPreselection}
                loadingText="Confirmando..."
                infoSeverity="warning"
                infoContent="Esta acción no se podrá deshacer. Una vez confirmados, los candidatos quedarán registrados como preseleccionados."
                onClose={
                    closePreselectionConfirmDialog
                }
                onConfirm={
                    handleConfirmPreselection
                }
            />

            {/* Fotografías históricas generadas en cada cierre. */}
            <PersonnelCandidateSubmissionBatchesDialog
                open={
                    openSubmissionBatchesDialog
                }
                batches={
                    submissionBatches
                }
                onClose={
                    closeSubmissionBatchesHistoryDialog
                }
            />

            {/* Formulario para crear o editar un candidato. */}
            <PersonnelRequisitionCandidateDialog
                open={openFormDialog}
                form={form}
                formErrors={formErrors}
                identificationTypes={
                    identificationTypes
                }
                editingCandidate={
                    editingCandidate
                }
                isEditing={
                    isEditing
                }
                hasFormChanges={
                    hasFormChanges
                }
                loadingSubmit={
                    loadingSubmit
                }
                onIdentificationTypeChange={
                    handleIdentificationTypeChange
                }
                onIdentificationNumberChange={
                    handleIdentificationNumberChange
                }
                onNameChange={
                    handleNameChange
                }
                onObservationChange={
                    handleObservationChange
                }
                onFileChange={
                    handleFileChange
                }
                onSubmit={
                    handleSubmitCandidate
                }
                onClose={
                    closeCandidateDialog
                }
            />

            {/* Confirmación para eliminar un candidato. */}
            <ConfirmActionDialog
                open={openDeleteDialog}
                title="Eliminar candidato"
                message={
                    <>
                        Se eliminará el candidato{" "}
                        <Box
                            component="span"
                            sx={{
                                color: "text.primary",
                                fontWeight: 700,
                            }}
                        >
                            {candidateToDelete?.name ?? ""}
                        </Box>
                        , junto con su hoja de vida
                        almacenada. Esta acción no se
                        puede deshacer.
                    </>
                }
                actionType="delete"
                confirmText="Eliminar"
                loading={loadingDelete}
                loadingText="Eliminando..."
                onClose={
                    closeDeleteCandidateDialog
                }
                onConfirm={
                    handleDeleteCandidate
                }
            />

            {/* Confirmación para cerrar el cargue. */}
            <ConfirmActionDialog
                open={openCloseDialog}
                title="Cerrar cargue de candidatos"
                message={
                    <Stack spacing={2}>
                        <Typography variant="body2">
                            Después de cerrar el cargue
                            no se podrán registrar,
                            actualizar ni eliminar
                            candidatos.
                        </Typography>

                        {isLateFirstClosure && (
                            <TextField
                                label="Motivo del retraso"
                                value={lateReason}
                                onChange={(event) =>
                                    handleLateReasonChange(
                                        event.target.value
                                    )
                                }
                                error={Boolean(
                                    lateReasonError
                                )}
                                helperText={
                                    lateReasonError ||
                                    "Indica por qué la presentación inicial se realiza después del plazo establecido."
                                }
                                multiline
                                minRows={3}
                                fullWidth
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 500,
                                    },
                                }}
                            />
                        )}
                    </Stack>
                }
                actionType="lock"
                confirmText="Cerrar cargue"
                loading={loadingClose}
                loadingText="Cerrando..."
                infoSeverity="warning"
                infoContent={
                    <Typography variant="body2">
                        Actualmente existen{" "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {candidates.length}
                        </Box>{" "}
                        candidatos registrados.
                    </Typography>
                }
                onClose={
                    closeCloseCandidatesDialog
                }
                onConfirm={
                    handleCloseCandidates
                }
            />

            {/* Confirmación para reabrir el cargue. */}
            <ConfirmActionDialog
                open={openReopenDialog}
                title="Reabrir cargue de candidatos"
                message={
                    <Stack spacing={2}>
                        <Typography variant="body2">
                            El cargue volverá a estar
                            disponible para realizar
                            ajustes en los candidatos
                            registrados.
                        </Typography>

                        <TextField
                            label="Motivo de reapertura"
                            value={reopenReason}
                            onChange={(event) =>
                                handleReopenReasonChange(
                                    event.target.value
                                )
                            }
                            error={Boolean(
                                reopenReasonError
                            )}
                            helperText={
                                reopenReasonError ||
                                "Indica por qué es necesario reabrir el cargue."
                            }
                            multiline
                            minRows={3}
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    maxLength: 500,
                                },
                            }}
                        />
                    </Stack>
                }
                actionType="unlock"
                confirmText="Reabrir cargue"
                loading={loadingReopen}
                loadingText="Reabriendo..."
                onClose={
                    closeReopenCandidatesDialog
                }
                onConfirm={
                    handleReopenCandidates
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

export default PersonnelRequisitionCandidatesSection;
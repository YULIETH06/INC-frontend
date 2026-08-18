import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
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

import PersonnelRequisitionCandidateCard from "./PersonnelRequisitionCandidateCard";
import PersonnelRequisitionCandidateDialog from "./PersonnelRequisitionCandidateDialog";

import { usePersonnelRequisitionCandidates } from "../../hooks/humanTalent/usePersonnelRequisitionCandidates";

import { formatDate } from "../../utils/common/dateUtils";

import type {
    CandidateSubmissionStatus,
} from "../../interfaces/humanTalent/personnelRequisition.interface";

interface PersonnelRequisitionCandidatesSectionProps {
    requisitionId: number;
    candidateSubmissionStatus: CandidateSubmissionStatus;
    candidateSubmissionClosedAt: string | null;
}

// Sección encargada de mostrar y gestionar los candidatos de una requisición.
const PersonnelRequisitionCandidatesSection = ({
    requisitionId,
    candidateSubmissionStatus,
    candidateSubmissionClosedAt,
}: PersonnelRequisitionCandidatesSectionProps) => {

    // Estado local del cargue para reflejar el cierre sin recargar la página.
    const [
        currentSubmissionStatus,
        setCurrentSubmissionStatus,
    ] = useState<CandidateSubmissionStatus>(
        candidateSubmissionStatus
    );

    // Fecha local de cierre devuelta por el backend.
    const [
        currentSubmissionClosedAt,
        setCurrentSubmissionClosedAt,
    ] = useState<string | null>(
        candidateSubmissionClosedAt
    );

    const {
        candidates,
        isCandidateManager,
        identificationTypes,

        form,
        formErrors,

        editingCandidate,
        candidateToDelete,

        openFormDialog,
        openDeleteDialog,
        openCloseDialog,
        openReopenDialog,

        loadingReopen,
        loadingCandidates,
        loadingSubmit,
        loadingDelete,
        loadingClose,

        loadError,

        message,
        openMessage,
        messageSeverity,

        isEditing,
        hasFormChanges,

        loadCandidates,

        handleIdentificationTypeChange,
        handleIdentificationNumberChange,
        handleNameChange,
        handleObservationChange,
        handleFileChange,

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

        handleSubmitCandidate,
        closeMessage,
        resetForm,
    } = usePersonnelRequisitionCandidates({
        requisitionId,

        enabled:
            currentSubmissionStatus !==
            "NO_INICIADA",

        onSubmissionClosed: (
            updatedRequisition
        ) => {
            // Actualiza el estado visual después de cerrar el cargue.
            setCurrentSubmissionStatus(
                updatedRequisition
                    .candidateSubmissionStatus
            );

            // Guarda la fecha real del cierre.
            setCurrentSubmissionClosedAt(
                updatedRequisition
                    .candidateSubmissionClosedAt
            );
        },

        onSubmissionReopened: (
            updatedRequisition
        ) => {
            // Actualiza el estado visual después de reabrir el cargue.
            setCurrentSubmissionStatus(
                updatedRequisition
                    .candidateSubmissionStatus
            );

            // Al reabrir, la fecha de cierre vuelve a null.
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

        setCurrentSubmissionClosedAt(
            candidateSubmissionClosedAt
        );
    }, [
        candidateSubmissionStatus,
        candidateSubmissionClosedAt,
    ]);

    const isSubmissionOpen =
        currentSubmissionStatus === "ABIERTA";

    // Indica si la presentación de candidatos está cerrada.
    const isSubmissionClosed =
        currentSubmissionStatus === "CERRADA";

    const maximumCandidatesReached =
        candidates.length >= 10;

    const hasCandidates =
        candidates.length > 0;

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
                                        alignItems:
                                            "center",
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

                                {/* Acciones disponibles según el estado del cargue. */}
                                {(canManageCandidates ||
                                    canReopenCandidates) && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: {
                                                    xs: "column",
                                                    sm: "row",
                                                },
                                                justifyContent: "flex-end",
                                                gap: 1,
                                            }}
                                        >
                                            {/* Acciones disponibles únicamente mientras el cargue está abierto. */}
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

                                            {/* Acción disponible únicamente cuando el cargue está cerrado. */}
                                            {canReopenCandidates && (
                                                <ActionButton
                                                    actionType="unlock"
                                                    tooltip="Reabrir cargue para realizar ajustes"
                                                    fullWidthOnMobile
                                                    loading={loadingReopen}
                                                    loadingText="Reabriendo..."
                                                    onClick={
                                                        openReopenCandidatesDialog
                                                    }
                                                >
                                                    Reabrir cargue
                                                </ActionButton>
                                            )}
                                        </Box>
                                    )}
                            </Box>
                        )}


                    {/* Información de cierre visible únicamente para el Auxiliar. */}
                    {!isSubmissionOpen &&
                        isCandidateManager &&
                        currentSubmissionClosedAt && (
                            <Alert severity="info">
                                El cargue de
                                candidatos fue cerrado
                                el{" "}
                                {formatDate(
                                    currentSubmissionClosedAt
                                )}
                                . Los candidatos se encuentran bloqueados para modificaciones. Si necesitas realizar ajustes, puedes reabrir el cargue.
                            </Alert>
                        )}

                    {/* Aviso de límite máximo. */}
                    {maximumCandidatesReached &&
                        isSubmissionOpen && (
                            <Alert severity="warning">
                                La requisición alcanzó
                                el máximo permitido de
                                cinco candidatos.
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
                                El cargue de candidatos está siendo
                                gestionado por Talento Humano. Las hojas
                                de vida estarán disponibles cuando el
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
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                    {
                                        xs: "1fr",
                                        lg: "repeat(2, minmax(0, 1fr))",
                                    },
                                    gap: 2,
                                }}
                            >
                                {candidates.map(
                                    (
                                        candidate
                                    ) => (
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
                                            onEdit={
                                                openEditCandidateDialog
                                            }
                                            onDelete={
                                                openDeleteCandidateDialog
                                            }
                                        />
                                    )
                                )}
                            </Box>
                        )}
                </Stack>
            </SectionCard>

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
                isEditing={isEditing}
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
                                color:
                                    "text.primary",
                                fontWeight: 700,
                            }}
                        >
                            {candidateToDelete
                                ?.name ??
                                ""}
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
                message="Después de cerrar el cargue no se podrán registrar, actualizar ni eliminar candidatos."
                actionType="lock"
                confirmText="Cerrar cargue"
                loading={loadingClose}
                loadingText="Cerrando..."
                infoSeverity="warning"
                infoContent={
                    <Typography
                        variant="body2"
                    >
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
                message="El cargue volverá a estar disponible para realizar ajustes en los candidatos registrados."
                actionType="unlock"
                confirmText="Reabrir cargue"
                loading={loadingReopen}
                loadingText="Reabriendo..."
                infoSeverity="info"
                infoContent={
                    <Typography variant="body2">
                        Podrás registrar, editar o
                        eliminar candidatos nuevamente
                        mientras el cargue permanezca
                        abierto.
                    </Typography>
                }
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
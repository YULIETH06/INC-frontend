import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import ActionButton from "../../common/ActionButton";
import CustomChip from "../../common/CustomChip";
import InfoItem from "../../common/InfoItem";
import FilePreviewCard from "../../common/FilePreviewCard";

import { getInitials } from "../../../utils/common/avatarUtils";
import { formatDate } from "../../../utils/common/dateUtils";

import type {
    PersonnelRequisitionCandidate,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

interface PersonnelRequisitionCandidateCardProps {
    candidate: PersonnelRequisitionCandidate;

    // Permite editar y eliminar mientras el cargue esté abierto.
    canManage?: boolean;

    // Permite seleccionar candidatos cuando el cargue esté cerrado.
    canSelect?: boolean;

    // Indica si el candidato fue elegido temporalmente.
    isSelected?: boolean;

    onEdit: (
        candidate: PersonnelRequisitionCandidate
    ) => void;

    onDelete: (
        candidate: PersonnelRequisitionCandidate
    ) => void;

    onSelect?: (
        candidate: PersonnelRequisitionCandidate
    ) => void;

    onUnselect?: (
        candidate: PersonnelRequisitionCandidate
    ) => void;
}

// Tarjeta para mostrar la información de un candidato.
const PersonnelRequisitionCandidateCard = ({
    candidate,
    canManage = false,
    canSelect = false,
    isSelected = false,
    onEdit,
    onDelete,
    onSelect,
    onUnselect,
}: PersonnelRequisitionCandidateCardProps) => {
    // Información preparada para mostrar en la tarjeta.
    const identificationType =
        candidate.identificationType?.code ??
        candidate.identificationType?.name ??
        "Documento";

    const uploadedByName =
        candidate.uploadedBy?.name ??
        "Usuario no disponible";

    const preselectedByName =
        candidate.preselectedBy?.name ??
        "Usuario no disponible";

    const preselectedAt =
        candidate.preselectedAt
            ? formatDate(
                candidate.preselectedAt
            )
            : null;

    // Indica si el candidato fue elegido temporalmente.
    const isTemporarilySelected =
        !candidate.isPreselected &&
        isSelected;

    // Permite mostrar la acción de selección.
    const canShowSelectionAction =
        canSelect &&
        !candidate.isPreselected;

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 2,
                transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 2,
                },
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    p: 2.5,

                    "&:last-child": {
                        pb: 2.5,
                    },
                }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        height: "100%",
                    }}
                >
                    {/* Información principal del candidato. */}
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems: "flex-start",
                            minWidth: 0,
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                color:
                                    "primary.contrastText",
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            {getInitials(
                                candidate.name
                            )}
                        </Avatar>

                        <Box
                            sx={{
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={1}
                                sx={{
                                    alignItems: {
                                        xs: "flex-start",
                                        sm: "center",
                                    },
                                    justifyContent:
                                        "space-between",
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    noWrap
                                    sx={{
                                        fontWeight: 700,
                                        minWidth: 0,
                                    }}
                                >
                                    {candidate.name}
                                </Typography>

                                {/* Estado permanente de preselección. */}
                                {candidate.isPreselected && (
                                    <CustomChip
                                        label="Preseleccionado"
                                        color="success"
                                        icon={
                                            <CheckCircleOutlineOutlinedIcon />
                                        }
                                    />
                                )}

                                {/* Estado temporal antes de confirmar. */}
                                {isTemporarilySelected && (
                                    <CustomChip
                                        label="Elegido"
                                        color="primary"
                                        icon={
                                            <CheckCircleOutlineOutlinedIcon />
                                        }
                                    />
                                )}
                            </Stack>

                            <Typography
                                variant="body2"
                                sx={{
                                    color:
                                        "text.secondary",
                                    mt: 0.25,
                                }}
                            >
                                Registrado el{" "}
                                {formatDate(
                                    candidate.createdAt
                                )}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color:
                                        "text.secondary",
                                }}
                            >
                                {identificationType}{" "}
                                {
                                    candidate.identificationNumber
                                }
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Observación registrada. */}
                    {candidate.observation && (
                        <InfoItem
                            label="Observación"
                            value={
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
                                        candidate.observation
                                    }
                                </Typography>
                            }
                        />
                    )}

                    {/* Archivo de hoja de vida. */}
                    <FilePreviewCard
                        fileUrl={
                            candidate.fileUrl
                        }
                        fileSize={
                            candidate.fileSize
                        }
                        buttonLabel="Ver hoja de vida"
                        buttonTooltip="Ver hoja de vida"
                    />

                    {/* Información secundaria del proceso. */}
                    <Box
                        sx={{
                            mt: "auto",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color:
                                    "text.secondary",
                                display: "block",
                            }}
                        >
                            Cargado por{" "}
                            <Box
                                component="span"
                                sx={{
                                    color:
                                        "text.primary",
                                    fontWeight: 600,
                                }}
                            >
                                {uploadedByName}
                            </Box>
                        </Typography>

                        {candidate.isPreselected && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color:
                                        "text.secondary",
                                    display: "block",
                                    mt: 0.5,
                                }}
                            >
                                Preseleccionado por{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        color:
                                            "text.primary",
                                        fontWeight: 600,
                                    }}
                                >
                                    {preselectedByName}
                                </Box>

                                {preselectedAt && (
                                    <>
                                        {" · "}
                                        {preselectedAt}
                                    </>
                                )}
                            </Typography>
                        )}
                    </Box>

                    {/* Acciones disponibles mientras el cargue esté abierto. */}
                    {canManage && (
                        <>
                            <Divider />

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    justifyContent:
                                        "flex-end",
                                    flexWrap: "wrap",
                                }}
                            >
                                <ActionButton
                                    actionType="edit"
                                    tooltip="Editar candidato"
                                    iconOnlyOnMobile
                                    onClick={() =>
                                        onEdit(
                                            candidate
                                        )
                                    }
                                >
                                    Editar
                                </ActionButton>

                                <ActionButton
                                    actionType="delete"
                                    tooltip="Eliminar candidato"
                                    iconOnlyOnMobile
                                    onClick={() =>
                                        onDelete(
                                            candidate
                                        )
                                    }
                                >
                                    Eliminar
                                </ActionButton>
                            </Stack>
                        </>
                    )}

                    {/* Acciones temporales de selección antes de confirmar. */}
                    {canShowSelectionAction && (
                        <>
                            <Divider />

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    justifyContent:
                                        "flex-end",
                                    flexWrap: "wrap",
                                }}
                            >
                                {isSelected ? (
                                    <ActionButton
                                        actionType="cancel"
                                        tooltip="Quitar candidato de la selección"
                                        fullWidthOnMobile
                                        onClick={() =>
                                            onUnselect?.(
                                                candidate
                                            )
                                        }
                                    >
                                        Quitar
                                    </ActionButton>
                                ) : (
                                    <ActionButton
                                        actionType="approve"
                                        tooltip="Seleccionar candidato"
                                        fullWidthOnMobile
                                        onClick={() =>
                                            onSelect?.(
                                                candidate
                                            )
                                        }
                                    >
                                        Seleccionar
                                    </ActionButton>
                                )}
                            </Stack>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PersonnelRequisitionCandidateCard;
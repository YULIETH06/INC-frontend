import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import ActionButton from "../../common/ActionButton";
import InfoItem from "../../common/InfoItem";

import { getInitials } from "../../../utils/common/avatarUtils";
import { formatDate } from "../../../utils/common/dateUtils";
import { formatFileSize } from "../../../utils/common/fileUtils";
import { buildFileUrl } from "../../../utils/common/fileUrl";

import type {
    PersonnelRequisitionCandidate,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

interface PersonnelRequisitionCandidateCardProps {
    candidate: PersonnelRequisitionCandidate;
    canManage?: boolean;

    onEdit: (
        candidate: PersonnelRequisitionCandidate
    ) => void;

    onDelete: (
        candidate: PersonnelRequisitionCandidate
    ) => void;
}

// Tarjeta para mostrar la información de un candidato.
const PersonnelRequisitionCandidateCard = ({
    candidate,
    canManage = false,
    onEdit,
    onDelete,
}: PersonnelRequisitionCandidateCardProps) => {
    // Abre la hoja de vida almacenada en el backend.
    const handleOpenResume = () => {
        const fileUrl = buildFileUrl(
            candidate.fileUrl
        );

        if (!fileUrl) {
            return;
        }

        window.open(
            fileUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

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
                            alignItems: "center",
                            minWidth: 0,
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                color:
                                    "primary.contrastText",
                                fontWeight: 700,
                            }}
                        >
                            {getInitials(
                                candidate.name
                            )}
                        </Avatar>

                        <Box
                            sx={{
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                noWrap
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {candidate.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color:
                                        "text.secondary",
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
                                    color: "text.secondary",
                                }}
                            >
                                {candidate.identificationType?.code ??
                                    candidate.identificationType?.name ??
                                    "Documento"}{" "}
                                {candidate.identificationNumber}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Observación registrada para el candidato. */}
                    {candidate.observation && (
                        <InfoItem
                            label="Observación"
                            value={
                                <Typography
                                    variant="body2"
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {candidate.observation}
                                </Typography>
                            }
                        />
                    )}

                    <Divider />

                    {/* Archivo de hoja de vida. */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            alignItems: {
                                xs: "stretch",
                                sm: "center",
                            },
                            justifyContent: "space-between",
                            gap: 2,
                            p: 1.5,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            bgcolor: "action.hover",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                                alignItems: "center",
                                minWidth: 0,
                            }}
                        >
                            <DescriptionOutlinedIcon
                                sx={{
                                    color: "primary.main",
                                    flexShrink: 0,
                                }}
                            />

                            <Box
                                sx={{
                                    minWidth: 0,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {candidate.originalName}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "text.secondary",
                                    }}
                                >
                                    {formatFileSize(
                                        candidate.fileSize
                                    )}
                                </Typography>
                            </Box>
                        </Stack>

                        <ActionButton
                            actionType="open"
                            tooltip="Ver hoja de vida"
                            fullWidthOnMobile
                            onClick={handleOpenResume}
                            sx={{
                                flexShrink: 0,
                            }}
                        >
                            Ver archivo
                        </ActionButton>
                    </Box>

                    {/* Usuario que realizó el cargue. */}
                    <InfoItem
                        label="Cargado por"
                        value={
                            <Typography
                                variant="body2"
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {candidate.uploadedBy?.name ??
                                    "Usuario no disponible"}
                            </Typography>
                        }
                    />

                    {/* Acciones disponibles mientras el cargue esté abierto. */}
                    {canManage && (
                        <>
                            <Divider />

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    justifyContent: "flex-end",
                                }}
                            >
                                <ActionButton
                                    actionType="edit"
                                    tooltip="Editar candidato"
                                    iconOnlyOnMobile
                                    onClick={() =>
                                        onEdit(candidate)
                                    }
                                >
                                    Editar
                                </ActionButton>

                                <ActionButton
                                    actionType="delete"
                                    tooltip="Eliminar candidato"
                                    iconOnlyOnMobile
                                    onClick={() =>
                                        onDelete(candidate)
                                    }
                                >
                                    Eliminar
                                </ActionButton>
                            </Stack>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PersonnelRequisitionCandidateCard;
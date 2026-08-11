import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ActionButton from "../common/ActionButton";
import CustomChip from "../common/CustomChip";
import InfoItem from "../common/InfoItem";

import { formatDate } from "../../utils/common/dateUtils";

import type {
    PositionProfileRevision,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionProfileRevisionCardProps {
    revision: PositionProfileRevision;
    selected?: boolean;

    onSelect: (
        revision: PositionProfileRevision
    ) => void;

    onEdit: (
        revision: PositionProfileRevision
    ) => void;

    onPublish: (
        revision: PositionProfileRevision
    ) => void;

    onDelete: (
        revision: PositionProfileRevision
    ) => void;
}

// Tarjeta para mostrar la información general de una revisión.
const PositionProfileRevisionCard = ({
    revision,
    selected = false,
    onSelect,
    onEdit,
    onPublish,
    onDelete,
}: PositionProfileRevisionCardProps) => {
    // Solo las revisiones en borrador pueden modificarse.
    const isDraft =
        revision.status === "BORRADOR";

    // Configuración visual según el estado de la revisión.
    const statusConfig = {
        BORRADOR: {
            label: "Borrador",
            color: "warning" as const,
        },
        VIGENTE: {
            label: "Vigente",
            color: "success" as const,
        },
        OBSOLETA: {
            label: "Obsoleta",
            color: "default" as const,
        },
    };

    const currentStatus =
        statusConfig[revision.status];

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 2,
                borderColor: selected
                    ? "primary.main"
                    : "divider",
                boxShadow: selected ? 2 : 0,
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
                    {/* Información principal de la revisión. */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent:
                                "space-between",
                            gap: 2,
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
                            <Avatar
                                sx={{
                                    bgcolor:
                                        selected
                                            ? "primary.main"
                                            : "action.selected",
                                    color:
                                        selected
                                            ? "primary.contrastText"
                                            : "text.primary",
                                    fontWeight: 700,
                                }}
                            >
                                {
                                    revision.revisionNumber
                                }
                            </Avatar>

                            <Box
                                sx={{
                                    minWidth: 0,
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Revisión{" "}
                                    {
                                        revision.revisionNumber
                                    }
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    Fecha de revisión:{" "}
                                    {formatDate(
                                        revision.revisionDate
                                    )}
                                </Typography>
                            </Box>
                        </Stack>

                        <CustomChip
                            label={
                                currentStatus.label
                            }
                            color={
                                currentStatus.color
                            }
                            variant="outlined"
                        />
                    </Box>

                    {/* Observación o descripción general del cambio. */}
                    <InfoItem
                        label="Observación del cambio"
                        value={
                            revision.changeObservation ? (
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
                                        revision.changeObservation
                                    }
                                </Typography>
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            "text.secondary",
                                        fontStyle:
                                            "italic",
                                    }}
                                >
                                    Sin observación
                                    registrada.
                                </Typography>
                            )
                        }
                    />

                    <InfoItem
                        label="Última actualización"
                        value={formatDate(
                            revision.updatedAt
                        )}
                    />

                    <Divider
                        sx={{
                            mt: "auto",
                        }}
                    />

                    {/* Acciones disponibles para la revisión. */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            justifyContent:
                                "space-between",
                            gap: 1,
                        }}
                    >
                        <ActionButton
                            actionType="open"
                            tooltip="Ver detalle de la revisión"
                            fullWidthOnMobile
                            onClick={() =>
                                onSelect(revision)
                            }
                        >
                            Ver detalle
                        </ActionButton>

                        {isDraft && (
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
                                    iconOnlyOnMobile
                                    onClick={() =>
                                        onEdit(
                                            revision
                                        )
                                    }
                                >
                                    Editar
                                </ActionButton>

                                <ActionButton
                                    actionType="save"
                                    tooltip="Publicar revisión"
                                    iconOnlyOnMobile
                                    onClick={() =>
                                        onPublish(
                                            revision
                                        )
                                    }
                                >
                                    Publicar
                                </ActionButton>

                                <ActionButton
                                    actionType="delete"
                                    tooltip="Eliminar revisión"
                                    iconOnlyOnMobile
                                    onClick={() =>
                                        onDelete(
                                            revision
                                        )
                                    }
                                >
                                    Eliminar
                                </ActionButton>
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PositionProfileRevisionCard;
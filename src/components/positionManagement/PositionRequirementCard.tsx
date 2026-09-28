import {
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

import ActionButton from "../common/ActionButton";
import CustomChip from "../common/CustomChip";

import { formatDate } from "../../utils/common/dateUtils";

import type {
    PositionRequirement,
    PositionRequirementEntry,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionRequirementCardProps {
    requirement: PositionRequirement;
    canManage?: boolean;

    onCreateRequirement: (
        requirementId: number
    ) => void;

    onEditRequirement: (
        requirementId: number,
        requirementItem: PositionRequirementEntry
    ) => void;

    onDeleteRequirement: (
        requirementId: number,
        requirementItem: PositionRequirementEntry
    ) => void;
}

// Tarjeta para mostrar un requisito y sus registros.
const PositionRequirementCard = ({
    requirement,
    canManage = false,
    onCreateRequirement,
    onEditRequirement,
    onDeleteRequirement,
}: PositionRequirementCardProps) => {
    const hasRequirements =
        requirement.descriptions.length > 0;

    const requirementsLabel =
        requirement.descriptions.length === 1
            ? "1 requisito"
            : `${requirement.descriptions.length} requisitos`;

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
                    {/* Encabezado del requisito. */}
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
                            <FactCheckOutlinedIcon
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
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {requirement.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    Información requerida
                                    para el perfil de cargo.
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={1}
                            sx={{
                                alignItems: {
                                    xs: "stretch",
                                    sm: "center",
                                },
                            }}
                        >
                            <CustomChip
                                label={requirementsLabel}
                                color={
                                    hasRequirements
                                        ? "primary"
                                        : "warning"
                                }
                                variant="outlined"
                            />

                            {canManage && (
                                <ActionButton
                                    actionType="create"
                                    tooltip="Agregar requisito"
                                    fullWidthOnMobile
                                    onClick={() =>
                                        onCreateRequirement(
                                            requirement.id
                                        )
                                    }
                                >
                                    Agregar
                                </ActionButton>
                            )}
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Estado vacío del requisito. */}
                    {!hasRequirements && (
                        <Box
                            sx={{
                                p: 2.5,
                                border: 1,
                                borderStyle: "dashed",
                                borderColor: "divider",
                                borderRadius: 2,
                                textAlign: "center",
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
                                No hay requisitos
                                registrados para este
                                tipo de requisito.
                            </Typography>

                            {canManage && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        mt: 0.5,
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    Agrega al menos un
                                    requisito antes de
                                    publicar la revisión.
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Requisitos registradas. */}
                    {hasRequirements && (
                        <Stack spacing={1.5}>
                            {requirement.descriptions.map(
                                (
                                    requirementItem,
                                    index
                                ) => (
                                    <Box
                                        key={
                                            requirementItem.id
                                        }
                                        sx={{
                                            p: 2,
                                            border: 1,
                                            borderColor:
                                                "divider",
                                            borderRadius: 2,
                                            bgcolor:
                                                "background.default",
                                        }}
                                    >
                                        <Stack
                                            spacing={1.5}
                                        >
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
                                                        sm: "flex-start",
                                                    },
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display:
                                                                "block",
                                                            mb: 0.5,
                                                            color:
                                                                "text.secondary",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        Requisito{" "}
                                                        {index +
                                                            1}
                                                    </Typography>

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
                                                            requirementItem.description
                                                        }
                                                    </Typography>
                                                </Box>

                                                {canManage && (
                                                    <Stack
                                                        direction="row"
                                                        spacing={
                                                            1
                                                        }
                                                        sx={{
                                                            justifyContent:
                                                                "flex-end",
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        <ActionButton
                                                            actionType="edit"
                                                            tooltip="Editar requisito"
                                                            iconOnlyOnMobile
                                                            onClick={() =>
                                                                onEditRequirement(
                                                                    requirement.id,
                                                                    requirementItem
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </ActionButton>

                                                        <ActionButton
                                                            actionType="delete"
                                                            tooltip="Eliminar requisito"
                                                            iconOnlyOnMobile
                                                            onClick={() =>
                                                                onDeleteRequirement(
                                                                    requirement.id,
                                                                    requirementItem
                                                                )
                                                            }
                                                        >
                                                            Eliminar
                                                        </ActionButton>
                                                    </Stack>
                                                )}
                                            </Box>

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color:
                                                        "text.secondary",
                                                }}
                                            >
                                                Última
                                                actualización:{" "}
                                                {formatDate(
                                                    requirementItem.updatedAt
                                                )}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                )
                            )}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PositionRequirementCard;
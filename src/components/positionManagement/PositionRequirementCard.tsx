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
    PositionRequirementDescription,
} from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionRequirementCardProps {
    requirement: PositionRequirement;
    canManage?: boolean;

    onCreateDescription: (
        requirementId: number
    ) => void;

    onEditDescription: (
        requirementId: number,
        description: PositionRequirementDescription
    ) => void;

    onDeleteDescription: (
        requirementId: number,
        description: PositionRequirementDescription
    ) => void;
}

// Tarjeta para mostrar un requisito y sus descripciones.
const PositionRequirementCard = ({
    requirement,
    canManage = false,
    onCreateDescription,
    onEditDescription,
    onDeleteDescription,
}: PositionRequirementCardProps) => {
    const hasDescriptions =
        requirement.descriptions.length > 0;

    const descriptionsLabel =
        requirement.descriptions.length === 1
            ? "1 descripción"
            : `${requirement.descriptions.length} descripciones`;

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
                                label={descriptionsLabel}
                                color={
                                    hasDescriptions
                                        ? "primary"
                                        : "warning"
                                }
                                variant="outlined"
                            />

                            {canManage && (
                                <ActionButton
                                    actionType="create"
                                    tooltip="Agregar descripción"
                                    fullWidthOnMobile
                                    onClick={() =>
                                        onCreateDescription(
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
                    {!hasDescriptions && (
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
                                No hay descripciones
                                registradas para este
                                requisito.
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
                                    Agrega al menos una
                                    descripción antes de
                                    publicar la revisión.
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Descripciones registradas. */}
                    {hasDescriptions && (
                        <Stack spacing={1.5}>
                            {requirement.descriptions.map(
                                (
                                    description,
                                    index
                                ) => (
                                    <Box
                                        key={
                                            description.id
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
                                                        Descripción{" "}
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
                                                            description.description
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
                                                            tooltip="Editar descripción"
                                                            iconOnlyOnMobile
                                                            onClick={() =>
                                                                onEditDescription(
                                                                    requirement.id,
                                                                    description
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </ActionButton>

                                                        <ActionButton
                                                            actionType="delete"
                                                            tooltip="Eliminar descripción"
                                                            iconOnlyOnMobile
                                                            onClick={() =>
                                                                onDeleteDescription(
                                                                    requirement.id,
                                                                    description
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
                                                    description.updatedAt
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
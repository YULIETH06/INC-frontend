import { Box, Stack, Typography } from "@mui/material";

import ActionButton from "../common/ActionButton";

import { formatDate } from "../../utils/common/dateUtils";

import type { PositionCompetency } from "../../interfaces/positionManagement/positionProfileRevision.interface";

interface PositionCompetencyCardProps {
    competency: PositionCompetency;
    canManage: boolean;
    onEdit: (competency: PositionCompetency) => void;
    onDelete: (competency: PositionCompetency) => void;
}

const PositionCompetencyCard = ({
    competency,
    canManage,
    onEdit,
    onDelete,
}: PositionCompetencyCardProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: {
                    xs: "column",
                    sm: "row",
                },
                alignItems: {
                    xs: "stretch",
                    sm: "flex-start",
                },
                justifyContent: "space-between",
                gap: 2,
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.default",
                transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 1,
                },
            }}
        >
            {/* Información de la competencia */}
            <Stack
                spacing={0.5}
                sx={{
                    minWidth: 0,
                    flex: 1,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                    }}
                >
                    Competencia
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "text.primary",
                        fontWeight: 500,
                        wordBreak: "break-word",
                    }}
                >
                    {competency.competency}
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                        mt: 0.5,
                    }}
                >
                    Última actualización:{" "}
                    {formatDate(competency.updatedAt)}
                </Typography>
            </Stack>

            {/* Acciones */}
            {canManage && (
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
                        flexShrink: 0,
                    }}
                >
                    <ActionButton
                        actionType="edit"
                        tooltip="Editar competencia"
                        fullWidthOnMobile
                        onClick={() =>
                            onEdit(competency)
                        }
                    >
                        Editar
                    </ActionButton>

                    <ActionButton
                        actionType="delete"
                        tooltip="Eliminar competencia"
                        fullWidthOnMobile
                        onClick={() =>
                            onDelete(competency)
                        }
                    >
                        Eliminar
                    </ActionButton>
                </Stack>
            )}
        </Box>
    );
};

export default PositionCompetencyCard;
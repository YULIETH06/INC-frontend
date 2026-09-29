import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";

import { formatDate } from "../../../utils/common/dateUtils";

interface PositionRevisionEntryCardProps {
    label: string;
    content: string;
    updatedAt: string;

    canManage?: boolean;

    editTooltip: string;
    deleteTooltip: string;

    onEdit: () => void;
    onDelete: () => void;
}

// Tarjeta reutilizable para mostrar un registro individual
// dentro de una revisión, como un requisito o una competencia.
const PositionRevisionEntryCard = ({
    label,
    content,
    updatedAt,
    canManage = false,
    editTooltip,
    deleteTooltip,
    onEdit,
    onDelete,
}: PositionRevisionEntryCardProps) => {
    return (
        <Box
            sx={{
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.default",
            }}
        >
            <Stack spacing={1.5}>
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
                    }}
                >
                    <Box
                        sx={{
                            minWidth: 0,
                            flex: 1,
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                color: "text.secondary",
                                fontWeight: 700,
                            }}
                        >
                            {label}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {content}
                        </Typography>
                    </Box>

                    {canManage && (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                justifyContent: "flex-end",
                                flexShrink: 0,
                            }}
                        >
                            <ActionButton
                                actionType="edit"
                                tooltip={editTooltip}
                                iconOnlyOnMobile
                                onClick={onEdit}
                            >
                                Editar
                            </ActionButton>

                            <ActionButton
                                actionType="delete"
                                tooltip={deleteTooltip}
                                iconOnlyOnMobile
                                onClick={onDelete}
                            >
                                Eliminar
                            </ActionButton>
                        </Stack>
                    )}
                </Box>

                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                    }}
                >
                    Última actualización:{" "}
                    {formatDate(updatedAt)}
                </Typography>
            </Stack>
        </Box>
    );
};

export default PositionRevisionEntryCard;
import type { ReactNode } from "react";

import {
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";
import CustomChip from "../../common/CustomChip";

interface PositionRevisionEntrySectionProps<T> {
    icon: ReactNode;

    title: string;

    subtitle: string;

    countLabel: string;

    entries: T[];

    canManage?: boolean;

    emptyMessage: string;

    emptyHint?: string;

    addTooltip: string;

    onAdd: () => void;

    renderEntry: (
        entry: T,
        index: number
    ) => ReactNode;
}

// Estructura visual compartida para los registros
// administrados dentro de una revisión.
const PositionRevisionEntrySection = <T,>({
    icon,
    title,
    subtitle,
    countLabel,
    entries,
    canManage = false,
    emptyMessage,
    emptyHint,
    addTooltip,
    onAdd,
    renderEntry,
}: PositionRevisionEntrySectionProps<T>) => {
    const hasEntries = entries.length > 0;

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
                    {/* Encabezado del tipo de registro. */}
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
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "primary.main",
                                    flexShrink: 0,
                                }}
                            >
                                {icon}
                            </Box>

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
                                    {title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {subtitle}
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
                                label={countLabel}
                                color={
                                    hasEntries
                                        ? "primary"
                                        : "warning"
                                }
                                variant="outlined"
                            />

                            {canManage && (
                                <ActionButton
                                    actionType="create"
                                    tooltip={addTooltip}
                                    fullWidthOnMobile
                                    onClick={onAdd}
                                >
                                    Agregar
                                </ActionButton>
                            )}
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Estado sin registros. */}
                    {!hasEntries && (
                        <Box
                            sx={{
                                p: 2,
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
                                {emptyMessage}
                            </Typography>

                            {canManage &&
                                emptyHint && (
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
                                        {emptyHint}
                                    </Typography>
                                )}
                        </Box>
                    )}

                    {/* Registros existentes. */}
                    {hasEntries && (
                        <Stack spacing={1.5}>
                            {entries.map(
                                (entry, index) =>
                                    renderEntry(
                                        entry,
                                        index
                                    )
                            )}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PositionRevisionEntrySection;
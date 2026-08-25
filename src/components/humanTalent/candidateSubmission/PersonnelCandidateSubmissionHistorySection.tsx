import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import CustomChip from "../../common/CustomChip";
import SectionCard from "../../common/SectionCard";

import { formatDate } from "../../../utils/common/dateUtils";

import type {
    PersonnelCandidateSubmissionHistory,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

interface PersonnelCandidateSubmissionHistorySectionProps {
    history: PersonnelCandidateSubmissionHistory[];
    loading?: boolean;
}

// Sección encargada de mostrar los movimientos realizados
// después de la presentación inicial de candidatos.
const PersonnelCandidateSubmissionHistorySection = ({
    history,
    loading = false,
}: PersonnelCandidateSubmissionHistorySectionProps) => {
    // No muestra la sección mientras se consulta el historial
    // o cuando todavía no existen movimientos registrados.
    if (
        loading ||
        history.length === 0
    ) {
        return null;
    }

    return (
        <SectionCard
            title="Historial del cargue"
            subtitle="Movimientos realizados después de la presentación inicial."
        >
            <Stack spacing={1.5}>
                {history.map((historyItem) => (
                    <Box
                        key={historyItem.id}
                        sx={{
                            p: 1.5,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
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
                            }}
                        >
                            <CustomChip
                                label={
                                    historyItem.action ===
                                        "REAPERTURA"
                                        ? "Reapertura"
                                        : "Cierre"
                                }
                                color={
                                    historyItem.action ===
                                        "REAPERTURA"
                                        ? "warning"
                                        : "success"
                                }
                                variant="outlined"
                            />

                            <Typography variant="body2">
                                {formatDate(
                                    historyItem.performedAt
                                )}
                                {" · "}
                                {
                                    historyItem
                                        .performedBy
                                        .name
                                }
                            </Typography>
                        </Stack>

                        {historyItem.reason && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    Motivo:
                                </Box>{" "}
                                {historyItem.reason}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Stack>
        </SectionCard>
    );
};

export default PersonnelCandidateSubmissionHistorySection;
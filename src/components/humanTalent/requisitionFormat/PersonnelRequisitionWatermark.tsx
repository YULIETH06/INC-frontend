import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import type { PersonnelRequisition } from "../../../interfaces/humanTalent/personnelRequisition.interface";

import { requisitionStatusOptions } from "../../../data/humanTalentOptions";

import { getOptionLabel } from "../../../utils/common/formatText";

import { getRequisitionStatusComment } from "../../../utils/humanTalent/personnelRequisitionUtils";

interface PersonnelRequisitionWatermarkProps {
    requisition: PersonnelRequisition;
}

// Muestra el estado general como marca de agua en el formato.
const PersonnelRequisitionWatermark = ({
    requisition,
}: PersonnelRequisitionWatermarkProps) => {
    const theme = useTheme();

    const {
        comment,
        title: commentTitle,
        showComment,
    } = getRequisitionStatusComment(requisition);

    const statusLabel = getOptionLabel(
        requisition.status,
        requisitionStatusOptions
    );

    const getWatermarkColor = () => {
        if (requisition.status === "APROBADA") {
            return theme.palette.success.main;
        }

        if (
            requisition.status === "RECHAZADA" ||
            requisition.status === "CANCELADA"
        ) {
            return theme.palette.error.main;
        }

        return theme.palette.warning.dark;
    };

    return (
        <Box
            aria-hidden="true"
            sx={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                pointerEvents: "none",
                userSelect: "none",
            }}
        >
            <Stack
                spacing={2}
                sx={{
                    width: "160mm",
                    alignItems: "center",
                    color: getWatermarkColor(),
                    textAlign: "center",
                    transform: "rotate(-28deg)",
                    opacity: 0.16,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                }}
            >
                <Typography
                    sx={{
                        fontSize: {
                            xs: "38px",
                            md: "56px",
                        },
                        lineHeight: 1,
                        fontWeight: 900,
                        letterSpacing: "5px",
                        textTransform: "uppercase",
                        overflowWrap: "anywhere",
                    }}
                >
                    {statusLabel}
                </Typography>

                {showComment && (
                    <Box
                        sx={{
                            maxWidth: "145mm",
                            px: 2,
                            py: 1,
                            border: "3px solid currentColor",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "15px",
                                lineHeight: 1.4,
                                fontWeight: 800,
                                textTransform: "uppercase",
                            }}
                        >
                            {commentTitle}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: "13px",
                                lineHeight: 1.5,
                                fontWeight: 700,
                                overflowWrap: "anywhere",
                                whiteSpace: "pre-line",
                            }}
                        >
                            {comment}
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Box>
    );
};

export default PersonnelRequisitionWatermark;
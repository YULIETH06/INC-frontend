import {
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import type {
    PersonnelHiringConfirmationApproval,
    PersonnelRequisitionApproval,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

import { formatDate } from "../../../utils/common/dateUtils";
import { buildFileUrl } from "../../../utils/common/fileUrl";

interface PersonnelApprovalCardProps {
    title: string;
    approval?:
    | PersonnelRequisitionApproval
    | PersonnelHiringConfirmationApproval;
}

// Muestra la firma y la información de una aprobación.
const PersonnelApprovalCard = ({
    title,
    approval,
}: PersonnelApprovalCardProps) => {
    const signatureUrl = approval?.decidedBy
        ? buildFileUrl(
            approval.decidedBy.signatureUrl
        )
        : "";

    const approverName =
        approval?.decidedBy?.name || "";

    return (
        <Paper
            elevation={0}
            sx={{
                minHeight: "210px",
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                backgroundColor: "#fff",
            }}
        >
            <Stack
                spacing={1.2}
                sx={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Box
                    sx={{
                        height: "90px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {signatureUrl ? (
                        <Box
                            component="img"
                            src={signatureUrl}
                            alt={`Firma ${approverName}`}
                            sx={{
                                maxWidth: "210px",
                                maxHeight: "80px",
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        ""
                    )}
                </Box>

                <Box
                    sx={{
                        width: "80%",
                        pt: 1,
                        borderTop: "1px solid",
                        borderColor: "text.primary",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 800,
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 0.3,
                            color: "text.secondary",
                        }}
                    >
                        Fecha:{" "}
                        {formatDate(
                            approval?.decidedAt
                        )}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};

export default PersonnelApprovalCard;
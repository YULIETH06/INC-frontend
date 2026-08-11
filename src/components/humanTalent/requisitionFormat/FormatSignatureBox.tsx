import {
    Box,
    Divider,
    Typography,
} from "@mui/material";

import type {
    PersonnelHiringConfirmationApproval,
    PersonnelRequisitionApproval,
} from "../../../interfaces/humanTalent/personnelRequisition.interface";

import { formatDate } from "../../../utils/common/dateUtils";
import { buildFileUrl } from "../../../utils/common/fileUrl";

type ApprovalType =
    | PersonnelRequisitionApproval
    | PersonnelHiringConfirmationApproval;

interface FormatSignatureBoxProps {
    title: string;
    approval?: ApprovalType;
}

// Muestra una firma o aprobación dentro del formato imprimible.
const FormatSignatureBox = ({
    title,
    approval,
}: FormatSignatureBoxProps) => {
    const signatureUrl = approval?.decidedBy
        ? buildFileUrl(
            approval.decidedBy.signatureUrl
        )
        : "";

    const userName =
        approval?.decidedBy?.name || "";

    return (
        <Box
            sx={{
                minHeight: "105px",
                px: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                textAlign: "center",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    height: "48px",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {signatureUrl ? (
                    <Box
                        component="img"
                        src={signatureUrl}
                        alt={`Firma ${userName || title}`}
                        sx={{
                            display: "block",
                            width: "auto",
                            height: "auto",
                            maxWidth: "140px",
                            maxHeight: "42px",
                            objectFit: "contain",
                        }}
                    />
                ) : (
                    ""
                )}
            </Box>

            <Divider
                sx={{
                    mb: 0.4,
                    borderColor: "#000",
                }}
            />

            <Typography
                sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                }}
            >
                {title}
            </Typography>

            <Typography
                sx={{
                    fontSize: "10px",
                }}
            >
                Fecha: {formatDate(approval?.decidedAt)}
            </Typography>
        </Box>
    );
};

export default FormatSignatureBox;
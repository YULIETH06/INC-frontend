import {
    Stack,
    Typography,
} from "@mui/material";

import InfoTooltip from "../../common/InfoTooltip";
import CustomChip from "../../common/CustomChip";

import type { PersonnelRequisition } from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

import { getOptionLabel } from "../../../utils/common/formatText";

import {
    getRequisitionStatusColor,
    getRequisitionStatusComment,
} from "../../../utils/humanTalent/personnelRequisitionUtils";

import { requisitionStatusOptions } from "../../../data/humanTalentOptions";

interface PersonnelRequisitionStatusBadgeProps {
    requisition: PersonnelRequisition;
}

// Muestra el estado general y su comentario cuando corresponde.YULI
const PersonnelRequisitionStatusBadge = ({
    requisition,
}: PersonnelRequisitionStatusBadgeProps) => {
    const {
        comment,
        title,
        showComment,
    } = getRequisitionStatusComment(requisition);

    return (
        <Stack
            direction="row"
            spacing={0.7}
            sx={{ alignItems: "center" }}
        >
            <CustomChip
                label={getOptionLabel(
                    requisition.status,
                    requisitionStatusOptions
                )}
                color={getRequisitionStatusColor(
                    requisition.status
                )}
                fontWeight={700}
            />

            {showComment && (
                <InfoTooltip
                    title={title}
                    label={`Ver ${title.toLowerCase()}`}
                    side="bottom"
                    align="start"
                    size="sm"
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                            overflowWrap: "anywhere",
                        }}
                    >
                        {comment}
                    </Typography>
                </InfoTooltip>
            )}
        </Stack>
    );
};

export default PersonnelRequisitionStatusBadge;
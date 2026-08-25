import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";
import CustomAccordion from "../../common/CustomAccordion";
import CustomChip from "../../common/CustomChip";
import EmptyState from "../../common/EmptyState";
import InfoItem from "../../common/InfoItem";

import { formatDate } from "../../../utils/common/dateUtils";

import type {
    PersonnelCandidateSubmissionBatch,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

interface PersonnelCandidateSubmissionBatchesDialogProps {
    open: boolean;
    batches: PersonnelCandidateSubmissionBatch[];
    onClose: () => void;
}

// Diálogo encargado de mostrar las fotografías históricas
// generadas en cada cierre del cargue de candidatos.
const PersonnelCandidateSubmissionBatchesDialog = ({
    open,
    batches,
    onClose,
}: PersonnelCandidateSubmissionBatchesDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                }}
            >
                Historial de cargues
            </DialogTitle>

            <DialogContent>
                <Stack
                    spacing={2}
                    sx={{
                        mt: 1,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                        }}
                    >
                        Consulta los candidatos que formaban
                        parte de cada cargue al momento de su
                        cierre.
                    </Typography>

                    {batches.length === 0 ? (
                        <EmptyState
                            title="No hay cargues registrados"
                            description="Aún no existen registros de cargues de candidatos."
                        />
                    ) : (
                        batches.map((batch) => (
                            <CustomAccordion
                                key={batch.id}
                                title={`Cargue ${batch.submissionNumber}`}
                                titleAdornment={
                                    <CustomChip
                                        label={`${batch.candidates.length} candidatos`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                }
                            >
                                <Stack spacing={2}>
                                    {/* Información general del cierre. */}
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                sm: "repeat(2, minmax(0, 1fr))",
                                            },
                                            gap: 2,
                                        }}
                                    >
                                        <InfoItem
                                            label="Fecha de cierre"
                                            value={formatDate(
                                                batch.closedAt
                                            )}
                                        />

                                        <InfoItem
                                            label="Cerrado por"
                                            value={
                                                batch.closedBy?.name ??
                                                "Usuario no disponible"
                                            }
                                        />
                                    </Box>

                                    <Divider />

                                    {/* Candidatos pertenecientes al cargue. */}
                                    <Stack spacing={1}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            Candidatos
                                        </Typography>

                                        {batch.candidates.map(
                                            (candidate) => (
                                                <Box
                                                    key={
                                                        candidate.id
                                                    }
                                                    sx={{
                                                        p: 1.25,
                                                        border: 1,
                                                        borderColor:
                                                            "divider",
                                                        borderRadius: 1,
                                                        bgcolor:
                                                            "background.default",
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                fontWeight:
                                                                    700,
                                                            }}
                                                        >
                                                            {
                                                                candidate.itemNumber
                                                            }
                                                            .
                                                        </Box>{" "}
                                                        {
                                                            candidate.identificationTypeCode
                                                        }{" "}
                                                        {
                                                            candidate.identificationNumber
                                                        }{" "}
                                                        -{" "}
                                                        {
                                                            candidate.candidateName
                                                        }
                                                    </Typography>
                                                </Box>
                                            )
                                        )}
                                    </Stack>
                                </Stack>
                            </CustomAccordion>
                        ))
                    )}
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                }}
            >
                <ActionButton
                    actionType="cancel"
                    onClick={onClose}
                >
                    Cerrar
                </ActionButton>
            </DialogActions>
        </Dialog>
    );
};

export default PersonnelCandidateSubmissionBatchesDialog;
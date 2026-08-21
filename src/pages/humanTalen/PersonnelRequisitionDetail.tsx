import {
    Alert,
    Box,
    CircularProgress,
    Stack,
} from "@mui/material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import ActionButton from "../../components/common/ActionButton";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";

import PersonnelApprovalCard from "../../components/humanTalent/PersonnelApprovalCard";
import InfoItem from "../../components/common/InfoItem";
import PersonnelRequisitionStatusBadge from "../../components/humanTalent/PersonnelRequisitionStatusBadge";

import { usePersonnelRequisitionDetail } from "../../hooks/humanTalent/usePersonnelRequisitionDetail";

import {
    contractTypeOptions,
    directContractTypeOptions,
    internContractTypeOptions,
    requisitionReasonOptions,
} from "../../data/humanTalentOptions";

import { formatDate } from "../../utils/common/dateUtils";
import { getOptionLabel } from "../../utils/common/formatText";

import {
    formatOptionalMoney,
    getHiringApprovalSlots,
    getRequisitionApprovalSlots,
} from "../../utils/humanTalent/personnelRequisitionUtils";
import PersonnelRequisitionCandidatesSection from "../../components/humanTalent/PersonnelRequisitionCandidatesSection";

// Página que muestra el detalle completo de una requisición de personal.
const PersonnelRequisitionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const requisitionId = Number(id);

    const {
        requisition,
        loading,
        error,
    } = usePersonnelRequisitionDetail(
        requisitionId
    );

    // Regresa al listado general de requisiciones.
    const handleRequisitions = () => {
        navigate(
            "/dashboard/human-talent/requisitions"
        );
    };

    // Abre la página del formato imprimible.
    const handlePrint = () => {
        navigate(
            `/dashboard/human-talent/requisitions/${requisitionId}/format?print=1`
        );
    };

    if (loading) {
        return (
            <PageContainer>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 6,
                    }}
                >
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Alert severity="error">
                    {error}
                </Alert>
            </PageContainer>
        );
    }

    if (!requisition) {
        return (
            <PageContainer>
                <Alert severity="info">
                    No se encontró la requisición solicitada.
                </Alert>
            </PageContainer>
        );
    }

    // Organiza las aprobaciones iniciales en los espacios
    // correspondientes del formato.
    const requisitionApprovalSlots =
        getRequisitionApprovalSlots(
            requisition.approvals
        );

    // Organiza las aprobaciones de Talento Humano.
    const hiringApprovalSlots =
        getHiringApprovalSlots(
            requisition
                .hiringConfirmation
                ?.approvals
        );

    return (
        <PageContainer>
            <PageHeader
                title={`Detalle de requisición #${requisition.id}`}
                subtitle="Consulta la información de la requisición, sus aprobaciones y la confirmación de Talento Humano."
                titleAdornment={
                    <PersonnelRequisitionStatusBadge
                        requisition={requisition}
                    />
                }
                actions={
                    <>
                        <ActionButton
                            actionType="back"
                            tooltip="Volver"
                            iconOnlyOnMobile
                            onClick={
                                handleRequisitions
                            }
                        >
                            Volver
                        </ActionButton>

                        <ActionButton
                            actionType="view"
                            tooltip="Generar formato"
                            iconOnlyOnMobile
                            onClick={handlePrint}
                        >
                            Ver formato imprimible
                        </ActionButton>
                    </>
                }
            />

            <Stack spacing={2.5}>
                <SectionCard
                    title="Información general"
                    subtitle="Datos principales de la requisición."
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >

                        <InfoItem
                            label="Solicitado por"
                            value={
                                requisition
                                    .createdBy
                                    ?.name
                            }
                        />

                        <InfoItem
                            label="Fecha solicitante"
                            value={formatDate(
                                requisition.requestDate
                            )}
                        />

                        <InfoItem
                            label="Departamento o área solicitante"
                            value={
                                requisition
                                    .department
                                    ?.name
                            }
                        />

                        <InfoItem
                            label="Cargo requerido"
                            value={
                                requisition
                                    .position
                                    ?.name
                            }
                        />

                        <InfoItem
                            label="Código perfil de cargo"
                            value={
                                requisition
                                    .position
                                    ?.code
                            }
                        />
                        <InfoItem
                            label="Revisión"
                            value={
                                requisition.positionRevision?.revisionNumber ??
                                "Sin revisión"
                            }
                        />

                        <InfoItem
                            label="Ciudad de labores"
                            value={
                                requisition.city?.name
                            }
                        />

                        <InfoItem
                            label="Motivo"
                            value={getOptionLabel(
                                requisition.reason,
                                requisitionReasonOptions
                            )}
                        />

                        <InfoItem
                            label="Descripción del motivo"
                            value={requisition.otherReason}
                        />
                    </Box>
                </SectionCard>

                <SectionCard title="Requerimientos de contratación">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(4, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        <InfoItem
                            label="Tipo de contratación"
                            value={getOptionLabel(
                                requisition.contractType,
                                contractTypeOptions
                            )}
                        />

                        <InfoItem
                            label="Tipo de contrato"
                            value={getOptionLabel(
                                requisition.directContractType,
                                directContractTypeOptions
                            )}
                        />

                        <InfoItem
                            label="Duración"
                            value={
                                requisition
                                    .contractDurationMonths
                                    ? `${requisition.contractDurationMonths} meses`
                                    : null
                            }
                        />

                        <InfoItem
                            label="Tipo practicante"
                            value={getOptionLabel(
                                requisition.internContractType,
                                internContractTypeOptions
                            )}
                        />

                        <InfoItem
                            label="Salario propuesto"
                            value={formatOptionalMoney(
                                requisition.proposedSalary
                            )}
                        />
                    </Box>
                </SectionCard>

                <SectionCard title="Aprobaciones de requisición">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        {requisitionApprovalSlots.map(
                            (slot) => (
                                <PersonnelApprovalCard
                                    key={
                                        slot.approval
                                            ?.id ??
                                        slot.title
                                    }
                                    title={
                                        slot.title
                                    }
                                    approval={
                                        slot.approval
                                    }
                                />
                            )
                        )}
                    </Box>
                </SectionCard>

                {requisition.hiringConfirmation && (
                    <SectionCard title="Confirmación de contratación">
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(4, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            <InfoItem
                                label="Tipo de contratación"
                                value={getOptionLabel(
                                    requisition
                                        .hiringConfirmation
                                        .contractType,
                                    contractTypeOptions
                                )}
                            />

                            <InfoItem
                                label="Tipo de contrato"
                                value={getOptionLabel(
                                    requisition
                                        .hiringConfirmation
                                        .directContractType,
                                    directContractTypeOptions
                                )}
                            />

                            <InfoItem
                                label="Duración"
                                value={
                                    requisition
                                        .hiringConfirmation
                                        .contractDurationMonths
                                        ? `${requisition.hiringConfirmation.contractDurationMonths} meses`
                                        : null
                                }
                            />

                            <InfoItem
                                label="Tipo practicante"
                                value={getOptionLabel(
                                    requisition
                                        .hiringConfirmation
                                        .internContractType,
                                    internContractTypeOptions
                                )}
                            />

                            <InfoItem
                                label="Salario aprobado"
                                value={formatOptionalMoney(
                                    requisition
                                        .hiringConfirmation
                                        .approvedSalary
                                )}
                            />
                        </Box>
                    </SectionCard>
                )}

                {requisition.hiringConfirmation && (
                    <SectionCard title="VoBo Talento Humano">
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {hiringApprovalSlots.map(
                                (slot) => (
                                    <PersonnelApprovalCard
                                        key={
                                            slot.approval?.id ??
                                            slot.title
                                        }
                                        title={slot.title}
                                        approval={
                                            slot.approval
                                        }
                                    />
                                )
                            )}
                        </Box>
                    </SectionCard>
                )}

                {requisition.candidateSubmissionStatus !==
                    "NO_INICIADA" && (
                        <PersonnelRequisitionCandidatesSection
                            requisitionId={requisition.id}
                            candidateSubmissionStatus={
                                requisition.candidateSubmissionStatus
                            }
                            candidateSubmissionDeadlineAt={
                                requisition.candidateSubmissionDeadlineAt
                            }
                            candidateSubmissionClosedAt={
                                requisition.candidateSubmissionClosedAt
                            }
                            candidateSubmissionLateReason={
                                requisition.candidateSubmissionLateReason
                            }
                        />
                    )}
            </Stack>
        </PageContainer>
    );
};

export default PersonnelRequisitionDetail;
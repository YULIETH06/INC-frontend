import { Fragment } from "react";
import {
    Alert,
    Box,
    CircularProgress,
    GlobalStyles,
    Stack,
    Typography,
} from "@mui/material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import ActionButton from "../../components/common/ActionButton";

import FormatLine from "../../components/humanTalent/requisitionFormat/FormatLine";
import FormatOptionBox from "../../components/humanTalent/requisitionFormat/FormatOptionBox";
import FormatSectionTitle from "../../components/humanTalent/requisitionFormat/FormatSectionTitle";
import FormatSignatureBox from "../../components/humanTalent/requisitionFormat/FormatSignatureBox";
import PersonnelRequisitionWatermark from "../../components/humanTalent/requisitionFormat/PersonnelRequisitionWatermark";

import { usePersonnelRequisitionDetail } from "../../hooks/humanTalent/usePersonnelRequisitionDetail";

import { appBrand } from "../../data/appBrand";

import {
    internContractTypeOptions,
    requisitionReasonOptions,
} from "../../data/humanTalentOptions";

import { formatDate } from "../../utils/common/dateUtils";

import {
    formatOptionalMoney,
    getHiringApprovalSlots,
    getRequisitionApprovalSlots,
} from "../../utils/humanTalent/personnelRequisitionUtils";

// Página independiente para visualizar e imprimir
// el formato de una requisición de personal.
const PersonnelRequisitionFormat = () => {
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

    // Imprime únicamente el formato de la requisición.
    const handlePrint = () => {
        window.print();
    };

    // Regresa al detalle de la requisición.
    const goBackToDetail = () => {
        navigate(
            `/dashboard/human-talent/requisitions/${requisitionId}`
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!requisition) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    No se encontró la requisición solicitada.
                </Alert>
            </Box>
        );
    }

    // Organiza las aprobaciones de la requisición
    // en los espacios fijos del formato.
    const requisitionApprovalSlots =
        getRequisitionApprovalSlots(
            requisition.approvals
        );

    // Organiza los VoBo de Talento Humano.
    const hiringApprovalSlots =
        getHiringApprovalSlots(
            requisition
                .hiringConfirmation
                ?.approvals
        );

    return (
        <>
            <GlobalStyles
                styles={{
                    "@page": {
                        size: "letter",
                        margin: "0",
                    },

                    "@media print": {
                        "html, body": {
                            margin: "0 !important",
                            padding: "0 !important",
                            backgroundColor:
                                "#fff !important",
                        },

                        "body *": {
                            visibility: "hidden !important",

                        },

                        "#requisition-print-area, #requisition-print-area *": {
                            visibility: "visible !important",
                            WebkitPrintColorAdjust: "exact",
                            printColorAdjust: "exact",
                        },

                        // Única fuente de verdad para el tamaño/posición en impresión
                        "#requisition-print-area": {
                            // position: "fixed !important",
                            position:
                                "absolute !important",
                            inset: "0 !important",
                            left: "0 !important",
                            top: "0 !important",
                            width: "auto !important",
                            minHeight:
                                "279mm !important",
                            margin: "0 !important",
                            padding:
                                "5mm !important",
                            boxShadow:
                                "none !important",
                            overflow: "visible !important"

                        },

                        ".no-print": {
                            display: "none !important",
                        },
                    },
                }}
            />

            <Box
                sx={{
                    minHeight: "100vh",
                    py: 3,
                    px: {
                        xs: 1,
                        md: 3,
                    },
                    backgroundColor: "#f5f5f5",

                    "@media print": {
                        py: 0,
                        px: 0,
                        backgroundColor: "#fff",
                    },
                }}
            >
                {/* Acciones que no se muestran al imprimir */}
                <Stack
                    className="no-print"
                    direction="row"
                    spacing={1}
                    sx={{
                        mb: 2,
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <ActionButton
                        actionType="back"
                        iconOnlyOnMobile
                        onClick={goBackToDetail}
                    >
                        Volver al detalle
                    </ActionButton>

                    <ActionButton
                        actionType="print"
                        iconOnlyOnMobile
                        onClick={handlePrint}
                    >
                        Imprimir formato 
                    </ActionButton>
                </Stack>

                {/* Área imprimible */}
                <Box
                    id="requisition-print-area"
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        boxSizing: "border-box",
                        width: "216mm",
                        minHeight: "279mm",
                        mx: "auto",
                        p: "5mm",
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
                        color: "#000",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Estado general y comentario como marca de agua */}
                    <PersonnelRequisitionWatermark
                        requisition={requisition}
                    />

                    {/* Contenido principal sobre la marca de agua */}
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            border: "1px solid #000",
                            display: "flex",          
                            flexDirection: "column",
                            flex: 1,
                        }}
                    >
                        {/* Encabezado */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "90px minmax(0, 1fr)",
                                minHeight: "68px",
                            }}
                        >
                            <Box
                                sx={{
                                    p: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",
                                    borderRight:
                                        "1px solid #000",
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={
                                        appBrand.logoIcon
                                    }
                                    alt={appBrand.logoAlt}
                                    sx={{
                                        width: "100%",
                                        maxWidth: "70px",
                                        maxHeight: "48px",
                                        objectFit:
                                            "contain",
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    justifyContent:
                                        "center",
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "14px",
                                        fontWeight: 700,
                                    }}
                                >
                                    LABORATORIOS INCOBRA S.A.
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "13px",
                                        fontWeight: 700,
                                    }}
                                >
                                    REQUISICIÓN DE PERSONAL
                                </Typography>
                            </Box>
                        </Box>

                        {/* Información general */}
                        <FormatSectionTitle
                            title="Información general"
                        />

                        <Box sx={{ p: 1 }}>
                            <FormatLine
                                label="Fecha solicitante"
                                value={formatDate(
                                    requisition.requestDate
                                )}
                            />

                            <FormatLine
                                label="Solicitado por"
                                value={
                                    requisition
                                        .createdBy
                                        ?.name
                                }
                            />

                            <FormatLine
                                label="Departamento o área solicitante"
                                value={
                                    requisition
                                        .department
                                        ?.name
                                }
                            />

                            <FormatLine
                                label="Cargo requerido"
                                value={
                                    requisition
                                        .position
                                        ?.name
                                }
                            />


                            {/* Agrupar la codigo y revisión de cargo en una misma fila. */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "minmax(0, 1fr) 180px",
                                    gap: 2,
                                }}
                            >
                                <FormatLine
                                    label="Código perfil de cargo"
                                    value={
                                        requisition
                                            .position
                                            ?.code
                                    }
                                />
                                <FormatLine
                                    label="Revisión"
                                    labelWidth="70px"
                                    value={
                                        requisition.positionRevision?.revisionNumber ??
                                        ""
                                    }
                                />
                            </Box>

                            <FormatLine
                                label="Ciudad de labores"
                                value={
                                    requisition.city
                                        ?.name
                                }
                            />
                        </Box>

                        {/* Motivo de la requisición */}
                        <FormatSectionTitle
                            title="Motivo de requisición"
                        />

                        <Box
                            sx={{
                                p: 1,
                                display: "grid",
                                gridTemplateColumns:
                                    "260px minmax(0, 1fr)",
                                gap: 0.8,
                            }}
                        >
                            {requisitionReasonOptions.map(
                                (option) => {
                                    const isSelected =
                                        requisition.reason ===
                                        option.value;

                                    return (
                                        <Fragment key={option.value}>
                                            <FormatOptionBox
                                                label={option.label}
                                                checked={isSelected}
                                            />

                                            {/* Muestra la descripción junto al motivo seleccionado. */}
                                            <Box
                                                sx={{
                                                    minWidth: 0,
                                                    minHeight: "18px",
                                                    px: 0.8,
                                                    borderBottom:
                                                        "1px solid #000",
                                                    fontSize: "11px",
                                                    overflowWrap:
                                                        "anywhere",
                                                }}
                                            >
                                                {isSelected
                                                    ? requisition.otherReason ??
                                                    ""
                                                    : ""}
                                            </Box>
                                        </Fragment>
                                    );
                                }
                            )}
                        </Box>

                        {/* Requerimientos de contratación */}
                        <FormatSectionTitle
                            title="Requerimientos de contratación"
                        />

                        <Box sx={{ p: 1 }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <FormatOptionBox
                                    label="Directo"
                                    checked={
                                        requisition.contractType ===
                                        "DIRECTO"
                                    }
                                />

                                <FormatOptionBox
                                    label="Temporal"
                                    checked={
                                        requisition.contractType ===
                                        "TEMPORAL"
                                    }
                                />

                                <FormatOptionBox
                                    label="Practicante"
                                    checked={
                                        requisition.contractType ===
                                        "PRACTICANTE"
                                    }
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <FormatOptionBox
                                    label="Indefinido"
                                    checked={
                                        requisition.directContractType ===
                                        "INDEFINIDO"
                                    }
                                />

                                <FormatOptionBox
                                    label="Fijo"
                                    checked={
                                        requisition.directContractType ===
                                        "FIJO"
                                    }
                                />

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                    }}
                                >
                                    Duración:{" "}
                                    {requisition
                                        .contractDurationMonths ||
                                        "____"}{" "}
                                    meses
                                </Typography>
                            </Box>

                            {/* Tipo de practicante solicitado */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                {internContractTypeOptions.map(
                                    (option) => (
                                        <FormatOptionBox
                                            key={
                                                option.value
                                            }
                                            label={
                                                option.label
                                            }
                                            checked={
                                                String(
                                                    requisition.internContractType ??
                                                    ""
                                                ) ===
                                                option.value
                                            }
                                        />
                                    )
                                )}
                            </Box>

                            <FormatLine
                                label="Salario propuesto"
                                value={formatOptionalMoney(
                                    requisition.proposedSalary
                                )}
                            />
                        </Box>

                        {/* Aprobaciones de la requisición */}
                        <FormatSectionTitle
                            title="Aprobaciones de requisición"
                        />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(3, minmax(0, 1fr))",
                                gap: 2,
                                p: 1,
                            }}
                        >
                            {requisitionApprovalSlots.map(
                                (slot, index) => (
                                    <FormatSignatureBox
                                        key={
                                            slot
                                                .approval
                                                ?.id ??
                                            `approval-${index}`
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

                        {/* Confirmación de contratación */}
                        <FormatSectionTitle
                            title="Confirmación de contratación"
                        />

                        <Box sx={{ p: 1 }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <FormatOptionBox
                                    label="Directo"
                                    checked={
                                        requisition
                                            .hiringConfirmation
                                            ?.contractType ===
                                        "DIRECTO"
                                    }
                                />

                                <FormatOptionBox
                                    label="Temporal"
                                    checked={
                                        requisition
                                            .hiringConfirmation
                                            ?.contractType ===
                                        "TEMPORAL"
                                    }
                                />

                                <FormatOptionBox
                                    label="Practicante"
                                    checked={
                                        requisition
                                            .hiringConfirmation
                                            ?.contractType ===
                                        "PRACTICANTE"
                                    }
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <FormatOptionBox
                                    label="Indefinido"
                                    checked={
                                        requisition
                                            .hiringConfirmation
                                            ?.directContractType ===
                                        "INDEFINIDO"
                                    }
                                />

                                <FormatOptionBox
                                    label="Fijo"
                                    checked={
                                        requisition
                                            .hiringConfirmation
                                            ?.directContractType ===
                                        "FIJO"
                                    }
                                />

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                    }}
                                >
                                    Duración:{" "}
                                    {requisition
                                        .hiringConfirmation
                                        ?.contractDurationMonths ||
                                        "____"}{" "}
                                    meses
                                </Typography>
                            </Box>

                            {/* Tipo de practicante aprobado */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, minmax(0, 1fr))",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                {internContractTypeOptions.map(
                                    (option) => (
                                        <FormatOptionBox
                                            key={
                                                option.value
                                            }
                                            label={
                                                option.label
                                            }
                                            checked={
                                                String(
                                                    requisition
                                                        .hiringConfirmation
                                                        ?.internContractType ??
                                                    ""
                                                ) ===
                                                option.value
                                            }
                                        />
                                    )
                                )}
                            </Box>

                            <FormatLine
                                label="Salario aprobado"
                                value={formatOptionalMoney(
                                    requisition
                                        .hiringConfirmation
                                        ?.approvedSalary
                                )}
                            />
                        </Box>

                        {/* VoBo de Talento Humano */}
                        <FormatSectionTitle
                            title="VoBo Talento Humano"
                        />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: 2,
                                p: 1,
                            }}
                        >
                            {hiringApprovalSlots.map(
                                (slot, index) => (
                                    <FormatSignatureBox
                                        key={
                                            slot
                                                .approval
                                                ?.id ??
                                            `vobo-${index}`
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
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default PersonnelRequisitionFormat;
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import RadioOptionGroup from "../../common/RadioOptionGroup";

import type {
    CandidateValidationForm,
    CandidateValidationFormErrors,
    CandidateValidationRequirementDescription,
} from "../../../interfaces/humanTalent/personnelCandidateValidation.interface";

interface RequirementGroup {
    requirementId: number;
    requirementName: string;

    descriptions: {
        description:
        CandidateValidationRequirementDescription;
        index: number;
    }[];
}

interface CandidateRequirementValidationTableProps {
    requirementGroups: RequirementGroup[];

    form: CandidateValidationForm;
    formErrors: CandidateValidationFormErrors;

    disabled: boolean;

    onCompliesChange: (
        index: number,
        value: boolean
    ) => void;

    onEvidenceChange: (
        index: number,
        value: string
    ) => void;

    onGapClosureChange: (
        index: number,
        value: string
    ) => void;
}

const compliesOptions = [
    {
        value: "false",
        label: "No",
    },
    {
        value: "true",
        label: "Sí",
    },
];

// Tabla para evaluar los requisitos del postulante.
const CandidateRequirementValidationTable = ({
    requirementGroups,
    form,
    formErrors,
    disabled,
    onCompliesChange,
    onEvidenceChange,
    onGapClosureChange,
}: CandidateRequirementValidationTableProps) => {
    return (
        <TableContainer
            sx={{
                width: "100%",
                overflowX: "auto",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
            }}
        >
            <Table
                size="small"
                sx={{
                    minWidth: 900,
                    tableLayout: "fixed",

                    "& .MuiTableCell-root": {
                        borderColor: "divider",
                    },
                }}
            >
                <TableHead>
                    <TableRow
                        sx={{
                            bgcolor:
                                "background.default",
                        }}
                    >
                        <TableCell
                            sx={{
                                width: "18%",
                                fontWeight: 700,
                                py: 1.25,
                                px: 1.5,
                            }}
                        >
                            Requerimiento
                        </TableCell>

                        <TableCell
                            sx={{
                                width: "32%",
                                fontWeight: 700,
                                py: 1.25,
                                px: 1.5,
                            }}
                        >
                            Descripción
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                width: "16%",
                                fontWeight: 700,
                                py: 1.25,
                                px: 1,
                            }}
                        >
                            Cumple
                        </TableCell>

                        <TableCell
                            sx={{
                                width: "34%",
                                fontWeight: 700,
                                py: 1.25,
                                px: 1.5,
                            }}
                        >
                            Evidencia / Cierre de brecha
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {requirementGroups.map(
                        (group) =>
                            group.descriptions.map(
                                (
                                    {
                                        description,
                                        index,
                                    },
                                    descriptionIndex
                                ) => {
                                    const requirementForm =
                                        form.requirementValidations[
                                        index
                                        ];

                                    const requirementErrors =
                                        formErrors
                                            .requirementValidations[
                                        index
                                        ];

                                    if (
                                        !requirementForm
                                    ) {
                                        return null;
                                    }

                                    const compliesValue =
                                        requirementForm.complies ===
                                            null
                                            ? ""
                                            : String(
                                                requirementForm.complies
                                            );

                                    return (
                                        <TableRow
                                            key={
                                                description.id
                                            }
                                            sx={{
                                                "&:last-child td":
                                                {
                                                    borderBottom: 0,
                                                },
                                            }}
                                        >
                                            {descriptionIndex ===
                                                0 && (
                                                    <TableCell
                                                        rowSpan={
                                                            group
                                                                .descriptions
                                                                .length
                                                        }
                                                        sx={{
                                                            verticalAlign:
                                                                "middle",
                                                            fontWeight: 700,
                                                            bgcolor:
                                                                "background.default",
                                                            py: 1.5,
                                                            px: 1.5,
                                                        }}
                                                    >
                                                        {
                                                            group.requirementName
                                                        }
                                                    </TableCell>
                                                )}

                                            <TableCell
                                                sx={{
                                                    verticalAlign:
                                                        "middle",
                                                    py: 1.5,
                                                    px: 1.5,
                                                    whiteSpace:
                                                        "pre-wrap",
                                                    overflowWrap:
                                                        "anywhere",
                                                }}
                                            >
                                                {
                                                    description.description
                                                }
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                sx={{
                                                    verticalAlign:
                                                        "middle",
                                                    py: 1,
                                                    px: 1,
                                                }}
                                            >
                                                <RadioOptionGroup
                                                    value={
                                                        compliesValue
                                                    }
                                                    options={
                                                        compliesOptions
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onCompliesChange(
                                                            index,
                                                            value ===
                                                            "true"
                                                        )
                                                    }
                                                    error={
                                                        requirementErrors
                                                            ?.complies
                                                    }
                                                    required
                                                    disabled={
                                                        disabled
                                                    }
                                                />
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    verticalAlign:
                                                        "middle",
                                                    py: 1,
                                                    px: 1.5,
                                                }}
                                            >
                                                {requirementForm.complies ===
                                                    null && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Seleccione Sí o No
                                                        </Typography>
                                                    )}

                                                {requirementForm.complies ===
                                                    true && (
                                                        <TextField
                                                            placeholder="Ingrese la evidencia de cumplimiento"
                                                            value={
                                                                requirementForm.evidence
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                onEvidenceChange(
                                                                    index,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            error={Boolean(
                                                                requirementErrors
                                                                    ?.evidence
                                                            )}
                                                            helperText={
                                                                requirementErrors
                                                                    ?.evidence
                                                            }
                                                            required
                                                            multiline
                                                            minRows={
                                                                1
                                                            }
                                                            maxRows={
                                                                3
                                                            }
                                                            fullWidth
                                                            size="small"
                                                            disabled={
                                                                disabled
                                                            }
                                                            slotProps={{
                                                                htmlInput:
                                                                {
                                                                    maxLength: 1000,
                                                                },
                                                            }}
                                                        />
                                                    )}

                                                {requirementForm.complies ===
                                                    false && (
                                                        <TextField
                                                            placeholder="Ingrese el cierre de brecha"
                                                            value={
                                                                requirementForm.gapClosure
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                onGapClosureChange(
                                                                    index,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            error={Boolean(
                                                                requirementErrors
                                                                    ?.gapClosure
                                                            )}
                                                            helperText={
                                                                requirementErrors
                                                                    ?.gapClosure
                                                            }
                                                            required
                                                            multiline
                                                            minRows={
                                                                1
                                                            }
                                                            maxRows={
                                                                3
                                                            }
                                                            fullWidth
                                                            size="small"
                                                            disabled={
                                                                disabled
                                                            }
                                                            slotProps={{
                                                                htmlInput:
                                                                {
                                                                    maxLength: 1000,
                                                                },
                                                            }}
                                                        />
                                                    )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CandidateRequirementValidationTable;
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import RadioOptionGroup from "../../common/RadioOptionGroup";

import {
    candidateCompetencyResultOptions,
} from "../../../data/humanTalentOptions";

import type {
    CandidateCompetencyEvaluationForm,
    CandidateCompetencyEvaluationFormErrors,
    CandidateCompetencyResult,
    CandidateValidationCompetencyDescription,
} from "../../../interfaces/humanTalent/candidateValidation/personnelCandidateValidation.interface";

interface CompetencyGroup {
    competencyTypeId: number;
    competencyTypeName: string;

    competencies: {
        description:
        CandidateValidationCompetencyDescription;
        index: number;
    }[];
}

interface CandidateCompetencyValidationTableProps {
    competencyGroups: CompetencyGroup[];

    form: CandidateCompetencyEvaluationForm;
    formErrors: CandidateCompetencyEvaluationFormErrors;

    disabled: boolean;

    onResultChange: (
        index: number,
        value: CandidateCompetencyResult
    ) => void;
}

// Tabla para evaluar las competencias del postulante.
const CandidateCompetencyValidationTable = ({
    competencyGroups,
    form,
    formErrors,
    disabled,
    onResultChange,
}: CandidateCompetencyValidationTableProps) => {
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
                    minWidth: 720,
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
                                width: "25%",
                                fontWeight: 700,
                                py: 1.25,
                                px: 1.5,
                            }}
                        >
                            Tipo de competencia
                        </TableCell>

                        <TableCell
                            sx={{
                                width: "40%",
                                fontWeight: 700,
                                py: 1.25,
                                px: 1.5,
                            }}
                        >
                            Competencia
                        </TableCell>

                        <TableCell
                            align="center"
                            sx={{
                                width: "35%",
                                fontWeight: 700,
                                py: 1.25,
                                px: 1,
                            }}
                        >
                            Resultado
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {competencyGroups.map(
                        (group) =>
                            group.competencies.map(
                                (
                                    {
                                        description,
                                        index,
                                    },
                                    competencyIndex
                                ) => {
                                    const competencyForm =
                                        form.competencyValidations[
                                        index
                                        ];

                                    const competencyErrors =
                                        formErrors
                                            .competencyValidations[
                                        index
                                        ];

                                    if (!competencyForm) {
                                        return null;
                                    }

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
                                            {competencyIndex ===
                                                0 && (
                                                    <TableCell
                                                        rowSpan={
                                                            group
                                                                .competencies
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
                                                            group.competencyTypeName
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
                                                    description.competency
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
                                                        competencyForm.result
                                                    }
                                                    options={
                                                        candidateCompetencyResultOptions
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onResultChange(
                                                            index,
                                                            value as CandidateCompetencyResult
                                                        )
                                                    }
                                                    error={
                                                        competencyErrors
                                                            ?.result
                                                    }
                                                    required
                                                    disabled={
                                                        disabled
                                                    }
                                                />
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

export default CandidateCompetencyValidationTable;
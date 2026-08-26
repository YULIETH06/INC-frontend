import {
    Alert,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import ActionButton from "../../common/ActionButton";
import ClearableSelect from "../../common/ClearableSelect";

import NumberInput from "../../common/inputs/NumberInput";
import MoneyInput from "../../common/inputs/MoneyInput";

import {
    contractTypeOptions,
    directContractTypeOptions,
    internContractTypeOptions,
} from "../../../data/humanTalentOptions";

import type {
    PersonnelRequisition,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";

interface HiringConfirmationForm {
    contractType: string;
    directContractType: string;
    contractDurationMonths: string;
    internContractType: string;
    approvedSalary: string;
}

interface PersonnelHiringConfirmationDialogProps {
    open: boolean;
    loading: boolean;
    requisition: PersonnelRequisition | null;
    form: HiringConfirmationForm;
    isValid: boolean;

    onChange: (
        field: keyof HiringConfirmationForm,
        value: string
    ) => void;

    onClose: () => void;
    onConfirm: () => void;
}

// Modal para registrar la confirmación final de contratación.
const PersonnelHiringConfirmationDialog = ({
    open,
    loading,
    requisition,
    form,
    isValid,
    onChange,
    onClose,
    onConfirm,
}: PersonnelHiringConfirmationDialogProps) => {
    const showDirectContractType =
        form.contractType === "DIRECTO";

    const showContractDuration =
        form.contractType === "TEMPORAL" ||
        (
            form.contractType === "DIRECTO" &&
            form.directContractType === "FIJO"
        );

    const showInternContractType =
        form.contractType === "PRACTICANTE";

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                }}
            >
                Confirmar contratación
            </DialogTitle>

            <DialogContent>
                {requisition && (
                    <Alert
                        severity="info"
                        sx={{
                            mb: 2,
                        }}
                    >
                        {requisition.position.name} -{" "}
                        {requisition.department.name}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 2,
                        mt: 1,
                    }}
                >
                    <ClearableSelect
                        label="Tipo de contrato"
                        value={form.contractType}
                        required
                        clearable
                        disabled={loading}
                        options={contractTypeOptions}
                        onChange={(value) =>
                            onChange(
                                "contractType",
                                value
                            )
                        }
                    />

                    {showDirectContractType && (
                        <ClearableSelect
                            label="Tipo de contrato directo"
                            value={form.directContractType}
                            required
                            clearable
                            disabled={loading}
                            options={
                                directContractTypeOptions
                            }
                            onChange={(value) =>
                                onChange(
                                    "directContractType",
                                    value
                                )
                            }
                        />
                    )}

                    {showContractDuration && (
                        <NumberInput
                            label="Duración en meses"
                            value={
                                form.contractDurationMonths
                            }
                            required
                            disabled={loading}
                            onChange={(value) =>
                                onChange(
                                    "contractDurationMonths",
                                    value
                                )
                            }
                        />
                    )}

                    {showInternContractType && (
                        <ClearableSelect
                            label="Tipo de practicante"
                            value={form.internContractType}
                            required
                            clearable
                            disabled={loading}
                            options={
                                internContractTypeOptions
                            }
                            onChange={(value) =>
                                onChange(
                                    "internContractType",
                                    value
                                )
                            }
                        />
                    )}

                    <MoneyInput
                        label="Salario aprobado"
                        value={form.approvedSalary}
                        required
                        disabled={loading}
                        onChange={(value) =>
                            onChange(
                                "approvedSalary",
                                value
                            )
                        }
                    />
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                <ActionButton
                    actionType="cancel"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancelar
                </ActionButton>

                <ActionButton
                    actionType="save"
                    loading={loading}
                    loadingText="Guardando..."
                    disabled={!isValid}
                    onClick={onConfirm}
                >
                    Guardar
                </ActionButton>
            </DialogActions>
        </Dialog>
    );
};

export default PersonnelHiringConfirmationDialog;
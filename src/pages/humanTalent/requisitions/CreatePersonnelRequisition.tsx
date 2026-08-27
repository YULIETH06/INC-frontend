import { Box } from "@mui/material";

import PageHeader from "../../../components/common/PageHeader";
import FormSection from "../../../components/common/FormSection";
import FormGrid from "../../../components/common/FormGrid";
import ClearableSelect from "../../../components/common/ClearableSelect";
import CustomSnackbar from "../../../components/common/CustomSnackbar";
import LoadingBox from "../../../components/common/LoadingBox";
import ActionButton from "../../../components/common/ActionButton";
import PageContainer from "../../../components/common/PageContainer";

import TextAreaInput from "../../../components/common/inputs/TextAreaInput";
import NumberInput from "../../../components/common/inputs/NumberInput";
import MoneyInput from "../../../components/common/inputs/MoneyInput";
import TextInput from "../../../components/common/inputs/TextInput";

import { useCreatePersonnelRequisition } from "../../../hooks/humanTalent/requisitions/useCreatePersonnelRequisition";

import {
    contractTypeOptions,
    directContractTypeOptions,
    internContractTypeOptions,
    requisitionReasonOptions,
} from "../../../data/humanTalentOptions";

// Página donde el usuario crea una requisición de personal.
const CreatePersonnelRequisition = () => {
    const {
        departmentId,
        positionId,
        currentPositionRevision,
        reason,
        otherReason,
        cityId,
        contractType,
        directContractType,
        contractDurationMonths,
        internContractType,
        proposedSalary,

        departments,
        positionProfiles,
        cities,

        loadingData,
        loadingSubmit,
        loadingPositionRevision,
        hasFormChanges,

        message,
        messageSeverity,
        openMessage,
        error,
        formErrors,

        handleDepartmentChange,
        handlePositionChange,
        handleReasonChange,
        handleOtherReasonChange,
        handleCityChange,
        handleContractTypeChange,
        handleDirectContractTypeChange,
        handleContractDurationMonthsChange,
        handleInternContractTypeChange,
        handleProposedSalaryChange,
        handleCreatePersonnelRequisition,
        closeMessage,
        resetForm,
    } = useCreatePersonnelRequisition();

    const selectedPosition = positionProfiles.find(
        (position) => String(position.id) === positionId
    );

    const departmentOptions = departments.map((department) => ({
        label: department.name,
        value: String(department.id),
    }));

    const positionProfileOptions = positionProfiles.map((position) => ({
        label: position.name,
        value: String(position.id),
    }));

    const cityOptions = cities.map((city) => ({
        label: city.name,
        value: String(city.id),
    }));

    const showDirectContractType = contractType === "DIRECTO";

    const showContractDuration =
        contractType === "TEMPORAL" ||
        (contractType === "DIRECTO" && directContractType === "FIJO");

    const showInternContractType = contractType === "PRACTICANTE";

    if (loadingData) {
        return <LoadingBox />;
    }

    return (
        <PageContainer>
            <PageHeader
                title="Crear requisición de personal"
                subtitle="Registra una solicitud de personal indicando el área, cargo, ciudad, motivo, tipo de contratación y salario propuesto."
                actions={
                    <>
                        <ActionButton
                            actionType="clear"
                            tooltip="Limpiar formulario"
                            onClick={resetForm}
                            disabled={!hasFormChanges || loadingSubmit}
                            fullWidthOnMobile
                        >
                            Limpiar
                        </ActionButton>

                        <ActionButton
                            actionType="save"
                            type="submit"
                            form="create-personnel-requisition-form"
                            loading={loadingSubmit}
                            loadingText="Creando..."
                            tooltip="Crear requisición"
                            fullWidthOnMobile
                        >
                            Crear requisición
                        </ActionButton>
                    </>
                }
            />

            {/* Formulario de creación de requisición de personal. */}
            <Box
                id="create-personnel-requisition-form"
                component="form"
                onSubmit={handleCreatePersonnelRequisition}
                noValidate
                sx={{
                    display: "grid",
                    gap: 2,
                }}
            >
                <FormSection title="Información de la solicitud">
                    <FormGrid
                        columns={{
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                        }}
                    >
                        <ClearableSelect
                            label="Área solicitante"
                            value={departmentId}
                            required
                            clearable
                            options={departmentOptions}
                            error={formErrors.departmentId}
                            onChange={handleDepartmentChange}
                        />

                        <ClearableSelect
                            label="Cargo requerido"
                            value={positionId}
                            required
                            clearable
                            options={positionProfileOptions}
                            error={formErrors.positionId}
                            disabled={!departmentId}
                            onChange={handlePositionChange}
                        />

                        <TextInput
                            label="Código del perfil de cargo"
                            value={selectedPosition?.code || ""}
                            readOnly
                        />

                        <TextInput
                            label="Revisión"
                            value={
                                loadingPositionRevision
                                    ? "Consultando..."
                                    : String(
                                        currentPositionRevision?.revisionNumber ?? ""
                                    )
                            }
                            readOnly
                            required
                            error={Boolean(formErrors.positionRevisionId)}
                            helperText={formErrors.positionRevisionId}
                        />

                        <ClearableSelect
                            label="Ciudad"
                            value={cityId}
                            required
                            clearable
                            options={cityOptions}
                            error={formErrors.cityId}
                            onChange={handleCityChange}
                        />
                    </FormGrid>
                </FormSection>

                <FormSection title="Motivo de la requisición">
                    <FormGrid
                        columns={{
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                        }}
                    >
                        <ClearableSelect
                            label="Motivo"
                            value={reason}
                            required
                            clearable
                            options={requisitionReasonOptions}
                            error={formErrors.reason}
                            onChange={handleReasonChange}
                        />

                        <TextAreaInput
                            label="Descripción del motivo"
                            required
                            value={otherReason}
                            onChange={handleOtherReasonChange}
                            rows={3}
                            error={Boolean(formErrors.otherReason)}
                            helperText={
                                formErrors.otherReason
                                    ? formErrors.otherReason
                                    : `${otherReason.length}/300`
                            }
                            slotProps={{
                                htmlInput: {
                                    maxLength: 300,
                                },
                            }}
                        />
                    </FormGrid>
                </FormSection>

                <FormSection title="Requerimientos de contratación">
                    <FormGrid
                        columns={{
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                            lg: "repeat(3, minmax(0, 1fr))",
                        }}
                    >
                        <ClearableSelect
                            label="Tipo de contratación"
                            value={contractType}
                            required
                            clearable
                            options={contractTypeOptions}
                            error={formErrors.contractType}
                            onChange={handleContractTypeChange}
                        />

                        {showDirectContractType && (
                            <ClearableSelect
                                label="Tipo de contrato directo"
                                value={directContractType}
                                required
                                clearable
                                options={directContractTypeOptions}
                                error={formErrors.directContractType}
                                onChange={handleDirectContractTypeChange}
                            />
                        )}

                        {showContractDuration && (
                            <NumberInput
                                label="Duración en meses"
                                required
                                value={contractDurationMonths}
                                onChange={handleContractDurationMonthsChange}
                                error={Boolean(
                                    formErrors.contractDurationMonths
                                )}
                                helperText={
                                    formErrors.contractDurationMonths
                                }
                            />
                        )}

                        {showInternContractType && (
                            <ClearableSelect
                                label="Tipo de practicante"
                                value={internContractType}
                                required
                                clearable
                                options={internContractTypeOptions}
                                error={formErrors.internContractType}
                                onChange={handleInternContractTypeChange}
                            />
                        )}

                        <MoneyInput
                            label="Salario propuesto"
                            required
                            value={proposedSalary}
                            onChange={handleProposedSalaryChange}
                            error={Boolean(formErrors.proposedSalary)}
                            helperText={formErrors.proposedSalary}
                        />
                    </FormGrid>
                </FormSection>
            </Box>

            <CustomSnackbar
                open={openMessage || Boolean(error)}
                message={error || message}
                severity={error ? "error" : messageSeverity}
                onClose={closeMessage}
            />
        </PageContainer>
    );
};

export default CreatePersonnelRequisition;
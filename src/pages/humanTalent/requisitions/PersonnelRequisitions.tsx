import { useState } from "react";
import { ValidationError } from "yup";

import { Alert, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../../components/common/PageContainer";
import PageHeader from "../../../components/common/PageHeader";
import CustomSnackbar from "../../../components/common/CustomSnackbar";
import EmptyState from "../../../components/common/EmptyState";
import ConfirmActionDialog from "../../../components/common/ConfirmActionDialog";
import ListToolbar from "../../../components/common/ListToolbar";
import ActionButton from "../../../components/common/ActionButton";

import ClearableSelect from "../../../components/common/inputs/ClearableSelect";
import DateInput from "../../../components/common/inputs/DateInput";
import MoneyInput from "../../../components/common/inputs/MoneyInput";

import PersonnelRequisitionListItem from "../../../components/humanTalent/requisitions/PersonnelRequisitionListItem";
import PersonnelHiringConfirmationDialog from "../../../components/humanTalent/requisitions/PersonnelHiringConfirmationDialog";

import { usePersonnelRequisitions } from "../../../hooks/humanTalent/requisitions/usePersonnelRequisitions";
import { useAuth } from "../../../context/AuthContext";

import { filterStyles } from "../../../styles/filterStyles";

import { requisitionStatusOptions } from "../../../data/humanTalentOptions";

import { cleanNumberInput } from "../../../utils/common/numberUtils";
import { normalizeText } from "../../../utils/common/formatText";
import { isDateInRange } from "../../../utils/common/dateUtils";

import type { PersonnelRequisition, RequisitionStatus } from "../../..//interfaces/humanTalent/requisitions/personnelRequisition.interface";

import { numberRangeSchema } from "../../../validations/common/rangeValidation";

// Página para listar, aprobar, rechazar y confirmar requisiciones de personal.
const PersonnelRequisitions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const {
        requisitions,

        loading,
        loadingDecision,
        selectedRequisitionId,

        loadError,
        message,
        openMessage,
        messageSeverity,

        openHiringDialog,
        selectedHiringRequisition,
        hiringForm,

        decisionDialog,
        decisionComment,

        openCreateHiringDialog,
        closeCreateHiringDialog,
        handleHiringFormChange,
        isHiringFormValid,
        confirmCreateHiringConfirmation,

        setDecisionComment,
        openApproveRequisitionDialog,
        openRejectRequisitionDialog,
        openApproveHiringConfirmationDialog,
        openRejectHiringConfirmationDialog,
        closeDecisionDialog,
        confirmDecisionDialog,

        getCurrentRequisitionApproval,
        getCurrentHiringConfirmationApproval,
        canCreateHiringConfirmation,

        loadRequisitions,

        closeMessage,
    } = usePersonnelRequisitions();

    // Texto utilizado para buscar requisiciones.
    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    // Filtro por estado.
    const [
        statusFilter,
        setStatusFilter,
    ] = useState<
        "ALL" | RequisitionStatus
    >("ALL");

    // Filtro por rango de fechas de la solicitud.
    const [
        startDateFilter,
        setStartDateFilter,
    ] = useState("");

    const [
        endDateFilter,
        setEndDateFilter,
    ] = useState("");

    // Filtro por rango de salario propuesto (solo números, sin separadores).
    const [
        minSalaryFilter,
        setMinSalaryFilter,
    ] = useState("");

    const [
        maxSalaryFilter,
        setMaxSalaryFilter,
    ] = useState("");

    // Limpia todos los filtros.
    // La búsqueda se controla independientemente.
    const clearFilters = () => {
        setStatusFilter("ALL");
        setStartDateFilter("");
        setEndDateFilter("");
        setMinSalaryFilter("");
        setMaxSalaryFilter("");
    };

    // Indica si existe algún filtro activo.
    const hasActiveFilters =
        statusFilter !== "ALL" ||
        startDateFilter !== "" ||
        endDateFilter !== "" ||
        minSalaryFilter !== "" ||
        maxSalaryFilter !== "";

    // Opciones disponibles para el filtro por estado.
    // que repite la etiqueta "En aprobación".
    const statusFilterOptions = [
        {
            label:
                "Todos los estados",
            value: "ALL",
        },
        ...requisitionStatusOptions.filter(
            (option) =>
                option.value !==
                "PENDIENTE_APROBACION"
        ),
    ];

    // Guarda el salario mínimo conservando solo números.
    const handleMinSalaryChange = (
        value: string
    ) => {
        setMinSalaryFilter(
            cleanNumberInput(value)
        );
    };

    // Guarda el salario máximo conservando solo números.
    const handleMaxSalaryChange = (
        value: string
    ) => {
        setMaxSalaryFilter(
            cleanNumberInput(value)
        );
    };

    // Valida el rango de salario con el esquema del filtro.
    const getSalaryRangeError = () => {
        try {
            numberRangeSchema.validateSync({
                min: minSalaryFilter,
                max: maxSalaryFilter,
            });

            return "";
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                return error.message;
            }

            return "";
        }
    };

    const salaryRangeError =
        getSalaryRangeError();



    /*
     * Búsqueda por área, código de área,
     * solicitante y ciudad.
     *
     * Estado, fecha y salario se manejan
     * exclusivamente desde sus filtros.
     */
    const filteredRequisitions =
        requisitions.filter((requisition) => {
            const normalizedSearch =
                normalizeText(searchTerm);

            const matchesSearch =
                !normalizedSearch ||
                normalizeText(
                    requisition.department?.name
                ).includes(
                    normalizedSearch
                ) ||
                normalizeText(
                    requisition.department?.code
                ).includes(
                    normalizedSearch
                ) ||
                normalizeText(
                    requisition.createdBy?.name
                ).includes(
                    normalizedSearch
                ) ||
                normalizeText(
                    requisition.city?.name
                ).includes(
                    normalizedSearch
                );

            const matchesStatus =
                statusFilter ===
                "ALL" ||
                requisition.status ===
                statusFilter;

            const matchesDate =
                isDateInRange(
                    requisition.requestDate,
                    startDateFilter,
                    endDateFilter
                );

            const salary =
                Number(
                    requisition.proposedSalary
                );

            const matchesMinSalary =
                !minSalaryFilter ||
                salary >=
                Number(minSalaryFilter);

            const matchesMaxSalary =
                !maxSalaryFilter ||
                salary <=
                Number(maxSalaryFilter);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate &&
                matchesMinSalary &&
                matchesMaxSalary
            );
        });
    // Valida si el usuario puede aprobar o rechazar la requisición actual.
    const canDecideRequisition = (requisition: PersonnelRequisition) => {
        const currentApproval = getCurrentRequisitionApproval(requisition);

        return currentApproval?.approverUserId === user?.id;
    };

    // Valida si el usuario puede aprobar o rechazar la confirmación de contratación actual.
    const canDecideHiringConfirmation = (requisition: PersonnelRequisition) => {
        const currentApproval = getCurrentHiringConfirmationApproval(requisition);

        return currentApproval?.approverUserId === user?.id;
    };

    // Valida si el usuario tiene un cargo activo específico.
    const userHasPosition = (positionCode: string) => {
        return user?.positions?.some((position) => position.code === positionCode);
    };

    // Valida si el usuario puede registrar la confirmación de contratación.
    const canCreateHiringConfirmationForUser = (
        requisition: PersonnelRequisition
    ) => {
        return (
            userHasPosition("DPC-TH-0118") &&
            canCreateHiringConfirmation(requisition)
        );
    };

    // Devuelve el título del modal de decisión.
    const getDecisionDialogTitle = () => {
        if (decisionDialog.type === "APPROVE_REQUISITION") {
            return "Aprobar requisición";
        }

        if (decisionDialog.type === "REJECT_REQUISITION") {
            return "Rechazar requisición";
        }

        if (decisionDialog.type === "APPROVE_HIRING_CONFIRMATION") {
            return "Aprobar confirmación de contratación";
        }

        if (decisionDialog.type === "REJECT_HIRING_CONFIRMATION") {
            return "Rechazar confirmación de contratación";
        }

        return "Confirmar acción";
    };

    // Devuelve el mensaje del modal de decisión.
    const getDecisionDialogMessage = () => {
        if (
            decisionDialog.type === "APPROVE_REQUISITION" ||
            decisionDialog.type === "APPROVE_HIRING_CONFIRMATION"
        ) {
            return "¿Está seguro de aprobar este proceso?";
        }

        return "Ingrese el motivo del rechazo para continuar.";
    };

    // Valida si la decisión requiere comentario.
    const isCommentRequired = () => {
        return (
            decisionDialog.type === "REJECT_REQUISITION" ||
            decisionDialog.type === "REJECT_HIRING_CONFIRMATION"
        );
    };

    // Valida si la acción del modal es de aprobación.
    const isApproveAction = () => {
        return (
            decisionDialog.type === "APPROVE_REQUISITION" ||
            decisionDialog.type === "APPROVE_HIRING_CONFIRMATION"
        );
    };

    // Navega al detalle de una requisición.
    const goToRequisitionDetail = (requisitionId: number) => {
        navigate(`/dashboard/human-talent/requisitions/${requisitionId}`);
    };

    return (
        <PageContainer>
            <PageHeader
                title="Requisiciones de personal"
                subtitle="Consulta, aprueba, rechaza o confirma requisiciones según el proceso."
                actions={
                    <ListToolbar
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        searchPlaceholder="Buscar por área, código de área, solicitante o ciudad"
                        searchTooltip="Buscar requisición"
                        filterActive={hasActiveFilters}
                        filterTitle="Filtros de requisiciones"
                        filterTooltip="Filtrar requisiciones"
                        filterContent={
                            <Box sx={filterStyles.filterMenuContent}>
                                <ClearableSelect
                                    label="Estado"
                                    value={statusFilter}
                                    options={statusFilterOptions}
                                    onChange={(value) =>
                                        setStatusFilter(
                                            (value || "ALL") as
                                            | "ALL"
                                            | RequisitionStatus
                                        )
                                    }
                                    size="small"
                                    minWidth="100%"
                                />

                                <Box sx={filterStyles.filterDateRow}>
                                    <DateInput
                                        label="Fecha inicio"
                                        value={startDateFilter}
                                        onChange={setStartDateFilter}
                                        maxDate={endDateFilter || undefined}
                                        sx={filterStyles.filterDateInput}
                                    />

                                    <DateInput
                                        label="Fecha fin"
                                        value={endDateFilter}
                                        onChange={setEndDateFilter}
                                        minDate={startDateFilter || undefined}
                                        sx={filterStyles.filterDateInput}
                                    />
                                </Box>

                                <Box sx={filterStyles.filterDateRow}>
                                    <MoneyInput
                                        label="Salario mínimo"
                                        size="small"
                                        value={minSalaryFilter}
                                        onChange={handleMinSalaryChange}
                                        error={Boolean(salaryRangeError)}
                                        sx={filterStyles.filterDateInput}
                                    />

                                    <MoneyInput
                                        label="Salario máximo"
                                        size="small"
                                        value={maxSalaryFilter}
                                        onChange={handleMaxSalaryChange}
                                        error={Boolean(salaryRangeError)}
                                        helperText={salaryRangeError}
                                        sx={filterStyles.filterDateInput}
                                    />
                                </Box>


                                <ActionButton
                                    actionType="clear"
                                    fullWidth
                                    variant="text"
                                    onClick={clearFilters}
                                    disabled={!hasActiveFilters}
                                    sx={filterStyles.clearFilterButton}
                                >
                                    Limpiar filtros
                                </ActionButton>
                            </Box>
                        }
                        onRefresh={loadRequisitions}
                        refreshLoading={loading}
                        refreshTooltip="Actualizar lista"
                    />
                }
            />

            {loadError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {loadError}
                </Alert>
            )}

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 6,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : requisitions.length === 0 ? (
                <EmptyState title="No hay requisiciones de personal registradas." />
            ) : filteredRequisitions.length === 0 ? (
                <EmptyState
                    title="No se encontraron requisiciones"
                    description="Intenta buscar con otra área, código, solicitante o ciudad, o ajusta los filtros."
                />
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {filteredRequisitions.map((requisition) => (
                        <PersonnelRequisitionListItem
                            key={requisition.id}
                            requisition={requisition}
                            loading={
                                loadingDecision &&
                                selectedRequisitionId === requisition.id
                            }
                            canDecideRequisition={canDecideRequisition(
                                requisition
                            )}
                            canCreateHiringConfirmation={canCreateHiringConfirmationForUser(
                                requisition
                            )}
                            canDecideHiringConfirmation={canDecideHiringConfirmation(
                                requisition
                            )}
                            onApproveRequisition={
                                openApproveRequisitionDialog
                            }
                            onRejectRequisition={
                                openRejectRequisitionDialog
                            }
                            onCreateHiringConfirmation={
                                openCreateHiringDialog
                            }
                            onApproveHiringConfirmation={
                                openApproveHiringConfirmationDialog
                            }
                            onRejectHiringConfirmation={
                                openRejectHiringConfirmationDialog
                            }
                            onViewDetail={goToRequisitionDetail}
                        />
                    ))}
                </Box>
            )}

            <ConfirmActionDialog
                open={decisionDialog.open}
                title={getDecisionDialogTitle()}
                message={getDecisionDialogMessage()}
                actionType={isApproveAction() ? "approve" : "reject"}
                confirmText={isApproveAction() ? "Aprobar" : "Rechazar"}
                loading={loadingDecision}
                infoContent={
                    decisionDialog.requisition
                        ? `${decisionDialog.requisition.position.name} - ${decisionDialog.requisition.department.name}`
                        : undefined
                }
                commentLabel={isCommentRequired() ? "Comentario" : undefined}
                commentValue={decisionComment}
                commentRequired={isCommentRequired()}
                onCommentChange={setDecisionComment}
                onClose={closeDecisionDialog}
                onConfirm={confirmDecisionDialog}
            />

            <PersonnelHiringConfirmationDialog
                open={openHiringDialog}
                loading={loadingDecision}
                requisition={selectedHiringRequisition}
                form={hiringForm}
                isValid={isHiringFormValid()}
                onChange={handleHiringFormChange}
                onClose={closeCreateHiringDialog}
                onConfirm={confirmCreateHiringConfirmation}
            />

            <CustomSnackbar
                open={openMessage}
                message={message}
                severity={messageSeverity}
                onClose={closeMessage}
            />
        </PageContainer>
    );
};

export default PersonnelRequisitions;
import { useEffect, useState } from "react";
import { ValidationError } from "yup";

import { getCities } from "../../../services/common/cityService";
import {
    createPersonnelRequisition,
    getDepartments,
} from "../../../services/humanTalent/requisitions/personnelRequisitionService";
import { getPositionProfiles } from "../../../services/positionManagement/positionProfileService";

import { createPersonnelRequisitionSchema } from "../../../validations/humanTalent/requisitions/personnelRequisitionValidation";
import { getErrorMessage } from "../../../utils/common/getErrorMessage";

import type {
    ContractType,
    CreatePersonnelRequisitionFormErrors,
    Department,
    DirectContractType,
    InternContractType,
    PositionProfile,
    RequisitionReason,
} from "../../../interfaces/humanTalent/requisitions/personnelRequisition.interface";
import type { City } from "../../../interfaces/common/city.interface";
import { cleanNumberInput } from "../../../utils/common/numberUtils";
import { getCurrentPositionProfileRevision } from "../../../services/positionManagement/positionProfileRevisionService";
import type { PositionProfileRevision } from "../../../interfaces/positionManagement/positionProfileRevision.interface";

// Estado inicial de los errores del formulario.
const initialFormErrors: CreatePersonnelRequisitionFormErrors = {
    departmentId: "",
    positionId: "",
    positionRevisionId: "",
    reason: "",
    otherReason: "",
    cityId: "",
    contractType: "",
    directContractType: "",
    contractDurationMonths: "",
    internContractType: "",
    proposedSalary: "",
};

// Hook encargado de manejar la lógica para crear una requisición de personal.
export const useCreatePersonnelRequisition = () => {
    // Área solicitante seleccionada.
    const [departmentId, setDepartmentId] = useState("");

    // Cargo requerido seleccionado.
    const [positionId, setPositionId] = useState("");

    // Id de la revisión vigente del cargo seleccionado.
    const [positionRevisionId, setPositionRevisionId] = useState("");

    // Información de la revisión vigente encontrada.
    const [currentPositionRevision, setCurrentPositionRevision] =
        useState<PositionProfileRevision | null>(null);

    // Controla la consulta de la revisión vigente.
    const [loadingPositionRevision, setLoadingPositionRevision] =
        useState(false);

    // Motivo de la requisición seleccionado.
    const [reason, setReason] = useState<RequisitionReason | "">("");

    // Descripción del motivo.
    const [otherReason, setOtherReason] = useState("");

    // Ciudad seleccionada.
    const [cityId, setCityId] = useState("");

    // Tipo principal de contratación seleccionado.
    const [contractType, setContractType] = useState<ContractType | "">("");

    // Tipo de contrato directo seleccionado.
    const [directContractType, setDirectContractType] =
        useState<DirectContractType | "">("");

    // Duración del contrato en meses.
    const [contractDurationMonths, setContractDurationMonths] = useState("");

    // Tipo de practicante seleccionado.
    const [internContractType, setInternContractType] =
        useState<InternContractType | "">("");

    // Salario propuesto escrito por el usuario.
    const [proposedSalary, setProposedSalary] = useState("");

    // Listado de áreas activas.
    const [departments, setDepartments] = useState<Department[]>([]);

    // Listado de perfiles de cargo activos.
    const [positionProfiles, setPositionProfiles] = useState<PositionProfile[]>(
        []
    );

    // Listado de ciudades activas.
    const [cities, setCities] = useState<City[]>([]);

    // Controla la carga inicial de datos del formulario.
    const [loadingData, setLoadingData] = useState(false);

    // Controla el envío del formulario.
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Mensaje mostrado en el CustomSnackbar.
    const [message, setMessage] = useState("");

    // Controla si se muestra el CustomSnackbar.
    const [openMessage, setOpenMessage] = useState(false);

    // Controla el tipo de mensaje mostrado en el CustomSnackbar.
    const [messageSeverity, setMessageSeverity] =
        useState<"success" | "warning">("success");

    // Mensaje de error general.
    const [error, setError] = useState("");

    // Errores de validación por campo.
    const [formErrors, setFormErrors] =
        useState<CreatePersonnelRequisitionFormErrors>(initialFormErrors);

    // Limpia mensajes generales y el error del campo que se está editando.
    const clearFieldError = (
        field: keyof CreatePersonnelRequisitionFormErrors
    ) => {
        setMessage("");
        setOpenMessage(false);
        setError("");

        setFormErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Carga las áreas, cargos y ciudades necesarias para el formulario.
    const loadFormData = async () => {
        try {
            setLoadingData(true);
            setError("");

            const [departmentsResponse, citiesResponse] = await Promise.all([
                getDepartments(),
                getCities(),
            ]);

            setDepartments(departmentsResponse.departments);
            setCities(citiesResponse.cities);
            setPositionProfiles([]);
        } catch (error: unknown) {
            console.error(error);
            setError(
                getErrorMessage(
                    error,
                    "Error al cargar los datos del formulario."
                )
            );
        } finally {
            setLoadingData(false);
        }
    };

    // Actualiza el área solicitante y carga los cargos relacionados.
    const handleDepartmentChange = async (value: string) => {
        setDepartmentId(value);
        setPositionId("");
        setPositionRevisionId("");
        setCurrentPositionRevision(null);
        setPositionProfiles([]);

        clearFieldError("departmentId");
        clearFieldError("positionId");
        clearFieldError("positionRevisionId");

        if (!value) {
            return;
        }

        try {
            const response = await getPositionProfiles(Number(value));

            setPositionProfiles(response.positionProfiles);
        } catch (error: unknown) {
            console.error(error);

            setError(
                getErrorMessage(
                    error,
                    "Error al cargar los cargos del área seleccionada."
                )
            );

            setPositionProfiles([]);
        }
    };

    // Actualiza el cargo requerido y consulta su revisión vigente.
    const handlePositionChange = async (value: string) => {
        setPositionId(value);
        setPositionRevisionId("");
        setCurrentPositionRevision(null);

        clearFieldError("positionId");
        clearFieldError("positionRevisionId");

        if (!value) {
            return;
        }

        try {
            setLoadingPositionRevision(true);

            const response =
                await getCurrentPositionProfileRevision(
                    Number(value)
                );

            // Muestra una advertencia cuando el cargo no tiene revisión vigente.
            if (!response.revision) {
                // YULI
                setMessage(response.message);
                setMessageSeverity("warning");
                setOpenMessage(true);
                return;
            }

            // Guarda la revisión vigente y cierra cualquier advertencia anterior.
            setMessage("");
            setOpenMessage(false);
            setCurrentPositionRevision(response.revision);
            setPositionRevisionId(
                String(response.revision.id)
            );
        } catch (error: unknown) {
            console.error(error);

            setError(
                getErrorMessage(
                    error,
                    "Error al consultar la revisión vigente del cargo."
                )
            );
        } finally {
            setLoadingPositionRevision(false);
        }
    };

    // Actualiza el motivo de la requisición.
    const handleReasonChange = (value: string) => {
        setReason(value as RequisitionReason | "");

        clearFieldError("reason");
    };

    // Actualiza la descripción del motivo seleccionado.
    const handleOtherReasonChange = (value: string) => {
        setOtherReason(value);
        clearFieldError("otherReason");
    };

    // Actualiza la ciudad.
    const handleCityChange = (value: string) => {
        setCityId(value);
        clearFieldError("cityId");
    };

    // Actualiza el tipo principal de contratación.
    const handleContractTypeChange = (value: string) => {
        setContractType(value as ContractType | "");

        setDirectContractType("");
        setContractDurationMonths("");
        setInternContractType("");

        clearFieldError("contractType");
        clearFieldError("directContractType");
        clearFieldError("contractDurationMonths");
        clearFieldError("internContractType");
    };

    // Actualiza el tipo de contrato directo.
    const handleDirectContractTypeChange = (value: string) => {
        setDirectContractType(value as DirectContractType | "");

        if (value !== "FIJO") {
            setContractDurationMonths("");
        }

        clearFieldError("directContractType");
        clearFieldError("contractDurationMonths");
    };

    // Actualiza la duración del contrato en meses.
    const handleContractDurationMonthsChange = (value: string) => {
        setContractDurationMonths(value);
        clearFieldError("contractDurationMonths");
    };

    // Actualiza el tipo de practicante.
    const handleInternContractTypeChange = (value: string) => {
        setInternContractType(value as InternContractType | "");
        clearFieldError("internContractType");
    };

    // Actualiza el salario propuesto dejando solo números.
    const handleProposedSalaryChange = (value: string) => {
        setProposedSalary(cleanNumberInput(value));
        clearFieldError("proposedSalary");
    };

    // Cierra el mensaje visual y limpia su contenido.
    const closeMessage = () => {
        setOpenMessage(false);
        setMessage("");
        setError("");
    };

    // Limpia el formulario y reinicia los mensajes visuales.
    const resetForm = () => {
        setDepartmentId("");
        setPositionId("");
        setPositionRevisionId("");
        setCurrentPositionRevision(null);
        setPositionProfiles([]);
        setReason("");
        setOtherReason("");
        setCityId("");
        setContractType("");
        setDirectContractType("");
        setContractDurationMonths("");
        setInternContractType("");
        setProposedSalary("");

        setFormErrors(initialFormErrors);
        setError("");
        setMessage("");
        setOpenMessage(false);

        // Reinicia el tipo de mensaje al valor predeterminado.
        setMessageSeverity("success");
    };

    // Indica si el formulario tiene al menos un campo diligenciado.
    const hasFormChanges =
        departmentId !== "" ||
        positionId !== "" ||
        reason !== "" ||
        otherReason !== "" ||
        cityId !== "" ||
        contractType !== "" ||
        directContractType !== "" ||
        contractDurationMonths !== "" ||
        internContractType !== "" ||
        proposedSalary !== "";

    // Crea una nueva requisición de personal usando validación Yup.
    const handleCreatePersonnelRequisition = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const formData = {
            departmentId,
            positionId,
            positionRevisionId,
            reason,
            otherReason,
            cityId,
            contractType,
            directContractType,
            contractDurationMonths,
            internContractType,
            proposedSalary,
        };

        try {
            await createPersonnelRequisitionSchema.validate(formData, {
                abortEarly: false,
            });

            setLoadingSubmit(true);
            setFormErrors(initialFormErrors);
            setError("");
            setMessage("");
            setOpenMessage(false);

            const response = await createPersonnelRequisition({
                departmentId: Number(departmentId),
                positionId: Number(positionId),
                positionRevisionId: Number(positionRevisionId),
                reason: reason as RequisitionReason,
                otherReason: otherReason.trim(),
                cityId: Number(cityId),
                contractType: contractType as ContractType,
                directContractType:
                    contractType === "DIRECTO"
                        ? (directContractType as DirectContractType)
                        : null,
                contractDurationMonths:
                    contractType === "TEMPORAL" ||
                        (contractType === "DIRECTO" &&
                            directContractType === "FIJO")
                        ? Number(contractDurationMonths)
                        : null,
                internContractType:
                    contractType === "PRACTICANTE"
                        ? (internContractType as InternContractType)
                        : null,
                proposedSalary: Number(proposedSalary),
            });

            resetForm();

            setMessage(
                response.message ||
                "Requisición de personal creada correctamente."
            );
            setOpenMessage(true);
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                const errors: CreatePersonnelRequisitionFormErrors = {
                    ...initialFormErrors,
                };

                error.inner.forEach((validationError) => {
                    const path =
                        validationError.path as keyof CreatePersonnelRequisitionFormErrors;

                    if (path) {
                        errors[path] = validationError.message;
                    }
                });

                setFormErrors(errors);
                setMessage("");
                setOpenMessage(false);
                return;
            }

            console.error(error);
            setError(
                getErrorMessage(
                    error,
                    "Error al crear la requisición de personal."
                )
            );
            setMessage("");
            setOpenMessage(false);
        } finally {
            setLoadingSubmit(false);
        }
    };

    useEffect(() => {
        loadFormData();
    }, []);

    return {
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
    };
};
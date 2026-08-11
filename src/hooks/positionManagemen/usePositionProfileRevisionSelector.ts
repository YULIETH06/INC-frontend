import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getDepartments,
} from "../../services/humanTalent/personnelRequisitionService";

import { getErrorMessage } from "../../utils/common/getErrorMessage";

import type {
    Department,
    PositionProfile,
} from "../../interfaces/humanTalent/personnelRequisition.interface";
import { getPositionProfiles } from "../../services/positionManagement/positionProfileService";

interface UsePositionProfileRevisionSelectorProps {
    initialDepartmentId?: string;
    initialPositionProfileId?: string;
}

// Hook encargado de cargar y seleccionar el perfil de cargo
// que será utilizado para consultar sus revisiones.
export const usePositionProfileRevisionSelector = ({
    initialDepartmentId = "",
    initialPositionProfileId = "",
}: UsePositionProfileRevisionSelectorProps = {}) => {
    // Departamento seleccionado.
    const [
        departmentId,
        setDepartmentId,
    ] = useState(initialDepartmentId);

    // Perfil de cargo seleccionado.
    const [
        positionProfileId,
        setPositionProfileId,
    ] = useState(initialPositionProfileId);

    // Departamentos activos disponibles.
    const [
        departments,
        setDepartments,
    ] = useState<Department[]>([]);

    // Perfiles de cargo del departamento seleccionado.
    const [
        positionProfiles,
        setPositionProfiles,
    ] = useState<PositionProfile[]>([]);

    // Controla la carga inicial de departamentos.
    const [
        loadingDepartments,
        setLoadingDepartments,
    ] = useState(false);

    // Controla la carga de perfiles de cargo.
    const [
        loadingPositionProfiles,
        setLoadingPositionProfiles,
    ] = useState(false);

    // Error producido al cargar los datos.
    const [loadError, setLoadError] =
        useState("");

    // Carga los departamentos activos.
    const loadDepartments = useCallback(
        async () => {
            try {
                setLoadingDepartments(true);
                setLoadError("");

                const response =
                    await getDepartments();

                setDepartments(
                    response.departments
                );
            } catch (error: unknown) {
                console.error(error);

                setDepartments([]);

                setLoadError(
                    getErrorMessage(
                        error,
                        "Error al cargar los departamentos."
                    )
                );
            } finally {
                setLoadingDepartments(false);
            }
        },
        []
    );

    // Carga los perfiles de cargo de un departamento.
    const loadPositionProfiles = useCallback(
        async (
            selectedDepartmentId: string,
            selectedPositionProfileId = ""
        ) => {
            if (!selectedDepartmentId) {
                setPositionProfiles([]);
                setPositionProfileId("");
                return;
            }

            try {
                setLoadingPositionProfiles(true);
                setLoadError("");

                const response =
                    await getPositionProfiles(
                        Number(selectedDepartmentId)
                    );

                setPositionProfiles(
                    response.positionProfiles
                );

                const profileExists =
                    response.positionProfiles.some(
                        (positionProfile) =>
                            positionProfile.id ===
                            Number(
                                selectedPositionProfileId
                            )
                    );

                setPositionProfileId(
                    profileExists
                        ? selectedPositionProfileId
                        : ""
                );
            } catch (error: unknown) {
                console.error(error);

                setPositionProfiles([]);
                setPositionProfileId("");

                setLoadError(
                    getErrorMessage(
                        error,
                        "Error al cargar los perfiles de cargo del departamento seleccionado."
                    )
                );
            } finally {
                setLoadingPositionProfiles(false);
            }
        },
        []
    );

    // Actualiza el departamento y carga sus perfiles de cargo.
    const handleDepartmentChange = async (
        value: string
    ) => {
        setDepartmentId(value);
        setPositionProfileId("");
        setPositionProfiles([]);
        setLoadError("");

        await loadPositionProfiles(value);
    };

    // Actualiza el perfil de cargo seleccionado.
    const handlePositionProfileChange = (
        value: string
    ) => {
        setPositionProfileId(value);
        setLoadError("");
    };

    // Limpia la selección actual.
    const resetSelection = () => {
        setDepartmentId("");
        setPositionProfileId("");
        setPositionProfiles([]);
        setLoadError("");
    };

    // Perfil de cargo seleccionado.
    const selectedPositionProfile =
        positionProfiles.find(
            (positionProfile) =>
                positionProfile.id ===
                Number(positionProfileId)
        ) ?? null;

    // Indica si existe un perfil de cargo seleccionado.
    const hasSelectedPositionProfile =
        Boolean(selectedPositionProfile);

    // Carga los departamentos al iniciar el hook.
    useEffect(() => {
        void loadDepartments();
    }, [loadDepartments]);

    // Recupera la selección recibida desde la URL.
    useEffect(() => {
        if (!initialDepartmentId) {
            return;
        }

        setDepartmentId(initialDepartmentId);

        void loadPositionProfiles(
            initialDepartmentId,
            initialPositionProfileId
        );
    }, [
        initialDepartmentId,
        initialPositionProfileId,
        loadPositionProfiles,
    ]);

    return {
        departmentId,
        positionProfileId,

        departments,
        positionProfiles,

        selectedPositionProfile,
        hasSelectedPositionProfile,

        loadingDepartments,
        loadingPositionProfiles,

        loadError,

        handleDepartmentChange,
        handlePositionProfileChange,
        resetSelection,
    };
};
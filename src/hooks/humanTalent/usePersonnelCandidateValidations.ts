import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getPersonnelCandidateValidations,
} from "../../services/humanTalent/personnelCandidateValidationService";

import { getErrorMessage } from "../../utils/common/getErrorMessage";

import type {
    PersonnelCandidateValidationListItem,
} from "../../interfaces/humanTalent/personnelCandidateValidation.interface";

// Hook encargado de consultar los candidatos disponibles para validación.
export const usePersonnelCandidateValidations = () => {
    // Candidatos disponibles para validación.
    const [
        candidates,
        setCandidates,
    ] = useState<PersonnelCandidateValidationListItem[]>([]);

    // Permiso para gestionar las validaciones.
    const [
        canManageValidation,
        setCanManageValidation,
    ] = useState(false);

    // Controla la carga del listado.
    const [
        loadingCandidates,
        setLoadingCandidates,
    ] = useState(false);

    // Error producido al consultar los candidatos.
    const [loadError, setLoadError] =
        useState("");

    // Consulta los candidatos disponibles para validación.
    const loadCandidates = useCallback(async () => {
        try {
            setLoadingCandidates(true);
            setLoadError("");

            const response =
                await getPersonnelCandidateValidations();

            setCandidates(
                response.candidates
            );

            setCanManageValidation(
                response.canManageValidation
            );
        } catch (error: unknown) {
            console.error(error);

            setCandidates([]);
            setCanManageValidation(false);

            setLoadError(
                getErrorMessage(
                    error,
                    "Error al cargar los candidatos disponibles para validación."
                )
            );
        } finally {
            setLoadingCandidates(false);
        }
    }, []);

    useEffect(() => {
        loadCandidates();
    }, [loadCandidates]);

    return {
        candidates,
        canManageValidation,

        loadingCandidates,
        loadError,

        loadCandidates,
    };
};
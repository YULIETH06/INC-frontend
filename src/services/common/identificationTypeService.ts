import api from "../../api/axios";

import type {
    IdentificationTypesResponse
} from "../../interfaces/common/identificationType.interface";

// Obtiene los tipos de identificación activos disponibles en el sistema.
export const getIdentificationTypes =
    async (): Promise<IdentificationTypesResponse> => {
        const response =
            await api.get<IdentificationTypesResponse>(
                "/common/identification-types"
            );

        return response.data;
    };
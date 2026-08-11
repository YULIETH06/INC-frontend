import api from "../../api/axios";
import type { PositionProfilesResponse } from "../../interfaces/positionManagement/positionProfile.interface";

// Obtiene los perfiles de cargo activos según el departamento seleccionado.
export const getPositionProfiles = async (
    departmentId: number
): Promise<PositionProfilesResponse> => {
    const response =
        await api.get<PositionProfilesResponse>(
            "/position-management/position-profiles",
            {
                params: {
                    departmentId,
                },
            }
        );

    return response.data;
};
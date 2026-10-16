import api from "../../api/axios";

import type {
  AssignablePositionsResponse,
  AssignUserPositionResponse,
  EndUserPositionAssignmentResponse,
  UserPositionAssignmentsResponse,
} from "../../interfaces/users/userPositionAssignment.interface";

// Obtiene los cargos activos disponibles para asignar. Endpoint usado por ADMIN.
export const getAssignablePositions =
  async (): Promise<AssignablePositionsResponse> => {
    const response =
      await api.get<AssignablePositionsResponse>(
        "/users/position-assignments/positions"
      );

    return response.data;
  };

// Obtiene el cargo actual y el historial de cargos de un usuario. Endpoint usado por ADMIN.
export const getUserPositionAssignments = async (
  userId: number
): Promise<UserPositionAssignmentsResponse> => {
  const response =
    await api.get<UserPositionAssignmentsResponse>(
      `/users/${userId}/position-assignments`
    );

  return response.data;
};

// Asigna o cambia el cargo de un usuario. Endpoint usado por ADMIN.
export const assignUserPosition = async (
  userId: number,
  positionId: number
): Promise<AssignUserPositionResponse> => {
  const response =
    await api.post<AssignUserPositionResponse>(
      `/users/${userId}/position-assignments`,
      {
        positionId,
      }
    );

  return response.data;
};

// Retira el cargo activo de un usuario. Endpoint usado por ADMIN.
export const endUserPositionAssignment = async (
  userId: number
): Promise<EndUserPositionAssignmentResponse> => {
  const response =
    await api.patch<EndUserPositionAssignmentResponse>(
      `/users/${userId}/position-assignments/current/end`
    );

  return response.data;
};

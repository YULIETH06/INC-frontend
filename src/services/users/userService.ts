import api from "../../api/axios";

import type {
  BulkUploadResponse,
} from "../../interfaces/users/bulkUpload.interface";

import type {
  ResetUserPasswordData,
  User,
  UserAccountResponse,
  UserRole,
} from "../../interfaces/users/user.interface";

// Obtiene todos los usuarios del sistema. Endpoint usado por ADMIN.
export const getAllUsers = async (): Promise<{
  message: string;
  users: User[];
}> => {
  const response = await api.get<{
    message: string;
    users: User[];
  }>("/users");

  return response.data;
};

// Obtiene únicamente los usuarios que tienen rol AGENT. Endpoint usado por ADMIN.
export const getAgents = async (): Promise<{
  message: string;
  agents: User[];
}> => {
  const response = await api.get<{
    message: string;
    agents: User[];
  }>("/users/agents");

  return response.data;
};

// Actualiza el rol de un usuario. Endpoint usado por ADMIN.
export const updateUserRole = async (
  userId: number,
  role: UserRole
) => {
  const response = await api.patch(
    `/users/${userId}/role`,
    {
      role,
    }
  );

  return response.data;
};

// Restablece la contraseña de un usuario. Endpoint usado por ADMIN.
export const resetUserPassword = async (
  userId: number,
  data: ResetUserPasswordData
) => {
  const response = await api.patch(
    `/users/${userId}/password`,
    data
  );

  return response.data;
};

// Desactiva un usuario. Endpoint usado por ADMIN.
export const deactivateUser = async (
  userId: number
): Promise<UserAccountResponse> => {
  const response = await api.patch<UserAccountResponse>(
    `/users/${userId}/deactivate`
  );

  return response.data;
};

// Activa nuevamente un usuario desactivado. Endpoint usado por ADMIN.
export const activateUser = async (
  userId: number
): Promise<UserAccountResponse> => {
  const response = await api.patch<UserAccountResponse>(
    `/users/${userId}/activate`
  );

  return response.data;
};

// Cambia el correo de un usuario. Endpoint usado por ADMIN.
export const updateUserEmail = async (
  userId: number,
  email: string
): Promise<UserAccountResponse> => {
  const response = await api.patch<UserAccountResponse>(
    `/users/${userId}/email`,
    {
      email,
    }
  );

  return response.data;
};

// Sube la firma del usuario autenticado.
export const uploadUserSignature = async (
  file: File
) => {
  const formData = new FormData();

  formData.append(
    "signature",
    file
  );

  const response = await api.patch(
    "/users/signature",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Registra usuarios mediante carga masiva desde archivo Excel. Endpoint usado por ADMIN.
export const uploadUsersBulk = async (
  file: File
): Promise<BulkUploadResponse<User>> => {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await api.post<
    BulkUploadResponse<User>
  >(
    "users/bulk",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
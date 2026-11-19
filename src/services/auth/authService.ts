import api from "../../api/axios";

import type {
    ChangePasswordData,
    ChangePasswordResponse,
    LoginData,
    LoginResponse,
    LogoutReason,
    RegisterData,
    RegisterResponse,
} from "../../interfaces/auth/auth.interface";

// Inicia sesión con correo y contraseña.
export const loginUser = async (
    data: LoginData
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);

    return response.data;
};

// Registra un nuevo usuario en el sistema.
export const registerUser = async (
    data: RegisterData
): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);

    return response.data;
};

// Cambia la contraseña del usuario autenticado.
export const changePassword = async (
    data: ChangePasswordData
): Promise<ChangePasswordResponse> => {
    const response = await api.patch<ChangePasswordResponse>(
        "/auth/password",
        data
    );

    return response.data;
};

// Registra el cierre de sesión en el backend.
// Recibe el token porque se llama justo después de borrarlo del navegador.
export const logoutUser = async (
    reason: LogoutReason,
    token: string
): Promise<void> => {
    await api.post(
        "/auth/logout",
        {
            reason,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
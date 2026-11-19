import { createContext, useContext, useEffect, useState } from "react";

import api from "../api/axios";

import {
    connectSocket,
    disconnectSocket,
} from "../services/sockets/socketService";

import { logoutUser } from "../services/auth/authService";

import type {
    AuthUser,
    LogoutReason,
    ProfileResponse,
} from "../interfaces/auth/auth.interface";

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: (reason?: LogoutReason) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        try {
            const response = await api.get<ProfileResponse>("/profile");
            setUser(response.data.user);
        } catch (error) {
            console.error("Error al obtener el perfil:", error);
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        await getProfile();
    };

    const logout = async (
        reason: LogoutReason = "MANUAL"
    ) => {
        const currentToken = localStorage.getItem("token");

        disconnectSocket();
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);

        if (!currentToken) {
            return;
        }

        try {
            await logoutUser(reason, currentToken);
        } catch (error) {
            // Si el registro falla, la sesión ya quedó cerrada en el navegador.
            console.error("Error al registrar el cierre de sesión:", error);
        }
    };

    // Carga el perfil del usuario cuando existe un token
    useEffect(() => {
        if (token) {
            getProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    // Conecta Socket.IO cuando el usuario ya está autenticado
    useEffect(() => {
        if (token && user) {
            connectSocket(token);
        }
    }, [token, user]);

    // Si otra pestaña cierra la sesión (borra el token), esta también se cierra.
    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === "token" && !event.newValue) {
                disconnectSocket();
                setToken(null);
                setUser(null);
            }
        };

        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated: !!token && !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }

    return context;
};
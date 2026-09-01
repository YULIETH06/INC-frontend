import {
    Navigate,
    Outlet,
} from "react-router-dom";

import {
    useAuth,
} from "../context/AuthContext";

import LoadingBox from "../components/common/LoadingBox";

// Protege las rutas públicas destinadas
// únicamente a usuarios no autenticados.
const PublicRoute = () => {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    // Espera mientras AuthContext verifica
    // si existe una sesión guardada.
    if (loading) {
        return (
            <LoadingBox
                minHeight={400}
                size={32}
            />
        );
    }

    // Si ya existe una sesión válida,
    // impide regresar al login mediante
    // navegación manual o forzada.
    if (isAuthenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    // Si no existe sesión, permite mostrar
    // la ruta pública solicitada.
    return <Outlet />;
};

export default PublicRoute;
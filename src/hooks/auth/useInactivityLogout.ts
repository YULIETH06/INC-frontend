import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useAuth,
} from "../../context/AuthContext";

import {
    SESSION_MESSAGE_KEY,
} from "../../api/axios";

import {
    ACTIVITY_SAVE_INTERVAL_MS,
    INACTIVITY_LIMIT_MS,
    INACTIVITY_WARNING_MS,
    LAST_ACTIVITY_KEY,
} from "../../data/sessionConfig";

// Eventos que cuentan como actividad del usuario.
const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "wheel",
    "touchstart",
];

// Lee la hora de la última actividad, compartida entre pestañas.
const getLastActivity = () => {
    return (
        Number(localStorage.getItem(LAST_ACTIVITY_KEY)) ||
        Date.now()
    );
};

// Guarda la hora de la última actividad.
const saveLastActivity = (time: number) => {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(time));
};

// Hook encargado de cerrar la sesión por inactividad.
// Muestra un aviso en el último minuto y cierra la sesión al llegar a cero.
export const useInactivityLogout = () => {
    const { logout } = useAuth();

    const [showWarning, setShowWarning] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    // useRef guarda valores que no necesitan volver a pintar la pantalla.
    const showWarningRef = useRef(false);
    const lastSavedRef = useRef(0);
    const closingRef = useRef(false);
    const logoutRef = useRef(logout);

    // Mantiene siempre la versión actual de logout.
    useEffect(() => {
        logoutRef.current = logout;
    }, [logout]);

    // Registra actividad y cierra el aviso.
    const continueSession = useCallback(() => {
        const now = Date.now();

        lastSavedRef.current = now;
        saveLastActivity(now);

        showWarningRef.current = false;
        setShowWarning(false);
    }, []);

    // Al entrar al sistema, cuenta como actividad.
    useEffect(() => {
        continueSession();
    }, [continueSession]);

    // Escucha la actividad del usuario.
    useEffect(() => {
        const handleActivity = () => {
            // Con el aviso abierto, solo cuenta el botón "Seguir conectado".
            if (showWarningRef.current) {
                return;
            }

            const now = Date.now();

            // Guarda como máximo una vez cada pocos segundos.
            if (
                now - lastSavedRef.current <
                ACTIVITY_SAVE_INTERVAL_MS
            ) {
                return;
            }

            lastSavedRef.current = now;
            saveLastActivity(now);
        };

        ACTIVITY_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, handleActivity, {
                passive: true,
            });
        });

        return () => {
            ACTIVITY_EVENTS.forEach((eventName) => {
                window.removeEventListener(eventName, handleActivity);
            });
        };
    }, []);

    // Revisa cada segundo cuánto tiempo queda.
    useEffect(() => {
        const intervalId = window.setInterval(() => {
            if (closingRef.current) {
                return;
            }

            const remaining =
                getLastActivity() +
                INACTIVITY_LIMIT_MS -
                Date.now();

            if (remaining <= 0) {
                closingRef.current = true;
                window.clearInterval(intervalId);

                sessionStorage.setItem(
                    SESSION_MESSAGE_KEY,
                    "Tu sesión se cerró por inactividad."
                );

                logoutRef.current("INACTIVITY");

                return;
            }

            const isWarningTime =
                remaining <= INACTIVITY_WARNING_MS;

            showWarningRef.current = isWarningTime;
            setShowWarning(isWarningTime);
            setSecondsLeft(Math.ceil(remaining / 1000));
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    // Cierra la sesión desde el aviso.
    const logoutNow = () => {
        closingRef.current = true;
        logoutRef.current("MANUAL");
    };

    return {
        showWarning,
        secondsLeft,
        continueSession,
        logoutNow,
    };
};
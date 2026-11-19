// Tiempo sin actividad antes de cerrar la sesión: 15 minutos.
export const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;

// Tiempo antes del cierre en que aparece el aviso: 60 segundos.
export const INACTIVITY_WARNING_MS = 60 * 1000;

// Cada cuánto se guarda la actividad, para no escribir en cada movimiento del mouse.
export const ACTIVITY_SAVE_INTERVAL_MS = 5 * 1000;

// Clave donde se guarda la hora de la última actividad, compartida entre pestañas.
export const LAST_ACTIVITY_KEY = "lastActivityAt";
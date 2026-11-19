import axios from "axios";

// Clave donde se guarda el mensaje que se mostrará en el login
// cuando la sesión se cierra sin que el usuario lo pida.
export const SESSION_MESSAGE_KEY = "sessionMessage";

// Códigos del backend que cierran la sesión, con su mensaje de respaldo.
const SESSION_END_MESSAGES: Record<string, string> = {
  USER_INACTIVE:
    "Tu usuario está desactivado. Comunícate con el administrador.",
  TOKEN_EXPIRED:
    "Tu sesión expiró. Inicia sesión nuevamente.",
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Cierra la sesión si el backend indica que el usuario fue desactivado o que el token venció.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error?.response?.data?.code;

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof code === "string" &&
      code in SESSION_END_MESSAGES &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");

      sessionStorage.setItem(
        SESSION_MESSAGE_KEY,
        error.response.data.message ||
        SESSION_END_MESSAGES[code]
      );

      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";

// Clave donde se guarda el mensaje que se mostrará en el login
// cuando la sesión se cierra desde el backend.
export const SESSION_MESSAGE_KEY = "sessionMessage";

// Código que envía el backend cuando el usuario fue desactivado.
const USER_INACTIVE_CODE = "USER_INACTIVE";

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

// Cierra la sesión si el backend indica que el usuario fue desactivado.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.response.data?.code === USER_INACTIVE_CODE &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");

      sessionStorage.setItem(
        SESSION_MESSAGE_KEY,
        error.response.data.message ||
        "Tu usuario está desactivado. Comunícate con el administrador."
      );

      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default api;
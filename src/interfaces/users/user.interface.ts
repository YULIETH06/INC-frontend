import type {
  UserCurrentPosition,
} from "./userPositionAssignment.interface";

export type UserRole =
  | "USER"
  | "ADMIN"
  | "AGENT";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  deactivatedAt?: string | null;

  // Cargo activo del usuario. Solo llega en el listado de administración.
  currentPosition?: UserCurrentPosition | null;
}

// Datos del formulario utilizado por el administrador
// para restablecer la contraseña de un usuario.
export interface ResetUserPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

// Datos enviados al backend al restablecer
// la contraseña de un usuario.
export interface ResetUserPasswordData {
  newPassword: string;
}

// Errores de validación del formulario.
export type ResetUserPasswordErrors = Partial<
  Record<
    keyof ResetUserPasswordFormData,
    string
  >
>;

// Datos del formulario utilizado por el administrador
// para cambiar el correo de un usuario.
export interface UpdateUserEmailFormData {
  email: string;
}

// Errores de validación del formulario de cambio de correo.
export type UpdateUserEmailErrors = Partial<
  Record<
    keyof UpdateUserEmailFormData,
    string
  >
>;

// Respuesta del backend al activar, desactivar o cambiar el correo de un usuario.
export interface UserAccountResponse {
  message: string;
  user: Pick<
    User,
    "id" | "name" | "email" | "role" | "isActive" | "deactivatedAt"
  >;
}
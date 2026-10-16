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
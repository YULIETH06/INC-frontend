export type UserRole =
  | "USER"
  | "ADMIN"
  | "AGENT";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
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
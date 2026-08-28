import * as yup from "yup";

// Validación para restablecer la contraseña de un usuario
// desde la administración de usuarios.
export const resetUserPasswordSchema = yup.object({
    newPassword: yup
        .string()
        .required("Campo obligatorio")
        .min(
            6,
            "Mínimo 6 caracteres."
        ),

    confirmPassword: yup
        .string()
        .required("Campo obligatorio")
        .oneOf(
            [yup.ref("newPassword")],
            "Las contraseñas no coinciden."
        ),
});
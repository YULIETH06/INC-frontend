import * as yup from "yup";

// Validación del formulario de login.
export const loginSchema = yup.object({
    email: yup
        .string()
        .trim()
        .email("Ingresa un correo electrónico válido.")
        .required("Campo es obligatorio"),

    password: yup
        .string()
        .required("Campo obligatorio"),
});

// Validación del formulario de registro.
export const registerSchema = yup.object({
    name: yup
        .string()
        .trim()
        .matches(
            /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
            "Solo se aceptan letras."
        )
        .required("Campo obligatorio."),

    email: yup
        .string()
        .trim()
        .email("Ingresa un correo electrónico válido.")
        .required("Campo obligatorio"),

    password: yup
        .string()
        .required("Campo obligatorio")
        .min(6, "Mínimo 6 caracteres."),
});

// Validación del formulario de cambio de contraseña.
export const changePasswordSchema = yup.object({
    currentPassword: yup
        .string()
        .required("Campo obligatorio"),

    newPassword: yup
        .string()
        .required("Campo obligatorio")
        .min(6, "Mínimo 6 caracteres.")
        .notOneOf(
            [yup.ref("currentPassword")],
            "La nueva contraseña debe ser diferente a la actual."
        ),

    confirmPassword: yup
        .string()
        .required("Campo obligatorio")
        .oneOf(
            [yup.ref("newPassword")],
            "Las contraseñas no coinciden."
        ),
});
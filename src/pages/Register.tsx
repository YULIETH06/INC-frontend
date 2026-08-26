import {
  Alert,
  Box,
  Link,
  Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import TextInput from "../components/common/inputs/TextInput";
import PasswordInput from "../components/common/inputs/PasswordInput";
import ActionButton from "../components/common/ActionButton";
import CustomSnackbar from "../components/common/CustomSnackbar";

import { appBrand } from "../data/appBrand";
import { useRegister } from "../hooks/auth/useRegister";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    name,
    email,
    password,
    loading,

    message,
    openMessage,
    error,
    formErrors,

    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleRegister,
    closeMessage,
  } = useRegister();

  const style = {
    container: {
      minHeight: "100vh",

      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      p: 2,

      background: `linear-gradient(
        135deg,
        ${theme.palette.primary.light},
        ${theme.palette.background.default}
      )`,
    },

    form: {
      width: "100%",
      maxWidth: "420px",
      minHeight: "480px",

      display: "flex",
      flexDirection: "column",
      alignItems: "center",

      backgroundColor: theme.palette.background.paper,

      p: "2rem",
      borderRadius: "12px",
      gap: "16px",

      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
    },

    logo: {
      width: "160px",
      height: "auto",
      objectFit: "contain",
      mb: "0.5rem",
    },

    link: {
      cursor: "pointer",
      textDecoration: "none",
      color: theme.palette.primary.main,
      fontWeight: 500,
    },
  };

  return (
    <Box sx={style.container}>
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={style.form}
        noValidate
      >
        <Box
          component="img"
          src={appBrand.logo}
          alt={appBrand.logoAlt}
          sx={style.logo}
        />

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          Regístrate para acceder a App-INC
        </Typography>

        {/* Mensaje para errores generales del backend. */}
        {error && (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <TextInput
          label="Nombre completo"
          value={name}
          onChange={handleNameChange}
          required
          disabled={loading}
          error={Boolean(formErrors.name)}
          helperText={formErrors.name}
          autoComplete="name"
        />

        <TextInput
          label="Correo electrónico"
          value={email}
          onChange={handleEmailChange}
          required
          disabled={loading}
          error={Boolean(formErrors.email)}
          helperText={formErrors.email}
          autoComplete="email"
        />

        <PasswordInput
          label="Contraseña"
          value={password}
          onChange={handlePasswordChange}
          required
          disabled={loading}
          error={Boolean(formErrors.password)}
          helperText={formErrors.password}
          hint="Mínimo 6 caracteres."
          autoComplete="new-password"
        />

        <ActionButton
          actionType="custom"
          type="submit"
          loading={loading}
          loadingText="Registrando..."
          size="large"
          fullWidth
        >
          Registrarse
        </ActionButton>

        <Typography
          sx={{
            fontSize: "0.9rem",
            color: theme.palette.text.secondary,
          }}
        >
          ¿Ya tienes cuenta?{" "}

          <Link
            sx={style.link}
            onClick={() => {
              if (!loading) {
                navigate("/");
              }
            }}
          >
            Inicia sesión
          </Link>
        </Typography>
      </Box>

      <CustomSnackbar
        open={openMessage}
        message={message}
        severity="success"
        onClose={closeMessage}
      />
    </Box>
  );
};

export default Register;
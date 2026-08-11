import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  titleAdornment?: ReactNode;
}

// Muestra el encabezado reutilizable de una página.
const PageHeader = ({
  title,
  subtitle,
  actions,
  titleAdornment,
}: PageHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "22px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>

          {titleAdornment}
        </Box>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              marginTop: "4px",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {actions && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
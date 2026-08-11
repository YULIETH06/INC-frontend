import {
  Box,
  CircularProgress,
} from "@mui/material";

interface LoadingBoxProps {
  minHeight?: number | string;
  size?: number;
}

// Muestra un indicador de carga centrado.
const LoadingBox = ({
  minHeight = 300,
  size,
}: LoadingBoxProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight,
      }}
    >
      <CircularProgress
        size={size}
      />
    </Box>
  );
};

export default LoadingBox;
import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import ActionButton from "./ActionButton";

import { formatFileSize } from "../../utils/common/fileUtils";
import { buildFileUrl } from "../../utils/common/fileUrl";

interface FilePreviewCardProps {
    fileName?: string;
    fileUrl: string;
    fileSize?: number | null;

    label?: string;

    buttonLabel?: string;
    buttonTooltip?: string;
}

// Componente reutilizable para mostrar y abrir un archivo almacenado.
const FilePreviewCard = ({
    fileName,
    fileUrl,
    fileSize = null,
    label,
    buttonLabel = "Ver archivo",
    buttonTooltip = "Ver archivo",
}: FilePreviewCardProps) => {
    // Abre el archivo almacenado en una nueva pestaña.
    const handleOpenFile = () => {
        const url = buildFileUrl(fileUrl);

        if (!url) {
            return;
        }

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <Box
            sx={{
                mt: 2,
                display: "flex",
                flexDirection: {
                    xs: "column",
                    sm: "row",
                },
                alignItems: {
                    xs: "stretch",
                    sm: "center",
                },
                justifyContent:
                    "space-between",
                gap: 2,
                p: 1.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "action.hover",
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    alignItems: "center",
                    minWidth: 0,
                }}
            >
                <DescriptionOutlinedIcon
                    sx={{
                        color: "primary.main",
                        flexShrink: 0,
                    }}
                />

                <Box sx={{ minWidth: 0 }}>
                    {label && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                            }}
                        >
                            {label}
                        </Typography>
                    )}

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {fileName}
                    </Typography>

                    {fileSize !== null && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {formatFileSize(
                                fileSize
                            )}
                        </Typography>
                    )}
                </Box>
            </Stack>

            <ActionButton
                actionType="open"
                tooltip={buttonTooltip}
                fullWidthOnMobile
                onClick={
                    handleOpenFile
                }
                sx={{
                    flexShrink: 0,
                }}
            >
                {buttonLabel}
            </ActionButton>
        </Box>
    );
};

export default FilePreviewCard;
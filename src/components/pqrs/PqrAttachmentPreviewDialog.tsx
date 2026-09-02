import { Box } from "@mui/material";

import CustomDialog from "../common/CustomDialog";
import ActionButton from "../common/ActionButton";

import { appIcons } from "../../icons/appIcons";

interface PreviewImage {
    url: string;
    name: string;
}

interface PqrAttachmentPreviewDialogProps {
    open: boolean;
    image: PreviewImage | null;
    onClose: () => void;
    onDownload: () => void;
}

// Diálogo reutilizable del módulo PQR para visualizar una imagen adjunta.
const PqrAttachmentPreviewDialog = ({
    open,
    image,
    onClose,
    onDownload,
}: PqrAttachmentPreviewDialogProps) => {
    const DownloadIcon = appIcons.download;

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title={image?.name || "Vista previa"}
            size="md"
            contentSx={{
                minHeight: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "background.default",
            }}
            actions={
                <>
                    <ActionButton
                        onClick={onDownload}
                        disabled={!image}
                        startIcon={<DownloadIcon />}
                    >
                        Descargar
                    </ActionButton>

                    <ActionButton
                        actionType="cancel"
                        onClick={onClose}
                    >
                        Cerrar
                    </ActionButton>
                </>
            }
        >
            {image && (
                <Box
                    component="img"
                    src={image.url}
                    alt={image.name}
                    sx={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: "70vh",
                        objectFit: "contain",
                        borderRadius: 2,
                    }}
                />
            )}
        </CustomDialog>
    );
};

export default PqrAttachmentPreviewDialog;
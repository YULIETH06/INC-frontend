// Convierte el tamaño de un archivo de bytes a KB o MB para mostrarlo en pantalla.
export const formatFileSize = (size: number) => {
    const sizeInKb = size / 1024;

    if (sizeInKb < 1024) {
        return `${Math.round(sizeInKb)} KB`;
    }

    return `${(sizeInKb / 1024).toFixed(1)} MB`;
};

// Descarga un archivo conservando el nombre original.
export const downloadFile = async (
    fileUrl: string,
    fileName: string
) => {
    if (!fileUrl) {
        return;
    }

    try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error("No se pudo descargar el archivo");
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();
        link.remove();

        URL.revokeObjectURL(blobUrl);
    } catch {
        const link = document.createElement("a");

        link.href = fileUrl;
        link.download = fileName;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);

        link.click();
        link.remove();
    }
};
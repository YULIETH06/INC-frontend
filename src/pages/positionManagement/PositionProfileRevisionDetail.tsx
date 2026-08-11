import {
    Alert,
} from "@mui/material";

import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";

import PositionProfileRevisionDetailSection from "../../components/positionManagement/PositionProfileRevisionDetailSection";
import ActionButton from "../../components/common/ActionButton";

// Página para consultar y gestionar el detalle de una revisión.
const PositionProfileRevisionDetail = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const departmentId =
        searchParams.get("departmentId") ?? "";

    const {
        positionProfileId: positionProfileIdParam,
        revisionId: revisionIdParam,
    } = useParams<{
        positionProfileId: string;
        revisionId: string;
    }>();

    // Convierte los identificadores recibidos en la URL.
    const positionProfileId = Number(
        positionProfileIdParam
    );

    const revisionId = Number(
        revisionIdParam
    );

    // Valida los identificadores antes de consultar el backend.
    const validIdentifiers =
        Number.isInteger(positionProfileId) &&
        positionProfileId > 0 &&
        Number.isInteger(revisionId) &&
        revisionId > 0;

    const handleGoBack = () => {
        const nextSearchParams =
            new URLSearchParams();

        if (departmentId) {
            nextSearchParams.set(
                "departmentId",
                departmentId
            );
        }

        if (validIdentifiers) {
            nextSearchParams.set(
                "positionProfileId",
                String(positionProfileId)
            );

            nextSearchParams.set(
                "revisionId",
                String(revisionId)
            );
        }

        navigate(
            `/dashboard/position-management/position-profiles?${nextSearchParams.toString()}`
        );
    };

    return (
        <PageContainer>
            <PageHeader
                title="Detalle de la revisión"
                subtitle="Consulta los requisitos y administra las descripciones de la revisión seleccionada."
                actions={
                    <ActionButton
                        actionType="back"
                        tooltip="Volver al historial de revisiones"
                        fullWidthOnMobile
                        onClick={handleGoBack}
                    >
                        Volver al historial
                    </ActionButton>
                }
            />

            {!validIdentifiers ? (
                <Alert severity="error">
                    La dirección del detalle no contiene
                    identificadores válidos.
                </Alert>
            ) : (
                <PositionProfileRevisionDetailSection
                    positionProfileId={
                        positionProfileId
                    }
                    revisionId={revisionId}
                />
            )}
        </PageContainer>
    );
};

export default PositionProfileRevisionDetail;
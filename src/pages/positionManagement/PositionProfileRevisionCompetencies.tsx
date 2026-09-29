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
import ActionButton from "../../components/common/ActionButton";

import PositionCompetenciesSection from "../../components/positionManagement/competencies/PositionCompetenciesSection";

// Página para consultar y gestionar las competencias
// de una revisión específica del perfil de cargo.
const PositionProfileRevisionCompetencies = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // Conserva el departamento para regresar
    // al historial manteniendo el contexto actual.
    const departmentId =
        searchParams.get("departmentId") ?? "";

    const {
        positionProfileId:
        positionProfileIdParam,
        revisionId:
        revisionIdParam,
    } = useParams<{
        positionProfileId: string;
        revisionId: string;
    }>();

    // Convierte los parámetros recibidos
    // desde la URL a números.
    const positionProfileId = Number(
        positionProfileIdParam
    );

    const revisionId = Number(
        revisionIdParam
    );

    // Valida ambos identificadores.
    const validIdentifiers =
        Number.isInteger(positionProfileId) &&
        positionProfileId > 0 &&
        Number.isInteger(revisionId) &&
        revisionId > 0;

    // Regresa al historial de revisiones.
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
                title="Competencias de la revisión"
                subtitle="Consulta y administra las competencias de la revisión seleccionada."
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
                    La dirección de las competencias
                    no contiene identificadores válidos.
                </Alert>
            ) : (
                <PositionCompetenciesSection
                    positionProfileId={
                        positionProfileId
                    }
                    revisionId={revisionId}
                />
            )}
        </PageContainer>
    );
};

export default PositionProfileRevisionCompetencies;
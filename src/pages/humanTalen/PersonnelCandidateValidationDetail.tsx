import {
    Alert,
} from "@mui/material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import ActionButton from "../../components/common/ActionButton";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";

import PersonnelCandidateValidationSection from "../../components/humanTalent/candidateValidation/PersonnelCandidateValidationSection";

// Página para consultar y gestionar el proceso de validación de un candidato.
const PersonnelCandidateValidationDetail = () => {
    const navigate = useNavigate();

    const {
        candidateId: candidateIdParam,
    } = useParams<{
        candidateId: string;
    }>();

    // Convierte el identificador recibido en la URL.
    const candidateId = Number(
        candidateIdParam
    );

    // Valida el identificador antes de consultar el backend.
    const validCandidateId =
        Number.isInteger(candidateId) &&
        candidateId > 0;

    // Regresa al listado de candidatos disponibles para validación.
    const handleGoBack = () => {
        navigate(
            "/dashboard/human-talent/candidate-validations"
        );
    };

    return (
        <PageContainer>
            <PageHeader
                title="Validación de cargo y postulante"
                subtitle="Consulta y completa las etapas correspondientes al candidato seleccionado."
                actions={
                    <ActionButton
                        actionType="back"
                        tooltip="Volver al listado de candidatos"
                        fullWidthOnMobile
                        onClick={handleGoBack}
                    >
                        Volver al listado
                    </ActionButton>
                }
            />

            {!validCandidateId ? (
                <Alert severity="error">
                    La dirección del detalle no contiene
                    un identificador de candidato válido.
                </Alert>
            ) : (
                <PersonnelCandidateValidationSection
                    candidateId={
                        candidateId
                    }
                />
            )}
        </PageContainer>
    );
};

export default PersonnelCandidateValidationDetail;
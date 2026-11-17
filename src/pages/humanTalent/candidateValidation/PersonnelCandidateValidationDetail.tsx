import {
    Alert,
} from "@mui/material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import ActionButton from "../../../components/common/ActionButton";
import IconActionButton from "../../../components/common/IconActionButton";
import PageContainer from "../../../components/common/PageContainer";
import PageHeader from "../../../components/common/PageHeader";

import PersonnelCandidateValidationSection from "../../../components/humanTalent/candidateValidation/PersonnelCandidateValidationSection";

import { usePersonnelCandidateValidationDetail } from "../../../hooks/humanTalent/candidateValidation/usePersonnelCandidateValidationDetail";

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

    // Consulta y gestiona el detalle del candidato y sus fases.
    const validationDetail =
        usePersonnelCandidateValidationDetail({
            candidateId,
            enabled: validCandidateId,
        });

    // Función y estado de carga que usa el botón de actualizar.
    const {
        loadingDetail,
        loadCandidateDetail,
    } = validationDetail;

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
                    <>
                        <ActionButton
                            actionType="back"
                            tooltip="Volver al listado de candidatos"
                            fullWidthOnMobile
                            onClick={handleGoBack}
                        >
                            Volver al listado
                        </ActionButton>

                        {validCandidateId && (
                            <IconActionButton
                                icon="refresh"
                                tooltip="Actualizar información"
                                loading={loadingDetail}
                                onClick={() =>
                                    void loadCandidateDetail()
                                }
                            />
                        )}
                    </>
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
                    validationDetail={
                        validationDetail
                    }
                />
            )}
        </PageContainer>
    );
};

export default PersonnelCandidateValidationDetail;
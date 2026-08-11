import { Stack } from "@mui/material";

import { useSearchParams } from "react-router-dom";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import ClearableSelect from "../../components/common/ClearableSelect";
import EmptyState from "../../components/common/EmptyState";
import FormGrid from "../../components/common/FormGrid";
import FormSection from "../../components/common/FormSection";
import SectionCard from "../../components/common/SectionCard";

import PositionProfileRevisionsSection from "../../components/positionManagement/PositionProfileRevisionsSection";

import { usePositionProfileRevisionSelector } from "../../hooks/positionManagemen/usePositionProfileRevisionSelector";

// Página para consultar y administrar las revisiones de perfiles de cargo.
const PositionProfileRevisions = () => {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    // Recupera la selección guardada en la URL.
    const initialDepartmentId =
        searchParams.get("departmentId") ?? "";

    const initialPositionProfileId =
        searchParams.get(
            "positionProfileId"
        ) ?? "";

    const {
        departmentId,
        positionProfileId,

        departments,
        positionProfiles,

        hasSelectedPositionProfile,

        loadingDepartments,
        loadingPositionProfiles,

        handleDepartmentChange,
        handlePositionProfileChange,
    } = usePositionProfileRevisionSelector({
        initialDepartmentId,
        initialPositionProfileId,
    });

    // Opciones disponibles para seleccionar un departamento.
    const departmentOptions = departments.map(
        (department) => ({
            label: department.name,
            value: String(department.id),
        })
    );

    // Opciones disponibles para seleccionar un perfil de cargo.
    const positionProfileOptions =
        positionProfiles.map(
            (positionProfile) => ({
                label: `${positionProfile.code} - ${positionProfile.name}`,
                value: String(
                    positionProfile.id
                ),
            })
        );

    // Actualiza el departamento y guarda la selección en la URL.
    const handleSelectedDepartmentChange = (
        value: string
    ) => {
        void handleDepartmentChange(value);

        const nextSearchParams =
            new URLSearchParams();

        if (value) {
            nextSearchParams.set(
                "departmentId",
                value
            );
        }

        // Al cambiar de departamento se limpian
        // el perfil y la revisión seleccionados.
        setSearchParams(nextSearchParams, {
            replace: true,
        });
    };

    // Actualiza el perfil de cargo y guarda la selección en la URL.
    const handleSelectedPositionProfileChange = (
        value: string
    ) => {
        handlePositionProfileChange(value);

        const nextSearchParams =
            new URLSearchParams(searchParams);

        if (departmentId) {
            nextSearchParams.set(
                "departmentId",
                departmentId
            );
        } else {
            nextSearchParams.delete(
                "departmentId"
            );
        }

        if (value) {
            nextSearchParams.set(
                "positionProfileId",
                value
            );
        } else {
            nextSearchParams.delete(
                "positionProfileId"
            );
        }

        nextSearchParams.delete("revisionId");

        setSearchParams(nextSearchParams, {
            replace: true,
        });
    };

    return (
        <PageContainer>
            <PageHeader
                title="Perfiles de cargo"
                subtitle="Consulta y administra las revisiones, requisitos y descripciones de cada perfil de cargo."
            />

            <Stack spacing={3}>
                <FormSection title="Seleccionar perfil de cargo">
                    <FormGrid
                        columns={{
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                        }}
                    >
                        <ClearableSelect
                            label="Departamento"
                            value={departmentId}
                            clearable
                            options={departmentOptions}
                            loading={loadingDepartments}
                            loadingText="Cargando departamentos..."
                            emptyMessage="No hay departamentos disponibles."
                            onChange={
                                handleSelectedDepartmentChange
                            }
                        />

                        <ClearableSelect
                            label="Perfil de cargo"
                            value={positionProfileId}
                            clearable
                            options={positionProfileOptions}
                            disabled={!departmentId}
                            loading={loadingPositionProfiles}
                            loadingText="Cargando perfiles de cargo..."
                            emptyMessage="No hay perfiles de cargo disponibles."
                            onChange={
                                handleSelectedPositionProfileChange
                            }
                        />
                    </FormGrid>
                </FormSection>

                {/* Estado inicial antes de seleccionar un perfil. */}
                {!hasSelectedPositionProfile ? (
                    <SectionCard
                        title="Revisiones del perfil"
                        subtitle="Aquí aparecerá el historial del perfil de cargo seleccionado."
                    >
                        <EmptyState
                            title="Selecciona un perfil de cargo"
                            description="Elige un departamento y un perfil de cargo para consultar sus revisiones."
                        />
                    </SectionCard>
                ) : (
                    <PositionProfileRevisionsSection
                        positionProfileId={Number(
                            positionProfileId
                        )}
                    />
                )}
            </Stack>
        </PageContainer>
    );
};

export default PositionProfileRevisions;
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";

import CreatePqr from "../pages/pqrs/user/CreatePqr";
import MyPqrs from "../pages/pqrs/user/MyPqrs";
import AdminPqrs from "../pages/pqrs/admin/AdminPqrs";
import AdminUser from "../pages/pqrs/admin/AdminUser";
import AgentPqrs from "../pages/pqrs/agent/AgentPqrs";

import CreatePersonnelRequisition from "../pages/humanTalen/requisitions/CreatePersonnelRequisition";
import PersonnelRequisitions from "../pages/humanTalen/requisitions/PersonnelRequisitions";
import PersonnelRequisitionDetail from "../pages/humanTalen/requisitions/PersonnelRequisitionDetail";
import PersonnelRequisitionFormat from "../pages/humanTalen/requisitions/PersonnelRequisitionFormat";
import PersonnelCandidateValidationDetail from "../pages/humanTalen/candidateValidation/PersonnelCandidateValidationDetail";
import PersonnelCandidateValidations from "../pages/humanTalen/candidateValidation/PersonnelCandidateValidations";

import UserSignature from "../pages/users/UserSignature";
import PositionProfileRevisions from "../pages/positionManagement/PositionProfileRevisions";
import PositionProfileRevisionDetail from "../pages/positionManagement/PositionProfileRevisionDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas con layout administrativo */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* PQR */}
          <Route path="/dashboard/pqrs/my" element={<MyPqrs />} />
          <Route path="/dashboard/pqrs/create" element={<CreatePqr />} />
          <Route path="/dashboard/pqrs" element={<AdminPqrs />} />
          <Route path="/agent/pqrs" element={<AgentPqrs />} />

          {/* Talento Humano */}
          <Route
            path="/dashboard/human-talent/requisitions"
            element={<PersonnelRequisitions />}
          />

          <Route
            path="/dashboard/human-talent/requisitions/:id"
            element={<PersonnelRequisitionDetail />}
          />

          <Route
            path="/dashboard/human-talent/requisitions/:id/format"
            element={<PersonnelRequisitionFormat />}
          />

          <Route
            path="/dashboard/human-talent/requisitions/create"
            element={<CreatePersonnelRequisition />}
          />

          {/* Validación de cargo y postulante */}
          <Route
            path="/dashboard/human-talent/candidate-validations"
            element={<PersonnelCandidateValidations />}
          />

          <Route
            path="/dashboard/human-talent/candidate-validations/:candidateId"
            element={<PersonnelCandidateValidationDetail />}
          />

          {/* Gestión de Cargos */}
          <Route
            path="/dashboard/position-management/position-profiles"
            element={<PositionProfileRevisions />}
          />

          <Route
            path="/dashboard/position-management/position-profiles/:positionProfileId/revisions/:revisionId"
            element={<PositionProfileRevisionDetail />}
          />

          {/* Usuario */}
          <Route path="/users" element={<AdminUser />} />
          <Route
            path="my-signature"
            element={<UserSignature />}
          />

        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
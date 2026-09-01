import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import DashboardLayout from "../components/layouts/DashboardLayout";

import CreatePqr from "../pages/pqrs/user/CreatePqr";
import MyPqrs from "../pages/pqrs/user/MyPqrs";
import AdminPqrs from "../pages/pqrs/admin/AdminPqrs";
import AdminUsers from "../pages/users/AdminUsers";
import AgentPqrs from "../pages/pqrs/agent/AgentPqrs";

import CreatePersonnelRequisition from "../pages/humanTalent/requisitions/CreatePersonnelRequisition";
import PersonnelRequisitions from "../pages/humanTalent/requisitions/PersonnelRequisitions";
import PersonnelRequisitionDetail from "../pages/humanTalent/requisitions/PersonnelRequisitionDetail";
import PersonnelRequisitionFormat from "../pages/humanTalent/requisitions/PersonnelRequisitionFormat";
import PersonnelCandidateValidationDetail from "../pages/humanTalent/candidateValidation/PersonnelCandidateValidationDetail";
import PersonnelCandidateValidations from "../pages/humanTalent/candidateValidation/PersonnelCandidateValidations";

import UserSignature from "../pages/users/UserSignature";
import ChangePassword from "../pages/users/ChangePassword";

import PositionProfileRevisions from "../pages/positionManagement/PositionProfileRevisions";
import PositionProfileRevisionDetail from "../pages/positionManagement/PositionProfileRevisionDetail";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas disponibles solo sin autenticación */}
      <Route element={<PublicRoute />}>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
      </Route>

      {/* Rutas disponibles solo con autenticación */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* PQR */}
          <Route
            path="/dashboard/pqrs/my"
            element={<MyPqrs />}
          />

          <Route
            path="/dashboard/pqrs/create"
            element={<CreatePqr />}
          />

          <Route
            path="/dashboard/pqrs"
            element={<AdminPqrs />}
          />

          <Route
            path="/agent/pqrs"
            element={<AgentPqrs />}
          />

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
          <Route
            path="/users"
            element={<AdminUsers />}
          />

          <Route
            path="/my-signature"
            element={<UserSignature />}
          />

          <Route
            path="/change-password"
            element={<ChangePassword />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
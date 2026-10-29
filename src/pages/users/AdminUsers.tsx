import {
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Typography,
  useTheme,
} from "@mui/material";

import type {
  DataTableColumn,
} from "../../components/common/DataTable";

import type {
  User,
  UserRole,
} from "../../interfaces/users/user.interface";

import {
  useAdminUsers,
} from "../../hooks/users/useAdminUsers";

import {
  useChangeUserPassword,
} from "../../hooks/users/useChangeUserPassword";

import {
  useUserPositionAssignment,
} from "../../hooks/users/useUserPositionAssignment";

import {
  useUserAccountActions,
} from "../../hooks/users/useUserAccountActions";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  userRoles,
} from "../../data/userRoles";

import {
  getUserRoleLabel,
} from "../../utils/users/userRoleUtils";

import {
  getUserStatusColor,
  getUserStatusLabel,
} from "../../utils/users/userStatusUtils";

import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import DataTable from "../../components/common/DataTable";
import ListToolbar from "../../components/common/ListToolbar";
import IconActionButton from "../../components/common/IconActionButton";
import ActionButton from "../../components/common/ActionButton";
import BulkUploadDialog from "../../components/common/BulkUploadDialog";
import ClearableSelect from "../../components/common/inputs/ClearableSelect";

import UserRoleChip from "../../components/users/UserRoleChip";
import CustomChip from "../../components/common/CustomChip";
import ConfirmActionDialog from "../../components/common/ConfirmActionDialog";
import ChangeUserEmailDialog from "../../components/users/ChangeUserEmailDialog";
import ChangeUserRoleDialog from "../../components/users/ChangeUserRoleDialog";
import ChangeUserPasswordDialog from "../../components/users/ChangeUserPasswordDialog";
import UserPositionAssignmentDialog from "../../components/users/UserPositionAssignmentDialog";

import {
  filterStyles,
} from "../../styles/filterStyles";

import {
  getTableStyles,
} from "../../styles/tableStyles";

import {
  downloadBulkUsersTemplate,
} from "../../template/users/downloadBulkUsersTemplate";

// Página principal para administrar usuarios.
const AdminUsers = () => {
  const theme = useTheme();

  const tableStyles =
    getTableStyles(theme);

  // Administración general de usuarios.
  const {
    users,
    loading,
    error,
    updatingUserId,

    selectedUser,
    selectedRole,
    openDialog,

    message,
    messageType,
    openMessage,

    openBulkUploadDialog,
    bulkUploadFile,
    bulkUploadLoading,
    bulkUploadResult,

    loadUsers,

    openChangeRoleDialog,
    closeChangeRoleDialog,
    changeSelectedRole,
    updateRole,

    openBulkUpload,
    closeBulkUpload,
    changeBulkUploadFile,
    uploadBulkUsers,
    clearBulkUploadResult,
    bulkUploadCompleted,

    closeMessage,
  } = useAdminUsers();

  // Restablecimiento administrativo de contraseña.
  const {
    selectedPasswordUser,

    openPasswordDialog,

    newPassword,
    confirmPassword,

    loading: passwordLoading,
    formErrors: passwordFormErrors,

    message: passwordMessage,
    messageType: passwordMessageType,
    openMessage: openPasswordMessage,

    openChangePasswordDialog,
    closeChangePasswordDialog,

    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleChangePassword,

    closeMessage: closePasswordMessage,
  } = useChangeUserPassword();

  // Asignación de cargos.
  const {
    selectedPositionUser,
    openPositionDialog,

    positions,
    loadingPositions,

    currentAssignment,
    assignmentHistory,
    loadingAssignments,
    loadError: positionLoadError,

    selectedPosition,
    positionError,

    savingPosition,
    endingPosition,
    openEndConfirm,

    message: positionMessage,
    messageType: positionMessageType,
    openMessage: openPositionMessage,

    openUserPositionDialog,
    closeUserPositionDialog,
    handlePositionChange,
    handleAssignPosition,

    openEndPositionConfirm,
    closeEndPositionConfirm,
    handleEndPosition,

    closeMessage: closePositionMessage,
  } = useUserPositionAssignment({
    onAssignmentChange: () =>
      loadUsers(false),
  });

  // Activación, desactivación y cambio de correo.
  const {
    statusUser,
    statusAction,
    updatingStatus,

    emailUser,
    newEmail,
    emailErrors,
    updatingEmail,

    message: accountMessage,
    messageType: accountMessageType,
    openMessage: openAccountMessage,

    openStatusConfirm,
    closeStatusConfirm,
    handleConfirmStatus,

    openEmailDialog,
    closeEmailDialog,
    handleNewEmailChange,
    handleSaveEmail,

    closeMessage: closeAccountMessage,
  } = useUserAccountActions({
    onAccountChange: () =>
      loadUsers(false),
  });

  // Usuario autenticado: el ADMIN no puede desactivarse a sí mismo.
  const { user: authenticatedUser } = useAuth();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState<
    "ALL" | UserRole
  >("ALL");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  // Opciones disponibles para filtrar usuarios por estado.
  const statusFilterOptions = [
    {
      label: "Todos los estados",
      value: "ALL",
    },
    {
      label: getUserStatusLabel(true),
      value: "ACTIVE",
    },
    {
      label: getUserStatusLabel(false),
      value: "INACTIVE",
    },
  ];

  // Opciones disponibles para filtrar usuarios por rol.
  const roleFilterOptions = [
    {
      label: "Todos los roles",
      value: "ALL",
    },
    ...userRoles.map(
      (role) => ({
        label:
          getUserRoleLabel(
            role
          ),
        value: role,
      })
    ),
  ];

  // Cambia la página actual de la tabla.
  const handleChangePage = (
    _event: unknown,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Cambia la cantidad de registros visibles por página.
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(
      Number(
        event.target.value
      )
    );

    setPage(0);
  };

  // Actualiza la búsqueda y regresa a la primera página.
  const handleSearchChange = (
    value: string
  ) => {
    setSearchTerm(value);
    setPage(0);
  };

  // Actualiza el filtro por rol.
  const handleRoleFilterChange = (
    value: string
  ) => {
    setRoleFilter(
      value as
      | "ALL"
      | UserRole
    );

    setPage(0);
  };

  // Actualiza el filtro por estado.
  const handleStatusFilterChange = (
    value: string
  ) => {
    setStatusFilter(
      value as
      | "ALL"
      | "ACTIVE"
      | "INACTIVE"
    );

    setPage(0);
  };

  // Limpia los filtros por rol y estado.
  const clearRoleFilter = () => {
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setPage(0);
  };

  // Indica si hay algún filtro aplicado.
  const hasActiveFilters =
    roleFilter !== "ALL" ||
    statusFilter !== "ALL";

  // Filtra usuarios por nombre, correo, cargo y rol.
  const filteredUsers =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .toLowerCase()
          .trim();

      return users.filter(
        (user) => {
          const matchesSearch =
            user.name
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            user.email
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            Boolean(
              user.currentPosition?.position.name
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
            );

          const matchesRole =
            roleFilter === "ALL" ||
            user.role ===
            roleFilter;

          const isActive =
            user.isActive !== false;

          const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter === "ACTIVE" && isActive) ||
            (statusFilter === "INACTIVE" && !isActive);

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      users,
      searchTerm,
      roleFilter,
      statusFilter,
    ]);

  // Define las columnas de la tabla de usuarios.
  const columns:
    DataTableColumn<User>[] = [
      {
        id: "number",
        label: "#",
        render: (
          _user,
          index
        ) => (
          <Typography
            sx={
              tableStyles.rowNumber
            }
          >
            {index + 1}
          </Typography>
        ),
      },
      {
        id: "name",
        label: "Nombre",
        render: (user) => (
          <Typography
            sx={{
              fontWeight: 700,
              color:
                "text.primary",
            }}
          >
            {user.name}
          </Typography>
        ),
      },
      {
        id: "email",
        label: "Correo",
        render: (user) =>
          user.email,
      },
      {
        id: "role",
        label: "Rol",
        render: (user) => (
          <UserRoleChip
            role={user.role}
          />
        ),
      },
      {
        id: "status",
        label: "Estado",
        render: (user) => (
          <CustomChip
            label={getUserStatusLabel(user.isActive)}
            color={getUserStatusColor(user.isActive)}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        id: "position",
        label: "Cargo",
        render: (user) =>
          user.currentPosition ? (
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color:
                    "text.primary",
                }}
              >
                {
                  user.currentPosition
                    .position.name
                }
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {
                  user.currentPosition
                    .position.code
                }
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Sin cargo
            </Typography>
          ),
      },
      {
        id: "action",
        label: "Acciones",
        align: "center",
        render: (user) => (
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
              gap: 0.5,
            }}
          >
            {/* Cambio de rol. */}
            <IconActionButton
              icon="edit"
              tooltip="Cambiar rol"
              loading={
                updatingUserId ===
                user.id
              }
              onClick={() =>
                openChangeRoleDialog(
                  user
                )
              }
              sx={
                tableStyles.primaryActionButton
              }
            />

            {/* Cambio de correo. */}
            <IconActionButton
              icon="email"
              tooltip="Cambiar correo"
              onClick={() =>
                openEmailDialog(
                  user
                )
              }
              disabled={
                updatingUserId ===
                user.id
              }
              sx={
                tableStyles.neutralActionButton
              }
            />

            {/* Asignación de cargo. */}
            <IconActionButton
              icon="position"
              tooltip={
                user.isActive === false
                  ? "Activa el usuario para asignarle un cargo"
                  : "Asignar cargo"
              }
              onClick={() =>
                openUserPositionDialog(
                  user
                )
              }
              disabled={
                updatingUserId ===
                user.id ||
                user.isActive === false
              }
              sx={
                tableStyles.neutralActionButton
              }
            />

            {/* Restablecimiento de contraseña. */}
            <IconActionButton
              icon="changePassword"
              tooltip="Restablecer contraseña"
              onClick={() =>
                openChangePasswordDialog(
                  user
                )
              }
              disabled={
                updatingUserId ===
                user.id
              }
              sx={
                tableStyles.neutralActionButton
              }
            />

            {/* Activación o desactivación. El ADMIN no puede desactivarse a sí mismo. */}
            <IconActionButton
              icon={
                user.isActive === false
                  ? "activateUser"
                  : "deactivateUser"
              }
              tooltip={
                user.isActive === false
                  ? "Activar usuario"
                  : user.id === authenticatedUser?.id
                    ? "No puedes desactivar tu propio usuario"
                    : "Desactivar usuario"
              }
              onClick={() =>
                openStatusConfirm(
                  user
                )
              }
              disabled={
                updatingUserId ===
                user.id ||
                (
                  user.isActive !== false &&
                  user.id === authenticatedUser?.id
                )
              }
              sx={
                tableStyles.neutralActionButton
              }
            />
          </Box>
        ),
      },
    ];

  if (loading) {
    return <LoadingBox />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
      }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{
            marginBottom:
              "16px",
          }}
        >
          {error}
        </Alert>
      )}

      {users.length === 0 ? (
        <EmptyState
          title="No hay usuarios registrados"
          description="Cuando existan usuarios en el sistema, aparecerán en esta tabla."
        />
      ) : (
        <DataTable
          title="Usuarios registrados"
          subtitle="Administra los usuarios registrados, sus roles y sus cargos dentro del sistema."
          actions={
            <ListToolbar
              searchValue={
                searchTerm
              }
              onSearchChange={
                handleSearchChange
              }
              searchPlaceholder="Buscar nombre, correo o cargo"
              searchTooltip="Buscar usuario"
              filterActive={
                hasActiveFilters
              }
              filterTitle="Filtrar usuarios"
              filterTooltip="Filtrar por rol o estado"
              filterContent={
                <Box
                  sx={
                    filterStyles.filterMenuContent
                  }
                >
                  <ClearableSelect
                    label="Rol"
                    value={
                      roleFilter
                    }
                    options={
                      roleFilterOptions
                    }
                    onChange={
                      handleRoleFilterChange
                    }
                    size="small"
                    minWidth="100%"
                  />

                  <ClearableSelect
                    label="Estado"
                    value={
                      statusFilter
                    }
                    options={
                      statusFilterOptions
                    }
                    onChange={
                      handleStatusFilterChange
                    }
                    size="small"
                    minWidth="100%"
                  />

                  <ActionButton
                    actionType="clear"
                    fullWidth
                    variant="text"
                    onClick={
                      clearRoleFilter
                    }
                    disabled={
                      !hasActiveFilters
                    }
                    sx={
                      filterStyles.clearFilterButton
                    }
                  >
                    Limpiar filtros
                  </ActionButton>
                </Box>
              }
              onRefresh={() =>
                loadUsers()
              }
              actions={
                <IconActionButton
                  icon="upload"
                  tooltip="Carga masiva de usuarios"
                  onClick={
                    openBulkUpload
                  }
                  disabled={
                    bulkUploadLoading
                  }
                />
              }
            />
          }
          minWidth={880}
          columns={columns}
          rows={filteredUsers}
          page={page}
          rowsPerPage={
            rowsPerPage
          }
          onPageChange={
            handleChangePage
          }
          onRowsPerPageChange={
            handleChangeRowsPerPage
          }
        />
      )}

      {users.length > 0 &&
        filteredUsers.length ===
        0 && (
          <Box
            sx={{
              marginTop:
                "16px",
            }}
          >
            <EmptyState
              title="No se encontraron usuarios"
              description="Intenta buscar con otro nombre, correo, cargo o rol."
            />
          </Box>
        )}

      {/* Cambio de rol. */}
      <ChangeUserRoleDialog
        open={openDialog}
        selectedUser={
          selectedUser
        }
        selectedRole={
          selectedRole
        }
        updatingUserId={
          updatingUserId
        }
        onClose={
          closeChangeRoleDialog
        }
        onRoleChange={
          changeSelectedRole
        }
        onSave={updateRole}
      />

      {/* Restablecimiento de contraseña. */}
      <ChangeUserPasswordDialog
        open={
          openPasswordDialog
        }
        selectedUser={
          selectedPasswordUser
        }
        newPassword={
          newPassword
        }
        confirmPassword={
          confirmPassword
        }
        errors={
          passwordFormErrors
        }
        loading={
          passwordLoading
        }
        onClose={
          closeChangePasswordDialog
        }
        onNewPasswordChange={
          handleNewPasswordChange
        }
        onConfirmPasswordChange={
          handleConfirmPasswordChange
        }
        onSave={
          handleChangePassword
        }
      />

      {/* Asignación de cargo. */}
      <UserPositionAssignmentDialog
        open={
          openPositionDialog
        }
        selectedUser={
          selectedPositionUser
        }
        positions={positions}
        loadingPositions={
          loadingPositions
        }
        currentAssignment={
          currentAssignment
        }
        assignmentHistory={
          assignmentHistory
        }
        loadingAssignments={
          loadingAssignments
        }
        loadError={
          positionLoadError
        }
        selectedPosition={
          selectedPosition
        }
        positionError={
          positionError
        }
        saving={
          savingPosition
        }
        ending={
          endingPosition
        }
        openEndConfirm={
          openEndConfirm
        }
        onClose={
          closeUserPositionDialog
        }
        onPositionChange={
          handlePositionChange
        }
        onSave={
          handleAssignPosition
        }
        onOpenEndConfirm={
          openEndPositionConfirm
        }
        onCloseEndConfirm={
          closeEndPositionConfirm
        }
        onConfirmEnd={
          handleEndPosition
        }
      />

      {/* Cambio de correo. */}
      <ChangeUserEmailDialog
        open={Boolean(emailUser)}
        selectedUser={emailUser}
        newEmail={newEmail}
        errors={emailErrors}
        loading={updatingEmail}
        onClose={closeEmailDialog}
        onNewEmailChange={
          handleNewEmailChange
        }
        onSave={handleSaveEmail}
      />

      {/* Confirmación de activación o desactivación. */}
      <ConfirmActionDialog
        open={Boolean(statusUser)}
        title={
          statusAction === "deactivate"
            ? "Desactivar usuario"
            : "Activar usuario"
        }
        message={
          <>
            ¿Deseas{" "}
            {statusAction === "deactivate"
              ? "desactivar"
              : "activar"}{" "}
            a{" "}
            <strong>
              {statusUser?.name}
            </strong>
            ?
          </>
        }
        infoContent={
          statusAction === "deactivate"
            ? "No podrá iniciar sesión y su sesión abierta se cerrará en su siguiente acción. Si tiene un cargo, se le retirará y sus aprobaciones pendientes quedarán esperando al próximo ocupante. Su correo quedará libre para un nuevo registro."
            : "Podrá iniciar sesión nuevamente con su correo actual. Si otro usuario activo ya usa ese correo, primero debes cambiárselo. Los cargos no se restauran: si los necesita, asígnalos de nuevo."
        }
        infoSeverity={
          statusAction === "deactivate"
            ? "warning"
            : "info"
        }
        actionType={
          statusAction === "deactivate"
            ? "lock"
            : "unlock"
        }
        confirmText={
          statusAction === "deactivate"
            ? "Desactivar"
            : "Activar"
        }
        loading={updatingStatus}
        loadingText={
          statusAction === "deactivate"
            ? "Desactivando..."
            : "Activando..."
        }
        onClose={closeStatusConfirm}
        onConfirm={handleConfirmStatus}
      />

      {/* Carga masiva. */}
      <BulkUploadDialog
        open={
          openBulkUploadDialog
        }
        title="Carga masiva de usuarios"
        description="Sube un archivo Excel con los usuarios que deseas registrar en el sistema."
        requiredColumns={[
          "nombre",
          "correo",
          "contraseña",
          "rol",
        ]}
        file={
          bulkUploadFile
        }
        loading={
          bulkUploadLoading
        }
        completed={
          bulkUploadCompleted
        }
        result={
          bulkUploadResult
        }
        onClose={
          closeBulkUpload
        }
        onFileChange={
          changeBulkUploadFile
        }
        onUpload={
          uploadBulkUsers
        }
        onClearResult={
          clearBulkUploadResult
        }
        onDownloadTemplate={
          downloadBulkUsersTemplate
        }
      />

      {/* Mensajes de administración general. */}
      <CustomSnackbar
        open={openMessage}
        message={message}
        severity={
          messageType
        }
        onClose={
          closeMessage
        }
      />

      {/* Mensajes de la asignación de cargos. */}
      <CustomSnackbar
        open={
          openPositionMessage
        }
        message={
          positionMessage
        }
        severity={
          positionMessageType
        }
        onClose={
          closePositionMessage
        }
      />

      {/* Mensajes de activación, desactivación y cambio de correo. */}
      <CustomSnackbar
        open={
          openAccountMessage
        }
        message={
          accountMessage
        }
        severity={
          accountMessageType
        }
        onClose={
          closeAccountMessage
        }
      />

      {/* Mensajes del restablecimiento de contraseña. */}
      <CustomSnackbar
        open={
          openPasswordMessage
        }
        message={
          passwordMessage
        }
        severity={
          passwordMessageType
        }
        onClose={
          closePasswordMessage
        }
      />
    </Box>
  );
};

export default AdminUsers;
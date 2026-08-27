import {
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  CircularProgress,
  MenuItem,
  Select,
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
  userRoles,
} from "../../data/userRoles";

import {
  getUserRoleLabel,
} from "../../utils/users/userRoleUtils";

import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import DataTable from "../../components/common/DataTable";
import ListToolbar from "../../components/common/ListToolbar";
import IconActionButton from "../../components/common/IconActionButton";
import ActionButton from "../../components/common/ActionButton";
import BulkUploadDialog from "../../components/common/BulkUploadDialog";

import UserRoleChip from "../../components/users/UserRoleChip";
import ChangeUserRoleDialog from "../../components/users/ChangeUserRoleDialog";

import {
  getFilterStyles,
} from "../../styles/filterStyles";

import {
  getTableStyles,
} from "../../styles/tableStyles";

import {
  downloadBulkUsersTemplate,
} from "../../template/users/downloadBulkUsersTemplate";

// Página principal para administrar usuarios y roles.
const AdminUsers = () => {
  const theme = useTheme();

  const filterStyles =
    getFilterStyles(theme);

  const tableStyles =
    getTableStyles(theme);

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState<"ALL" | UserRole>(
    "ALL"
  );

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
      Number(event.target.value)
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
    event: {
      target: {
        value: string;
      };
    }
  ) => {
    setRoleFilter(
      event.target.value as
      | "ALL"
      | UserRole
    );

    setPage(0);
  };

  // Limpia el filtro por rol.
  const clearRoleFilter = () => {
    setRoleFilter("ALL");
    setPage(0);
  };

  // Filtra usuarios por nombre, correo y rol.
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
              );

          const matchesRole =
            roleFilter === "ALL" ||
            user.role ===
            roleFilter;

          return (
            matchesSearch &&
            matchesRole
          );
        }
      );
    }, [
      users,
      searchTerm,
      roleFilter,
    ]);

  // Define las columnas de la tabla de usuarios.
  const columns: DataTableColumn<User>[] =
    [
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
        id: "action",
        label: "Acción",
        align: "center",
        render: (user) =>
          updatingUserId ===
            user.id ? (
            <CircularProgress
              size={22}
            />
          ) : (
            <IconActionButton
              icon="edit"
              tooltip="Cambiar rol"
              onClick={() =>
                openChangeRoleDialog(
                  user
                )
              }
              sx={
                tableStyles.primaryActionButton
              }
            />
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
          subtitle="Administra los usuarios registrados y sus roles dentro del sistema."
          actions={
            <ListToolbar
              searchValue={
                searchTerm
              }
              onSearchChange={
                handleSearchChange
              }
              searchPlaceholder="Buscar nombre o correo"
              searchTooltip="Buscar usuario"
              filterActive={
                roleFilter !==
                "ALL"
              }
              filterTitle="Filtrar por rol"
              filterTooltip="Filtrar por rol"
              filterContent={
                <Box
                  sx={
                    filterStyles.smallFilterMenuContent
                  }
                >
                  <Select
                    fullWidth
                    value={
                      roleFilter
                    }
                    onChange={
                      handleRoleFilterChange
                    }
                    size="small"
                    sx={
                      filterStyles.filterSelect
                    }
                  >
                    <MenuItem value="ALL">
                      Todos los roles
                    </MenuItem>

                    {userRoles.map(
                      (role) => (
                        <MenuItem
                          key={
                            role
                          }
                          value={
                            role
                          }
                        >
                          {getUserRoleLabel(
                            role
                          )}
                        </MenuItem>
                      )
                    )}
                  </Select>

                  <ActionButton
                    actionType="clear"
                    fullWidth
                    variant="text"
                    onClick={
                      clearRoleFilter
                    }
                    disabled={
                      roleFilter ===
                      "ALL"
                    }
                    sx={
                      filterStyles.clearFilterButtonWithMargin
                    }
                  >
                    Limpiar filtro
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
                  sx={
                    filterStyles.iconButton
                  }
                />
              }
            />
          }
          columns={columns}
          rows={filteredUsers}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {users.length > 0 &&
        filteredUsers.length === 0 && (
          <Box
            sx={{
              marginTop: "16px",
            }}
          >
            <EmptyState
              title="No se encontraron usuarios"
              description="Intenta buscar con otro nombre, correo o rol."
            />
          </Box>
        )}

      <ChangeUserRoleDialog
        open={openDialog}
        selectedUser={selectedUser}
        selectedRole={selectedRole}
        updatingUserId={updatingUserId}
        onClose={closeChangeRoleDialog}
        onRoleChange={changeSelectedRole}
        onSave={updateRole}
      />

      <BulkUploadDialog
        open={openBulkUploadDialog}
        title="Carga masiva de usuarios"
        description="Sube un archivo Excel con los usuarios que deseas registrar en el sistema."
        requiredColumns={["nombre", "email", "contraseña", "rol"]}
        file={bulkUploadFile}
        loading={bulkUploadLoading}
        completed={bulkUploadCompleted}
        result={bulkUploadResult}
        onClose={closeBulkUpload}
        onFileChange={changeBulkUploadFile}
        onUpload={uploadBulkUsers}
        onClearResult={clearBulkUploadResult}
        onDownloadTemplate={downloadBulkUsersTemplate}
      />

      <CustomSnackbar
        open={openMessage}
        message={message}
        severity={messageType}
        onClose={closeMessage}
      />
    </Box>
  );
};

export default AdminUsers;
import {
    Box,
    Divider,
    Typography,
} from "@mui/material";

import type {
    User,
    UserRole,
} from "../../interfaces/users/user.interface";

import { userRoles } from "../../data/userRoles";

import {
    getUserRoleLabel,
} from "../../utils/users/userRoleUtils";

import CustomDialog from "../common/CustomDialog";
import ActionButton from "../common/ActionButton";
import ClearableSelect from "../common/ClearableSelect";

import UserRoleChip from "./UserRoleChip";

interface ChangeUserRoleDialogProps {
    open: boolean;
    selectedUser: User | null;
    selectedRole: UserRole;
    updatingUserId: number | null;

    onClose: () => void;
    onRoleChange: (role: UserRole) => void;
    onSave: () => void;
}

// Diálogo utilizado para cambiar el rol de un usuario.
const ChangeUserRoleDialog = ({
    open,
    selectedUser,
    selectedRole,
    updatingUserId,
    onClose,
    onRoleChange,
    onSave,
}: ChangeUserRoleDialogProps) => {
    // Indica si el usuario seleccionado se encuentra en proceso de actualización.
    const isUpdating =
        Boolean(selectedUser) &&
        updatingUserId === selectedUser?.id;

    // Permite guardar únicamente cuando existe un usuario
    // y el rol seleccionado es diferente del actual.
    const canSave =
        Boolean(selectedUser) &&
        selectedRole !== selectedUser?.role;

    // Opciones disponibles para el selector de roles.
    const roleOptions = userRoles.map(
        (role) => ({
            value: role,
            label: getUserRoleLabel(role),
        })
    );

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="Cambiar rol"
            size="xs"
            contentSx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
            actions={
                <>
                    <ActionButton
                        actionType="cancel"
                        onClick={onClose}
                        disabled={isUpdating}
                        sx={{
                            flex: 1,
                        }}
                    >
                        Cancelar
                    </ActionButton>

                    <ActionButton
                        actionType="save"
                        onClick={onSave}
                        loading={isUpdating}
                        loadingText="Guardando..."
                        disabled={!canSave}
                        sx={{
                            flex: 2,
                        }}
                    >
                        Guardar cambios
                    </ActionButton>
                </>
            }
        >
            {selectedUser && (
                <>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "action.hover",
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Usuario seleccionado
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color: "text.primary",
                            }}
                        >
                            {selectedUser.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {selectedUser.email}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Rol actualmente asignado al usuario. */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 1,
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                fontWeight: 500,
                            }}
                        >
                            Rol actual
                        </Typography>

                        <UserRoleChip
                            role={selectedUser.role}
                        />
                    </Box>

                    {/* Selección del nuevo rol. */}
                    <ClearableSelect
                        label="Nuevo rol"
                        value={selectedRole}
                        options={roleOptions}
                        onChange={(value) => {
                            onRoleChange(
                                value as UserRole
                            );
                        }}
                        size="small"
                        disabled={isUpdating}
                        minWidth="0"
                    />
                </>
            )}
        </CustomDialog>
    );
};

export default ChangeUserRoleDialog;
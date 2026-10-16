import {
    Alert,
    Autocomplete,
    Box,
    CircularProgress,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import type {
    User,
} from "../../interfaces/users/user.interface";

import type {
    AssignablePosition,
    UserPositionAssignment,
} from "../../interfaces/users/userPositionAssignment.interface";

import {
    formatDate,
} from "../../utils/common/dateUtils";

import CustomDialog from "../common/CustomDialog";
import ActionButton from "../common/ActionButton";
import CustomChip from "../common/CustomChip";
import ConfirmActionDialog from "../common/ConfirmActionDialog";

interface UserPositionAssignmentDialogProps {
    open: boolean;
    selectedUser: User | null;

    positions: AssignablePosition[];
    loadingPositions: boolean;

    currentAssignment: UserPositionAssignment | null;
    assignmentHistory: UserPositionAssignment[];
    loadingAssignments: boolean;
    loadError: string;

    selectedPosition: AssignablePosition | null;
    positionError: string;

    saving: boolean;
    ending: boolean;
    openEndConfirm: boolean;

    onClose: () => void;
    onPositionChange: (position: AssignablePosition | null) => void;
    onSave: () => void;

    onOpenEndConfirm: () => void;
    onCloseEndConfirm: () => void;
    onConfirmEnd: () => void;
}

// Texto que identifica un cargo dentro del selector.
const getPositionLabel = (
    position: AssignablePosition
) => {
    return `${position.code} — ${position.name}`;
};

// Diálogo utilizado para asignar, cambiar o retirar el cargo de un usuario.
const UserPositionAssignmentDialog = ({
    open,
    selectedUser,
    positions,
    loadingPositions,
    currentAssignment,
    assignmentHistory,
    loadingAssignments,
    loadError,
    selectedPosition,
    positionError,
    saving,
    ending,
    openEndConfirm,
    onClose,
    onPositionChange,
    onSave,
    onOpenEndConfirm,
    onCloseEndConfirm,
    onConfirmEnd,
}: UserPositionAssignmentDialogProps) => {
    const isBusy =
        saving ||
        ending;

    // Permite guardar cuando hay un cargo elegido diferente del actual.
    const canSave =
        Boolean(selectedPosition) &&
        selectedPosition?.id !==
        currentAssignment?.position.id &&
        !loadingAssignments;

    // Ordena los cargos por área para agruparlos en el selector.
    const sortedPositions = [
        ...positions,
    ].sort((a, b) => {
        const departmentA =
            a.homeDepartment?.name ??
            "Sin área";

        const departmentB =
            b.homeDepartment?.name ??
            "Sin área";

        return (
            departmentA.localeCompare(
                departmentB
            ) ||
            a.name.localeCompare(
                b.name
            )
        );
    });

    // Historial sin el cargo activo, para no repetirlo.
    const previousAssignments =
        assignmentHistory.filter(
            (assignment) =>
                assignment.id !==
                currentAssignment?.id
        );

    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title="Asignar cargo"
                size="sm"
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
                            disabled={isBusy}
                            sx={{
                                flex: 1,
                            }}
                        >
                            Cerrar
                        </ActionButton>

                        <ActionButton
                            actionType="save"
                            onClick={onSave}
                            loading={saving}
                            loadingText="Guardando..."
                            disabled={
                                !canSave ||
                                ending
                            }
                            sx={{
                                flex: 2,
                            }}
                        >
                            {currentAssignment
                                ? "Cambiar cargo"
                                : "Asignar cargo"}
                        </ActionButton>
                    </>
                }
            >
                {selectedUser && (
                    <>
                        {/* Usuario seleccionado. */}
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

                        {loadError && (
                            <Alert severity="error">
                                {loadError}
                            </Alert>
                        )}

                        {/* Cargo actual. */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
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
                                Cargo actual
                            </Typography>

                            {loadingAssignments ? (
                                <CircularProgress size={20} />
                            ) : currentAssignment ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: {
                                            xs: "flex-start",
                                            sm: "center",
                                        },
                                        justifyContent:
                                            "space-between",
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row",
                                        },
                                        gap: 1.5,
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            {
                                                currentAssignment
                                                    .position.name
                                            }
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {
                                                currentAssignment
                                                    .position.code
                                            }
                                            {currentAssignment
                                                .position
                                                .homeDepartment &&
                                                ` · ${currentAssignment.position.homeDepartment.name}`}
                                            {` · Desde ${formatDate(
                                                currentAssignment.startDate
                                            )}`}
                                        </Typography>
                                    </Box>

                                    <ActionButton
                                        actionType="reject"
                                        onClick={
                                            onOpenEndConfirm
                                        }
                                        disabled={isBusy}
                                        fullWidthOnMobile
                                    >
                                        Retirar cargo
                                    </ActionButton>
                                </Box>
                            ) : (
                                <CustomChip
                                    label="Sin cargo asignado"
                                    color="default"
                                    size="small"
                                />
                            )}
                        </Box>

                        <Divider />

                        {/* Selección del nuevo cargo. */}
                        <Autocomplete
                            options={sortedPositions}
                            value={selectedPosition}
                            onChange={(_event, value) =>
                                onPositionChange(value)
                            }
                            groupBy={(position) =>
                                position.homeDepartment
                                    ?.name ??
                                "Sin área"
                            }
                            getOptionLabel={
                                getPositionLabel
                            }
                            isOptionEqualToValue={(
                                option,
                                value
                            ) =>
                                option.id === value.id
                            }
                            getOptionDisabled={(
                                position
                            ) =>
                                position.id ===
                                currentAssignment
                                    ?.position.id
                            }
                            loading={loadingPositions}
                            loadingText="Cargando cargos..."
                            noOptionsText="No se encontraron cargos"
                            disabled={isBusy}
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={
                                        currentAssignment
                                            ? "Nuevo cargo"
                                            : "Cargo"
                                    }
                                    placeholder="Buscar por código o nombre"
                                    error={Boolean(
                                        positionError
                                    )}
                                    helperText={
                                        positionError ||
                                        (currentAssignment
                                            ? "Al cambiar el cargo, el actual quedará en el historial."
                                            : undefined)
                                    }
                                />
                            )}
                        />

                        {/* Historial de cargos anteriores. */}
                        {previousAssignments.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
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
                                    Cargos anteriores
                                </Typography>

                                <TableContainer
                                    sx={{
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    bgcolor:
                                                        "background.default",
                                                }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Cargo
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Desde
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Hasta
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {previousAssignments.map(
                                                (assignment) => (
                                                    <TableRow
                                                        key={
                                                            assignment.id
                                                        }
                                                    >
                                                        <TableCell>
                                                            {
                                                                assignment
                                                                    .position
                                                                    .name
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {formatDate(
                                                                assignment.startDate
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            {formatDate(
                                                                assignment.endDate
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </>
                )}
            </CustomDialog>

            {/* Confirmación para retirar el cargo. */}
            <ConfirmActionDialog
                open={openEndConfirm}
                title="Retirar cargo"
                message={
                    <>
                        ¿Deseas retirar el cargo{" "}
                        <strong>
                            {
                                currentAssignment
                                    ?.position.name
                            }
                        </strong>{" "}
                        a{" "}
                        <strong>
                            {selectedUser?.name}
                        </strong>
                        ?
                    </>
                }
                infoContent="El cargo quedará en el historial del usuario y podrás asignarle otro cuando lo necesites."
                infoSeverity="info"
                actionType="reject"
                confirmText="Retirar cargo"
                loading={ending}
                loadingText="Retirando..."
                onClose={onCloseEndConfirm}
                onConfirm={onConfirmEnd}
            />
        </>
    );
};

export default UserPositionAssignmentDialog;

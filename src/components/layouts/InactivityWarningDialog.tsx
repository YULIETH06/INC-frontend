import {
    Typography,
} from "@mui/material";

import CustomDialog from "../common/CustomDialog";
import ActionButton from "../common/ActionButton";

interface InactivityWarningDialogProps {
    open: boolean;
    secondsLeft: number;
    onContinue: () => void;
    onLogout: () => void;
}

// Aviso que aparece antes de cerrar la sesión por inactividad.
const InactivityWarningDialog = ({
    open,
    secondsLeft,
    onContinue,
    onLogout,
}: InactivityWarningDialogProps) => {
    return (
        <CustomDialog
            open={open}
            title="¿Sigues ahí?"
            size="xs"
            showCloseButton={false}
            actions={
                <>
                    <ActionButton
                        actionType="cancel"
                        onClick={onLogout}
                        sx={{
                            flex: 1,
                        }}
                    >
                        Cerrar sesión
                    </ActionButton>

                    <ActionButton
                        actionType="approve"
                        variant="contained"
                        onClick={onContinue}
                        sx={{
                            flex: 1.5,
                        }}
                    >
                        Seguir conectado
                    </ActionButton>
                </>
            }
        >
            <Typography variant="body2">
                Por inactividad, tu sesión se cerrará en{" "}
                <strong>{secondsLeft}</strong>{" "}
                {secondsLeft === 1 ? "segundo" : "segundos"}.
            </Typography>
        </CustomDialog>
    );
};

export default InactivityWarningDialog;
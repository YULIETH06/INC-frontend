import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

export const appIcons = {
    save: SaveOutlinedIcon,
    edit: EditOutlinedIcon,
    cancel: CloseOutlinedIcon,
    approve: CheckCircleOutlineOutlinedIcon,
    reject: CancelOutlinedIcon,
    delete: DeleteOutlineOutlinedIcon,
    view: VisibilityOutlinedIcon,
    open: OpenInNewOutlinedIcon,
    create: AddCircleOutlineOutlinedIcon,
    send: SendOutlinedIcon,
    clear: RestartAltOutlinedIcon,
    back: ArrowBackOutlinedIcon,
    print: PrintOutlinedIcon,
    file: DescriptionOutlinedIcon,
    upload: UploadFileOutlinedIcon,
    lock: LockOutlinedIcon,
    unlock: LockOpenOutlinedIcon,
    history: HistoryOutlinedIcon,
};

export type AppIconName =
    keyof typeof appIcons;
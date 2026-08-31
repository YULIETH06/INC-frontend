import {
    useState,
} from "react";

import {
    Alert,
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Rating,
    TextField,
    Typography,
} from "@mui/material";

import {
    alpha,
    useTheme,
} from "@mui/material/styles";

import type {
    PqrStatus,
} from "../../../interfaces/pqrs/pqr.interface";

import {
    useMyPqrs,
} from "../../../hooks/pqrs/useMyPqrs";

import {
    useAuth,
} from "../../../context/AuthContext";

import {
    usePqrChat,
} from "../../../hooks/pqrs/usePqrChat";

import {
    formatDate,
} from "../../../utils/common/dateUtils";

import {
    getCaseTypeLabel,
    getStatusColor,
} from "../../../utils/pqrs/pqrUtils";

import {
    pqrStatusOptions,
} from "../../../data/pqrOptions";

import {
    filterStyles,
} from "../../../styles/filterStyles";

import {
    appIcons,
} from "../../../icons/appIcons";

import PageHeader from "../../../components/common/PageHeader";
import LoadingBox from "../../../components/common/LoadingBox";
import EmptyState from "../../../components/common/EmptyState";
import CustomSnackbar from "../../../components/common/CustomSnackbar";
import StatsSummary from "../../../components/common/StatsSummary";
import ListToolbar from "../../../components/common/ListToolbar";
import ClearableSelect from "../../../components/common/ClearableSelect";
import ActionButton from "../../../components/common/ActionButton";

import PqrRatingSummary from "../../../components/pqrs/PqrRatingSummary";

import {
    PqrChatView,
} from "../../../components/pqrs/PqrChatView";

// Íconos reutilizados desde el catálogo centralizado.
const AssignmentIcon = appIcons.assignment;

const PendingIcon = appIcons.pending;

const CompletedIcon = appIcons.completed;

const RatingIcon = appIcons.rating;

const CalendarIcon = appIcons.calendar;

const ReviewIcon = appIcons.review;

const ChatIcon = appIcons.chat;

// Página donde el usuario consulta las PQR que ha creado.
const MyPqrs = () => {
    const theme = useTheme();

    const {
        pqrs,
        loading,
        error,
        loadMyPqrs,

        ratingPqrId,
        rating,
        ratingComment,
        ratingLoading,

        selectedChatPqrId,
        selectedChatPqr,
        openPqrChat,
        closePqrChat,

        openMessage,
        message,
        messageType,

        setRating,
        setRatingComment,
        openRatingForm,
        closeRatingForm,
        submitRating,
        closeMessage,
    } = useMyPqrs();

    // Token y usuario utilizados por el chat.
    const { token, user } = useAuth();

    const {
        messages,
        messageText,
        setMessageText,
        selectedFile,
        handleSelectFile,
        handleRemoveSelectedFile,
        loadingMessages,
        sendingAttachment,
        chatError,
        setChatError,
        handleSendMessage,
    } = usePqrChat({
        pqrId:
            selectedChatPqrId,
        token,
    });

    // Texto utilizado para buscar PQR.
    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    // Filtro por estado.
    const [
        statusFilter,
        setStatusFilter,
    ] = useState<
        "ALL" | PqrStatus
    >("ALL");

    // Obtiene la etiqueta visible de un estado.
    const getStatusLabel = (
        status: PqrStatus
    ) => {
        return (
            pqrStatusOptions.find(
                (option) =>
                    option.value ===
                    status
            )?.label ||
            status
        );
    };

    // Limpia el filtro por estado.
    const clearFilters = () => {
        setStatusFilter("ALL");
    };

    // Indica si existe algún filtro activo.
    // La búsqueda se controla independientemente.
    const hasActiveFilters =
        statusFilter !== "ALL";

    // Indica si existe búsqueda o filtro activo.
    // Se utiliza únicamente para el texto informativo.
    const hasActiveCriteria =
        searchTerm.trim() !== "" ||
        hasActiveFilters;

    // Opciones disponibles para el filtro por estado.
    const statusFilterOptions = [
        {
            label:
                "Todos los estados",
            value: "ALL",
        },
        ...pqrStatusOptions,
    ];

    // Cuenta las PQR que todavía no están cerradas.
    const pendingPqrs =
        pqrs.filter(
            (pqr) =>
                pqr.status !==
                "CERRADA"
        ).length;

    // Cuenta las PQR cerradas.
    const closedPqrs =
        pqrs.filter(
            (pqr) =>
                pqr.status ===
                "CERRADA"
        ).length;

    // Cuenta las PQR cerradas pendientes de calificación.
    const pendingRatingPqrs =
        pqrs.filter(
            (pqr) =>
                pqr.status ===
                "CERRADA" &&
                !pqr.rating
        ).length;

    // Información mostrada en las tarjetas de resumen.
    const summaryItems = [
        {
            label:
                "Mis PQR",
            value:
                pqrs.length,
            icon: (
                <AssignmentIcon fontSize="small" />
            ),
        },
        {
            label:
                "En seguimiento",
            value:
                pendingPqrs,
            icon: (
                <PendingIcon fontSize="small" />
            ),
        },
        {
            label:
                "Cerradas",
            value:
                closedPqrs,
            icon: (
                <CompletedIcon fontSize="small" />
            ),
        },
        {
            label:
                "Por calificar",
            value:
                pendingRatingPqrs,
            icon: (
                <RatingIcon fontSize="small" />
            ),
        },
    ];

    /*
     * Filtra las PQR.
     *
     * El buscador solamente utiliza campos que
     * no tienen un filtro propio:
     *
     * - ID
     * - descripción
     * - tipo de caso
     *
     * Estado se maneja exclusivamente desde
     * su filtro.
     */
    const filteredPqrs =
        pqrs.filter((pqr) => {
            const normalizedSearch =
                searchTerm
                    .toLowerCase()
                    .trim();

            const matchesSearch =
                !normalizedSearch ||
                `${pqr.id}`.includes(
                    normalizedSearch
                ) ||
                `pqr-${pqr.id}`.includes(
                    normalizedSearch
                ) ||
                `#pqr-${pqr.id}`.includes(
                    normalizedSearch
                ) ||
                pqr.description
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    ) ||
                pqr.caseType
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    ) ||
                getCaseTypeLabel(
                    pqr.caseType
                )
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    );

            const matchesStatus =
                statusFilter ===
                "ALL" ||
                pqr.status ===
                statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    const style = {
        container: {
            width: "100%",
        },

        topBar: {
            mb: 2,
            display: "flex",
            justifyContent:
                "space-between",
            alignItems: {
                xs: "stretch",
                sm: "center",
            },
            flexDirection: {
                xs: "column",
                sm: "row",
            },
            gap: 1.5,
        },

        helperText: {
            color:
                theme.palette.text
                    .secondary,
            fontSize: "0.88rem",
            fontWeight: 600,
        },

        toolbarContainer: {
            flex: 1,
            display: "flex",
            justifyContent:
                "flex-end",
        },

        list: {
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                xl: "1fr 1fr 1fr",
            },
            gap: 1.5,
            alignItems:
                "start",
        },

        card: {
            borderRadius: 4,
            backgroundColor:
                theme.palette
                    .background.paper,
            border: `1px solid ${alpha(
                theme.palette.primary
                    .main,
                0.16
            )}`,
            boxShadow:
                "0 10px 24px rgba(15, 23, 42, 0.07)",
            overflow: "hidden",
            transition:
                "all 0.2s ease",

            "&:hover": {
                transform:
                    "translateY(-2px)",
                boxShadow:
                    "0 16px 34px rgba(15, 23, 42, 0.12)",
                borderColor:
                    alpha(
                        theme.palette
                            .primary
                            .main,
                        0.35
                    ),
            },
        },

        cardContent: {
            p: 2,
        },

        cardHeader: {
            display: "flex",
            justifyContent:
                "space-between",
            alignItems:
                "flex-start",
            gap: 1.5,
            mb: 1.2,
        },

        idText: {
            fontSize: "0.78rem",
            fontWeight: 900,
            color:
                theme.palette
                    .primary.main,
            mb: 0.3,
        },

        cardTitle: {
            fontWeight: 900,
            color:
                theme.palette.text
                    .primary,
            lineHeight: 1.2,
            fontSize: "1rem",
        },

        statusChip: {
            borderRadius:
                "999px",
            fontWeight: 800,
            fontSize: "0.72rem",
            height: 24,
        },

        dateBox: {
            display: "flex",
            alignItems:
                "center",
            gap: 0.7,
            color:
                theme.palette.text
                    .secondary,
            mb: 1.3,
        },

        date: {
            color:
                theme.palette.text
                    .secondary,
            fontSize: "0.82rem",
        },

        descriptionBlock: {
            mt: 1.3,
            p: 1.4,
            borderRadius: 3,
            backgroundColor:
                alpha(
                    theme.palette
                        .primary.light,
                    0.42
                ),
            border: `1px solid ${alpha(
                theme.palette.primary
                    .main,
                0.16
            )}`,
        },

        descriptionLabel: {
            mb: 0.5,
            fontSize: "0.72rem",
            fontWeight: 900,
            color:
                theme.palette
                    .primary.main,
            textTransform:
                "uppercase",
            letterSpacing:
                "0.06em",
        },

        description: {
            color:
                theme.palette.text
                    .secondary,
            fontSize: "0.88rem",
            lineHeight: 1.55,
            display:
                "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient:
                "vertical",
            overflow: "hidden",
            minHeight: 62,
        },

        actionsBoxCard: {
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px solid ${alpha(
                theme.palette.primary
                    .main,
                0.14
            )}`,
            display: "flex",
            gap: 1,
            alignItems:
                "center",
            flexWrap: "wrap",
        },

        chatButton: {
            borderRadius: 2.5,
            fontWeight: 800,
            textTransform:
                "none",
            boxShadow: "none",
        },

        ratingButton: {
            borderRadius: 2.5,
            fontWeight: 800,
            textTransform:
                "none",
            boxShadow: "none",
        },

        ratingSection: {
            mt: 1.5,
            p: {
                xs: 1.8,
                md: 2,
            },
            borderRadius: 4,
            backgroundColor:
                theme.palette
                    .background
                    .default,
            border: `1px solid ${theme.palette.primary.light}`,
        },

        ratingHeader: {
            display: "flex",
            alignItems:
                "center",
            gap: 1,
            mb: 0.5,
            fontWeight: 800,
            color:
                theme.palette
                    .primary.main,
        },

        ratingDescription: {
            color:
                theme.palette.text
                    .secondary,
            mb: 1.5,
            lineHeight: 1.6,
        },

        ratingStarsBox: {
            display: "flex",
            alignItems:
                "center",
            gap: 1,
            mb: 1.5,
            flexWrap: "wrap",
        },

        ratingText: {
            color:
                theme.palette.text
                    .secondary,
            fontSize: "0.9rem",
        },

        ratingActions: {
            display: "flex",
            justifyContent:
                "flex-end",
            gap: 1,
            mt: 1.5,
            flexDirection: {
                xs: "column",
                sm: "row",
            },
        },

        cancelButton: {
            borderRadius: 3,
            fontWeight: 700,
            textTransform:
                "none",
        },

        submitRatingButton: {
            borderRadius: 3,
            fontWeight: 800,
            textTransform:
                "none",
            boxShadow: "none",
        },
    };

    if (loading) {
        return (
            <LoadingBox />
        );
    }

    // Muestra el chat cuando existe una PQR seleccionada.
    if (
        selectedChatPqr &&
        user
    ) {
        return (
            <>
                <PqrChatView
                    pqr={selectedChatPqr}
                    messages={messages}
                    messageText={messageText}
                    selectedFile={selectedFile}
                    loadingMessages={loadingMessages}
                    sendingAttachment={sendingAttachment}
                    chatError={chatError}
                    currentUserRole={user.role}
                    onBack={closePqrChat}
                    onMessageChange={setMessageText}
                    onSendMessage={handleSendMessage}
                    onSelectFile={handleSelectFile}
                    onRemoveSelectedFile={handleRemoveSelectedFile}
                    onClearError={() => setChatError("")}
                />

                <CustomSnackbar
                    open={openMessage}
                    message={message}
                    severity={messageType}
                    onClose={closeMessage}
                />
            </>
        );
    }

    return (
        <Box sx={style.container}>
            <PageHeader
                title="Mis PQR"
                subtitle="Consulta el estado de tus peticiones, quejas, reclamos o solicitudes."
            />

            <StatsSummary
                items={
                    summaryItems
                }
            />

            <Box sx={style.topBar}>
                <Typography sx={style.helperText}>
                    {filteredPqrs.length} PQR encontradas
                    {hasActiveFilters && " con filtros aplicados"}
                </Typography>

                <Box
                    sx={
                        style.toolbarContainer
                    }
                >
                    <ListToolbar
                        searchValue={
                            searchTerm
                        }
                        onSearchChange={
                            setSearchTerm
                        }
                        searchPlaceholder="Buscar PQR..."
                        searchTooltip="Buscar PQR"
                        filterActive={
                            hasActiveFilters
                        }
                        filterTitle="Filtrar por estado"
                        filterTooltip="Filtrar PQR"
                        filterContent={
                            <Box
                                sx={
                                    filterStyles.filterMenuContent
                                }
                            >
                                <ClearableSelect
                                    label="Estado"
                                    value={
                                        statusFilter
                                    }
                                    options={
                                        statusFilterOptions
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setStatusFilter(
                                            value as
                                            | "ALL"
                                            | PqrStatus
                                        )
                                    }
                                    size="small"
                                    minWidth="100%"
                                />

                                <ActionButton
                                    actionType="clear"
                                    fullWidth
                                    variant="text"
                                    onClick={
                                        clearFilters
                                    }
                                    disabled={
                                        !hasActiveFilters
                                    }
                                    sx={
                                        filterStyles.clearFilterButton
                                    }
                                >
                                    Limpiar filtro
                                </ActionButton>
                            </Box>
                        }
                        onRefresh={
                            loadMyPqrs
                        }
                        refreshTooltip="Actualizar lista"
                    />
                </Box>
            </Box>

            {/* Mensaje de error al cargar las PQR. */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Estado vacío cuando el usuario no tiene PQR. */}
            {pqrs.length ===
                0 ? (
                <EmptyState
                    title="No tienes PQR registradas"
                    description="Cuando crees una PQR, aparecerá en este espacio."
                />
            ) : filteredPqrs.length ===
                0 ? (
                <EmptyState
                    title="No se encontraron PQR"
                    description="No hay solicitudes que coincidan con tu búsqueda o filtro aplicado."
                />
            ) : (
                <Box
                    sx={style.list}
                >
                    {filteredPqrs.map(
                        (pqr) => (
                            <Paper
                                key={
                                    pqr.id
                                }
                                sx={
                                    style.card
                                }
                            >
                                <Box
                                    sx={style.cardContent}
                                >
                                    <Box
                                        sx={style.cardHeader}
                                    >
                                        <Box>
                                            <Typography
                                                sx={style.idText}
                                            >
                                                #PQR-{pqr.id}
                                            </Typography>

                                            <Typography
                                                sx={style.cardTitle}
                                            >
                                                {getCaseTypeLabel(
                                                    pqr.caseType
                                                )}
                                            </Typography>
                                        </Box>

                                        <Chip
                                            label={getStatusLabel(
                                                pqr.status
                                            )}
                                            color={getStatusColor(
                                                pqr.status
                                            )}
                                            size="small"
                                            sx={
                                                style.statusChip
                                            }
                                        />
                                    </Box>

                                    <Box sx={style.dateBox}
                                    >
                                        <CalendarIcon fontSize="small" />

                                        <Typography
                                            variant="body2"
                                            sx={style.date}
                                        >
                                            Creada el{" "}
                                            {formatDate(
                                                pqr.createdAt
                                            )}
                                        </Typography>
                                    </Box>

                                    <Box sx={style.descriptionBlock}>
                                        <Typography sx={style.descriptionLabel}>
                                            Descripción
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={style.description}
                                        >
                                            {pqr.description}
                                        </Typography>
                                    </Box>

                                    {/* Calificación ya registrada. */}
                                    {pqr.rating && (
                                        <PqrRatingSummary
                                            rating={pqr.rating}
                                            ratingComment={pqr.ratingComment}
                                            ratedAt={pqr.ratedAt}
                                        />
                                    )}

                                    <Divider
                                        sx={{
                                            mt: 1.5,
                                        }}
                                    />

                                    <Box sx={style.actionsBoxCard}>
                                        {/* Abre el chat de seguimiento. */}
                                        <Button
                                            variant="outlined"
                                            startIcon={
                                                <Badge
                                                    badgeContent={
                                                        pqr.unreadMessagesCount ??
                                                        0
                                                    }
                                                    color="error"
                                                    invisible={
                                                        (
                                                            pqr.unreadMessagesCount ??
                                                            0
                                                        ) ===
                                                        0
                                                    }
                                                >
                                                    <ChatIcon />
                                                </Badge>
                                            }
                                            sx={
                                                style.chatButton
                                            }
                                            onClick={() =>
                                                openPqrChat(
                                                    pqr.id
                                                )
                                            }
                                        >
                                            Ver chat
                                        </Button>

                                        {/* Abre el formulario de calificación. */}
                                        {pqr.status ===
                                            "CERRADA" &&
                                            !pqr.rating &&
                                            ratingPqrId !==
                                            pqr.id && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={
                                                        <ReviewIcon />
                                                    }
                                                    sx={
                                                        style.ratingButton
                                                    }
                                                    onClick={() =>
                                                        openRatingForm(
                                                            pqr.id
                                                        )
                                                    }
                                                >
                                                    Calificar
                                                    atención
                                                </Button>
                                            )}
                                    </Box>

                                    {/* Formulario de calificación. */}
                                    {ratingPqrId ===
                                        pqr.id && (
                                            <Box
                                                sx={
                                                    style.ratingSection
                                                }
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={
                                                        style.ratingHeader
                                                    }
                                                >
                                                    <ReviewIcon fontSize="small" />

                                                    Califica
                                                    la
                                                    atención
                                                    recibida
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={
                                                        style.ratingDescription
                                                    }
                                                >
                                                    Selecciona
                                                    una
                                                    valoración
                                                    y
                                                    escribe
                                                    un
                                                    comentario
                                                    si
                                                    deseas
                                                    aportar
                                                    más
                                                    detalles
                                                    sobre
                                                    la
                                                    atención
                                                    brindada.
                                                </Typography>

                                                <Box
                                                    sx={
                                                        style.ratingStarsBox
                                                    }
                                                >
                                                    <Rating
                                                        value={
                                                            rating
                                                        }
                                                        onChange={(
                                                            _,
                                                            value
                                                        ) =>
                                                            setRating(
                                                                value
                                                            )
                                                        }
                                                        size="large"
                                                    />

                                                    <Typography
                                                        variant="body2"
                                                        sx={
                                                            style.ratingText
                                                        }
                                                    >
                                                        {rating
                                                            ? `${rating} de 5 estrellas`
                                                            : "Sin calificación seleccionada"}
                                                    </Typography>
                                                </Box>

                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    minRows={
                                                        3
                                                    }
                                                    label="Comentario"
                                                    placeholder="Ejemplo: La atención fue clara y oportuna."
                                                    value={
                                                        ratingComment
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setRatingComment(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    slotProps={{
                                                        htmlInput:
                                                        {
                                                            maxLength:
                                                                300,
                                                        },
                                                    }}
                                                    helperText={`${300 -
                                                        ratingComment.length
                                                        } caracteres disponibles`}
                                                />

                                                <Box
                                                    sx={
                                                        style.ratingActions
                                                    }
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        color="inherit"
                                                        onClick={
                                                            closeRatingForm
                                                        }
                                                        disabled={
                                                            ratingLoading
                                                        }
                                                        sx={
                                                            style.cancelButton
                                                        }
                                                    >
                                                        Cancelar
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        onClick={() =>
                                                            submitRating(
                                                                pqr.id
                                                            )
                                                        }
                                                        disabled={
                                                            ratingLoading
                                                        }
                                                        sx={
                                                            style.submitRatingButton
                                                        }
                                                    >
                                                        {ratingLoading
                                                            ? "Enviando..."
                                                            : "Enviar calificación"}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
                                </Box>
                            </Paper>
                        )
                    )}
                </Box>
            )}

            <CustomSnackbar
                open={
                    openMessage
                }
                message={
                    message
                }
                severity={
                    messageType
                }
                onClose={
                    closeMessage
                }
            />
        </Box>
    );
};

export default MyPqrs;
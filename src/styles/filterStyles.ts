// Estilos reutilizables para el contenido
// de los filtros utilizados en los listados.
export const filterStyles = {
    filterMenuContent: {
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
    },

    filterDateRow: {
        display: "grid",

        gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
        },

        gap: 1,
    },

    filterDateInput: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor:
                "#f8fafc",
        },
    },

    clearFilterButton: {
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 700,
    },
};
import * as Yup from "yup";

// Esquema reutilizable para validar un rango numérico (mínimo y máximo).
export const numberRangeSchema = Yup.object({
    min: Yup.string()
        .trim(),

    max: Yup.string()
        .trim()
        .test(
            "isGreaterOrEqualThanMin",
            "Debe ser mayor o igual al valor mínimo.",
            function (value) {
                const { min } = this.parent;

                if (!value || !min) return true;

                return Number(value) >= Number(min);
            }
        ),
});
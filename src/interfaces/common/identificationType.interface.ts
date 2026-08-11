// Tipo de identificación disponible en el sistema.
export interface IdentificationType {
    id: number;
    code: string;
    name: string;
}

// Respuesta al obtener los tipos de identificación activos.
export interface IdentificationTypesResponse {
    message: string;
    identificationTypes: IdentificationType[];
}
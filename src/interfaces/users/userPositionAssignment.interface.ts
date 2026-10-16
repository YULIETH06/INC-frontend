// Área a la que pertenece un cargo.
export interface PositionHomeDepartment {
    id: number;
    name: string;
}

// Cargo activo disponible para asignar a un usuario.
export interface AssignablePosition {
    id: number;
    code: string;
    name: string;
    homeDepartment: PositionHomeDepartment | null;
}

// Asignación de un cargo a un usuario, activa o histórica.
export interface UserPositionAssignment {
    id: number;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    position: AssignablePosition;
}

// Cargo activo que llega en el listado de usuarios.
export interface UserCurrentPosition {
    id: number;
    startDate: string;
    position: {
        id: number;
        code: string;
        name: string;
    };
}

// Respuesta del backend con los cargos disponibles.
export interface AssignablePositionsResponse {
    message: string;
    positions: AssignablePosition[];
}

// Respuesta del backend con el cargo actual y el historial de un usuario.
export interface UserPositionAssignmentsResponse {
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    currentAssignment: UserPositionAssignment | null;
    history: UserPositionAssignment[];
}

// Respuesta del backend al asignar un cargo.
export interface AssignUserPositionResponse {
    message: string;
    assignment: UserPositionAssignment;
}

// Respuesta del backend al retirar un cargo.
export interface EndUserPositionAssignmentResponse {
    message: string;
}

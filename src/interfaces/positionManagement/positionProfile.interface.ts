export interface PositionProfile {
    id: number;
    code: string;
    name: string;
    homeDepartmentId: number;
}

export interface PositionProfilesResponse {
    message: string;
    positionProfiles: PositionProfile[];
}
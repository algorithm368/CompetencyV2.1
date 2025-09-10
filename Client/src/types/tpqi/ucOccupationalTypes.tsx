export interface ucOccupational {
    id: number;
    unitCode:number;
    occupationalId: number;
}

export interface ucOccupationalView {
    id: number;
    unitCode:number;
    occupationalId: number;

    occupational: {
        id: number;
        name: string | null;
    } | null;

}

export interface ucOccupationalPageResult {
    data: ucOccupationalView[];
    total?: number;
}

export type CreateucOccupationalDto = Omit<ucOccupational, "id">;
export type UpdateucOccupationalDto = Partial<CreateucOccupationalDto>;

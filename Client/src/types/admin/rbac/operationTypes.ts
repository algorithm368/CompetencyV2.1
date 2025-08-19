export interface Operation {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OperationPageResult {
  data: Operation[];
  total: number;
}

export interface CreateOperationDto {
  name: string;
  description?: string;
}

export interface UpdateOperationDto {
  name?: string;
  description?: string;
}

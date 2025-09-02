export interface UserAssetInstance {
  id: number;
  userId: string;
  assetInstanceId: number;
  assignedAt: string; // ISO date string
  assetInstance?: {
    id: number;
    assetId: number;
    recordId: string;
  };
}

export interface UserAssetInstanceAssignmentDto {
  userId: string;
  assetInstanceIds: number[];
}

export interface UserAssetInstanceListResponse {
  data: UserAssetInstance[];
  total: number;
}

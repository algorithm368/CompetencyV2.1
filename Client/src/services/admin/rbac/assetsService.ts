import { AxiosResponse } from "axios";
import api from "@Services/api";
import { Asset, AssetPageResult, CreateAssetDto, UpdateAssetDto } from "@Types/admin/rbac/assetTypes";
import { RolePermission } from "@Types/admin/rbac/rolePermissionTypes";

export const AssetsService = {
  getAllAssets: async (search?: string, page?: number, perPage?: number): Promise<AssetPageResult> => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", String(page));
    if (perPage !== undefined) params.append("perPage", String(perPage));
    if (search) params.append("search", search);

    const res: AxiosResponse<AssetPageResult> = await api.get("/competency/rbac/assets", { params });
    return res.data;
  },

  getAssetById: async (id: number): Promise<Asset> => {
    const res: AxiosResponse<Asset> = await api.get(`/competency/rbac/assets/${id}`);
    return res.data;
  },

  createAsset: async (payload: CreateAssetDto): Promise<Asset> => {
    const res: AxiosResponse<Asset> = await api.post("/competency/rbac/assets", payload);
    return res.data;
  },

  updateAsset: async (id: number, payload: UpdateAssetDto): Promise<Asset> => {
    const res: AxiosResponse<Asset> = await api.put(`/competency/rbac/assets/${id}`, payload);
    return res.data;
  },

  deleteAsset: async (id: number): Promise<void> => {
    await api.delete(`/competency/rbac/assets/${id}`);
  },

  getRolePermissionsForAsset: async (assetId: number): Promise<RolePermission[]> => {
    const res: AxiosResponse<RolePermission[]> = await api.get(`/competency/rbac/assets/${assetId}/role-permissions`);
    return res.data;
  },
};

import api from "@Services/api";
import { Subcategory, CreateSubcategoryDto, UpdateSubcategoryDto, SubcategoryPageResult } from "@Types/sfia/subcategoryTypes";

const BASE_URL = "/admin/sfia/subcategory";

export const SubcategoryService = {
  async getAll(search?: string, page?: number, perPage?: number) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (page) params.append("page", String(page));
    if (perPage) params.append("perPage", String(perPage));

    const res = await api.get<SubcategoryPageResult[]>(`${BASE_URL}?${params.toString()}`);
    return res.data;
  },

  async getById(id: number) {
    const res = await api.get<Subcategory>(`${BASE_URL}/${id}`);
    return res.data;
  },

  async create(data: CreateSubcategoryDto, actorId: string) {
    const res = await api.post<Subcategory>(BASE_URL, data, {
      headers: { "x-actor-id": actorId },
    });
    return res.data;
  },

  async update(id: number, data: UpdateSubcategoryDto, actorId: string) {
    const res = await api.put<Subcategory>(`${BASE_URL}/${id}`, data, { headers: { "x-actor-id": actorId } });
    return res.data;
  },

  async delete(id: number, actorId: string) {
    await api.delete(`${BASE_URL}/${id}`, {
      headers: { "x-actor-id": actorId },
    });
  },
};

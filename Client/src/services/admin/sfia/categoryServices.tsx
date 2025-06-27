import api from "@Services/api";
import { Category, CreateCategoryDto, UpdateCategoryDto, CategoryPageResult } from "@Types/sfia/categoryTypes";

const BASE_URL = "/admin/sfia/category";

export const CategoryService = {
  async getAll(search?: string, page?: number, perPage?: number) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (page) params.append("page", String(page));
    if (perPage) params.append("perPage", String(perPage));

    const res = await api.get<CategoryPageResult[]>(`${BASE_URL}?${params.toString()}`);
    return res.data;
  },

  async getById(id: number) {
    const res = await api.get<Category>(`${BASE_URL}/${id}`);
    return res.data;
  },

  async create(data: CreateCategoryDto) {
    const res = await api.post<Category>(BASE_URL, data);
    return res.data;
  },

  async update(id: number, data: UpdateCategoryDto) {
    const res = await api.put<Category>(`${BASE_URL}/${id}`, data);
    return res.data;
  },

  async delete(id: number) {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

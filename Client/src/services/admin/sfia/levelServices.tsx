import api from "@Services/api";
import { Levels, CreateLevelDto, UpdateLevelDto, LevelPageResult } from "@Types/sfia/levelTypes";

const BASE_URL = "/admin/sfia/level";

export const LevelService = {
  async getAll(search?: string, page?: number, perPage?: number) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (page) params.append("page", String(page));
    if (perPage) params.append("perPage", String(perPage));

    const res = await api.get<LevelPageResult[]>(`${BASE_URL}?${params.toString()}`);
    return res.data;
  },

  async getById(id: number) {
    const res = await api.get<Levels>(`${BASE_URL}/${id}`);
    return res.data;
  },

  async create(data: CreateLevelDto) {
    const res = await api.post<Levels>(BASE_URL, data);
    return res.data;
  },

  async update(id: number, data: UpdateLevelDto) {
    const res = await api.put<Levels>(`${BASE_URL}/${id}`, data);
    return res.data;
  },

  async delete(id: number) {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

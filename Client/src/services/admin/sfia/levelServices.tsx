import api from "@Services/api";
import { Levels, CreateLevelDto, UpdateLevelDto, LevelPageResult } from "@Types/sfia/levelTypes";

const BASE_URL = "/admin/sfia/level";

export const LevelService = {
  async getAll(search?: string, cursor?: number, perPage?: number): Promise<LevelPageResult> {
    const params = new URLSearchParams();
    if (cursor) params.append("page", String(cursor));
    if (perPage) params.append("perPage", String(perPage));
    if (search) params.append("search", search);

    const res = await api.get<LevelPageResult>(`${BASE_URL}?${params.toString()}`);
    return res.data;
  },

  async getById(id: number): Promise<Levels> {
    const res = await api.get<Levels>(`${BASE_URL}/${id}`);
    return res.data;
  },

  async create(data: CreateLevelDto): Promise<Levels> {
    const res = await api.post<Levels>(BASE_URL, data);
    return res.data;
  },

  async update(id: number, data: UpdateLevelDto): Promise<Levels> {
    const res = await api.put<Levels>(`${BASE_URL}/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

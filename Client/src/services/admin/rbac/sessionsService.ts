import { AxiosResponse } from "axios";
import api from "@Services/api";
import { Session } from "@Types/admin/rbac/sessionTypes";

export const SessionsService = {
  createSession: async (payload: Session): Promise<Session> => {
    const res: AxiosResponse<Session> = await api.post("/competency/rbac/sessions", payload);
    return res.data;
  },

  getSessionById: async (id: string): Promise<Session> => {
    const res: AxiosResponse<Session> = await api.get(`/competency/rbac/sessions/${id}`);
    return res.data;
  },

  getSessionByAccessToken: async (): Promise<Session> => {
    const res: AxiosResponse<Session> = await api.get("/competency/rbac/sessions/by-access-token");
    return res.data;
  },

  getSessionByRefreshToken: async (): Promise<Session> => {
    const res: AxiosResponse<Session> = await api.get("/competency/rbac/sessions/by-refresh-token");
    return res.data;
  },

  deleteSessionById: async (id: string): Promise<void> => {
    await api.delete(`/competency/rbac/sessions/${id}`);
  },

  deleteSessionsByUserId: async (userId: string): Promise<void> => {
    await api.delete(`/competency/rbac/sessions/user/${userId}`);
  },

  isSessionExpired: async (id: string): Promise<boolean> => {
    const res: AxiosResponse<{ expired: boolean }> = await api.get(`/competency/rbac/sessions/${id}/expired`);
    return res.data.expired;
  },
};

import { AxiosResponse } from "axios";
import api from "@Services/api";
import { User } from "@Types/admin/rbac/userTypes";
import { Role } from "@Types/admin/rbac/roleTypes";

export const UsersService = {
  getAllUsers: async (): Promise<User[]> => {
    const res: AxiosResponse<User[]> = await api.get("/competency/rbac/users");
    return res.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const res: AxiosResponse<User> = await api.get(`/competency/rbac/users/${id}`);
    return res.data;
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const res: AxiosResponse<User> = await api.get("/competency/rbac/users/by-email", { params: { email } });
    return res.data;
  },

  createUser: async (payload: User): Promise<User> => {
    const res: AxiosResponse<User> = await api.post("/competency/rbac/users", payload);
    return res.data;
  },

  updateUser: async (id: string, payload: Partial<User>): Promise<User> => {
    const res: AxiosResponse<User> = await api.put(`/competency/rbac/users/${id}`, payload);
    return res.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/competency/rbac/users/${id}`);
  },

  assignRoleToUser: async (userId: string, roleId: number): Promise<void> => {
    await api.post("/competency/rbac/user-roles", { userId, roleId });
  },

  revokeRoleFromUser: async (userId: string, roleId: number): Promise<void> => {
    await api.delete("/competency/rbac/user-roles", { data: { userId, roleId } });
  },

  getUserRoles: async (userId: string): Promise<Role[]> => {
    const res: AxiosResponse<Role[]> = await api.get(`/competency/rbac/user-roles/user/${userId}`);
    return res.data;
  },
};

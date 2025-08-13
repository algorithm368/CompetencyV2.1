import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "@Services/admin/rbac/usersService";
import { User } from "@Types/admin/rbac/userTypes";
import { Role } from "@Types/admin/rbac/roleTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useUserManager(onToast?: ToastCallback) {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: UsersService.getAllUsers,
    staleTime: 5 * 60 * 1000,
  });

  const createUser = useMutation<User, Error, User>({
    mutationFn: (payload: User) => UsersService.createUser(payload),
    onSuccess: (created: User) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", created.id] });
      onToast?.("User created successfully", "success");
    },
    onError: () => onToast?.("Failed to create user", "error"),
  });

  const updateUser = useMutation<User, Error, { id: string; payload: Partial<User> }>({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) => UsersService.updateUser(id, payload),
    onSuccess: (updated: User) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updated.id] });
      onToast?.("User updated successfully", "success");
    },
    onError: () => onToast?.("Failed to update user", "error"),
  });

  const deleteUser = useMutation<void, Error, string>({
    mutationFn: (id: string) => UsersService.deleteUser(id),
    onSuccess: (_: void, id: string) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      onToast?.("User deleted successfully", "success");
    },
    onError: () => onToast?.("Failed to delete user", "error"),
  });

  const assignRole = useMutation<void, Error, { userId: string; roleId: number }>({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: number }) => UsersService.assignRoleToUser(userId, roleId),
    onSuccess: ({ userId }: { userId: string; roleId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
      onToast?.("Role assigned successfully", "success");
    },
    onError: () => onToast?.("Failed to assign role", "error"),
  });

  const revokeRole = useMutation<void, Error, { userId: string; roleId: number }>({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: number }) => UsersService.revokeRoleFromUser(userId, roleId),
    onSuccess: ({ userId }: { userId: string; roleId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
      onToast?.("Role revoked successfully", "success");
    },
    onError: () => onToast?.("Failed to revoke role", "error"),
  });

  return {
    usersQuery,
    createUser,
    updateUser,
    deleteUser,
    assignRole,
    revokeRole,
  };
}

export function useUserQuery(userId: string | null) {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User id is null");
      return UsersService.getUserById(userId);
    },
    enabled: !!userId,
  });
}

export function useUserRolesQuery(userId: string | null) {
  return useQuery<Role[], Error>({
    queryKey: ["userRoles", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User id is null");
      return UsersService.getUserRoles(userId);
    },
    enabled: !!userId,
  });
}

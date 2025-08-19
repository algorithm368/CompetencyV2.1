import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PermissionsService } from "@Services/admin/rbac/permissionsService";
import { Permission, PermissionPageResult, CreatePermissionDto, UpdatePermissionDto } from "@Types/admin/rbac/permissionTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function usePermissionManager(options?: { id?: number | null; search?: string; page?: number; perPage?: number }, onToast?: ToastCallback) {
  const { id = null, search = "", page = 1, perPage = 10 } = options || {};
  const queryClient = useQueryClient();

  // Fetch permissions page
  const permissionsQuery = useQuery<PermissionPageResult, Error>({
    queryKey: ["permissions", search, page, perPage] as const,
    queryFn: () => PermissionsService.getAllPermissions(search, page, perPage),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch single permission by id
  const permissionQuery = useQuery<Permission, Error>({
    queryKey: ["permission", id] as const,
    queryFn: async () => {
      if (id === null) throw new Error("Permission id is null");
      return PermissionsService.getPermissionById(id);
    },
    enabled: id !== null,
  });

  // Create permission
  const createPermission = useMutation<Permission, Error, CreatePermissionDto>({
    mutationFn: (payload: CreatePermissionDto) => PermissionsService.createPermission(payload),
    onSuccess: (created: Permission) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permission", created.id] });
      onToast?.("Permission created successfully", "success");
    },
    onError: () => onToast?.("Failed to create permission", "error"),
  });

  // Update permission
  const updatePermission = useMutation<Permission, Error, { id: number; data: UpdatePermissionDto }>({
    mutationFn: ({ id, data }: { id: number; data: UpdatePermissionDto }) => PermissionsService.updatePermission(id, data),
    onSuccess: (updated: Permission) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permission", updated.id] });
      onToast?.("Permission updated successfully", "success");
    },
    onError: () => onToast?.("Failed to update permission", "error"),
  });

  // Delete permission
  const deletePermission = useMutation<void, Error, number>({
    mutationFn: (delId: number) => PermissionsService.deletePermission(delId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      onToast?.("Permission deleted successfully", "success");
    },
    onError: () => onToast?.("Failed to delete permission", "error"),
  });

  return {
    permissionsQuery,
    permissionQuery,
    createPermission,
    updatePermission,
    deletePermission,
  };
}

import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import PermissionService from "@Services/competency/permissionService";
import { Permission, PermissionPageResult, CreatePermissionDto, UpdatePermissionDto } from "@Types/competency/permissionTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function usePermissionManager(
  options?: {
    id?: number | null;
    search?: string;
    page?: number;
    perPage?: number;
    initialPrefetchPages?: number;
  },
  onToast?: ToastCallback
) {
  const { id = null, search = "", page = 1, perPage = 10, initialPrefetchPages = 3 } = options || {};
  const queryClient = useQueryClient();

  const fetchPage = async (pageIndex: number, pageSize: number): Promise<PermissionPageResult> => {
    const pageNumber = pageIndex + 1;
    const result = await PermissionService.getAll(search, pageNumber, pageSize);
    return {
      data: result.data ?? [],
      total: result.total ?? 0,
    };
  };

  const prefetchQueries = useQueries({
    queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
      queryKey: ["permissions", search, i + 1, perPage] as const,
      queryFn: () => fetchPage(i, perPage),
      staleTime: 5 * 60 * 1000,
      enabled: true,
    })),
  });

  const currentPageQuery = useQuery<PermissionPageResult, Error>({
    queryKey: ["permissions", search, page, perPage] as const,
    queryFn: () => PermissionService.getAll(search, page, perPage),
    enabled: page > initialPrefetchPages,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const mergedData: PermissionPageResult | undefined = page <= initialPrefetchPages ? prefetchQueries[page - 1]?.data : currentPageQuery.data;

  const isLoading = prefetchQueries.some((q) => q.isLoading) || (page > initialPrefetchPages && currentPageQuery.isLoading);

  const isError = prefetchQueries.some((q) => q.isError) || (page > initialPrefetchPages && currentPageQuery.isError);

  const error = prefetchQueries.find((q) => q.error)?.error || (page > initialPrefetchPages && currentPageQuery.error);

  const permissionQuery = useQuery<Permission, Error>({
    queryKey: ["permission", id] as const,
    queryFn: async () => {
      if (id === null) throw new Error("Permission id is null");
      return PermissionService.getById(id);
    },
    enabled: id !== null,
  });

  const createPermission = useMutation<Permission, Error, CreatePermissionDto>({
    mutationFn: (dto) => PermissionService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      onToast?.("Permission created successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to create permission", "error");
    },
  });

  const updatePermission = useMutation<Permission, Error, UpdatePermissionDto>({
    mutationFn: ({ id, ...data }) => PermissionService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permission", updated.id] });
      onToast?.("Permission updated successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to update permission", "error");
    },
  });

  const deletePermission = useMutation<void, Error, number>({
    mutationFn: (id) => PermissionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      onToast?.("Permission deleted successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to delete permission", "error");
    },
  });

  // ✅ เพิ่ม: assign permission to role
  const assignPermissionToRole = async (roleId: number, permissionId: number): Promise<void> => {
    try {
      await PermissionService.assignToRole(roleId, permissionId);
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      onToast?.("Permission assigned successfully", "success");
    } catch {
      onToast?.("Failed to assign permission", "error");
    }
  };

  // ✅ เพิ่ม: revoke permission from role
  const revokePermissionFromRole = async (roleId: number, permissionId: number): Promise<void> => {
    try {
      await PermissionService.revokeFromRole(roleId, permissionId);
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      onToast?.("Permission revoked successfully", "success");
    } catch {
      onToast?.("Failed to revoke permission", "error");
    }
  };

  // ✅ เพิ่ม: get all permissions for a role
  const getPermissionsForRole = async (roleId: number): Promise<Permission[]> => {
    return PermissionService.getForRole(roleId);
  };

  return {
    permissionsQuery: {
      data: mergedData,
      isLoading,
      isError,
      error,
      refetch: currentPageQuery.refetch,
    },
    fetchPage,
    permissionQuery,
    createPermission,
    updatePermission,
    deletePermission,
    assignPermissionToRole,
    revokePermissionFromRole,
    getPermissionsForRole,
  };
}

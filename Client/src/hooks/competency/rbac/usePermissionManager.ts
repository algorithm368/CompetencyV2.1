import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import RbacService from "@Services/competency/rbacService";
import { Permission, PermissionPageResult, CreatePermissionDto, UpdatePermissionDto } from "@Types/competency/rbacTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;
export function usePermissionManager(options?: { id?: number | null; search?: string; page?: number; perPage?: number; initialPrefetchPages?: number }, onToast?: ToastCallback) {
  const { id = null, search = "", page = 1, perPage = 10, initialPrefetchPages = 3 } = options || {};
  const queryClient = useQueryClient();

  const fetchPage = async (pageIndex: number, pageSize: number): Promise<PermissionPageResult> => {
    const pageNumber = pageIndex + 1;
    const result = await RbacService.getAllPermissions(search, pageNumber, pageSize);
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
    queryFn: () => RbacService.getAllPermissions(search, page, perPage),
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
      return RbacService.getPermissionById(id);
    },
    enabled: id !== null,
  });

  const createPermission = useMutation<Permission, Error, CreatePermissionDto>({
    mutationFn: (dto: CreatePermissionDto) => RbacService.createPermission(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      onToast?.("Permission created successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to create permission", "error");
    },
  });

  const updatePermission = useMutation<Permission, Error, { id: number; data: UpdatePermissionDto }>({
    mutationFn: ({ id, data }: { id: number; data: UpdatePermissionDto }) => RbacService.updatePermission(id, data),
    onSuccess: (updated: Permission) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permission", updated.id] });
      onToast?.("Permission updated successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to update permission", "error");
    },
  });

  const deletePermission = useMutation<void, Error, number>({
    mutationFn: (delId: number) => RbacService.deletePermission(delId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      onToast?.("Permission deleted successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to delete permission", "error");
    },
  });

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
  };
}

import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import RoleService from "@Services/competency/roleService";
import { RoleEntity, RolePageResult, CreateRoleDto, UpdateRoleDto } from "@Types/competency/roleTypes";
import { UserEntity } from "@Types/competency/roleTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useRoleManager(
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

  const fetchPage = async (pageIndex: number, pageSize: number): Promise<RolePageResult> => {
    const pageNumber = pageIndex + 1;
    const result = await RoleService.getAll(search, pageNumber, pageSize);
    return {
      data: result.data ?? [],
      total: result.total ?? 0,
    };
  };

  const prefetchQueries = useQueries({
    queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
      queryKey: ["roles", search, i + 1, perPage] as const,
      queryFn: () => fetchPage(i, perPage),
      staleTime: 5 * 60 * 1000,
      enabled: true,
    })),
  });

  const currentPageQuery = useQuery<RolePageResult, Error>({
    queryKey: ["roles", search, page, perPage] as const,
    queryFn: () => RoleService.getAll(search, page, perPage),
    enabled: page > initialPrefetchPages,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const mergedData: RolePageResult | undefined = page <= initialPrefetchPages ? prefetchQueries[page - 1]?.data : currentPageQuery.data;

  const isLoading = prefetchQueries.some((q) => q.isLoading) || (page > initialPrefetchPages && currentPageQuery.isLoading);
  const isError = prefetchQueries.some((q) => q.isError) || (page > initialPrefetchPages && currentPageQuery.isError);
  const error = prefetchQueries.find((q) => q.error)?.error || (page > initialPrefetchPages ? currentPageQuery.error : undefined);

  const roleQuery = useQuery<RoleEntity, Error>({
    queryKey: ["role", id] as const,
    queryFn: async () => {
      if (id === null) throw new Error("Role id is null");
      return RoleService.getById(id);
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });

  const createRole = useMutation<RoleEntity, Error, CreateRoleDto>({
    mutationFn: (dto) => RoleService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      onToast?.("Role created successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to create role", "error");
    },
  });

  const updateRole = useMutation<RoleEntity, Error, UpdateRoleDto & { id: number }>({
    mutationFn: ({ id, ...data }) => RoleService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", updated.id] });
      onToast?.("Role updated successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to update role", "error");
    },
  });

  const deleteRole = useMutation<void, Error, number>({
    mutationFn: (delId) => RoleService.delete(delId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      onToast?.("Role deleted successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to delete role", "error");
    },
  });

  const assignRoleToUser = async (userId: string, roleId: number): Promise<void> => {
    try {
      await RoleService.assignToUser(userId, roleId);
      onToast?.("Role assigned to user", "success");
    } catch {
      onToast?.("Failed to assign role to user", "error");
    }
  };

  const revokeRoleFromUser = async (userId: string, roleId: number): Promise<void> => {
    try {
      await RoleService.revokeFromUser(userId, roleId);
      onToast?.("Role revoked from user", "success");
    } catch {
      onToast?.("Failed to revoke role from user", "error");
    }
  };

  const getRolesForUser = async (userId: number): Promise<RoleEntity[]> => {
    return RoleService.getRolesForUser(userId);
  };

  // Query สำหรับดึง users ทั้งหมด
  const allUsersQuery = useQuery<UserEntity[], Error>({
    queryKey: ["users", "all"],
    queryFn: () => RoleService.getAllUsers(), // ต้องมีใน RoleService ด้วยนะ
    staleTime: 5 * 60 * 1000,
    onError: (error) => onToast?.(`Failed to fetch users: ${error.message}`, "error"),
  });

  // Query สำหรับดึง roles ทั้งหมด (แบบไม่แบ่งหน้า)
  const allRolesQuery = useQuery<RoleEntity[], Error>({
    queryKey: ["roles", "all"],
    queryFn: () => RoleService.getAllRoles(), // ต้องมีใน RoleService ด้วยนะ
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      onToast?.(`Failed to fetch all roles: ${error.message}`, "error");
    },
  });

  return {
    rolesQuery: {
      data: mergedData,
      isLoading,
      isError,
      error,
      refetch: currentPageQuery.refetch,
    },
    fetchPage,
    roleQuery,
    createRole,
    updateRole,
    deleteRole,
    assignRoleToUser,
    revokeRoleFromUser,
    getRolesForUser,
    allUsersQuery,
    allRolesQuery,
  };
}

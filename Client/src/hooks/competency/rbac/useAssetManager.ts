import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import RbacService from "@Services/competency/rbacService";
import { Asset, AssetPageResult, CreateAssetDto, UpdateAssetDto } from "@Types/competency/rbacTypes";
type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;
export function useAssetManager(options?: { id?: number | null; search?: string; page?: number; perPage?: number; initialPrefetchPages?: number }, onToast?: ToastCallback) {
  const { id = null, search = "", page = 1, perPage = 10, initialPrefetchPages = 3 } = options || {};
  const queryClient = useQueryClient();

  const fetchPage = async (pageIndex: number, pageSize: number): Promise<AssetPageResult> => {
    const pageNumber = pageIndex + 1;
    return RbacService.getAllAssets(search, pageNumber, pageSize);
  };

  const prefetchQueries = useQueries({
    queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
      queryKey: ["assets", search, i + 1, perPage] as const,
      queryFn: () => fetchPage(i, perPage),
      staleTime: 5 * 60 * 1000,
      enabled: true,
    })),
  });

  const currentPageQuery = useQuery<AssetPageResult, Error>({
    queryKey: ["assets", search, page, perPage] as const,
    queryFn: () => RbacService.getAllAssets(search, page, perPage),
    enabled: page > initialPrefetchPages,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const mergedData: AssetPageResult | undefined = page <= initialPrefetchPages ? prefetchQueries[page - 1]?.data : currentPageQuery.data;

  const isLoading = prefetchQueries.some((q) => q.isLoading) || (page > initialPrefetchPages && currentPageQuery.isLoading);

  const isError = prefetchQueries.some((q) => q.isError) || (page > initialPrefetchPages && currentPageQuery.isError);

  const error = prefetchQueries.find((q) => q.error)?.error || (page > initialPrefetchPages && currentPageQuery.error);

  const assetQuery = useQuery<Asset, Error>({
    queryKey: ["asset", id] as const,
    queryFn: async () => {
      if (id === null) throw new Error("Asset id is null");
      return RbacService.getAssetById(id);
    },
    enabled: id !== null,
  });

  const createAsset = useMutation<Asset, Error, CreateAssetDto>({
    mutationFn: (dto: CreateAssetDto) => RbacService.createAsset(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      onToast?.("Asset created successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to create asset", "error");
    },
  });

  const updateAsset = useMutation<Asset, Error, { id: number; data: UpdateAssetDto }>({
    mutationFn: ({ id, data }: { id: number; data: UpdateAssetDto }) => RbacService.updateAsset(id, data),
    onSuccess: (updated: Asset) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset", updated.id] });
      onToast?.("Asset updated successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to update asset", "error");
    },
  });

  const deleteAsset = useMutation<void, Error, number>({
    mutationFn: (delId: number) => RbacService.deleteAsset(delId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      onToast?.("Asset deleted successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to delete asset", "error");
    },
  });

  return {
    assetsQuery: {
      data: mergedData,
      isLoading,
      isError,
      error,
      refetch: currentPageQuery.refetch,
    },
    fetchPage,
    assetQuery,
    createAsset,
    updateAsset,
    deleteAsset,
  };
}

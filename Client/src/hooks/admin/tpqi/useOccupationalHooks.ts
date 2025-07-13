import {
    useQuery,
    useMutation,
    useQueryClient,
    useQueries,
} from "@tanstack/react-query";
import { OccupationalService } from "@Services/admin/tpqi/occupationalServices";
import {
    Occupational,
    CreateOccupationalDto,
    UpdateOccupationalDto,
    OccupationalPageResult,
} from "@Types/tpqi/OccupationalTypes";

type ToastCallback = (
    message: string,
    type?: "success" | "error" | "info"
) => void;

export function useOccupationalManager(
    options?: {
        id?: number | null;
        search?: string;
        page?: number;
        perPage?: number;
        initialPrefetchPages?: number;
    },
    onToast?: ToastCallback
) {
    const {
        id = null,
        search = "",
        page = 1,
        perPage = 10,
        initialPrefetchPages = 3,
    } = options || {};
    const queryClient = useQueryClient();

    const fetchPage = async (
        pageIndex: number,
        pageSize: number
    ): Promise<{ data: Occupational[]; total: number }> => {
        const pageNumber = pageIndex + 1;
        const result = await OccupationalService.getAll(search, pageNumber, pageSize);
        return {
            data: result.data ?? [],
            total: result.total ?? 0,
        };
    };

    const prefetchQueries = useQueries({
        queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
            queryKey: ["occupationals", search, i + 1, perPage],
            queryFn: () => fetchPage(i, perPage),
            staleTime: 5 * 60 * 1000,
            enabled: true,
        })),
    });

    const currentPageQuery = useQuery<OccupationalPageResult, Error>({
        queryKey: ["occupationals", search, page, perPage],
        queryFn: () => OccupationalService.getAll(search, page, perPage),
        enabled: page > initialPrefetchPages,
        staleTime: 5 * 60 * 1000,
        placeholderData: (previous) => previous,
    });

    const mergedData: OccupationalPageResult | undefined = (() => {
        if (page <= initialPrefetchPages) {
            const pre = prefetchQueries[page - 1];
            if (pre && !pre.isLoading && !pre.isError) return pre.data;
            return undefined;
        }
        return currentPageQuery.data;
    })();

    const isLoading =
        prefetchQueries.some((q) => q.isLoading) ||
        (page > initialPrefetchPages && currentPageQuery.isLoading);

    const isError =
        prefetchQueries.some((q) => q.isError) ||
        (page > initialPrefetchPages && currentPageQuery.isError);

    const error =
        prefetchQueries.find((q) => q.isError)?.error || currentPageQuery.error;

    const occupationalQuery = useQuery<Occupational | undefined, Error>({
        queryKey: ["occupational", id],
        queryFn: () => {
            if (id === null) throw new Error("Occupational id is null");
            return OccupationalService.getById(id);
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });

    const createOccupational = useMutation({
        mutationFn: (data: CreateOccupationalDto) => OccupationalService.create(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["occupationals"] });
            onToast?.("Occupational created successfully", "success");
        },
        onError: (error) => {
            onToast?.(`Failed to create occupational: ${error.message}`, "error");
        },
    });

    const updateOccupational = useMutation({
        mutationFn: (data: UpdateOccupationalDto) => {
            if (id === null) throw new Error("Occupational id is null");
            return OccupationalService.update(id, data);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["occupationals"] });
            onToast?.("Occupational updated successfully", "success");
        },
        onError: (error) => {
            onToast?.(`Failed to update occupational: ${error.message}`, "error");
        },
    });

    const deleteOccupational = useMutation({
        mutationFn: () => {
            if (id === null) throw new Error("Occupational id is null");
            return OccupationalService.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["occupationals"] });
            onToast?.("Occupational deleted successfully", "success");
        },
        onError: (error) => {
            onToast?.(`Failed to delete occupational: ${error.message}`, "error");
        },
    });

    return {
        occupationalsQuery: {
            data: mergedData,
            isLoading,
            isError,
            error,
            refetch: currentPageQuery.refetch,
        },
        fetchPage,
        occupationalQuery,
        createOccupational,
        updateOccupational,
        deleteOccupational,
    };
}
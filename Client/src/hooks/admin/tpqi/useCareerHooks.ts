import {
    useQuery,
    useQueries,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { CareerService } from "@Services/admin/tpqi/careerServices";
import {
    Career,
    CreateCareerDto,
    UpdateCareerDto,
    CareerPageResult,
} from "@Types/tpqi/careerTypes";

type ToastCallback = (
    message: string,
    type?: "success" | "error" | "info"
) => void;

export function useCareerManager(
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
    ): Promise<{ data: Career[]; total: number }> => {
        const pageNumber = pageIndex + 1;
        const result = await CareerService.getAll(search, pageNumber, pageSize);
        return {
            data: result.data ?? [],
            total: result.total ?? 0,
        };
    };

    const prefetchQueries = useQueries({
        queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
            queryKey: ["careers", search, i + 1, perPage],
            queryFn: () => fetchPage(i, perPage),
            staleTime: 5 * 60 * 1000,
            enabled: true,
        })),
    });

    const currentPageQuery = useQuery<CareerPageResult, Error>({
        queryKey: ["careers", search, page, perPage],
        queryFn: () => CareerService.getAll(search, page, perPage),
        enabled: page > initialPrefetchPages,
        staleTime: 5 * 60 * 1000,
        placeholderData: (previous) => previous,
    });

    const mergedData: CareerPageResult | undefined = (() => {
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

    const carrerQuery = useQuery<Career, Error>({
        queryKey: ["career", id],
        queryFn: () => {
            if (id === null) throw new Error("Subcategory id is null");
            return CareerService.getById(id);
        }, enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });

    const createCareer = useMutation<Career, Error, CreateCareerDto>({
        mutationFn: (dto) => CareerService.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["careers"] });
            onToast?.("Career created successfully", "success");
        },
        onError: () => {
            onToast?.("Failed to create career", "error");
        }
    })

    const updateCareer = useMutation<Career, Error, { id: number; data: UpdateCareerDto }>({
        mutationFn: ({ id, data }) => CareerService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["careers"] });
            onToast?.("Career updated successfully", "success");
        },
        onError: () => {
            onToast?.("Failed to update career", "error");
        }
    });

    const deleteCareer = useMutation<void, Error, number>({
        mutationFn: (id) => CareerService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["careers"] });
            onToast?.("Career deleted successfully", "success");
        },
        onError: () => {
            onToast?.("Failed to delete career", "error");
        }
    });

    return {
        careersQuery: {
            data: mergedData,
            isLoading,
            isError,
            error,
            refetch: currentPageQuery.refetch,
        },
        fetchPage,
        carrerQuery,
        createCareer,
        updateCareer,
        deleteCareer,
    }
}

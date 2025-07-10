import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { CareerService } from "@Services/admin/tpqi/careerServices";
import { Career, CreateCareerDto, UpdateCareerDto, CareerPageResult } from "@Types/tpqi/careerTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useCareerManager(
    options?: {
        id?: number | null;
        search?: string;
        name?: string;
        page?: number;
        perPage?: number;
        initialPrefetchPages?: number;
    },
    onToast?: ToastCallback
) {
    const { id = null, search = "", name = "", page = 1, perPage = 10, initialPrefetchPages = 3 } = options || {};
    const queryClient = useQueryClient();

    const fetchPage = async (pageIndex: number, pageSize: number): Promise<{ data: Career[]; total: number }> => {
        const pageNumber = pageIndex + 1;
        const result = await CareerService.getAll(search, pageNumber, pageSize);
        return {
            data: result.data ?? [],
            total: result.total ?? 0,
        };
    }

    const prefetchQueries = useQueries({
        queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
            queryKey: ["careers", search, i + 1, perPage],
            queryFn: () => fetchPage(i, perPage),
            staleTime: 5 * 60 * 1000,
            enabled: true,
        })),
    });
}
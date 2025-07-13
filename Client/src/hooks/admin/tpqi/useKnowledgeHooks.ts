import {
    useQuery,
    useQueries,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { KnowledgeService } from "@Services/admin/tpqi/knowledgeServices";
import {
    Knowledge,
    CreateKnowledgeDto,
    UpdateKnowledgeDto,
    KnowledgePageResult,
} from "@Types/tpqi/KnowledgeTypes";
import { use } from "react";

type ToastCallback = (
    message: string,
    type?: "success" | "error" | "info"
) => void;

export function useKnowledgeManager(
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
    ): Promise<{ data: Knowledge[]; total: number }> => {
        const pageNumber = pageIndex + 1;
        const result = await KnowledgeService.getAll(search, pageNumber, pageSize);
        return {
            data: result.data ?? [],
            total: result.total ?? 0,
        };
    };

    const prefetchQueries = useQueries({
        queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
            queryKey: ["knowledges", search, i + 1, perPage],
            queryFn: () => fetchPage(i, perPage),
            staleTime: 5 * 60 * 1000,
            enabled: true,
        })),
    });

    const currentPageQuery = useQuery<KnowledgePageResult, Error>({
        queryKey: ["knowledges", search, page, perPage],
        queryFn: () => KnowledgeService.getAll(search, page, perPage),
        enabled: page > initialPrefetchPages,
        staleTime: 5 * 60 * 1000,
        placeholderData: (previous) => previous,
    });

    const mergedData: KnowledgePageResult | undefined = (() => {
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
    
    const knowledgeQuery = useQuery<Knowledge | undefined, Error>({
        queryKey: ["knowledge", id],
        queryFn: () => {
            if (id === null) throw new Error("knowledge id is null");
            return KnowledgeService.getById(id);
        }, enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });

    const  createKnowledge = useMutation<Knowledge, Error, CreateKnowledgeDto>({
        mutationFn: async (data) => {
            const newKnowledge = await KnowledgeService.create(data);
            queryClient.invalidateQueries({ queryKey: ["knowledges"] });
            onToast?.("Knowledge created successfully", "success");
            return newKnowledge;
        },
        onError: (error) => {
            onToast?.(`Error creating knowledge: ${error.message}`, "error");
        },
    });

    const updateKnowledge = useMutation<Knowledge, Error, { id: number; data: UpdateKnowledgeDto }>({
        mutationFn: async ({ id, data }) => {
            const updatedKnowledge = await KnowledgeService.update(id, data);
            queryClient.invalidateQueries({ queryKey: ["knowledges"] });
            onToast?.("Knowledge updated successfully", "success");
            return updatedKnowledge;
        },
        onError: (error) => {
            onToast?.(`Error updating knowledge: ${error.message}`, "error");
        },
    });

    const deleteKnowledge = useMutation<void, Error, number>({
        mutationFn: async (id) => {
            await KnowledgeService.delete(id);
            queryClient.invalidateQueries({ queryKey: ["knowledges"] });
            onToast?.("Knowledge deleted successfully", "success");
        },
        onError: (error) => {
            onToast?.(`Error deleting knowledge: ${error.message}`, "error");
        },
    });

    return {
        knowledgesQuery:{
            data: mergedData,
            isLoading,
            isError,
            error,
            refetch: currentPageQuery.refetch,
        },
        fetchPage,
        knowledgeQuery,
        createKnowledge,
        updateKnowledge,
        deleteKnowledge,
    }
}
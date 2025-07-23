import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { SkillService } from "@Services/admin/tpqi/skillServices";
import { Skill, CreateSkillDto, UpdateSkillDto, SkillPageResult } from "@Types/tpqi/skillTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useSkillManager(
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

    // Function to fetch a single page of skills
    const fetchPage = async (pageIndex: number, pageSize: number): Promise<{ data: Skill[]; total: number }> => {
        const pageNumber = pageIndex + 1;
        const result = await SkillService.getAll(search, pageNumber, pageSize);
        return {
            data: result.data ?? [],
            total: result.total ?? 0,
        };
    };

    // Prefetch multiple pages
    const prefetchQueries = useQueries({
        queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
            queryKey: ["skills", search, i + 1, perPage],
            queryFn: () => fetchPage(i, perPage),
            staleTime: 5 * 60 * 1000,
            enabled: true,
        })),
    });

    // Load the current page if it's not prefetched
    const currentPageQuery = useQuery<SkillPageResult, Error>({
        queryKey: ["skills", search, page, perPage],
        queryFn: () => SkillService.getAll(search, page, perPage),
        enabled: page > initialPrefetchPages,
        staleTime: 5 * 60 * 1000,
        placeholderData: (previous) => previous,
    });

    // Combine prefetch data with the current page data
    const mergedData: SkillPageResult | undefined = (() => {
        if (page <= initialPrefetchPages) {
            const pre = prefetchQueries[page - 1];
            if (pre && !pre.isLoading && !pre.isError) return pre.data;
            return undefined;
        }
        return currentPageQuery.data;
    })();

    const isLoading = prefetchQueries.some((q) => q.isLoading) || (page > initialPrefetchPages && currentPageQuery.isLoading);

    const isError = prefetchQueries.some((q) => q.isError) || (page > initialPrefetchPages && currentPageQuery.isError);

    const error = prefetchQueries.find((q) => q.error)?.error || (page > initialPrefetchPages && currentPageQuery.error);

    const skillQuery = useQuery<Skill, Error>({
        queryKey: ["skill", id],
        queryFn: () => {
            if (id === null) throw new Error("Skill ID is required");
            return SkillService.getById(id);
        },
        enabled: id !== null,
    });

    const createSkill = useMutation({
        mutationFn: (dto: CreateSkillDto) => SkillService.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            onToast?.("Skill created successfully", "success");
        },
        onError: (error) => {
            onToast?.(`Failed to create skill: ${error.message}`, "error");
        },
    });

    const updateSkill = useMutation({
        mutationFn: ({ id, data }: {
            id: number; data: UpdateSkillDto
        }) => SkillService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            onToast?.("Skill updated successfully", "success");
        },
        onError: (error) => {
            onToast?.(`Failed to update skill: ${error.message}`, "error");
        },
    });

    const deleteSkill = useMutation({
        mutationFn: (id: number) => SkillService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            onToast?.("Skill deleted successfully", "success");
        },
        onError: (error) => {
            onToast?.(`Failed to delete skill: ${error.message}`, "error");
        },
    });

    return {
        skillsQuery: {
            data: mergedData,
            isLoading,
            isError,
            error,
            refetch: currentPageQuery.refetch,
        },
        skillQuery,
        createSkill,
        updateSkill,
        deleteSkill,
        fetchPage,
    };
}
import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { SessionsService } from "@Services/admin/rbac/sessionsService";
import { Session } from "@Types/admin/rbac/sessionTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useSessionManager(options?: { id?: string | null; page?: number; perPage?: number; initialPrefetchPages?: number }, onToast?: ToastCallback) {
  const { id = null, page = 1, perPage = 10, initialPrefetchPages = 3 } = options || {};
  const queryClient = useQueryClient();

  const fetchPage = async () => {
    const result = await SessionsService.getSessionById(id ?? "");
    return { data: result ? [result] : [], total: result ? 1 : 0 };
  };

  const prefetchQueries = useQueries({
    queries: Array.from({ length: initialPrefetchPages }, (_, i) => ({
      queryKey: ["sessions", i + 1, perPage] as const,
      queryFn: fetchPage,
      staleTime: 5 * 60 * 1000,
      enabled: true,
    })),
  });

  const currentPageQuery = useQuery<{ data: Session[]; total: number }, Error>({
    queryKey: ["sessions", page, perPage] as const,
    queryFn: fetchPage,
    enabled: page > initialPrefetchPages,
    staleTime: 5 * 60 * 1000,
  });

  const mergedData = page <= initialPrefetchPages ? prefetchQueries[page - 1]?.data : currentPageQuery.data;

  const isLoading = prefetchQueries.some((q) => q.isLoading) || (page > initialPrefetchPages && currentPageQuery.isLoading);
  const isError = prefetchQueries.some((q) => q.isError) || (page > initialPrefetchPages && currentPageQuery.isError);
  const error = prefetchQueries.find((q) => q.error)?.error || (page > initialPrefetchPages && currentPageQuery.error);

  const sessionQuery = useQuery<Session, Error>({
    queryKey: ["session", id] as const,
    queryFn: async () => {
      if (!id) throw new Error("Session id is null");
      return SessionsService.getSessionById(id);
    },
    enabled: id !== null,
  });

  const createSession = useMutation<Session, Error, Session>({
    mutationFn: (payload: Session) => SessionsService.createSession(payload),
    onSuccess: (created: Session) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session", created.id] });
      onToast?.("Session created successfully", "success");
    },
    onError: () => onToast?.("Failed to create session", "error"),
  });

  const deleteSession = useMutation<void, Error, string>({
    mutationFn: (sessionId: string) => SessionsService.deleteSessionById(sessionId),
    onSuccess: (_data: void, sessionId: string) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      onToast?.("Session deleted successfully", "success");
    },
    onError: () => onToast?.("Failed to delete session", "error"),
  });

  return {
    sessionsQuery: {
      data: mergedData,
      isLoading,
      isError,
      error,
      refetch: currentPageQuery.refetch,
    },
    sessionQuery,
    createSession,
    deleteSession,
  };
}

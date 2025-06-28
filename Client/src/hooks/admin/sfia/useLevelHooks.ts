import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LevelService } from "@Services/admin/sfia/levelServices";
import { Levels, CreateLevelDto, UpdateLevelDto, LevelPageResult } from "@Types/sfia/levelTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useLevelManager(
  options?: {
    id?: number | null;
    search?: string;
    page?: number;
    perPage?: number;
  },
  onToast?: ToastCallback
) {
  const { id = null, search, page, perPage } = options || {};
  const queryClient = useQueryClient();

  const levelsQuery = useQuery<LevelPageResult[], Error>({
    queryKey: ["levels", { search, page, perPage }],
    queryFn: () => LevelService.getAll(search, page, perPage),
  });

  const levelQuery = useQuery<Levels, Error>({
    queryKey: ["level", id],
    queryFn: () => {
      if (id === null) throw new Error("Level id is null");
      return LevelService.getById(id);
    },
    enabled: id !== null,
  });

  const createLevel = useMutation<Levels, Error, CreateLevelDto>({
    mutationFn: (dto) => LevelService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      onToast?.("Level created successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to create level", "error");
    },
  });

  const updateLevel = useMutation<Levels, Error, { id: number; data: UpdateLevelDto }>({
    mutationFn: ({ id, data }) => LevelService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      queryClient.invalidateQueries({ queryKey: ["level", updated.id] });
      onToast?.("Level updated successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to update level", "error");
    },
  });

  const deleteLevel = useMutation<void, Error, number>({
    mutationFn: (delId) => LevelService.delete(delId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      onToast?.("Level deleted successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to delete level", "error");
    },
  });

  return {
    levelsQuery,
    levelQuery,
    createLevel,
    updateLevel,
    deleteLevel,
  };
}

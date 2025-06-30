import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubcategoryService } from "@Services/admin/sfia/subcategoryServices";
import { Subcategory, CreateSubcategoryDto, UpdateSubcategoryDto, SubcategoryPageResult } from "@Types/sfia/subcategoryTypes";

type ToastCallback = (message: string, type?: "success" | "error" | "info") => void;

export function useSubcategoryManager(
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

const subcategoriesQuery = useQuery<SubcategoryPageResult, Error>({
  queryKey: ["subcategories", search, page, perPage],
  queryFn: async () => {
    // Ensure getAll returns a single SubcategoryPageResult object
    const result = await SubcategoryService.getAll(search, page, perPage);
    // If getAll returns an array, pick the first item or handle accordingly
    if (Array.isArray(result)) {
      if (result.length === 0) throw new Error("No subcategory page result found");
      return result[0];
    }
    return result;
  },
  staleTime: 0,
  placeholderData: (previousData) => previousData,
});

  const subcategoryQuery = useQuery<Subcategory, Error>({
    queryKey: ["subcategory", id],
    queryFn: () => {
      if (id === null) throw new Error("Subcategory id is null");
      return SubcategoryService.getById(id);
    },
    enabled: id !== null,
  });

  const createSubcategory = useMutation<Subcategory, Error, CreateSubcategoryDto>({
    mutationFn: (dto) => SubcategoryService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      onToast?.("Subcategory created successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to create subcategory", "error");
    },
  });

  const updateSubcategory = useMutation<Subcategory, Error, { id: number; data: UpdateSubcategoryDto }>({
    mutationFn: ({ id, data }) => SubcategoryService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["subcategory", updated.id] });
      onToast?.("Subcategory updated successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to update subcategory", "error");
    },
  });

  const deleteSubcategory = useMutation<void, Error, number>({
    mutationFn: (delId) => SubcategoryService.delete(delId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      onToast?.("Subcategory deleted successfully", "success");
    },
    onError: () => {
      onToast?.("Failed to delete subcategory", "error");
    },
  });

  return {
    subcategoriesQuery,
    subcategoryQuery,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
}

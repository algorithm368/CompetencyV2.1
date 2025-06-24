import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubcategoryService } from "@Services/admin/sfia/subcategoryServices";
import { Subcategory, CreateSubcategoryDto, UpdateSubcategoryDto, SubcategoryPageResult } from "@Types/sfia/subcategoryTypes";

export function useSubcategoryManager(
  actorId: string,
  options?: {
    id?: number | null;
    search?: string;
    page?: number;
    perPage?: number;
  }
) {
  const { id = null, search, page, perPage } = options || {};
  const queryClient = useQueryClient();

  const subcategoriesQuery = useQuery<SubcategoryPageResult[], Error>({
    queryKey: ["subcategories", { search, page, perPage }],
    queryFn: () => SubcategoryService.getAll(search, page, perPage),
  });
  console.log(subcategoriesQuery.data);

  const subcategoryQuery = useQuery<Subcategory, Error>({
    queryKey: ["subcategory", id],
    queryFn: () => {
      if (id === null) throw new Error("Subcategory id is null");
      return SubcategoryService.getById(id);
    },
    enabled: id !== null,
  });

  const createSubcategory = useMutation<Subcategory, Error, CreateSubcategoryDto>({
    mutationFn: (dto) => SubcategoryService.create(dto, actorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  const updateSubcategory = useMutation<Subcategory, Error, { id: number; data: UpdateSubcategoryDto }>({
    mutationFn: ({ id, data }) => SubcategoryService.update(id, data, actorId),
    onSuccess: (upd) => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["subcategory", upd.id] });
    },
  });

  const deleteSubcategory = useMutation<void, Error, number>({
    mutationFn: (delId) => SubcategoryService.delete(delId, actorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subcategories"] }),
  });

  return {
    subcategoriesQuery,
    subcategoryQuery,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
}

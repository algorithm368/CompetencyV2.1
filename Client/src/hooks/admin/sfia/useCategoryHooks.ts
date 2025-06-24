import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@Services/admin/sfia/categoryServices";
import { Category, CreateCategoryDto, UpdateCategoryDto, CategoryPageResult } from "@Types/sfia/categoryTypes";

export function useCategoryManager(
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

  const categoriesQuery = useQuery<CategoryPageResult, Error>({
    queryKey: ["categories", { search, page, perPage }],
    queryFn: async () => {
      const result = await CategoryService.getAll(search, page, perPage);
      if (Array.isArray(result)) {
        return result[0];
      }
      return result;
    },
  });

  const categoryQuery = useQuery<Category, Error>({
    queryKey: ["category", id],
    queryFn: () => {
      if (id === null) throw new Error("Category id is null");
      return CategoryService.getById(id);
    },
    enabled: id !== null,
  });

  const createCategory = useMutation<Category, Error, CreateCategoryDto>({
    mutationFn: (dto) => {
      const fixedDto = {
        ...dto,
        subcategory_id: dto.subcategory_id != null ? Number(dto.subcategory_id) : null,
      };
      return CategoryService.create(fixedDto, actorId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const updateCategory = useMutation<Category, Error, { id: number; data: UpdateCategoryDto }>({
    mutationFn: ({ id, data }) => {
      const fixedData = {
        ...data,
        subcategory_id: data.subcategory_id != null ? Number(data.subcategory_id) : null,
      };
      return CategoryService.update(id, fixedData, actorId);
    },
    onSuccess: (upd) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", upd.id] });
    },
  });

  const deleteCategory = useMutation<void, Error, number>({
    mutationFn: (delId) => CategoryService.delete(delId, actorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  return { categoriesQuery, categoryQuery, createCategory, updateCategory, deleteCategory };
}

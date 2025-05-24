import { CategoryRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Category } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class CategoryService extends BaseService<Category, keyof Category> {
  constructor() {
    super(CategoryRepo, ["category_text", "subcategory_id"], "id");
  }
}

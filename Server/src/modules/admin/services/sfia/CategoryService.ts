import { CategoryRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Category } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class CategoryService extends BaseService<Category, keyof Category> {
  constructor() {
    super(new CategoryRepo(), ["category_text"], "id");
  }
}

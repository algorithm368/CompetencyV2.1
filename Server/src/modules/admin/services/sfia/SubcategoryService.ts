import { SubcategoryRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Subcategory } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class SubcategoryService extends BaseService<Subcategory, keyof Subcategory> {
  constructor() {
    super(new SubcategoryRepo(), ["subcategory_text"], "id");
  }
}

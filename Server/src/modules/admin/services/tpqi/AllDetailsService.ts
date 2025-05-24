import type { all_details } from "@prisma/client_tpqi";
import { AllDetailsRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class AllDetailsService extends BaseService<all_details, keyof all_details> {
  constructor() {
    super(AllDetailsRepo, ["id_all_details", "id_career_level"], "id_all_details");
  }
}

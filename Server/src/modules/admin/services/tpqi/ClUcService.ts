import type { cl_uc } from "@prisma/client_tpqi";
import { ClUcRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class ClUcService extends BaseService<cl_uc, keyof cl_uc> {
  constructor() {
    super(new ClUcRepo(), ["id_career_level"], "id_cl_uc");
  }
}

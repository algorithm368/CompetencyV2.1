import type { career_level } from "@prisma/client_tpqi";
import { CareerLevelRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class CareerLevelService extends BaseService<career_level, keyof career_level> {
  constructor() {
    super(new CareerLevelRepo(), ["id_career_level"], "id_career_level");
  }
}

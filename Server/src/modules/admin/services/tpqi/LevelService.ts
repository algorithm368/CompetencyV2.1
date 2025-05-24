import type { level } from "@prisma/client_tpqi";
import { LevelRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class LevelService extends BaseService<level, keyof level> {
  constructor() {
    super(LevelRepo, ["name_level"], "id_level");
  }
}

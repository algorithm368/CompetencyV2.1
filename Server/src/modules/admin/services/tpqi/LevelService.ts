import type { Level } from "@prisma/client_tpqi";
import { LevelRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class LevelService extends BaseService<Level, keyof Level> {
  constructor() {
    super(new LevelRepo(), ["name"], "id");
  }
}

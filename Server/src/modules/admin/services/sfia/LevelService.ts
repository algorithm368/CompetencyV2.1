import { LevelRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Level } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class LevelService extends BaseService<Level, keyof Level> {
  constructor() {
    super(new LevelRepo(), ["name"], "id");
  }
}

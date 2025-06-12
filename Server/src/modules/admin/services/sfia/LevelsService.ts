import { LevelsRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Levels } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class LevelsService extends BaseService<Levels, keyof Levels> {
  constructor() {
    super(new LevelsRepo(), ["level_name", "code_job", "id"], "code_job");
  }
}

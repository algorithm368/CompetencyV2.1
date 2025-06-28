import { LevelsRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Levels } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class LevelsService extends BaseService<Levels, keyof Levels> {
  constructor() {
    super(new LevelsRepo(), ["code_job"], "id");
  }
}

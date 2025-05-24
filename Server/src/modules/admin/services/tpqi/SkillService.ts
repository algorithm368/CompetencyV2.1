import type { skill } from "@prisma/client_tpqi";
import { SkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class SkillService extends BaseService<skill, keyof skill> {
  constructor() {
    super(SkillRepo, ["name_skill"], "id_skill");
  }
}

import type { Skill } from "@prisma/client_tpqi";
import { SkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class SkillService extends BaseService<Skill, keyof Skill> {
  constructor() {
    super(new SkillRepo(), ["name"], "id");
  }
}

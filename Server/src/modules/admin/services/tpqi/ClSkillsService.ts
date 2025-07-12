import type { CareerLevelSkill } from "@prisma/client_tpqi";
import { CareerLevelSkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class ClSkillsService extends BaseService<CareerLevelSkill, keyof CareerLevelSkill> {
  constructor() {
    super(new CareerLevelSkillRepo(), ["careerLevelId"], "id");
  }
}

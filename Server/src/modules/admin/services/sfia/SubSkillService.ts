import { SubSkillRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { SubSkill } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class SubSkillService extends BaseService<SubSkill, keyof SubSkill> {
  constructor() {
    super(new SubSkillRepo(), ["skillCode"], "id");
  }
}

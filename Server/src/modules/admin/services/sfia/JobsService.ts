import { SkillRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Skill } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class SkillService extends BaseService<Skill, keyof Skill> {
  constructor() {
    super(new SkillRepo(), ["name"], "code");
  }
}

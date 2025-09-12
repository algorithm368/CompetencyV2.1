import type { UnitSkill } from "@prisma/client_tpqi";
import { UnitSkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class USkillService extends BaseService<UnitSkill, keyof UnitSkill> {
  constructor() {
    super(new UnitSkillRepo(), ["unitCodeId"], "id");
  }
}

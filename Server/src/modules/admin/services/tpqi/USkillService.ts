import type { UserUnitSkill } from "@prisma/client_tpqi";
import { UserUnitSkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class USkillService extends BaseService<UserUnitSkill, keyof UserUnitSkill> {
  constructor() {
    super(new UserUnitSkillRepo(), ["unitCodeId"], "id");
  }
}

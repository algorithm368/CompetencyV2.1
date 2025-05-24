import type { u_skill } from "@prisma/client_tpqi";
import { USkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class USkillService extends BaseService<u_skill, keyof u_skill> {
  constructor() {
    super(USkillRepo, ["id_u_skill", "id_unit_code", "id_skill"], "id_u_skill");
  }
}

import type { UserSkill } from "@prisma/client_tpqi";
import { UserSkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UsersSkillsService extends BaseService<UserSkill, keyof UserSkill> {
  constructor() {
    super(new UserSkillRepo(), ["userEmail"], "id");
  }
}

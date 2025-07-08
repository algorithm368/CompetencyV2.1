import type { users_skills } from "@prisma/client_tpqi";
import { UsersSkillsRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UsersSkillsService extends BaseService<users_skills, keyof users_skills> {
  constructor() {
    super(new UsersSkillsRepo(), ["link_skill", "email", "approval_status"], "id_users_skills");
  }
}

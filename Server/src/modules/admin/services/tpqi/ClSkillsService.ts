import type { cl_skills } from "@prisma/client_tpqi";
import { ClSkillsRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class ClSkillsService extends BaseService<cl_skills, keyof cl_skills> {
  constructor() {
    super(new ClSkillsRepo(), ["id_career_level"], "id_cl_skills");
  }
}

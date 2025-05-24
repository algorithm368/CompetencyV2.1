import { SkillsRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Skills } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class SkillsService extends BaseService<Skills, keyof Skills> {
  constructor() {
    super(SkillsRepo, ["skill_text", "description_id"], "id");
  }
}

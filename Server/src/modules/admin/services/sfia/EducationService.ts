import { EducationRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Education } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class EducationService extends BaseService<Education, keyof Education> {
  constructor() {
    super(new EducationRepo(), ["syear", "eyear", "level_edu", "universe", "faculty", "branch", "portfolio_id"], "id");
  }
}

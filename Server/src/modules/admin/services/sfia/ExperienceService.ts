import { ExperienceRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Experience } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class ExperienceService extends BaseService<Experience, keyof Experience> {
  constructor() {
    super(new ExperienceRepo(), ["exp_text", "date", "portfolio_id"], "id");
  }
}

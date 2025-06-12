import { DescriptionRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Description } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class DescriptionService extends BaseService<Description, keyof Description> {
  constructor() {
    super(new DescriptionRepo(), ["description_text", "Levels.level_name"], "id", { Levels: true });
  }
}

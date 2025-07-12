import { DescriptionRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Description } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class DescriptionService extends BaseService<Description, keyof Description> {
  constructor() {
    super(new DescriptionRepo(), ["text"], "id");
  }
}

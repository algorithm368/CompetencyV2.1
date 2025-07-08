import { InformationRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Information } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class InformationService extends BaseService<Information, keyof Information> {
  constructor() {
    super(new InformationRepo(), ["info_text", "date", "skill_id", "datacollection_id", "approval_status"], "id");
  }
}

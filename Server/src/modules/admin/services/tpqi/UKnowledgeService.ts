import type { UnitKnowledge } from "@prisma/client_tpqi";
import { UnitKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UKnowledgeService extends BaseService<UnitKnowledge, keyof UnitKnowledge> {
  constructor() {
    super(new UnitKnowledgeRepo(), ["unitCodeId"], "id");
  }
}

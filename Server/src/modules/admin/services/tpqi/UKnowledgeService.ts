import type { UserUnitKnowledge } from "@prisma/client_tpqi";
import { UserUnitKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UKnowledgeService extends BaseService<UserUnitKnowledge, keyof UserUnitKnowledge> {
  constructor() {
    super(new UserUnitKnowledgeRepo(), ["unitCodeId"], "id");
  }
}

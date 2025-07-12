import type { CareerLevelKnowledge } from "@prisma/client_tpqi";
import { CareerLevelKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class ClKnowledgeService extends BaseService<CareerLevelKnowledge, keyof CareerLevelKnowledge> {
  constructor() {
    super(new CareerLevelKnowledgeRepo(), ["careerLevelId"], "id");
  }
}

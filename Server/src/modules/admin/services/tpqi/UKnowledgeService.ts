import type { u_knowledge } from "@prisma/client_tpqi";
import { UKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UKnowledgeService extends BaseService<u_knowledge, keyof u_knowledge> {
  constructor() {
    super(new UKnowledgeRepo(), ["id_unit_code", "id_u_knowledge", "id_knowledge"], "id_u_knowledge");
  }
}

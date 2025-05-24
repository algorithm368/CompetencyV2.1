import type { knowledge } from "@prisma/client_tpqi";
import { KnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class KnowledgeService extends BaseService<knowledge, keyof knowledge> {
  constructor() {
    super(KnowledgeRepo, ["name_knowledge"], "id_knowledge");
  }
}

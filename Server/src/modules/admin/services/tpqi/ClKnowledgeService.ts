import type { cl_knowledge } from "@prisma/client_tpqi";
import { ClKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class ClKnowledgeService extends BaseService<cl_knowledge, keyof cl_knowledge> {
  constructor() {
    super(new ClKnowledgeRepo(), ["id_cl_knowledge"], "id_cl_knowledge");
  }
}

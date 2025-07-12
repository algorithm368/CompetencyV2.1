import type { Knowledge } from "@prisma/client_tpqi";
import { KnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class KnowledgeService extends BaseService<Knowledge, keyof Knowledge> {
  constructor() {
    super(new KnowledgeRepo(), ["name"], "id");
  }
}

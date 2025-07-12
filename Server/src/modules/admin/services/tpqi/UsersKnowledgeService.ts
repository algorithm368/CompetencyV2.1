import type { UserKnowledge } from "@prisma/client_tpqi";
import { UserKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UsersKnowledgeService extends BaseService<UserKnowledge, keyof UserKnowledge> {
  constructor() {
    super(new UserKnowledgeRepo(), ["userEmail"], "id");
  }
}

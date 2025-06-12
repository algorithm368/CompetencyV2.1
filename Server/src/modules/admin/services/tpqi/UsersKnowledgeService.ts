import type { users_knowledge } from "@prisma/client_tpqi";
import { UsersKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class UsersKnowledgeService extends BaseService<users_knowledge, keyof users_knowledge> {
  constructor() {
    super(new UsersKnowledgeRepo(), ["link_knowledge", "email", "approval_status"], "id_users_knowledge");
  }
}

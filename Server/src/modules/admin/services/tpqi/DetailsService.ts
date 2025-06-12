import type { details } from "@prisma/client_tpqi";
import { DetailsRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class DetailsService extends BaseService<details, keyof details> {
  constructor() {
    super(new DetailsRepo(), ["outcomes"], "id_d");
  }
}

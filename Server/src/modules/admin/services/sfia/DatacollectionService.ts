import { DatacollectionRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Datacollection } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class DatacollectionService extends BaseService<Datacollection, keyof Datacollection> {
  constructor() {
    super(new DatacollectionRepo(), ["user_id", "id"], "id");
  }
}

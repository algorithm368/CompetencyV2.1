import type { Occupational } from "@prisma/client_tpqi";
import { OccupationalRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class OccupationalService extends BaseService<Occupational, keyof Occupational> {
  constructor() {
    super(new OccupationalRepo(), ["name"], "id");
  }
}

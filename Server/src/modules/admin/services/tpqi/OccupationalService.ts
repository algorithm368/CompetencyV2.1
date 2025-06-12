import type { occupational } from "@prisma/client_tpqi";
import { OccupationalRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class OccupationalService extends BaseService<occupational, keyof occupational> {
  constructor() {
    super(new OccupationalRepo(), ["name_occupational"], "id_occupational");
  }
}

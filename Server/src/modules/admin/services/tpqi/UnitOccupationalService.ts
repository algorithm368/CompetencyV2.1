import type { unit_occupational } from "@prisma/client_tpqi";
import { UnitOccupationalRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class UnitOccupationalService extends BaseService<unit_occupational, keyof unit_occupational> {
  constructor() {
    super(new UnitOccupationalRepo(), ["id_unit_occupational", "id_unit_code", "id_occupational"], "id_unit_occupational");
  }
}

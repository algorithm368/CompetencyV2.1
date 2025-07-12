import type { UnitOccupational } from "@prisma/client_tpqi";
import { UnitOccupationalRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UnitOccupationalService extends BaseService<UnitOccupational, keyof UnitOccupational> {
  constructor() {
    super(new UnitOccupationalRepo(), ["unitCodeId"], "id");
  }
}

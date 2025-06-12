import type { unit_code } from "@prisma/client_tpqi";
import { UnitCodeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class UnitCodeService extends BaseService<unit_code, keyof unit_code> {
  constructor() {
    super(new UnitCodeRepo(), ["name", "description_unitcode", "unit_code"], "id_unit_code");
  }
}

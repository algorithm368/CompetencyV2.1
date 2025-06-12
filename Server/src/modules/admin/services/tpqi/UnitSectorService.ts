import type { unit_sector } from "@prisma/client_tpqi";
import { UnitSectorRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class UnitSectorService extends BaseService<unit_sector, keyof unit_sector> {
  constructor() {
    super(new UnitSectorRepo(), ["id_unit_sector", "id_unit_code", "id_sector"], "id_unit_sector");
  }
}

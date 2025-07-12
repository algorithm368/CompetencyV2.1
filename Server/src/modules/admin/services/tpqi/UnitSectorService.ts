import type { UnitSector } from "@prisma/client_tpqi";
import { UnitSectorRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UnitSectorService extends BaseService<UnitSector, keyof UnitSector> {
  constructor() {
    super(new UnitSectorRepo(), ["unitCodeId"], "id");
  }
}

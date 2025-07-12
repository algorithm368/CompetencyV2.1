import type { Sector } from "@prisma/client_tpqi";
import { SectorRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class SectorService extends BaseService<Sector, keyof Sector> {
  constructor() {
    super(new SectorRepo(), ["name"], "id");
  }
}

import type { sector } from "@prisma/client_tpqi";
import { SectorRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class SectorService extends BaseService<sector, keyof sector> {
  constructor() {
    super(new SectorRepo(), ["name_sector"], "id_sector");
  }
}

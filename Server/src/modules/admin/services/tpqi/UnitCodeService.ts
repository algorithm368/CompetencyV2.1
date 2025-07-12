import type { UnitCode } from "@prisma/client_tpqi";
import { UnitCodeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UnitCodeService extends BaseService<UnitCode, keyof UnitCode> {
  constructor() {
    super(new UnitCodeRepo(), ["name", "description"], "id");
  }
}

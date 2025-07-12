import type { CareerLevelUnitCode } from "@prisma/client_tpqi";
import { CareerLevelUnitCodeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class ClUcService extends BaseService<CareerLevelUnitCode, keyof CareerLevelUnitCode> {
  constructor() {
    super(new CareerLevelUnitCodeRepo(), ["careerLevelId"], "id");
  }
}

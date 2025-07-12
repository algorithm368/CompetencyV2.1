import type { CareerLevel } from "@prisma/client_tpqi";
import { CareerLevelRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class CareerLevelService extends BaseService<CareerLevel, keyof CareerLevel> {
  constructor() {
    super(new CareerLevelRepo(), ["careerId"], "id");
  }
}

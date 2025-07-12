import type { Career } from "@prisma/client_tpqi";
import { CareerRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class CareerService extends BaseService<Career, keyof Career> {
  constructor() {
    super(new CareerRepo(), ["name"], "id");
  }
}

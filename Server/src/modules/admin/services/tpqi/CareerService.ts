import type { career } from "@prisma/client_tpqi";
import { CareerRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class CareerService extends BaseService<career, keyof career> {
  constructor() {
    super(CareerRepo, ["name_career"], "id_career");
  }
}

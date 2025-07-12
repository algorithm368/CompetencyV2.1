import type { CareerLevelDetail } from "@prisma/client_tpqi";
import { CareerLevelDetailRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class AllDetailsService extends BaseService<CareerLevelDetail, keyof CareerLevelDetail> {
  constructor() {
    super(new CareerLevelDetailRepo(), ["description"], "id");
  }
}

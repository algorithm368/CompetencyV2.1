import type { TpqiSummary } from "@prisma/client_tpqi";
import { TpqiSummaryRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class TpqiSummaryDataService extends BaseService<TpqiSummary, keyof TpqiSummary> {
  constructor() {
    super(new TpqiSummaryRepo(), ["userEmail"], "id");
  }
}

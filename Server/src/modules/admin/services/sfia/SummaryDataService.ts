import { SfiaSummaryRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { SfiaSummary } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class SummaryDataService extends BaseService<SfiaSummary, keyof SfiaSummary> {
  constructor() {
    super(new SfiaSummaryRepo(), ["userEmail"], "id");
  }
}

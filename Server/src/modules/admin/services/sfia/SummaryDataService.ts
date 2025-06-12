import { SummaryDataRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { sfia_summary_data } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class SummaryDataService extends BaseService<sfia_summary_data, keyof sfia_summary_data> {
  constructor() {
    super(new SummaryDataRepo(), ["user_email", "code_job", "id", "level_id", "skillPercentage"], "id");
  }
}

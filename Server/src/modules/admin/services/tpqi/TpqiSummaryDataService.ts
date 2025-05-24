import type { tpqi_summary_data } from "@prisma/client_tpqi";
import { TpqiSummaryDataRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "../BaseService";

export class TpqiSummaryDataService extends BaseService<tpqi_summary_data, keyof tpqi_summary_data> {
  constructor() {
    super(TpqiSummaryDataRepo, ["user_email", "career_id", "level_id", "id_career_level", "skillPercentage", "knowledgePercentage"], "id");
  }
}

import { JobsRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Jobs } from "@prisma/client_sfia";
import { BaseService } from "../BaseService";

export class JobsService extends BaseService<Jobs, keyof Jobs> {
  constructor() {
    super(new JobsRepo(), ["code_job", "job_name", "overall", "note", "level_id"], "code_job");
  }
}

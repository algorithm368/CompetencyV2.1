import { PortfolioRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Portfolio } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class PortfolioService extends BaseService<Portfolio, keyof Portfolio> {
  constructor() {
    super(new PortfolioRepo(), ["user_id", "id"], "id");
  }
}

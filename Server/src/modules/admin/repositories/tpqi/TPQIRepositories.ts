import { BaseRepository } from "../BaseRepository";
import { TPQI } from "@Database/dbManagers";
import type {
  all_details,
  career,
  career_level,
  cl_knowledge,
  cl_skills,
  cl_uc,
  details,
  knowledge,
  level,
  occupational,
  sector,
  skill,
  tpqi_summary_data,
  u_knowledge,
  u_skill,
  unit_code,
  unit_occupational,
  unit_sector,
  users_knowledge,
  users_skills,
} from "@prisma/client_tpqi";
import { DatabaseManagement } from "@Utils/DatabaseManagement";

// all_details Repository
export class AllDetailsRepo extends BaseRepository<all_details, "id_all_details"> {
  constructor(manager: DatabaseManagement<any> = TPQI.all_details, pkField: "id_all_details" = "id_all_details") {
    super(manager, pkField);
  }
}

// career Repository
export class CareerRepo extends BaseRepository<career, "id_career"> {
  constructor(manager: DatabaseManagement<any> = TPQI.career, pkField: "id_career" = "id_career") {
    super(manager, pkField);
  }
}

// career_level Repository
export class CareerLevelRepo extends BaseRepository<career_level, "id_career_level"> {
  constructor(manager: DatabaseManagement<any> = TPQI.career_level, pkField: "id_career_level" = "id_career_level") {
    super(manager, pkField);
  }
}

// cl_knowledge Repository
export class ClKnowledgeRepo extends BaseRepository<cl_knowledge, "id_cl_knowledge"> {
  constructor(manager: DatabaseManagement<any> = TPQI.cl_knowledge, pkField: "id_cl_knowledge" = "id_cl_knowledge") {
    super(manager, pkField);
  }
}

// cl_skills Repository
export class ClSkillsRepo extends BaseRepository<cl_skills, "id_cl_skills"> {
  constructor(manager: DatabaseManagement<any> = TPQI.cl_skills, pkField: "id_cl_skills" = "id_cl_skills") {
    super(manager, pkField);
  }
}

// cl_uc Repository
export class ClUcRepo extends BaseRepository<cl_uc, "id_cl_uc"> {
  constructor(manager: DatabaseManagement<any> = TPQI.cl_uc, pkField: "id_cl_uc" = "id_cl_uc") {
    super(manager, pkField);
  }
}

// details Repository
export class DetailsRepo extends BaseRepository<details, "id_d"> {
  constructor(manager: DatabaseManagement<any> = TPQI.details, pkField: "id_d" = "id_d") {
    super(manager, pkField);
  }
}

// knowledge Repository
export class KnowledgeRepo extends BaseRepository<knowledge, "id_knowledge"> {
  constructor(manager: DatabaseManagement<any> = TPQI.knowledge, pkField: "id_knowledge" = "id_knowledge") {
    super(manager, pkField);
  }
}

// level Repository
export class LevelRepo extends BaseRepository<level, "id_level"> {
  constructor(manager: DatabaseManagement<any> = TPQI.level, pkField: "id_level" = "id_level") {
    super(manager, pkField);
  }
}

// occupational Repository
export class OccupationalRepo extends BaseRepository<occupational, "id_occupational"> {
  constructor(manager: DatabaseManagement<any> = TPQI.occupational, pkField: "id_occupational" = "id_occupational") {
    super(manager, pkField);
  }
}

// sector Repository
export class SectorRepo extends BaseRepository<sector, "id_sector"> {
  constructor(manager: DatabaseManagement<any> = TPQI.sector, pkField: "id_sector" = "id_sector") {
    super(manager, pkField);
  }
}

// skill Repository
export class SkillRepo extends BaseRepository<skill, "id_skill"> {
  constructor(manager: DatabaseManagement<any> = TPQI.skill, pkField: "id_skill" = "id_skill") {
    super(manager, pkField);
  }
}

// tpqi_summary_data Repository
export class TpqiSummaryDataRepo extends BaseRepository<tpqi_summary_data, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.tpqi_summary_data, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// u_knowledge Repository
export class UKnowledgeRepo extends BaseRepository<u_knowledge, "id_u_knowledge"> {
  constructor(manager: DatabaseManagement<any> = TPQI.u_knowledge, pkField: "id_u_knowledge" = "id_u_knowledge") {
    super(manager, pkField);
  }
}

// u_skill Repository
export class USkillRepo extends BaseRepository<u_skill, "id_u_skill"> {
  constructor(manager: DatabaseManagement<any> = TPQI.u_skill, pkField: "id_u_skill" = "id_u_skill") {
    super(manager, pkField);
  }
}

// unit_code Repository
export class UnitCodeRepo extends BaseRepository<unit_code, "id_unit_code"> {
  constructor(manager: DatabaseManagement<any> = TPQI.unit_code, pkField: "id_unit_code" = "id_unit_code") {
    super(manager, pkField);
  }
}

// unit_occupational Repository
export class UnitOccupationalRepo extends BaseRepository<unit_occupational, "id_unit_occupational"> {
  constructor(manager: DatabaseManagement<any> = TPQI.unit_occupational, pkField: "id_unit_occupational" = "id_unit_occupational") {
    super(manager, pkField);
  }
}

// unit_sector Repository
export class UnitSectorRepo extends BaseRepository<unit_sector, "id_unit_sector"> {
  constructor(manager: DatabaseManagement<any> = TPQI.unit_sector, pkField: "id_unit_sector" = "id_unit_sector") {
    super(manager, pkField);
  }
}

// users_knowledge Repository
export class UsersKnowledgeRepo extends BaseRepository<users_knowledge, "id_users_knowledge"> {
  constructor(manager: DatabaseManagement<any> = TPQI.users_knowledge, pkField: "id_users_knowledge" = "id_users_knowledge") {
    super(manager, pkField);
  }
}

// users_skills Repository
export class UsersSkillsRepo extends BaseRepository<users_skills, "id_users_skills"> {
  constructor(manager: DatabaseManagement<any> = TPQI.users_skills, pkField: "id_users_skills" = "id_users_skills") {
    super(manager, pkField);
  }
}

import { BaseRepository } from "@Utils/BaseRepository";
import { TPQI } from "@Database/dbManagers";
import type {
  Career,
  CareerLevel,
  CareerLevelDetail,
  CareerLevelKnowledge,
  CareerLevelSkill,
  CareerLevelUnitCode,
  Knowledge,
  Level,
  Skill,
  UnitCode,
  UserKnowledge,
  UserSkill,
  UserUnitKnowledge,
  UserUnitSkill,
  TpqiSummary,
  Occupational,
  UnitOccupational,
  Sector,
  UnitSector,
} from "@prisma/client_tpqi";
import { DatabaseManagement } from "@Utils/databaseUtils";

// Career Repository
export class CareerRepo extends BaseRepository<Career, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.career, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// CareerLevel Repository
export class CareerLevelRepo extends BaseRepository<CareerLevel, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.careerLevel, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// CareerLevelDetail Repository
export class CareerLevelDetailRepo extends BaseRepository<CareerLevelDetail, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.careerLevelDetail, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// CareerLevelKnowledge Repository
export class CareerLevelKnowledgeRepo extends BaseRepository<CareerLevelKnowledge, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.careerLevelKnowledge, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// CareerLevelSkill Repository
export class CareerLevelSkillRepo extends BaseRepository<CareerLevelSkill, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.careerLevelSkill, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// CareerLevelUnitCode Repository
export class CareerLevelUnitCodeRepo extends BaseRepository<CareerLevelUnitCode, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.careerLevelUnitCode, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Knowledge Repository
export class KnowledgeRepo extends BaseRepository<Knowledge, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.knowledge, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Level Repository
export class LevelRepo extends BaseRepository<Level, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.level, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Skill Repository
export class SkillRepo extends BaseRepository<Skill, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.skill, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// UnitCode Repository
export class UnitCodeRepo extends BaseRepository<UnitCode, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.unitCode, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// UserKnowledge Repository
export class UserKnowledgeRepo extends BaseRepository<UserKnowledge, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.userKnowledge, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// UserSkill Repository
export class UserSkillRepo extends BaseRepository<UserSkill, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.userSkill, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// UserUnitKnowledge Repository
export class UserUnitKnowledgeRepo extends BaseRepository<UserUnitKnowledge, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.userUnitKnowledge, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// UserUnitSkill Repository
export class UserUnitSkillRepo extends BaseRepository<UserUnitSkill, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.userUnitSkill, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// TpqiSummary Repository
export class TpqiSummaryRepo extends BaseRepository<TpqiSummary, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.tpqiSummary, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Occupational Repository
export class OccupationalRepo extends BaseRepository<Occupational, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.occupational, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// UnitOccupational Repository
export class UnitOccupationalRepo extends BaseRepository<UnitOccupational, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.unitOccupational, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Sector Repository
export class SectorRepo extends BaseRepository<Sector, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.sector, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// UnitSector Repository
export class UnitSectorRepo extends BaseRepository<UnitSector, "id"> {
  constructor(manager: DatabaseManagement<any> = TPQI.unitSector, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

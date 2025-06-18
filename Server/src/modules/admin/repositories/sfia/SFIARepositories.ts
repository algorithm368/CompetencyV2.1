import { BaseRepository } from "../BaseRepository";
import { SFIA } from "@Database/dbManagers";
import type { Category, Datacollection, Description, Education, Experience, Information, Jobs, Levels, Portfolio, Skills, Subcategory, sfia_summary_data } from "@prisma/client_sfia";
import { DatabaseManagement } from "@Utils/databaseUtils";

// Category Repository
export class CategoryRepo extends BaseRepository<Category, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.category, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Datacollection Repository
export class DatacollectionRepo extends BaseRepository<Datacollection, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.datacollection, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Description Repository
export class DescriptionRepo extends BaseRepository<Description, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.description, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Education Repository
export class EducationRepo extends BaseRepository<Education, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.education, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Experience Repository
export class ExperienceRepo extends BaseRepository<Experience, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.experience, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Information Repository
export class InformationRepo extends BaseRepository<Information, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.information, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Jobs Repository
export class JobsRepo extends BaseRepository<Jobs, "code_job"> {
  constructor(manager: DatabaseManagement<any> = SFIA.jobs, pkField: "code_job" = "code_job") {
    super(manager, pkField);
  }
}

// Levels Repository
export class LevelsRepo extends BaseRepository<Levels, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.levels, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Portfolio Repository
export class PortfolioRepo extends BaseRepository<Portfolio, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.portfolio, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Skills Repository
export class SkillsRepo extends BaseRepository<Skills, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.skills, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// Subcategory Repository
export class SubcategoryRepo extends BaseRepository<Subcategory, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.subcategory, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

// SFIA Summary Data Repository
export class SummaryDataRepo extends BaseRepository<sfia_summary_data, "id"> {
  constructor(manager: DatabaseManagement<any> = SFIA.sfia_summary_data, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

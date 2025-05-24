import { BaseRepository } from "../BaseRepository";
import { SFIA } from "@Database/dbManagers";
import type { Category, Datacollection, Description, Education, Experience, Information, Jobs, Levels, Portfolio, Skills, Subcategory, sfia_summary_data } from "@prisma/client_sfia";

// Category Repository
export const CategoryRepo = new BaseRepository<Category, "id">(SFIA.category, "id");

// Datacollection Repository
export const DatacollectionRepo = new BaseRepository<Datacollection, "id">(SFIA.datacollection, "id");

// Description Repository
export const DescriptionRepo = new BaseRepository<Description, "id">(SFIA.description, "id");

// Education Repository
export const EducationRepo = new BaseRepository<Education, "id">(SFIA.education, "id");

// Experience Repository
export const ExperienceRepo = new BaseRepository<Experience, "id">(SFIA.experience, "id");

// Information Repository
export const InformationRepo = new BaseRepository<Information, "id">(SFIA.information, "id");

// Jobs Repository
export const JobsRepo = new BaseRepository<Jobs, "code_job">(SFIA.jobs, "code_job");

// Levels Repository
export const LevelsRepo = new BaseRepository<Levels, "id">(SFIA.levels, "id");

// Portfolio Repository
export const PortfolioRepo = new BaseRepository<Portfolio, "id">(SFIA.portfolio, "id");

// Skills Repository
export const SkillsRepo = new BaseRepository<Skills, "id">(SFIA.skills, "id");

// Subcategory Repository
export const SubcategoryRepo = new BaseRepository<Subcategory, "id">(SFIA.subcategory, "id");

// SFIA Summary Data Repository
export const SummaryDataRepo = new BaseRepository<sfia_summary_data, "id">(SFIA.sfia_summary_data, "id");

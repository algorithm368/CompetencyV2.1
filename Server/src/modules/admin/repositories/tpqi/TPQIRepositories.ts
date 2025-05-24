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

// all_details Repository
export const AllDetailsRepo = new BaseRepository<all_details, "id_all_details">(TPQI.all_details, "id_all_details");

// career Repository
export const CareerRepo = new BaseRepository<career, "id_career">(TPQI.career, "id_career");

// career_level Repository
export const CareerLevelRepo = new BaseRepository<career_level, "id_career_level">(TPQI.career_level, "id_career_level");

// cl_knowledge Repository
export const ClKnowledgeRepo = new BaseRepository<cl_knowledge, "id_cl_knowledge">(TPQI.cl_knowledge, "id_cl_knowledge");

// cl_skills Repository
export const ClSkillsRepo = new BaseRepository<cl_skills, "id_cl_skills">(TPQI.cl_skills, "id_cl_skills");

// cl_uc Repository
export const ClUcRepo = new BaseRepository<cl_uc, "id_cl_uc">(TPQI.cl_uc, "id_cl_uc");

// details Repository
export const DetailsRepo = new BaseRepository<details, "id_d">(TPQI.details, "id_d");

// knowledge Repository
export const KnowledgeRepo = new BaseRepository<knowledge, "id_knowledge">(TPQI.knowledge, "id_knowledge");

// level Repository
export const LevelRepo = new BaseRepository<level, "id_level">(TPQI.level, "id_level");

// occupational Repository
export const OccupationalRepo = new BaseRepository<occupational, "id_occupational">(TPQI.occupational, "id_occupational");

// sector Repository
export const SectorRepo = new BaseRepository<sector, "id_sector">(TPQI.sector, "id_sector");

// skill Repository
export const SkillRepo = new BaseRepository<skill, "id_skill">(TPQI.skill, "id_skill");

// tpqi_summary_data Repository
export const TpqiSummaryDataRepo = new BaseRepository<tpqi_summary_data, "id">(TPQI.tpqi_summary_data, "id");

// u_knowledge Repository
export const UKnowledgeRepo = new BaseRepository<u_knowledge, "id_u_knowledge">(TPQI.u_knowledge, "id_u_knowledge");

// u_skill Repository
export const USkillRepo = new BaseRepository<u_skill, "id_u_skill">(TPQI.u_skill, "id_u_skill");

// unit_code Repository
export const UnitCodeRepo = new BaseRepository<unit_code, "id_unit_code">(TPQI.unit_code, "id_unit_code");

// unit_occupational Repository
export const UnitOccupationalRepo = new BaseRepository<unit_occupational, "id_unit_occupational">(TPQI.unit_occupational, "id_unit_occupational");

// unit_sector Repository
export const UnitSectorRepo = new BaseRepository<unit_sector, "id_unit_sector">(TPQI.unit_sector, "id_unit_sector");

// users_knowledge Repository
export const UsersKnowledgeRepo = new BaseRepository<users_knowledge, "id_users_knowledge">(TPQI.users_knowledge, "id_users_knowledge");

// users_skills Repository
export const UsersSkillsRepo = new BaseRepository<users_skills, "id_users_skills">(TPQI.users_skills, "id_users_skills");

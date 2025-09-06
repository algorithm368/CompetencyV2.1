import { RAW } from "@Database/dbManagers";

interface DashboardSummary {
  totalUsers: number;
  onlineUsers: number;
  rolesCount: Record<string, number>;
  recentUsers: Array<{
    id: string;
    email: string;
    firstNameTH?: string;
    lastNameTH?: string;
    status: "online" | "offline";
    lastLogin?: Date;
  }>;
  topSfiaSkills: Array<{
    skillCode: string;
    skillName?: string;
    averagePercent: number;
  }>;
  topTpqiCareers: Array<{
    careerName?: string;
    avgSkillPercent: number;
    avgKnowledgePercent: number;
  }>;
}

// ===== Row Types =====
type TotalUsersRow = { totalUsers: bigint };
type SessionRow = { userId: string };
type RoleRow = { name: string; count: bigint };
type RecentUserRow = {
  id: string;
  email: string;
  firstNameTH: string | null;
  lastNameTH: string | null;
  lastLogin: Date | null;
};
type SfiaSkillRow = {
  skillCode: string;
  skillName: string | null;
  averagePercent: number;
};
type TpqiCareerRow = {
  careerName: string;
  avgSkillPercent: number;
  avgKnowledgePercent: number;
};

export const DashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    /** ---------------- COMPETENCY DB ---------------- */

    // จำนวนผู้ใช้ทั้งหมด
    const [{ totalUsers: totalUsersRaw }] = await RAW.COMPETENCY.$queryRawUnsafe<TotalUsersRow[]>(`
        SELECT COUNT(*) as totalUsers FROM \`User\`
      `);
    const totalUsers = Number(totalUsersRaw);

    // ออนไลน์ (session ยังไม่หมดอายุ)
    const sessions = await RAW.COMPETENCY.$queryRawUnsafe<SessionRow[]>(`
      SELECT DISTINCT userId 
      FROM \`Session\` 
      WHERE expiresAt > NOW()
    `);
    const onlineUserIds = sessions.map((s: SessionRow) => s.userId);
    const onlineUsers = onlineUserIds.length;

    // Roles count
    const roles = await RAW.COMPETENCY.$queryRawUnsafe<RoleRow[]>(`
      SELECT r.name, COUNT(*) as count
      FROM \`UserRole\` ur
      JOIN \`Role\` r ON ur.roleId = r.id
      GROUP BY r.name
    `);
    const rolesCount: Record<string, number> = {};
    roles.forEach((r: RoleRow) => {
      rolesCount[r.name || "Unknown"] = Number(r.count);
    });

    // Recent users (10 คนล่าสุดที่ login)
    const recentUsers = await RAW.COMPETENCY.$queryRawUnsafe<RecentUserRow[]>(`
      SELECT u.id, u.email, u.firstNameTH, u.lastNameTH,
            l.timestamp as lastLogin
      FROM \`Log\` l
      JOIN \`User\` u ON l.userId = u.id
      WHERE l.action = 'LOGIN'
      ORDER BY l.timestamp DESC
      LIMIT 10
    `);

    const recentUsersWithStatus: DashboardSummary["recentUsers"] = recentUsers.map((u: RecentUserRow) => ({
      id: u.id,
      email: u.email,
      firstNameTH: u.firstNameTH ?? undefined,
      lastNameTH: u.lastNameTH ?? undefined,
      lastLogin: u.lastLogin ?? undefined,
      status: onlineUserIds.includes(u.id) ? "online" : "offline",
    }));

    /** ---------------- SFIA DB ---------------- */
    const topSfiaSkills = await RAW.SFIA.$queryRawUnsafe<SfiaSkillRow[]>(`
      SELECT s.code as skillCode, s.name as skillName,
            AVG(ss.skillPercent) as averagePercent
      FROM \`SfiaSummary\` ss
      JOIN \`Skill\` s ON ss.skillCode = s.code
      GROUP BY s.code, s.name
      ORDER BY AVG(ss.skillPercent) DESC
      LIMIT 5
    `);

    /** ---------------- TPQI DB ---------------- */
    const topTpqiCareers = await RAW.TPQI.$queryRawUnsafe<TpqiCareerRow[]>(`
      SELECT c.name as careerName,
            AVG(ts.skillPercent) as avgSkillPercent,
            AVG(ts.knowledgePercent) as avgKnowledgePercent
      FROM \`TpqiSummary\` ts
      JOIN \`Career\` c ON ts.careerId = c.id
      GROUP BY c.name
      ORDER BY AVG(ts.skillPercent) DESC
      LIMIT 5
    `);

    /** ---------------- RETURN ---------------- */
    return {
      totalUsers,
      onlineUsers,
      rolesCount,
      recentUsers: recentUsersWithStatus,
      topSfiaSkills: topSfiaSkills.map((s: SfiaSkillRow) => ({
        skillCode: s.skillCode,
        skillName: s.skillName ?? undefined,
        averagePercent: s.averagePercent,
      })),
      topTpqiCareers: topTpqiCareers.map((c: TpqiCareerRow) => ({
        careerName: c.careerName ?? undefined,
        avgSkillPercent: c.avgSkillPercent,
        avgKnowledgePercent: c.avgKnowledgePercent,
      })),
    };
  },
};

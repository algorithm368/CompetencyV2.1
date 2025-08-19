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

export const DashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    /** ---------------- COMPETENCY DB ---------------- */

    // จำนวนผู้ใช้ทั้งหมด
    const [{ totalUsers: totalUsersRaw }] = await RAW.COMPETENCY.$queryRawUnsafe<{ totalUsers: bigint }[]>(`SELECT COUNT(*) as totalUsers FROM \`User\``);
    const totalUsers = Number(totalUsersRaw);

    // ออนไลน์ (session ยังไม่หมดอายุ)
    const sessions = await RAW.COMPETENCY.$queryRawUnsafe<{ userId: string }[]>(`
    SELECT DISTINCT userId FROM \`Session\` WHERE expiresAt > NOW()
  `);
    const onlineUserIds = sessions.map((s) => s.userId);
    const onlineUsers = onlineUserIds.length;

    // Roles count
    const roles = await RAW.COMPETENCY.$queryRawUnsafe<{ name: string; count: bigint }[]>(`
    SELECT r.name, COUNT(*) as count
    FROM \`UserRole\` ur
    JOIN \`Role\` r ON ur.roleId = r.id
    GROUP BY r.name
  `);
    const rolesCount: Record<string, number> = {};
    roles.forEach((r) => {
      rolesCount[r.name || "Unknown"] = Number(r.count);
    });

    // Recent users (10 คนล่าสุดที่ login)
    const recentUsers = await RAW.COMPETENCY.$queryRawUnsafe<
      {
        id: string;
        email: string;
        firstNameTH?: string;
        lastNameTH?: string;
        lastLogin: Date;
      }[]
    >(`
      SELECT u.id, u.email, u.firstNameTH, u.lastNameTH,
             l.timestamp as lastLogin
      FROM \`Log\` l
      JOIN \`User\` u ON l.userId = u.id
      WHERE l.action = 'LOGIN'
      ORDER BY l.timestamp DESC
      LIMIT 10
    `);

    const recentUsersWithStatus = recentUsers.map((u) => ({
      ...u,
      status: onlineUserIds.includes(u.id) ? ("online" as const) : ("offline" as const),
    }));

    /** ---------------- SFIA DB ---------------- */
    const topSfiaSkills = await RAW.SFIA.$queryRawUnsafe<{ skillCode: string; skillName?: string; averagePercent: number }[]>(`
      SELECT s.code as skillCode, s.name as skillName,
             AVG(ss.skillPercent) as averagePercent
      FROM \`SfiaSummary\` ss
      JOIN \`Skill\` s ON ss.skillCode = s.code
      GROUP BY s.code, s.name
      ORDER BY AVG(ss.skillPercent) DESC
      LIMIT 5
    `);

    /** ---------------- TPQI DB ---------------- */
    const topTpqiCareers = await RAW.TPQI.$queryRawUnsafe<{ careerName: string; avgSkillPercent: number; avgKnowledgePercent: number }[]>(`
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
      topSfiaSkills,
      topTpqiCareers,
    };
  },
};

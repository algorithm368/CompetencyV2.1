import React, { useCallback, useMemo } from "react";
import Layout from "@Layouts/Layout";
import { FaUserCircle, FaCheckCircle, FaTimesCircle, FaDownload } from "react-icons/fa";
import { mockOccupations, OccupationType, SkillType } from "../mockOccupations";
import { mockUsers, UserType } from "../mockOccupations";
import { generatePortfolioPdf } from "./PortfolioPdf";

const ProfilePage: React.FC = () => {
  const userId = 1;
  const foundUser: UserType | undefined = mockUsers.find((u) => u.id === userId);
  const userOccupation: OccupationType | undefined = foundUser ? mockOccupations.find((occ) => occ.id === foundUser.occupationId) : undefined;

  const generatePdf = useCallback(() => {
    if (!foundUser || !userOccupation) return;
    generatePortfolioPdf(foundUser, userOccupation);
  }, [foundUser, userOccupation]);

  const levelProgressScreen = useMemo(() => {
    if (!foundUser || !userOccupation) return {};
    const summary: Record<string, { total: number; completed: number }> = {};
    userOccupation.skills.forEach((skill) => {
      const lvl = skill.level;
      if (!summary[lvl]) summary[lvl] = { total: 0, completed: 0 };
      summary[lvl].total += 1;
      if (foundUser.evidenceUrls[skill.id]?.trim() !== "") {
        summary[lvl].completed += 1;
      }
    });
    return summary;
  }, [foundUser, userOccupation]);

  if (!foundUser) {
    return (
      <Layout>
        <div className="pt-16 px-4 text-center">
          <p className="text-red-500">ไม่พบข้อมูลผู้ใช้</p>
        </div>
      </Layout>
    );
  }

  const mockUserProfile = {
    name: foundUser.name,
    email: `${foundUser.name.toLowerCase().replace(" ", ".")}@example.com`,
    role: "Full Stack Developer",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    bio: "Passionate developer with experience in building full-stack applications. Skilled in React, Node.js, and cloud deployment. Always eager to learn new technologies and improve code quality.",
    location: "Bangkok, Thailand",
  };

  const totalOccupations = userOccupation ? 1 : 0;
  const totalSkills = userOccupation ? userOccupation.skills.length : 0;
  const evidenceCount = Object.values(foundUser.evidenceUrls).filter((url) => url.trim() !== "").length;

  const renderProgressBar = (completed: number, total: number) => {
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-500 h-2.5"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="pt-16 pb-16 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto space-y-16">
        <section className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center text-center">
          <div className="relative w-32 h-32 mb-4">
            {mockUserProfile.avatarUrl ? (
              <img
                src={mockUserProfile.avatarUrl}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm"
              />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-300" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-800">{mockUserProfile.name}</h1>
          <p className="text-gray-600 mt-1">{mockUserProfile.role}</p>
          <p className="text-gray-500 mt-1">{mockUserProfile.email}</p>
          <p className="text-gray-500 mt-2">{mockUserProfile.location}</p>
          <p className="text-gray-700 mt-4 max-w-2xl leading-relaxed">{mockUserProfile.bio}</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
            <span className="text-5xl font-bold text-indigo-600">{totalOccupations}</span>
            <p className="mt-2 text-gray-700 text-lg">Occupation</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
            <span className="text-5xl font-bold text-indigo-600">{totalSkills}</span>
            <p className="mt-2 text-gray-700 text-lg">Skills</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
            <span className="text-5xl font-bold text-indigo-600">{evidenceCount}</span>
            <p className="mt-2 text-gray-700 text-lg">Evidence Count</p>
          </div>
        </section>

        <section className="flex justify-center">
          <button
            onClick={generatePdf}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
          >
            <FaDownload className="mr-2 w-5 h-5" /> ดาวน์โหลด Portfolio (PDF)
          </button>
        </section>

        {userOccupation && (
          <section className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Level Progress</h2>
            <div className="space-y-6">
              {Object.entries(levelProgressScreen).map(([level, { total, completed }]) => {
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                return (
                  <div
                    key={level}
                    className="space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{level}</span>
                      <span className="text-gray-600">
                        {percent}% ({completed}/{total})
                      </span>
                    </div>
                    {renderProgressBar(completed, total)}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Occupation & Skills</h2>
          {!userOccupation ? (
            <p className="text-gray-500">ยังไม่มีอาชีพในระบบ</p>
          ) : (
            <div className="space-y-10">
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">{userOccupation.name}</h3>
                    <p className="text-gray-500 mt-1">
                      Total Skills: <span className="font-medium">{userOccupation.skills.length}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                  {userOccupation.skills.map((skill: SkillType) => {
                    const hasEvidence = Boolean(foundUser.evidenceUrls[skill.id]?.trim() !== "");
                    return (
                      <div
                        key={skill.id}
                        className="border border-gray-200 p-6 rounded-2xl hover:shadow-lg transition"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800">{skill.name}</h4>
                            <p className="text-sm text-gray-500 mt-0.5">
                              Framework: {skill.framework} | Level: {skill.level}
                            </p>
                          </div>
                          {hasEvidence ? <FaCheckCircle className="text-green-500 w-6 h-6" /> : <FaTimesCircle className="text-red-500 w-6 h-6" />}
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">{skill.description}</p>

                        <details className="mb-4">
                          <summary className="cursor-pointer text-indigo-600 hover:underline mb-2">Responsibilities</summary>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {skill.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                          <summary className="cursor-pointer text-indigo-600 hover:underline mb-2">Requirements</summary>
                          <ul className="list-decimal list-inside text-gray-700 space-y-1">
                            {skill.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </details>

                        <div className="mt-4">
                          <h5 className="text-md font-semibold text-gray-800 mb-2">My Evidence</h5>
                          {hasEvidence ? (
                            <a
                              href={foundUser.evidenceUrls[skill.id]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              View My Evidence
                            </a>
                          ) : (
                            <p className="text-gray-500 italic">No evidence submitted</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;

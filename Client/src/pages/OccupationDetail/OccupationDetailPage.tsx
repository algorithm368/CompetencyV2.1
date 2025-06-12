// OccupationDetailPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@Layouts/Layout";
import { FaArrowLeft } from "react-icons/fa";
import { mockOccupations, OccupationType, SkillType, mockUsers, UserType } from "../mockOccupations";

const OccupationDetailPage: React.FC = () => {
  // สมมุติ userId = 1 (John Doe) และ occupationId = 1 (Software Developer)
  const userId = "1";
  const id = "1"; // occupationId

  const navigate = useNavigate();
  const [occupation, setOccupation] = useState<OccupationType | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [evidenceUrls, setEvidenceUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    // 1) หา user ตาม userId = "1"
    const foundUser = mockUsers.find((u) => u.id === Number(userId));
    if (!foundUser) {
      navigate(-1);
      return;
    }
    setUser(foundUser);

    // 2) หา occupation ตาม id = "1"
    const foundOcc = mockOccupations.find((o) => o.id === Number(id));
    if (!foundOcc) {
      navigate(-1);
      return;
    }

    // 3) ตรวจสอบว่า occupationId ของ user ตรงกับ id ของ occupation
    if (foundUser.occupationId !== foundOcc.id) {
      navigate(-1);
      return;
    }
    setOccupation(foundOcc);

    // 4) สร้าง initialUrls จาก foundUser.evidenceUrls
    const initialUrls: Record<number, string> = {};
    foundOcc.skills.forEach((sk) => {
      if (Object.prototype.hasOwnProperty.call(foundUser.evidenceUrls, sk.id)) {
        initialUrls[sk.id] = foundUser.evidenceUrls[sk.id];
      } else {
        initialUrls[sk.id] = "";
      }
    });
    setEvidenceUrls(initialUrls);
  }, [navigate]);

  const levelProgress = useMemo(() => {
    if (!occupation) return {};
    const summary: Record<string, { total: number; completed: number }> = {};
    occupation.skills.forEach((skill) => {
      const lvl = skill.level;
      if (!summary[lvl]) summary[lvl] = { total: 0, completed: 0 };
      summary[lvl].total += 1;
      if (evidenceUrls[skill.id]?.trim() !== "") {
        summary[lvl].completed += 1;
      }
    });
    return summary;
  }, [occupation, evidenceUrls]);

  const overallCompletion = useMemo(() => {
    if (!occupation) return 0;
    const completedCount = Object.values(evidenceUrls).filter((u) => u.trim() !== "").length;
    const totalCount = occupation.skills.length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  }, [evidenceUrls, occupation]);

  const handleSaveEvidence = (skillId: number) => {
    const url = evidenceUrls[skillId];
    if (url.trim() === "") {
      alert("กรุณากรอก URL หลักฐานก่อนบันทึก");
      return;
    }
    console.log(`User ${user?.id} บันทึกหลักฐานสำหรับ skill ${skillId} ของ occupation ${occupation?.id}:`, url);
    alert("บันทึกหลักฐานเรียบร้อยแล้ว");
    setEvidenceUrls((prev) => ({
      ...prev,
      [skillId]: "",
    }));
  };

  if (!occupation || !user) {
    return (
      <Layout>
        <div className="pt-16 px-4 text-center">
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-18 px-4 pb-16 md:px-8 lg:px-16 max-w-6xl mx-auto">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <FaArrowLeft className="mr-2" /> ย้อนกลับ
        </button>

        {/* ชื่ออาชีพ, ชื่อผู้ใช้ และสรุปเปอร์เซ็นต์ */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{occupation.name}</h1>
            <p className="text-gray-600">
              ผู้ใช้: <span className="font-medium">{user.name}</span>
            </p>
            <p className="text-gray-600">
              จำนวนทักษะทั้งหมด: <span className="font-medium">{occupation.skills.length}</span> ชุด
            </p>

            <ul className="text-sm text-gray-500 mt-1 space-y-1">
              {Object.entries(levelProgress).map(([level, { total, completed }]) => {
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                return (
                  <li key={level}>
                    ระดับ {level}: สำเร็จ {pct}%
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-4 sm:mt-0">
            <p className="text-xl text-green-600 font-semibold">สำเร็จทั้งหมด {overallCompletion}%</p>
          </div>
        </header>

        {/* รายการทักษะ */}
        <ul className="space-y-6">
          {occupation.skills.map((skill: SkillType) => (
            <li
              key={skill.id}
              className="bg-white p-6 rounded-2xl shadow-sm transition"
            >
              <div className="mb-2">
                <h2 className="text-2xl font-semibold text-gray-800">{skill.name}</h2>
                <p className="text-sm text-gray-500">
                  กรอบสมรรถนะ: {skill.framework} | ระดับ: {skill.level}
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4 line-clamp-2">{skill.description}</p>

              <details className="mb-4">
                <summary className="cursor-pointer text-blue-600 hover:underline mb-2">ดูรายละเอียดเพิ่มเติม</summary>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">หน้าที่ความรับผิดชอบ</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {skill.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">คุณสมบัติที่ต้องการ</h3>
                    <ul className="list-decimal list-inside space-y-1 text-gray-700">
                      {skill.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>

              {/* ส่วนใส่หลักฐาน (Evidence) */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">หลักฐาน (Evidence)</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <input
                    type="url"
                    placeholder="https://example.com/your-evidence"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    value={evidenceUrls[skill.id] || ""}
                    onChange={(e) =>
                      setEvidenceUrls((prev) => ({
                        ...prev,
                        [skill.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleSaveEvidence(skill.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default OccupationDetailPage;

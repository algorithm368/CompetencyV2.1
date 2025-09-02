import { PrismaClient } from "@prisma/client_competency";

const prisma = new PrismaClient();

async function main() {
  const operations = ["create", "read", "update", "delete"];

  const assets = [
    // ===== SFIA =====
    { tableName: "Category", description: "หมวดหมู่หลักของ SFIA" },
    { tableName: "Subcategory", description: "หมวดย่อยของ SFIA" },
    { tableName: "Skill", description: "ทักษะหลักใน SFIA" },
    { tableName: "Level", description: "ระดับของทักษะ SFIA" },
    { tableName: "Description", description: "คำอธิบายระดับ SFIA" },
    { tableName: "SubSkill", description: "ทักษะย่อยของ SFIA" },
    { tableName: "Information", description: "ข้อมูล/หลักฐานการประเมิน" },
    { tableName: "DataCollection", description: "การเก็บข้อมูลความสามารถผู้ใช้" },
    { tableName: "SfiaSummary", description: "สรุปคะแนนทักษะผู้ใช้" },

    // ===== TPQI =====
    { tableName: "Career", description: "อาชีพหลักใน TPQI" },
    { tableName: "CareerLevel", description: "ระดับอาชีพ" },
    { tableName: "LevelTpqi", description: "ระดับมาตรฐาน TPQI" },
    { tableName: "CareerLevelDetail", description: "รายละเอียดระดับอาชีพ" },
    { tableName: "CareerLevelKnowledge", description: "ความรู้ในระดับอาชีพ" },
    { tableName: "CareerLevelSkill", description: "ทักษะในระดับอาชีพ" },
    { tableName: "CareerLevelUnitCode", description: "รหัสหน่วยอาชีพ" },
    { tableName: "Knowledge", description: "ความรู้ใน TPQI" },
    { tableName: "SkillTpqi", description: "ทักษะใน TPQI" },
    { tableName: "UnitCode", description: "หน่วยรหัสมาตรฐาน" },
    { tableName: "UserKnowledge", description: "ความรู้ของผู้ใช้" },
    { tableName: "UserSkill", description: "ทักษะของผู้ใช้" },
    { tableName: "UserUnitKnowledge", description: "หน่วยมาตรฐานความรู้ของผู้ใช้" },
    { tableName: "UserUnitSkill", description: "หน่วยมาตรฐานทักษะของผู้ใช้" },
    { tableName: "Occupational", description: "อาชีพมาตรฐาน" },
    { tableName: "UnitOccupational", description: "ความสัมพันธ์อาชีพกับหน่วย" },
    { tableName: "Sector", description: "สาขาวิชาชีพ" },
    { tableName: "UnitSector", description: "ความสัมพันธ์สาขาวิชาชีพกับหน่วย" },
    { tableName: "TpqiSummary", description: "สรุปผลการประเมินผู้ใช้ TPQI" },
  ];

  // สร้าง Operation
  const operationRecords = [];
  for (const opName of operations) {
    const op = await prisma.operation.upsert({
      where: { name: opName },
      update: {},
      create: { name: opName, description: `${opName} operation` },
    });
    operationRecords.push(op);
  }

  for (const asset of assets) {
    const assetRecord = await prisma.asset.upsert({
      where: { tableName: asset.tableName },
      update: { description: asset.description },
      create: asset,
    });

    // สร้าง Permission CRUD สำหรับแต่ละ Asset
    for (const op of operationRecords) {
      await prisma.permission.upsert({
        where: { operationId_assetId: { operationId: op.id, assetId: assetRecord.id } },
        update: {},
        create: { operationId: op.id, assetId: assetRecord.id },
      });
    }
  }

  console.log("Seeded SFIA and TPQI assets, operations, and permissions.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

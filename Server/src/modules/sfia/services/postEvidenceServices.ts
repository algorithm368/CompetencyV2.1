import { primaSfia } from "../../../db/prismaClients";
import { InformationApprovalStatus } from "@prima/client_sfia";

export interface CreateEvidenceRequest {
  userId: string;
  subSkillId: number;
  evidenceText: string;
  evidenceUrl?: string;
}

export interface EvidenceResponse {
  id: number;
  text: string | null;
  evidenceUrl: string | null;
  approved: InformationApprovalStatus;
  createdAt: Date;
  subSkillId: number;
  dataCollectionId: number;
}

export async function createSubSkillEvidence(
  evidenceData: CreateEvidenceRequest
): Promise<EvidenceResponse> {
  // First, check if the subSkill exists
  const subSkill = await primaSfia.subSkill.findUnique({
    where: {
      id: evidenceData.subSkillId,
    },
  });

  if (!subSkill) {
    throw new Error(
      `SubSkill with ID ${evidenceData.subSkillId} does not exist.`
    );
  }

  let dataCollection = await primaSfia.dataCollection.findFirst({
    where: {
      userId: evidenceData.userId,
    },
  });

  if (!dataCollection) {
    dataCollection = await primaSfia.dataCollection.create({
      data: {
        userId: evidenceData.userId,
      },
    });
  }

  const evidence = await primaSfia.information.create({
    data: {
      text: evidenceData.evidenceText,
      evidenceUrl: evidenceData.evidenceUrl,
      subSkillId: evidenceData.subSkillId,
      dataCollectionId: dataCollection.id,
      approveStatus: InformationApprovalStatus.NOT_APPROVED,
    },
  });

  return {
    id: evidence.id,
    text: evidence.text,
    evidenceUrl: evidence.evidenceUrl,
    approved: evidence.approveStatus,
    createdAt: evidence.createdAt,
    subSkillId: evidence.subSkillId!,
    dataCollectionId: evidence.dataCollectionId!,
  };
}

// test function to verify the service
createSubSkillEvidence({
  userId: "test-user-id",
  subSkillId: 1,
  evidenceText: "This is a test evidence.",
  evidenceUrl: "http://example.com/test-evidence",
}).then(response => {
  console.log("Evidence created successfully:", response);
}).catch(error => {
  console.error("Error creating evidence:", error);
});

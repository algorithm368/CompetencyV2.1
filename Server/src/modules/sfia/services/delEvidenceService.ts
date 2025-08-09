import { prismaSfia } from "@/db/prismaClients";

export const delEvidenceService = {
  deleteEvidence: async (id: string) => {
    try {
      const result = await prismaSfia.evidence.delete({
        where: { id },
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete evidence: ${error.message}`);
    }
  },
};

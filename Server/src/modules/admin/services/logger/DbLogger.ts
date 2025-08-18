import { Logger, LogEvent } from "./LoggerInterface";
import { PrismaClient, $Enums } from "@prisma/client_competency";

const prisma = new PrismaClient();

export class DbLogger implements Logger {
  async log(event: LogEvent): Promise<void> {
    try {
      await prisma.log.create({
        data: {
          action: event.action as $Enums.LogAction,
          databaseName: "default",
          tableName: event.model,
          recordId: event.data?.id ? String(event.data.id) : null,
          userId: event.actor || null,
          timestamp: new Date(event.timestamp),
          parameters: JSON.stringify(event.data),
        },
      });
    } catch (err) {
      console.error("[DbLogger] Failed to save log:", err);
    }
  }
}

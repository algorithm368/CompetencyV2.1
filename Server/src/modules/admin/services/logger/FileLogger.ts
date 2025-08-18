import fs from "fs";
import path from "path";
import { Logger, LogEvent } from "./LoggerInterface";

export class FileLogger implements Logger {
  private buffer: LogEvent[] = [];
  private flushing = false;

  constructor(private readonly dirPath: string = path.resolve(process.cwd(), "logs"), private readonly prefix: string = "application", private readonly daily: boolean = true) {}

  public async log(event: LogEvent): Promise<void> {
    this.buffer.push(event);
    if (!this.flushing) {
      this.flushing = true;
      setTimeout(() => {
        this.flushBuffer().catch((err) => console.error("[FileLogger] Failed to flush buffer:", err));
      }, 1000);
    }
  }

  private getFilePath(): string {
    const dateSuffix = this.daily ? `-${new Date().toISOString().slice(0, 10)}` : "";
    const fileName = `${this.prefix}${dateSuffix}.log`;
    return path.join(this.dirPath, fileName);
  }

  private async flushBuffer(): Promise<void> {
    const entries = this.buffer.splice(0);
    if (entries.length === 0) {
      this.flushing = false;
      return;
    }

    const lines =
      entries
        .map((evt) => {
          const dataStr = JSON.stringify(evt.data);
          const reqIdStr = evt.requestId ?? "";
          return `[${evt.timestamp}],[${evt.level}],[${evt.actor}],[${evt.action}],[${evt.model}],${dataStr},${reqIdStr}`;
        })
        .join("\n") + "\n";

    const filePath = this.getFilePath();
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.appendFile(filePath, lines);
    this.flushing = false;
  }
}

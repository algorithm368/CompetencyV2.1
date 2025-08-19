import fs from "fs";
import path from "path";
/** Interface for log entries */
export interface LogEvent {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  actor: string;
  action: string;
  model: string;
  data: any;
  requestId?: string;
}

/** Logger interface for DI */
export interface Logger {
  log(event: LogEvent): Promise<void>;
}
/** File-based JSON logger with batching & daily rotation */
export class FileLogger implements Logger {
  private buffer: LogEvent[] = [];
  private flushing = false;

  /**
   * @param dirPath - base directory for log files; defaults to "<project-root>/logs"
   * @param prefix   - filename prefix (e.g. "application")
   * @param daily    - whether to roll files daily
   */
  constructor(private readonly dirPath: string = path.resolve(process.cwd(), "logs"), private readonly prefix: string = "application", private readonly daily: boolean = true) {}

  public async log(event: LogEvent): Promise<void> {
    this.buffer.push(event);
    if (!this.flushing) {
      this.flushing = true;
      setTimeout(() => {
        this.flushBuffer().catch((err) => console.error("[FileLogger] Failed to flush buffer:", err));
      }, 1_000);
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
          const dataStr = `[${JSON.stringify(evt.data)}]`;
          const reqIdStr = evt.requestId ? `[${evt.requestId}]` : `[]`;
          return [`[${evt.timestamp}]`, `[${evt.level}]`, `[${evt.actor}]`, `[${evt.action}]`, `[${evt.model}]`, dataStr, reqIdStr].join(",");
        })
        .join("\n") + "\n";

    const filePath = this.getFilePath();
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.appendFile(filePath, lines);
    this.flushing = false;
  }
}

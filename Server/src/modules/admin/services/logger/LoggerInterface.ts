export interface LogEvent {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  actor: string;
  action: string;
  model: string;
  data: any;
  requestId?: string;
}

export interface Logger {
  log(event: LogEvent): Promise<void>;
}

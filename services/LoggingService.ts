export interface ILoggingService {
  logInfo(message: string, context?: Record<string, any>): Promise<void>
  logWarning(message: string, context?: Record<string, any>): Promise<void>
  logError(error: Error, context?: Record<string, any>): Promise<void>
  logActivity(activity: string, context?: Record<string, any>): Promise<void>
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  context: Record<string, any>
  source: string
}

export class LoggingService implements ILoggingService {
  private readonly logs: LogEntry[] = []
  private readonly maxLogSize = 10000

  async logInfo(message: string, context: Record<string, any> = {}): Promise<void> {
    await this.writeLog(LogLevel.INFO, message, context)
  }

  async logWarning(message: string, context: Record<string, any> = {}): Promise<void> {
    await this.writeLog(LogLevel.WARNING, message, context)
  }

  async logError(error: Error, context: Record<string, any> = {}): Promise<void> {
    await this.writeLog(LogLevel.ERROR, error.message, {
      ...context,
      stack: error.stack,
      errorType: error.constructor.name,
    })
  }

  async logActivity(activity: string, context: Record<string, any> = {}): Promise<void> {
    await this.writeLog(LogLevel.INFO, `Activity: ${activity}`, context)
  }

  private async writeLog(level: LogLevel, message: string, context: Record<string, any>): Promise<void> {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      source: "CoffeeMachine",
    }

    this.logs.push(logEntry)

    if (this.logs.length > this.maxLogSize) {
      this.logs.shift()
    }

    console.log(`[${LogLevel[level]}] ${message}`, context)
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter((log) => log.level >= level)
    }
    return [...this.logs]
  }
}

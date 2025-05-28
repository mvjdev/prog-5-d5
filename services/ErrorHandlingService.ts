import { type CoffeeMachineException, ErrorSeverity } from "../errors/CoffeeMachineExeption"
import type { ILoggingService } from "./LoggingService" 

export interface IErrorHandlingService {
  handleError(error: CoffeeMachineException): Promise<ErrorHandlingResult>
  registerErrorHandler(errorType: string, handler: ErrorHandler): void
  getErrorStatistics(): ErrorStatistics
}

export interface ErrorHandler {
  canHandle(error: CoffeeMachineException): boolean
  handle(error: CoffeeMachineException): Promise<ErrorHandlingResult>
}

export interface ErrorHandlingResult {
  handled: boolean
  recoveryAttempted: boolean
  userMessage: string
  technicalMessage: string
  nextActions: string[]
}

export interface ErrorStatistics {
  totalErrors: number
  errorsByType: Record<string, number>
  errorsBySeverity: Record<ErrorSeverity, number>
  recoveryRate: number
}

export class ErrorHandlingService implements IErrorHandlingService {
  private readonly errorHandlers = new Map<string, ErrorHandler>()
  private readonly errorHistory: CoffeeMachineException[] = []
  private readonly maxHistorySize = 1000

  constructor(private readonly loggingService: ILoggingService) {}

  async handleError(error: CoffeeMachineException): Promise<ErrorHandlingResult> {
    this.recordError(error)
    await this.loggingService.logError(error)
    const handler = this.findErrorHandler(error)

    if (handler) {
      return await handler.handle(error)
    }

    return this.handleUnknownError(error)
  }

  registerErrorHandler(errorType: string, handler: ErrorHandler): void {
    this.errorHandlers.set(errorType, handler)
  }

  getErrorStatistics(): ErrorStatistics {
    const totalErrors = this.errorHistory.length
    const errorsByType: Record<string, number> = {}
    const errorsBySeverity: Record<ErrorSeverity, number> = {
      [ErrorSeverity.LOW]: 0,
      [ErrorSeverity.MEDIUM]: 0,
      [ErrorSeverity.HIGH]: 0,
      [ErrorSeverity.CRITICAL]: 0,
    }

    this.errorHistory.forEach((error) => {
      errorsByType[error.code] = (errorsByType[error.code] || 0) + 1
      errorsBySeverity[error.severity]++
    })

    const recoveredErrors = this.errorHistory.filter((e) => e.isRecoverable()).length
    const recoveryRate = totalErrors > 0 ? recoveredErrors / totalErrors : 0

    return {
      totalErrors,
      errorsByType,
      errorsBySeverity,
      recoveryRate,
    }
  }

  private recordError(error: CoffeeMachineException): void {
    this.errorHistory.push(error)

    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift()
    }
  }

  private findErrorHandler(error: CoffeeMachineException): ErrorHandler | undefined {
    for (const [, handler] of this.errorHandlers) {
      if (handler.canHandle(error)) {
        return handler
      }
    }
    return undefined
  }

  private async handleUnknownError(error: CoffeeMachineException): Promise<ErrorHandlingResult> {
    return {
      handled: false,
      recoveryAttempted: false,
      userMessage: "Une erreur inattendue s'est produite. Veuillez contacter l'assistance.",
      technicalMessage: `Erreur non gérée: ${error.message}`,
      nextActions: ["Redémarrer la machine", "Contacter le support technique"],
    }
  }
}

export class ResourceErrorHandler implements ErrorHandler {
  canHandle(error: CoffeeMachineException): boolean {
    return error.code === "INSUFFICIENT_RESOURCE" || error.code === "EMPTY_WATER_RESERVOIR"
  }

  async handle(error: CoffeeMachineException): Promise<ErrorHandlingResult> {
    return {
      handled: true,
      recoveryAttempted: true,
      userMessage: "Ressources insuffisantes. Maintenance requise.",
      technicalMessage: error.message,
      nextActions: error.getRecoveryActions(),
    }
  }
}

export class PaymentErrorHandler implements ErrorHandler {
  canHandle(error: CoffeeMachineException): boolean {
    return error.code === "INSUFFICIENT_PAYMENT"
  }

  async handle(error: CoffeeMachineException): Promise<ErrorHandlingResult> {
    return {
      handled: true,
      recoveryAttempted: false,
      userMessage: "Paiement insuffisant. Veuillez insérer le montant manquant.",
      technicalMessage: error.message,
      nextActions: error.getRecoveryActions(),
    }
  }
}

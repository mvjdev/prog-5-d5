export abstract class CoffeeMachineException extends Error {
  public readonly code: string
  public readonly severity: ErrorSeverity
  public readonly timestamp: Date
  public readonly context: Record<string, any>

  constructor(
    message: string,
    code: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: Record<string, any> = {},
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.severity = severity
    this.timestamp = new Date()
    this.context = context
  }

  abstract getRecoveryActions(): string[]
  abstract isRecoverable(): boolean
}

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export class InsufficientResourceException extends CoffeeMachineException {
  constructor(resource: string, currentLevel: number, requiredLevel: number) {
    super(
      `Ressource insuffisante: ${resource}. Niveau actuel: ${currentLevel}%, requis: ${requiredLevel}%`,
      "INSUFFICIENT_RESOURCE",
      ErrorSeverity.HIGH,
      { resource, currentLevel, requiredLevel },
    )
  }

  getRecoveryActions(): string[] {
    return [
      "Contacter le service de maintenance",
      "Vérifier les niveaux de ressources",
      "Effectuer un réapprovisionnement",
    ]
  }

  isRecoverable(): boolean {
    return true
  }
}

export class PowerOutageException extends CoffeeMachineException {
  constructor() {
    super("Coupure de courant détectée", "POWER_OUTAGE", ErrorSeverity.CRITICAL)
  }

  getRecoveryActions(): string[] {
    return [
      "Vérifier l'alimentation électrique",
      "Activer le système de sauvegarde",
      "Effectuer un redémarrage sécurisé",
    ]
  }

  isRecoverable(): boolean {
    return true
  }
}

export class EmptyWaterReservoirException extends CoffeeMachineException {
  constructor(currentLevel: number) {
    super("Réservoir d'eau vide", "EMPTY_WATER_RESERVOIR", ErrorSeverity.HIGH, { currentLevel })
  }

  getRecoveryActions(): string[] {
    return ["Remplir le réservoir d'eau", "Vérifier les connexions hydrauliques", "Effectuer un cycle de nettoyage"]
  }

  isRecoverable(): boolean {
    return true
  }
}

export class InsufficientPaymentException extends CoffeeMachineException {
  constructor(required: number, provided: number) {
    super(
      `Paiement insuffisant. Requis: ${required}€, fourni: ${provided}€`,
      "INSUFFICIENT_PAYMENT",
      ErrorSeverity.LOW,
      { required, provided },
    )
  }

  getRecoveryActions(): string[] {
    return ["Insérer le montant manquant", "Sélectionner un café moins cher", "Annuler la transaction"]
  }

  isRecoverable(): boolean {
    return true
  }
}

export class InvalidSelectionException extends CoffeeMachineException {
  constructor(selection: string, validOptions: string[]) {
    super(`Sélection invalide: ${selection}`, "INVALID_SELECTION", ErrorSeverity.LOW, { selection, validOptions })
  }

  getRecoveryActions(): string[] {
    return ["Choisir parmi les options disponibles", "Consulter le menu", "Redémarrer la sélection"]
  }

  isRecoverable(): boolean {
    return true
  }
}

export class ProcessInterruptedException extends CoffeeMachineException {
  constructor(stage: string) {
    super(`Processus interrompu à l'étape: ${stage}`, "PROCESS_INTERRUPTED", ErrorSeverity.MEDIUM, { stage })
  }

  getRecoveryActions(): string[] {
    return ["Reprendre le processus", "Redémarrer la machine", "Contacter l'assistance"]
  }

  isRecoverable(): boolean {
    return true
  }
}

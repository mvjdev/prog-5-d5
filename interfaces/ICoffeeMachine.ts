export interface ICoffeeMachine {
  selectCoffee(coffeeType: string): Promise<boolean>
  validatePayment(amount: number): Promise<boolean>
  prepareCoffee(): Promise<boolean>
  getCurrentStatus(): MachineStatus
}

export interface IPaymentSystem {
  processPayment(amount: number, requiredAmount: number): Promise<PaymentResult>
  refundPayment(amount: number): Promise<boolean>
}

export interface IPreparationSystem {
  checkResourceAvailability(coffeeType: string): ResourceStatus
  prepareBeverage(coffeeType: string): Promise<PreparationResult>
  getSystemStatus(): SystemStatus
}

export interface IControlSystem {
  monitorSensors(): SensorData
  controlActuators(commands: ActuatorCommand[]): Promise<boolean>
  handleEmergencyShutdown(): Promise<void>
}

export interface IMaintenanceSystem {
  performDiagnostics(): Promise<DiagnosticResult>
  schedulePreventiveMaintenance(): void
  logMaintenanceActivity(activity: MaintenanceActivity): void
}

export enum MessageType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

export enum MachineStatus {
  READY = "ready",
  BUSY = "busy",
  MAINTENANCE = "maintenance",
  ERROR = "error",
  OFFLINE = "offline",
}

export interface PaymentResult {
  success: boolean
  change: number
  transactionId: string
}

export interface ResourceStatus {
  waterLevel: number
  coffeeLevel: number
  isAvailable: boolean
  estimatedServings: number
}

export interface PreparationResult {
  success: boolean
  preparationTime: number
  qualityScore: number
}

export interface SystemStatus {
  temperature: number
  pressure: number
  powerLevel: number
  isOperational: boolean
}

export interface SensorData {
  waterLevel: number
  coffeeLevel: number
  temperature: number
  pressure: number
  powerStatus: boolean
}

export interface ActuatorCommand {
  component: string
  action: string
  parameters: Record<string, any>
}

export interface DiagnosticResult {
  overallHealth: number
  issues: string[]
  recommendations: string[]
}

export interface MaintenanceActivity {
  type: string
  description: string
  timestamp: Date
  technician?: string
}

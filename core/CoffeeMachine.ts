import {
  type ICoffeeMachine,
  type IPreparationSystem,
  type IControlSystem,
  MachineStatus,
} from "../interfaces/ICoffeeMachine"
import type { IErrorHandlingService } from "../services/ErrorHandlingService"
import type { ILoggingService } from "../services/LoggingService"
import { CoffeeMenu, type CoffeeType } from "../data/CoffeeMenu"
import { CoffeeMachineException } from "../errors/CoffeeMachineExeption" 

export class CoffeeMachine implements ICoffeeMachine {
  private currentStatus: MachineStatus = MachineStatus.READY
  private selectedCoffee: string | null = null
  private paymentAmount = 0

  constructor(
    private readonly preparationSystem: IPreparationSystem,
    private readonly controlSystem: IControlSystem,
    private readonly errorHandler: IErrorHandlingService,
    private readonly logger: ILoggingService,
  ) {
    this.initializeMachine()
  }

  async selectCoffee(coffeeType: string): Promise<boolean> {
    try {
      await this.logger.logActivity("Coffee selection started", { coffeeType })

      const coffee = CoffeeMenu.getCoffeeByType(coffeeType as CoffeeType)
      if (!coffee) {
        throw new Error(`Type de café invalide: ${coffeeType}`)
      }

      const resourceStatus = this.preparationSystem.checkResourceAvailability(coffeeType)
      if (!resourceStatus.isAvailable) {
        console.log(`Ressources insuffisantes pour ${coffee.name}`)
        return false
      }

      this.selectedCoffee = coffeeType
      console.log(`${coffee.name} sélectionné - Prix: ${coffee.price.toFixed(2)}€`)

      await this.logger.logActivity("Coffee selected successfully", {
        coffeeType,
        price: coffee.price,
      })

      return true
    } catch (error) {
      if (error instanceof CoffeeMachineException) {
        await this.errorHandler.handleError(error)
      } else {
        await this.logger.logError(error as Error)
      }
      return false
    }
  }

  async validatePayment(amount: number): Promise<boolean> {
    try {
      if (!this.selectedCoffee) {
        throw new Error("Aucun café sélectionné")
      }

      const coffee = CoffeeMenu.getCoffeeByType(this.selectedCoffee as CoffeeType)!

      if (amount < coffee.price) {
        console.log(`Paiement insuffisant. Requis: ${coffee.price.toFixed(2)}€, fourni: ${amount.toFixed(2)}€`)
        return false
      }

      this.paymentAmount = amount
      const change = amount - coffee.price

      if (change > 0) {
        console.log(`Paiement accepté. Monnaie: ${change.toFixed(2)}€`)
      } else {
        console.log("Paiement accepté")
      }

      await this.logger.logActivity("Payment validated", {
        amount,
        coffeePrice: coffee.price,
        change,
      })

      return true
    } catch (error) {
      await this.logger.logError(error as Error)
      return false
    }
  }

  async prepareCoffee(): Promise<boolean> {
    if (!this.selectedCoffee || this.paymentAmount === 0) {
      console.log("Sélection ou paiement manquant")
      return false
    }

    try {
      this.currentStatus = MachineStatus.BUSY
      console.log("Préparation en cours...")

      const result = await this.preparationSystem.prepareBeverage(this.selectedCoffee)

      if (result.success) {
        console.log(`Votre café est prêt ! Qualité: ${result.qualityScore}/100`)

        await this.logger.logActivity("Coffee prepared successfully", {
          coffeeType: this.selectedCoffee,
          preparationTime: result.preparationTime,
          qualityScore: result.qualityScore,
        })

        this.resetForNextOrder()
        return true
      } else {
        console.log("Erreur lors de la préparation")
        return false
      }
    } catch (error) {
      if (error instanceof CoffeeMachineException) {
        await this.errorHandler.handleError(error)
      } else {
        await this.logger.logError(error as Error)
      }

      this.currentStatus = MachineStatus.ERROR
      return false
    } finally {
      if (this.currentStatus !== MachineStatus.ERROR) {
        this.currentStatus = MachineStatus.READY
      }
    }
  }

  getCurrentStatus(): MachineStatus {
    return this.currentStatus
  }

  async performFullCycle(coffeeType: string, paymentAmount: number): Promise<boolean> {
    const selectionSuccess = await this.selectCoffee(coffeeType)
    if (!selectionSuccess) return false

    const paymentSuccess = await this.validatePayment(paymentAmount)
    if (!paymentSuccess) return false

    return await this.prepareCoffee()
  }

  async performMaintenance(): Promise<void> {
    this.currentStatus = MachineStatus.MAINTENANCE
    console.log("Mode maintenance activé")

    await this.logger.logActivity("Maintenance started")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    this.currentStatus = MachineStatus.READY
    console.log("Maintenance terminée")

    await this.logger.logActivity("Maintenance completed")
  }

  private async initializeMachine(): Promise<void> {
    await this.logger.logActivity("Machine initialization started")
    const sensorData = this.controlSystem.monitorSensors()

    if (!sensorData.powerStatus) {
      this.currentStatus = MachineStatus.OFFLINE
    }

    await this.logger.logActivity("Machine initialized", {
      status: this.currentStatus,
      sensorData,
    })
  }

  private resetForNextOrder(): void {
    this.selectedCoffee = null
    this.paymentAmount = 0
    this.currentStatus = MachineStatus.READY
  }
}

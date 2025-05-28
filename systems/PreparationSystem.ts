import type { IPreparationSystem, ResourceStatus, PreparationResult, SystemStatus } from "../interfaces/ICoffeeMachine"
import { CoffeeMenu, type CoffeeType } from "../data/CoffeeMenu"
import { InsufficientResourceException, EmptyWaterReservoirException } from "../errors/CoffeeMachineExeption"

export class BeveragePreparationSystem implements IPreparationSystem {
  private readonly resourceLevels = {
    water: 100,
    coffee: 100,
    milk: 100,
  }

  private readonly systemStatus: SystemStatus = {
    temperature: 20,
    pressure: 0,
    powerLevel: 100,
    isOperational: true,
  }

  checkResourceAvailability(coffeeType: string): ResourceStatus {
    const coffee = CoffeeMenu.getCoffeeByType(coffeeType as CoffeeType)
    if (!coffee) {
      return {
        waterLevel: this.resourceLevels.water,
        coffeeLevel: this.resourceLevels.coffee,
        isAvailable: false,
        estimatedServings: 0,
      }
    }

    const waterServings = Math.floor(this.resourceLevels.water / coffee.waterRequired)
    const coffeeServings = Math.floor(this.resourceLevels.coffee / coffee.coffeeRequired)
    const estimatedServings = Math.min(waterServings, coffeeServings)

    const isAvailable =
      this.resourceLevels.water >= coffee.waterRequired && this.resourceLevels.coffee >= coffee.coffeeRequired

    return {
      waterLevel: this.resourceLevels.water,
      coffeeLevel: this.resourceLevels.coffee,
      isAvailable,
      estimatedServings,
    }
  }

  async prepareBeverage(coffeeType: string): Promise<PreparationResult> {
    const coffee = CoffeeMenu.getCoffeeByType(coffeeType as CoffeeType)
    if (!coffee) {
      throw new Error(`Type de café inconnu: ${coffeeType}`)
    }

    await this.validateResources(coffee.waterRequired, coffee.coffeeRequired)

    const startTime = Date.now()
    console.log(`☕ Début de préparation: ${coffee.name}`)

    try {
      await this.heatWater()
      await this.grindCoffee()
      await this.extractCoffee(coffee)

      this.consumeResources(coffee.waterRequired, coffee.coffeeRequired)

      const preparationTime = Date.now() - startTime
      const qualityScore = this.calculateQualityScore()

      console.log(`✅ ${coffee.name} prêt en ${preparationTime}ms`)

      return {
        success: true,
        preparationTime,
        qualityScore,
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la préparation: ${error.message}`)
      return {
        success: false,
        preparationTime: Date.now() - startTime,
        qualityScore: 0,
      }
    }
  }

  getSystemStatus(): SystemStatus {
    return { ...this.systemStatus }
  }

  private async validateResources(waterRequired: number, coffeeRequired: number): Promise<void> {
    if (this.resourceLevels.water < waterRequired) {
      if (this.resourceLevels.water === 0) {
        throw new EmptyWaterReservoirException(this.resourceLevels.water)
      }
      throw new InsufficientResourceException("water", this.resourceLevels.water, waterRequired)
    }

    if (this.resourceLevels.coffee < coffeeRequired) {
      throw new InsufficientResourceException("coffee", this.resourceLevels.coffee, coffeeRequired)
    }
  }

  private async heatWater(): Promise<void> {
    console.log("🔥 Chauffage de l'eau...")
    this.systemStatus.temperature = 90
    await this.simulateDelay(2000)
  }

  private async grindCoffee(): Promise<void> {
    console.log("⚙️ Mouture du café...")
    await this.simulateDelay(1500)
  }

  private async extractCoffee(coffee: any): Promise<void> {
    console.log(`☕ Extraction du ${coffee.name}...`)
    this.systemStatus.pressure = 9
    await this.simulateDelay(coffee.preparationTime || 3000)
  }

  private consumeResources(waterRequired: number, coffeeRequired: number): void {
    this.resourceLevels.water -= waterRequired
    this.resourceLevels.coffee -= coffeeRequired

    this.resourceLevels.water = Math.max(0, this.resourceLevels.water)
    this.resourceLevels.coffee = Math.max(0, this.resourceLevels.coffee)
  }

  private calculateQualityScore(): number {
    const tempScore = this.systemStatus.temperature >= 85 && this.systemStatus.temperature <= 95 ? 50 : 30
    const pressureScore = this.systemStatus.pressure >= 8 && this.systemStatus.pressure <= 10 ? 50 : 30

    return tempScore + pressureScore
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  refillResources(): void {
    this.resourceLevels.water = 100
    this.resourceLevels.coffee = 100
    this.resourceLevels.milk = 100
    console.log("🔄 Ressources rechargées")
  }

  setResourceLevel(resource: keyof typeof this.resourceLevels, level: number): void {
    this.resourceLevels[resource] = Math.max(0, Math.min(100, level))
  }

  getResourceLevels(): typeof this.resourceLevels {
    return { ...this.resourceLevels }
  }
}

import type { IControlSystem, SensorData, ActuatorCommand } from "../interfaces/ICoffeeMachine"
import { PowerOutageException } from "../errors/CoffeeMachineExeption" 

export class MachineControlSystem implements IControlSystem {
  private sensorData: SensorData = {
    waterLevel: 100,
    coffeeLevel: 100,
    temperature: 20,
    pressure: 0,
    powerStatus: true,
  }

  private readonly temperatureThresholds = {
    min: 85,
    max: 95,
    optimal: 90,
  }

  private readonly pressureThresholds = {
    min: 8,
    max: 10,
    optimal: 9,
  }

  monitorSensors(): SensorData {
    this.updateSensorReadings()
    return { ...this.sensorData }
  }

  async controlActuators(commands: ActuatorCommand[]): Promise<boolean> {
    if (!this.sensorData.powerStatus) {
      throw new PowerOutageException()
    }

    try {
      for (const command of commands) {
        await this.executeActuatorCommand(command)
      }
      return true
    } catch (error) {
      console.error("Erreur lors du contrôle des actionneurs:", error)
      return false
    }
  }

  async handleEmergencyShutdown(): Promise<void> {
    console.log("🚨 ARRÊT D'URGENCE ACTIVÉ")

    await this.executeActuatorCommand({
      component: "heater",
      action: "stop",
      parameters: {},
    })

    await this.executeActuatorCommand({
      component: "pump",
      action: "stop",
      parameters: {},
    })

    await this.executeActuatorCommand({
      component: "grinder",
      action: "stop",
      parameters: {},
    })

    console.log("✅ Arrêt d'urgence terminé")
  }

  private updateSensorReadings(): void {
    this.sensorData.temperature += (Math.random() - 0.5) * 2
    this.sensorData.pressure += (Math.random() - 0.5) * 0.5

    if (Math.random() < 0.1) {
      this.sensorData.waterLevel = Math.max(0, this.sensorData.waterLevel - Math.random() * 5)
      this.sensorData.coffeeLevel = Math.max(0, this.sensorData.coffeeLevel - Math.random() * 3)
    }

    if (Math.random() < 0.001) {
      this.sensorData.powerStatus = false
    }
  }

  private async executeActuatorCommand(command: ActuatorCommand): Promise<void> {
    console.log(`🔧 Exécution: ${command.component}.${command.action}`, command.parameters)
    await new Promise((resolve) => setTimeout(resolve, 100))
    this.updateSensorDataFromCommand(command)
  }

  private updateSensorDataFromCommand(command: ActuatorCommand): void {
    switch (command.component) {
      case "heater":
        if (command.action === "start") {
          this.sensorData.temperature = this.temperatureThresholds.optimal
        }
        break
      case "pump":
        if (command.action === "start") {
          this.sensorData.pressure = this.pressureThresholds.optimal
        }
        break
    }
  }

  simulatePowerOutage(): void {
    this.sensorData.powerStatus = false
  }

  restorePower(): void {
    this.sensorData.powerStatus = true
  }

  setResourceLevel(resource: "water" | "coffee", level: number): void {
    if (resource === "water") {
      this.sensorData.waterLevel = Math.max(0, Math.min(100, level))
    } else {
      this.sensorData.coffeeLevel = Math.max(0, Math.min(100, level))
    }
  }
}

import { CoffeeMachine } from "../core/CoffeeMachine"
import { BeveragePreparationSystem } from "../systems/PreparationSystem"
import { MachineControlSystem } from "../systems/ControlSystem"
import { ErrorHandlingService, ResourceErrorHandler, PaymentErrorHandler } from "../services/ErrorHandlingService"
import { LoggingService } from "../services/LoggingService"
import { CoffeeType } from "../data/CoffeeMenu"

async function demonstrateArchitecture(): Promise<void> {
  console.log("🏗️ DÉMONSTRATION ARCHITECTURE MACHINE À CAFÉ")
  console.log("=".repeat(50))

  const logger = new LoggingService()
  const errorHandler = new ErrorHandlingService(logger)
  const preparationSystem = new BeveragePreparationSystem()
  const controlSystem = new MachineControlSystem()

  errorHandler.registerErrorHandler("resource", new ResourceErrorHandler())
  errorHandler.registerErrorHandler("payment", new PaymentErrorHandler())

  const coffeeMachine = new CoffeeMachine(preparationSystem, controlSystem, errorHandler, logger)

  console.log("\n📋 CAS D'UTILISATION PRINCIPAUX")
  console.log("-".repeat(30))

  console.log("\n✅ SCÉNARIO DE SUCCÈS")
  const successResult = await coffeeMachine.performFullCycle(CoffeeType.CAPPUCCINO, 3.0)
  console.log(`Résultat: ${successResult ? "Succès" : "Échec"}`)

  console.log("\n❌ GESTION DES ERREURS")
  console.log("-".repeat(30))

  preparationSystem.setResourceLevel("water", 0)
  const errorResult = await coffeeMachine.performFullCycle(CoffeeType.LATTE, 3.5)
  console.log(`Résultat avec erreur: ${errorResult ? "Succès" : "Échec"}`)

  preparationSystem.refillResources()

  console.log("\n🔧 MAINTENANCE PRÉVENTIVE")
  console.log("-".repeat(30))
  await coffeeMachine.performMaintenance()

  console.log("\n📊 STATISTIQUES ET MONITORING")
  console.log("-".repeat(30))

  const errorStats = errorHandler.getErrorStatistics()
  console.log("Statistiques d'erreurs:", errorStats)

  const logs = logger.getLogs()
  console.log(`Nombre de logs: ${logs.length}`)

  const systemStatus = preparationSystem.getSystemStatus()
  console.log("État du système:", systemStatus)

  console.log("\n🎉 DÉMONSTRATION TERMINÉE")
}

if (require.main === module) {
  demonstrateArchitecture().catch(console.error)
}

export { demonstrateArchitecture }

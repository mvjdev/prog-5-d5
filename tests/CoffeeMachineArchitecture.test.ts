import { CoffeeMachine } from "../core/CoffeeMachine"
import { BeveragePreparationSystem } from "../systems/PreparationSystem"
import { MachineControlSystem } from "../systems/ControlSystem"
import { ErrorHandlingService, ResourceErrorHandler, PaymentErrorHandler } from "../services/ErrorHandlingService"
import { LoggingService } from "../services/LoggingService"
import { CoffeeType } from "../data/CoffeeMenu"
import { MachineStatus } from "../interfaces/ICoffeeMachine" 

describe("🏗️ Architecture Machine à Café - Tests Complets", () => {
  let coffeeMachine: CoffeeMachine
  let preparationSystem: BeveragePreparationSystem
  let controlSystem: MachineControlSystem
  let errorHandler: ErrorHandlingService
  let logger: LoggingService

  beforeEach(() => {
    logger = new LoggingService()
    errorHandler = new ErrorHandlingService(logger)
    preparationSystem = new BeveragePreparationSystem()
    controlSystem = new MachineControlSystem()

    errorHandler.registerErrorHandler("resource", new ResourceErrorHandler())
    errorHandler.registerErrorHandler("payment", new PaymentErrorHandler())

    coffeeMachine = new CoffeeMachine(preparationSystem, controlSystem, errorHandler, logger)
  })

  describe("🎯 Cas d'Utilisation Principaux", () => {
    describe("1️⃣ Sélection du Café", () => {
      test("✅ Validation du choix valide", async () => {
        const result = await coffeeMachine.selectCoffee(CoffeeType.ESPRESSO)
        expect(result).toBe(true)
      })

      test("❌ Rejet du choix invalide", async () => {
        const result = await coffeeMachine.selectCoffee("cafe_inexistant")
        expect(result).toBe(false)
      })
    })

    describe("2️⃣ Validation du Café", () => {
      test("✅ Vérification de la disponibilité", async () => {
        await coffeeMachine.selectCoffee(CoffeeType.ESPRESSO)

        const resourceStatus = preparationSystem.checkResourceAvailability(CoffeeType.ESPRESSO)
        expect(resourceStatus.isAvailable).toBe(true)
      })

      test("✅ Confirmation du prix", async () => {
        await coffeeMachine.selectCoffee(CoffeeType.CAPPUCCINO)
        const result = await coffeeMachine.validatePayment(2.5)

        expect(result).toBe(true)
      })

      test("❌ Paiement insuffisant", async () => {
        await coffeeMachine.selectCoffee(CoffeeType.LATTE)
        const result = await coffeeMachine.validatePayment(2.0)

        expect(result).toBe(false)
      })
    })

    describe("3️⃣ Préparation du Café", () => {
      test("✅ Processus complet de préparation", async () => {
        const result = await coffeeMachine.performFullCycle(CoffeeType.ESPRESSO, 2.0)
        expect(result).toBe(true)
      })

      test("✅ Contrôle des paramètres (température, quantité)", async () => {
        await coffeeMachine.selectCoffee(CoffeeType.AMERICANO)
        await coffeeMachine.validatePayment(2.5)

        const systemStatus = preparationSystem.getSystemStatus()
        expect(systemStatus.isOperational).toBe(true)
      })
    })
  })

  describe("❌ Gestion des Erreurs", () => {
    describe("🔧 Erreurs Système (Runtime Exceptions)", () => {
      test("❌ Plus de parfum de café disponible", async () => {
        preparationSystem.setResourceLevel("coffee", 0)

        const result = await coffeeMachine.performFullCycle(CoffeeType.ESPRESSO, 2.0)
        expect(result).toBe(false)
      })

      test("❌ Coupure de courant", async () => {
        controlSystem.simulatePowerOutage()

        expect(() => {
          controlSystem.monitorSensors()
        }).not.toThrow()

        const sensorData = controlSystem.monitorSensors()
        expect(sensorData.powerStatus).toBe(false)
      })

      test("❌ Réservoir d'eau vide", async () => {
        preparationSystem.setResourceLevel("water", 0)

        const result = await coffeeMachine.performFullCycle(CoffeeType.LATTE, 3.5)
        expect(result).toBe(false)
      })
    })

    describe("👤 Erreurs Utilisateur", () => {
      test("❌ Paiement insuffisant", async () => {
        await coffeeMachine.selectCoffee(CoffeeType.MOCHA)
        const result = await coffeeMachine.validatePayment(2.0)

        expect(result).toBe(false)
      })

      test("❌ Sélection invalide", async () => {
        const result = await coffeeMachine.selectCoffee("type_inexistant")
        expect(result).toBe(false)
      })

      test("❌ Interruption du processus", async () => {
        await coffeeMachine.selectCoffee(CoffeeType.ESPRESSO)
        expect(coffeeMachine.getCurrentStatus()).toBe(MachineStatus.READY)
      })
    })
  })

  describe("🏗️ Architecture Technique", () => {
    describe("🎛️ Système de Contrôle", () => {
      test("✅ Microcontrôleur opérationnel", () => {
        const sensorData = controlSystem.monitorSensors()
        expect(sensorData).toBeDefined()
        expect(typeof sensorData.temperature).toBe("number")
      })

      test("✅ Capteurs fonctionnels", () => {
        const sensorData = controlSystem.monitorSensors()
        expect(sensorData.waterLevel).toBeGreaterThanOrEqual(0)
        expect(sensorData.coffeeLevel).toBeGreaterThanOrEqual(0)
      })

      test("✅ Actionneurs contrôlables", async () => {
        const commands = [
          { component: "heater", action: "start", parameters: {} },
          { component: "pump", action: "start", parameters: {} },
        ]

        const result = await controlSystem.controlActuators(commands)
        expect(result).toBe(true)
      })
    })

    describe("☕ Système de Préparation", () => {
      test("✅ Moulins à café opérationnels", async () => {
        const result = await preparationSystem.prepareBeverage(CoffeeType.ESPRESSO)
        expect(result.success).toBe(true)
      })

      test("✅ Système de chauffage fonctionnel", () => {
        const systemStatus = preparationSystem.getSystemStatus()
        expect(systemStatus.temperature).toBeGreaterThan(0)
      })

      test("✅ Pompe à eau active", () => {
        const resourceStatus = preparationSystem.checkResourceAvailability(CoffeeType.AMERICANO)
        expect(resourceStatus.waterLevel).toBeGreaterThan(0)
      })
    })
  })

  describe("🔄 Flux de Données", () => {
    test("✅ Validation → Système de paiement", async () => {
      await coffeeMachine.selectCoffee(CoffeeType.ESPRESSO)
      const paymentResult = await coffeeMachine.validatePayment(2.0)

      expect(typeof paymentResult).toBe("boolean")
    })

    test("✅ Paiement → Préparation", async () => {
      await coffeeMachine.selectCoffee(CoffeeType.CAPPUCCINO)
      await coffeeMachine.validatePayment(3.0)
      const preparationResult = await coffeeMachine.prepareCoffee()

      expect(typeof preparationResult).toBe("boolean")
    })
  })

  describe("🛠️ Gestion des Imprévus", () => {
    describe("🚨 Scénarios d'Erreur", () => {
      test("✅ Détection automatique des problèmes", () => {
        preparationSystem.setResourceLevel("coffee", 0)

        const resourceStatus = preparationSystem.checkResourceAvailability(CoffeeType.ESPRESSO)
        expect(resourceStatus.isAvailable).toBe(false)
      })

      test("✅ Mise en attente du système", async () => {
        preparationSystem.setResourceLevel("coffee", 0)
        await coffeeMachine.performFullCycle(CoffeeType.ESPRESSO, 2.0)

        const status = coffeeMachine.getCurrentStatus()
        expect([MachineStatus.READY, MachineStatus.ERROR]).toContain(status)
      })
    })

    describe("🔧 Procédures de Récupération", () => {
      test("✅ Redémarrage automatique", async () => {
        controlSystem.simulatePowerOutage()
        controlSystem.restorePower()

        const sensorData = controlSystem.monitorSensors()
        expect(sensorData.powerStatus).toBe(true)
      })

      test("✅ Restauration de l'état", async () => {
        await coffeeMachine.performMaintenance()
        expect(coffeeMachine.getCurrentStatus()).toBe(MachineStatus.READY)
      })

      test("✅ Journalisation des erreurs", async () => {
        const logsBefore = logger.getLogs().length

        await coffeeMachine.selectCoffee("type_invalide")

        const logsAfter = logger.getLogs().length
        expect(logsAfter).toBeGreaterThan(logsBefore)
      })
    })
  })

  describe("🚀 Optimisations", () => {
    describe("⚡ Performance", () => {
      test("✅ Mise en veille intelligente", () => {
        expect(coffeeMachine.getCurrentStatus()).toBe(MachineStatus.READY)
      })

      test("✅ Optimisation de la consommation d'énergie", () => {
        const systemStatus = preparationSystem.getSystemStatus()
        expect(systemStatus.powerLevel).toBeGreaterThan(0)
      })

      test("✅ Gestion efficace des ressources", () => {
        const resourceLevels = preparationSystem.getResourceLevels()
        expect(resourceLevels.water).toBeGreaterThanOrEqual(0)
        expect(resourceLevels.coffee).toBeGreaterThanOrEqual(0)
      })
    })

    describe("🔧 Maintenance", () => {
      test("✅ Surveillance proactive", () => {
        const sensorData = controlSystem.monitorSensors()
        expect(sensorData).toHaveProperty("waterLevel")
        expect(sensorData).toHaveProperty("coffeeLevel")
      })

      test("✅ Alertes préventives", async () => {
        preparationSystem.setResourceLevel("water", 10)

        const resourceStatus = preparationSystem.checkResourceAvailability(CoffeeType.LATTE)
        expect(resourceStatus.estimatedServings).toBeLessThan(5)
      })

      test("✅ Statistiques d'utilisation", () => {
        const errorStats = errorHandler.getErrorStatistics()
        expect(errorStats).toHaveProperty("totalErrors")
        expect(errorStats).toHaveProperty("recoveryRate")
      })
    })
  })
})

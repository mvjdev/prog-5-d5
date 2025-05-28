"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeeMachine = void 0;
const CoffeeMachineErrors_1 = require("../errors/CoffeeMachineErrors");
class CoffeeMachine {
    constructor() {
        this.coffeeLevel = 100; // Pourcentage de café restant
        this.waterLevel = 100; // Pourcentage d'eau restante
        this.isInterfaceActive = true;
        this.hasPower = true;
        this.validCoffeeTypes = ["espresso", "americano", "cappuccino", "latte"];
        console.log("🔌 Machine à café initialisée");
    }
    // Vérification de l'état général de la machine
    checkMachineStatus() {
        if (!this.hasPower) {
            throw new CoffeeMachineErrors_1.PowerOutageError();
        }
        if (!this.isInterfaceActive) {
            throw new CoffeeMachineErrors_1.InterfaceNotActiveError();
        }
    }
    // Validation du paiement
    validatePayment(amount, coffee) {
        try {
            this.checkMachineStatus();
            if (amount < coffee.price) {
                throw new CoffeeMachineErrors_1.InsufficientPaymentError(coffee.price, amount);
            }
            console.log(`✅ Paiement accepté: ${amount.toFixed(2)}€`);
            if (amount > coffee.price) {
                console.log(`💰 Monnaie rendue: ${(amount - coffee.price).toFixed(2)}€`);
            }
            return true;
        }
        catch (error) {
            console.error(`❌ ${error.message}`);
            return false;
        }
    }
    // Vérification de la disponibilité des ressources
    canPrepare(coffee) {
        try {
            this.checkMachineStatus();
            // Vérifier si le type de café est valide
            if (!this.validCoffeeTypes.includes(coffee.type.toLowerCase())) {
                throw new CoffeeMachineErrors_1.UnknownCoffeeTypeError(coffee.type);
            }
            // Vérifier les niveaux de ressources
            if (this.coffeeLevel < coffee.coffeeRequired) {
                throw new CoffeeMachineErrors_1.OutOfCoffeeError();
            }
            if (this.waterLevel < coffee.waterRequired) {
                throw new CoffeeMachineErrors_1.OutOfWaterError();
            }
            return true;
        }
        catch (error) {
            console.error(`❌ ${error.message}`);
            if (error instanceof CoffeeMachineErrors_1.OutOfCoffeeError || error instanceof CoffeeMachineErrors_1.OutOfWaterError) {
                console.log("🔧 Veuillez contacter la maintenance");
            }
            else if (error instanceof CoffeeMachineErrors_1.UnknownCoffeeTypeError) {
                console.log("📋 Types de café disponibles:", this.validCoffeeTypes.join(", "));
            }
            return false;
        }
    }
    // Préparation du café
    prepare(coffee) {
        try {
            this.checkMachineStatus();
            if (!this.canPrepare(coffee)) {
                return;
            }
            console.log(`☕ Préparation de votre ${coffee.name}...`);
            // Consommer les ressources
            this.coffeeLevel -= coffee.coffeeRequired;
            this.waterLevel -= coffee.waterRequired;
            // Simulation du temps de préparation
            setTimeout(() => {
                console.log(`✅ Votre ${coffee.name} est prêt !`);
            }, 2000);
        }
        catch (error) {
            console.error(`❌ Impossible de préparer le café: ${error.message}`);
        }
    }
    // Affichage du statut de la machine
    showStatus() {
        console.log("\n📊 STATUT DE LA MACHINE");
        console.log(`☕ Niveau de café: ${this.coffeeLevel}%`);
        console.log(`💧 Niveau d'eau: ${this.waterLevel}%`);
        console.log(`🔌 Alimentation: ${this.hasPower ? "OK" : "PANNE"}`);
        console.log(`📱 Interface: ${this.isInterfaceActive ? "ACTIVE" : "INACTIVE"}`);
    }
    // Méthodes pour simuler les pannes (pour les tests)
    simulatePowerOutage() {
        this.hasPower = false;
        console.log("⚡ Simulation: Panne de courant");
    }
    restorePower() {
        this.hasPower = true;
        console.log("🔌 Alimentation restaurée");
    }
    deactivateInterface() {
        this.isInterfaceActive = false;
        console.log("📱 Interface désactivée");
    }
    activateInterface() {
        this.isInterfaceActive = true;
        console.log("📱 Interface activée");
    }
    setCoffeeLevel(level) {
        this.coffeeLevel = Math.max(0, Math.min(100, level));
    }
    setWaterLevel(level) {
        this.waterLevel = Math.max(0, Math.min(100, level));
    }
    restart() {
        console.log("🔄 Redémarrage de la machine...");
        this.isInterfaceActive = true;
        this.hasPower = true;
        console.log("✅ Machine redémarrée avec succès");
    }
}
exports.CoffeeMachine = CoffeeMachine;
//# sourceMappingURL=CoffeeMachine.js.map
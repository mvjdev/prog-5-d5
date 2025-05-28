"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeeMachine = void 0;
class CoffeeMachine {
    constructor(initialWater = 1000, initialCoffeeBeans = 500) {
        this.water = initialWater;
        this.coffeeBeans = initialCoffeeBeans;
        this.powerOn = true;
        this.interfaceActive = true;
    }
    validatePayment(amount, coffee) {
        if (amount < coffee.price) {
            console.log("💸 Paiement insuffisant.");
            return false;
        }
        return true;
    }
    canPrepare(coffee) {
        if (!this.powerOn) {
            console.log("⚠️ Panne de courant.");
            return false;
        }
        if (!this.interfaceActive) {
            console.log("⚠️ Interface inactive.");
            return false;
        }
        if (this.water < coffee.waterRequired) {
            console.log("🚱 Plus d'eau.");
            return false;
        }
        if (this.coffeeBeans < coffee.coffeeRequired) {
            console.log("☕ Plus de grains de café.");
            return false;
        }
        return true;
    }
    prepare(coffee) {
        this.water -= coffee.waterRequired;
        this.coffeeBeans -= coffee.coffeeRequired;
        console.log(`✅ Votre ${coffee.name} est prêt. Bonne dégustation !`);
    }
    showStatus() {
        console.log(`🔋 Eau: ${this.water}ml | ☕ Café: ${this.coffeeBeans}g`);
    }
}
exports.CoffeeMachine = CoffeeMachine;
//# sourceMappingURL=CoffeMachine.js.map
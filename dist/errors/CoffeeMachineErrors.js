"use strict";
// Classes d'erreurs personnalisées pour la machine à café
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownCoffeeTypeError = exports.PowerOutageError = exports.InterfaceNotActiveError = exports.OutOfWaterError = exports.OutOfCoffeeError = exports.InsufficientPaymentError = exports.CoffeeMachineError = void 0;
class CoffeeMachineError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "CoffeeMachineError";
    }
}
exports.CoffeeMachineError = CoffeeMachineError;
class InsufficientPaymentError extends CoffeeMachineError {
    constructor(required, provided) {
        super(`Paiement insuffisant. Requis: ${required.toFixed(2)}€, fourni: ${provided.toFixed(2)}€`, "INSUFFICIENT_PAYMENT");
    }
}
exports.InsufficientPaymentError = InsufficientPaymentError;
class OutOfCoffeeError extends CoffeeMachineError {
    constructor() {
        super("Plus de café disponible. Maintenance requise.", "OUT_OF_COFFEE");
    }
}
exports.OutOfCoffeeError = OutOfCoffeeError;
class OutOfWaterError extends CoffeeMachineError {
    constructor() {
        super("Plus d'eau disponible. Maintenance requise.", "OUT_OF_WATER");
    }
}
exports.OutOfWaterError = OutOfWaterError;
class InterfaceNotActiveError extends CoffeeMachineError {
    constructor() {
        super("Interface non active. Redémarrage nécessaire.", "INTERFACE_NOT_ACTIVE");
    }
}
exports.InterfaceNotActiveError = InterfaceNotActiveError;
class PowerOutageError extends CoffeeMachineError {
    constructor() {
        super("Panne de courant. Veuillez attendre ou contacter un technicien.", "POWER_OUTAGE");
    }
}
exports.PowerOutageError = PowerOutageError;
class UnknownCoffeeTypeError extends CoffeeMachineError {
    constructor(coffeeType) {
        super(`Type de café non reconnu: ${coffeeType}`, "UNKNOWN_COFFEE_TYPE");
    }
}
exports.UnknownCoffeeTypeError = UnknownCoffeeTypeError;
//# sourceMappingURL=CoffeeMachineErrors.js.map
export declare class CoffeeMachineError extends Error {
    code: string;
    constructor(message: string, code: string);
}
export declare class InsufficientPaymentError extends CoffeeMachineError {
    constructor(required: number, provided: number);
}
export declare class OutOfCoffeeError extends CoffeeMachineError {
    constructor();
}
export declare class OutOfWaterError extends CoffeeMachineError {
    constructor();
}
export declare class InterfaceNotActiveError extends CoffeeMachineError {
    constructor();
}
export declare class PowerOutageError extends CoffeeMachineError {
    constructor();
}
export declare class UnknownCoffeeTypeError extends CoffeeMachineError {
    constructor(coffeeType: string);
}
//# sourceMappingURL=CoffeeMachineErrors.d.ts.map
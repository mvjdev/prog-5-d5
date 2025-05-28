import type { Coffee } from "../types/Coffee";
export declare class CoffeeMachine {
    private coffeeLevel;
    private waterLevel;
    private isInterfaceActive;
    private hasPower;
    private validCoffeeTypes;
    constructor();
    private checkMachineStatus;
    validatePayment(amount: number, coffee: Coffee): boolean;
    canPrepare(coffee: Coffee): boolean;
    prepare(coffee: Coffee): void;
    showStatus(): void;
    simulatePowerOutage(): void;
    restorePower(): void;
    deactivateInterface(): void;
    activateInterface(): void;
    setCoffeeLevel(level: number): void;
    setWaterLevel(level: number): void;
    restart(): void;
}
//# sourceMappingURL=CoffeeMachine.d.ts.map
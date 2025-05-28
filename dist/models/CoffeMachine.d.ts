import { CoffeeType } from "../type/CoffeeType";
export declare class CoffeeMachine {
    private water;
    private coffeeBeans;
    private powerOn;
    private interfaceActive;
    constructor(initialWater?: number, initialCoffeeBeans?: number);
    validatePayment(amount: number, coffee: CoffeeType): boolean;
    canPrepare(coffee: CoffeeType): boolean;
    prepare(coffee: CoffeeType): void;
    showStatus(): void;
}
//# sourceMappingURL=CoffeMachine.d.ts.map
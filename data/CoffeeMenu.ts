export enum CoffeeType {
  ESPRESSO = "espresso",
  AMERICANO = "americano",
  CAPPUCCINO = "cappuccino",
  LATTE = "latte",
  MACCHIATO = "macchiato",
  MOCHA = "mocha",
}

export interface Coffee {
  type: CoffeeType
  name: string
  description: string
  price: number
  waterRequired: number
  coffeeRequired: number
  preparationTime: number
  difficulty: number
}

export class CoffeeMenu {
  private static readonly coffees: Coffee[] = [
    {
      type: CoffeeType.ESPRESSO,
      name: "Espresso",
      description: "Café court et intense",
      price: 1.5,
      waterRequired: 5,
      coffeeRequired: 10,
      preparationTime: 2000,
      difficulty: 2,
    },
    {
      type: CoffeeType.AMERICANO,
      name: "Americano",
      description: "Espresso allongé avec de l'eau chaude",
      price: 2.0,
      waterRequired: 15,
      coffeeRequired: 8,
      preparationTime: 2500,
      difficulty: 2,
    },
    {
      type: CoffeeType.CAPPUCCINO,
      name: "Cappuccino",
      description: "Espresso avec mousse de lait",
      price: 2.5,
      waterRequired: 10,
      coffeeRequired: 12,
      preparationTime: 4000,
      difficulty: 3,
    },
    {
      type: CoffeeType.LATTE,
      name: "Latte",
      description: "Café au lait avec mousse légère",
      price: 3.0,
      waterRequired: 12,
      coffeeRequired: 10,
      preparationTime: 4500,
      difficulty: 3,
    },
    {
      type: CoffeeType.MACCHIATO,
      name: "Macchiato",
      description: 'Espresso "taché" de mousse de lait',
      price: 2.8,
      waterRequired: 8,
      coffeeRequired: 12,
      preparationTime: 3500,
      difficulty: 4,
    },
    {
      type: CoffeeType.MOCHA,
      name: "Mocha",
      description: "Café au chocolat avec mousse de lait",
      price: 3.5,
      waterRequired: 15,
      coffeeRequired: 12,
      preparationTime: 5000,
      difficulty: 4,
    },
  ]

  static getAllCoffees(): Coffee[] {
    return [...this.coffees]
  }

  static getCoffeeByType(type: CoffeeType): Coffee | undefined {
    return this.coffees.find((coffee) => coffee.type === type)
  }

  static getCoffeesByPriceRange(minPrice: number, maxPrice: number): Coffee[] {
    return this.coffees.filter((coffee) => coffee.price >= minPrice && coffee.price <= maxPrice)
  }

  static getCoffeesByDifficulty(maxDifficulty: number): Coffee[] {
    return this.coffees.filter((coffee) => coffee.difficulty <= maxDifficulty)
  }

  static getRecommendedCoffee(availableWater: number, availableCoffee: number): Coffee | undefined {
    const availableCoffees = this.coffees.filter(
      (coffee) => coffee.waterRequired <= availableWater && coffee.coffeeRequired <= availableCoffee,
    )

    if (availableCoffees.length === 0) {
      return undefined
    }

    return availableCoffees.reduce((best, current) => (current.price > best.price ? current : best))
  }
}

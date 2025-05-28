"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const CoffeeMachine_1 = require("./models/CoffeeMachine");
const CoffeeMenu_1 = require("./data/CoffeeMenu");
const readline = __importStar(require("readline"));
const coffeeMachine = new CoffeeMachine_1.CoffeeMachine();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function displayMenu() {
    console.log("\n📋 MENU CAFÉ");
    CoffeeMenu_1.COFFEE_MENU.forEach((coffee, index) => {
        console.log(`${index + 1}. ${coffee.name} - ${coffee.price.toFixed(2)} €`);
    });
}
function askForCoffeeChoice() {
    displayMenu();
    rl.question("\n👉 Entrez le numéro de votre choix (ou 'q' pour quitter) : ", (input) => {
        if (input.toLowerCase() === "q") {
            console.log("👋 Merci d'avoir utilisé notre machine à café !");
            rl.close();
            return;
        }
        const choiceIndex = Number.parseInt(input) - 1;
        const selectedCoffee = CoffeeMenu_1.COFFEE_MENU[choiceIndex];
        if (!selectedCoffee) {
            console.log("❌ Choix invalide. Veuillez choisir un numéro entre 1 et " + CoffeeMenu_1.COFFEE_MENU.length);
            return askForCoffeeChoice();
        }
        askForPayment(selectedCoffee);
    });
}
function askForPayment(coffee) {
    rl.question(`💰 Insérez au moins ${coffee.price.toFixed(2)}€ : `, (input) => {
        const amount = Number.parseFloat(input);
        if (isNaN(amount)) {
            console.log("❌ Montant invalide. Veuillez entrer un nombre.");
            return askForPayment(coffee);
        }
        if (!coffeeMachine.validatePayment(amount, coffee)) {
            console.log("🔄 Retour au menu principal...");
            return askForCoffeeChoice();
        }
        if (!coffeeMachine.canPrepare(coffee)) {
            console.log("🔄 Retour au menu principal...");
            return askForCoffeeChoice();
        }
        coffeeMachine.prepare(coffee);
        setTimeout(() => {
            coffeeMachine.showStatus();
            console.log("\n🔄 Retour au menu principal...");
            askForCoffeeChoice();
        }, 2500);
    });
}
function handleEmergency() {
    rl.question("\n🚨 Menu de maintenance:\n1. Redémarrer la machine\n2. Simuler panne de courant\n3. Retour normal\nChoix: ", (input) => {
        switch (input) {
            case "1":
                coffeeMachine.restart();
                break;
            case "2":
                coffeeMachine.simulatePowerOutage();
                break;
            case "3":
                break;
            default:
                console.log("❌ Choix invalide");
        }
        askForCoffeeChoice();
    });
}
// Gestion des erreurs globales
process.on("uncaughtException", (error) => {
    console.error("🚨 Erreur critique:", error.message);
    console.log("🔧 Veuillez contacter la maintenance");
    rl.close();
});
console.log("☕ Bienvenue dans la Machine à Café Automatique");
console.log("💡 Tapez 'Ctrl+C' puis 'm' pour accéder au menu de maintenance");
// Gestion du Ctrl+C pour le menu de maintenance
rl.on("SIGINT", () => {
    rl.question("\n🔧 Accéder au menu de maintenance ? (m/n): ", (answer) => {
        if (answer.toLowerCase() === "m") {
            handleEmergency();
        }
        else {
            console.log("👋 Au revoir !");
            rl.close();
        }
    });
});
askForCoffeeChoice();
//# sourceMappingURL=main.js.map
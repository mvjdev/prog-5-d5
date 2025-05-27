# prog-5-d5
# ☕ Machine à Café Automatique

Ce projet simule le fonctionnement d’une machine à café automatique. L'utilisateur insère un paiement, choisit son café, et la machine prépare la boisson en tenant compte des différentes contraintes techniques.

## 🎯 Objectif

Créer une simulation interactive d'une machine à café automatique qui permet à un utilisateur :

* d'effectuer un paiement,
* de choisir un type de café,
* de recevoir son café, ou de gérer les erreurs possibles (plus d’eau, plus de grains, panne de courant, etc.).

---

## 📘 Use Case

```
Acteur principal : Utilisateur

1. L'utilisateur insère de l'argent
2. La machine valide le paiement
3. L'utilisateur choisit un type de café
4. La machine vérifie la disponibilité des ressources
   - Eau
   - Café
   - Électricité
   - Lumière (interface active)
5. La machine prépare le café
6. L'utilisateur récupère son café
```

---

## 💼 Business Logic

### Paiement

* Le paiement est obligatoire pour lancer la procédure.
* Vérification automatique : le montant est suffisant ou non.
* Si insuffisant → message d'erreur, retour de la monnaie.

### Choix du café

* Plusieurs types de cafés : Expresso, Cappuccino, Latte, etc.
* Chaque café a ses propres besoins en eau et café.

### Préparation

* Vérification de la disponibilité :

  * Eau : >= quantité requise
  * Café : >= quantité requise
  * Électricité : active
  * Lumière : allumée (indique interface disponible)
* Lancement de la préparation
* Retour à l’état initial après distribution

---

## ❌ Erreurs Possibles

| Erreur                     | Cause                       | Solution possible                     |
| -------------------------- | --------------------------- | ------------------------------------- |
| `Paiement insuffisant`     | Montant < prix du café      | Afficher message, demander complément |
| `Plus de café`             | Réservoir de café vide      | Message d’erreur, maintenance         |
| `Plus d’eau`               | Réservoir d’eau vide        | Message d’erreur, maintenance         |
| `Pas de lumière`           | Interface non active        | Redémarrage, vérification système     |
| `Panne de courant`         | Plus d'électricité          | Attendre ou notifier un technicien    |
| `Type de café non reconnu` | Mauvaise entrée utilisateur | Afficher la liste valide              |

---

## 🚀 Optimisations Possibles

* 🔁 **Mode maintenance** : permettre à un technicien de remplir l’eau ou le café sans redémarrer la machine.
* ⚡ **Énergie** : mode économie d’énergie en veille.
* 🧠 **Suggestion intelligente** : recommander un café en fonction du moment de la journée.
* 📊 **Historique d’utilisation** : nombre de cafés servis par type.
* 🌐 **Connectivité IoT** : notifications à distance pour la maintenance.

---
## 👤 Auteur

Projet réalisé par **STD22082** dans le cadre du module **Prog5**

---

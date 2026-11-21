# Anonyme Pro

Plateforme de rencontres sociales, amicales et relationnelles, conçue pour favoriser les découvertes et les interactions réelles dans un cadre moderne, sécurisé et premium.

Lancement initial : **Sénégal (Dakar)**  
Devise : **XOF (Franc CFA)**  
Plateformes : **Web (Phase 1)** & **iOS natif (Phase 2)**

---

## 🚀 Fonctionnalités Clés (MVP)

- **Authentification & Sessions :** Inscription sécurisée, gestion multi-appareils, suppression de compte conforme (RGPD/CDP & App Store).
- **Profils Utilisateurs :** Photos, bios, centres d'intérêt, critères de découverte et géolocalisation approximative respectueuse de la vie privée.
- **Vérification d'authenticité anti-fake :** Double selfie avec gestes aléatoires en direct + note vocale de 20 secondes. Validation administrative via back-office.
- **Découverte & Matching :** Défilement de profils, likes limités, pass et notification de correspondances mutuelles (matchs).
- **Messagerie temps réel :** Textes, photographies et notes vocales instantanées via WebSockets.
- **Modèle Freemium :**
  - Gratuit : découverte, likes limités, matchs, messagerie.
  - Premium (500 FCFA/mois) : likes illimités, identification des profils ayant liké/visité, filtres avancés, mode incognito, retour en arrière.
- **Paiements locaux :** Intégration Wave et Orange Money (Web) et Apple In-App Purchase / StoreKit (iOS).
- **Administration & Gouvernance (RBAC) :**
  - Rôles stricts (Super Admin, Modérateur, Vérificateur, Support).
  - Traçabilité et journal d'audit systématique de chaque accès sensible.
  - Tableau de bord analytique complet (DAU/MAU, rétention, conversion, revenus).

---

## 🛠️ Stack Technique

- **Backend :** Node.js / NestJS (REST API + WebSockets)
- **Base de données :** PostgreSQL avec extension PostGIS
- **ORM :** Prisma
- **Cache & Sessions :** Redis
- **Stockage Objets :** Compatible S3 (URLs signées éphémères pour les médias privés)
- **Frontend Web :** React, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Mobile (Phase 2) :** Swift & SwiftUI (iOS natif, StoreKit, APNs)
- **DevOps / Infra :** Docker & Docker Compose

---

## 📄 Documentation

Le cahier des charges complet et les spécifications détaillées sont consultables dans le fichier [`contexte.md`](./contexte.md).

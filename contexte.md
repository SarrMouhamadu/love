# ANONYME PRO

## Contexte général du projet — Document de référence pour l'agent IA

**Version : 1.1**

---

# 1. Présentation générale

Anonyme Pro est une plateforme de rencontres sociales destinée à faciliter les échanges, les découvertes et les nouvelles relations entre personnes adultes.

Le projet démarre au Sénégal, avec une première phase pilote à Dakar, avant une éventuelle expansion vers d'autres marchés africains et internationaux.

La plateforme permettra aux utilisateurs de créer un compte, de présenter leur profil, de découvrir d'autres personnes, d'exprimer leur intérêt, de créer des correspondances (matches) et de communiquer entre eux.

Anonyme Pro est le nom commercial du produit. Il ne faut pas interpréter le mot « Anonyme » comme une promesse d'anonymat, de confidentialité absolue ou de dissimulation de l'identité vis-à-vis de l'administration.

L'application doit être conçue comme un véritable produit numérique commercial, évolutif, sécurisé et administrable.

## Objectifs principaux

- Faciliter les rencontres sociales.
- Permettre aux utilisateurs de découvrir de nouvelles personnes.
- Favoriser les interactions et les échanges.
- Construire une communauté active et équilibrée.
- Proposer une expérience gratuite avec une offre Premium accessible.
- Développer un modèle économique durable.
- Donner à l'administration une visibilité suffisante sur les activités et les performances de la plateforme.

# 2. Public cible et positionnement

- Public : hommes et femmes.
- Âge minimum : 18 ans.
- Marché initial : Sénégal.
- Zone de lancement prioritaire : Dakar.
- Langues : français et anglais.
- Devise : franc CFA (XOF).
- Type de rencontres : sociales, amicales, nouvelles connaissances et relations éventuelles.

La plateforme ne doit pas être exclusivement présentée comme une application de rencontres amoureuses.

Elle doit offrir un environnement permettant de rencontrer des personnes partageant des centres d'intérêt, des habitudes, des objectifs ou des envies de socialisation.

# 3. Plateformes et stratégie de développement

Le lancement se fera progressivement.

### Phase 1 — Web

Développer une application web responsive accessible depuis ordinateur, tablette et smartphone.

Elle doit proposer les fonctionnalités essentielles du produit et permettre aux utilisateurs de s'inscrire, créer leur profil, découvrir des membres et communiquer.

### Phase 2 — iOS

Développer une véritable application native iOS avec SwiftUI et préparer sa publication sur l'App Store.

L'application iOS doit utiliser le même backend que la plateforme web.

Les abonnements et fonctionnalités numériques achetés dans l'application iOS devront respecter les règles Apple relatives aux achats intégrés.

### Phase 3 — Android

Prévoir une architecture permettant d'ajouter ultérieurement une application Android sans reconstruire le backend.

**Important :** ne pas développer Android dans le périmètre initial.

# 4. Identité visuelle et expérience utilisateur

L'expérience doit être moderne, minimaliste, élégante et premium.

L'inspiration générale est celle des produits Apple : simplicité, clarté, cohérence et attention aux détails.

### Direction artistique

- Couleurs principales : noir, blanc et orange.
- Mode clair et mode sombre.
- Interface responsive.
- Icônes Lucide ou équivalents visuels cohérents.
- Typographie lisible.
- Espacements maîtrisés.
- Animations discrètes et fluides.
- Composants réutilisables.

Éviter absolument :

- Les interfaces surchargées.
- Les longs textes explicatifs.
- Les couleurs trop nombreuses.
- Les cartes et encadrés inutiles.
- Les tableaux de bord remplis d'informations sans hiérarchie.
- Les interfaces génériques ressemblant à des templates générés automatiquement.

Chaque écran doit avoir un objectif principal clairement identifiable.

# 5. Authentification et gestion des comptes

Prévoir :

- Inscription par email et mot de passe.
- Connexion et déconnexion.
- Vérification de l'adresse email.
- Récupération du mot de passe.
- Gestion des sessions.
- Déconnexion de tous les appareils.
- Suppression du compte.
- Gestion des préférences.
- Acceptation des conditions générales.
- Acceptation et consultation de la politique de confidentialité.

Chaque utilisateur doit disposer d'un identifiant unique.

Prévoir les statuts suivants :

- Actif.
- En attente de vérification.
- Suspendu.
- Bloqué.
- Supprimé.

Les utilisateurs doivent pouvoir gérer leur compte depuis les paramètres.

# 6. Profils utilisateurs

Chaque utilisateur dispose d'un profil personnel.

### Informations principales

- Photo de profil.
- Photos supplémentaires.
- Pseudonyme ou nom d'affichage.
- Date de naissance ou âge calculé.
- Genre.
- Ville de résidence.
- Description personnelle.
- Centres d'intérêt.
- Loisirs.
- Langues parlées.
- Profession ou domaine d'activité (facultatif).
- Niveau d'études (facultatif).
- Type de relation recherchée.
- Préférences de découverte.

L'utilisateur doit pouvoir modifier ses informations et contrôler les éléments de son profil visibles par les autres membres.

Les informations sensibles qui ne sont pas destinées à la présentation publique ne doivent pas apparaître sur les profils.

# 7. Vérification des utilisateurs

La vérification concerne aussi bien les hommes que les femmes.

Elle constitue un élément important de confiance et de lutte contre les faux profils.

### Processus de vérification

L'utilisateur devra fournir :

1. Deux selfies pris en direct, suivant des instructions aléatoires différentes.
2. Un enregistrement vocal de 20 secondes, dans lequel il prononce une phrase générée aléatoirement.

Les selfies servent notamment à vérifier la présence d'une personne réelle et à comparer les images avec les photographies du profil.

L'enregistrement vocal sert à renforcer les contrôles d'authenticité.

### Statuts

- Non vérifié.
- Vérification en attente.
- Vérifié.
- Vérification rejetée.
- Vérification à refaire.

### Administration

L'administrateur doit pouvoir :

- Consulter les demandes.
- Visualiser les médias nécessaires à la vérification.
- Accepter ou rejeter une demande.
- Ajouter un motif de rejet.
- Demander une nouvelle soumission.
- Consulter l'historique des vérifications.

La vérification peut être effectuée manuellement dans la première version.

Ne pas prétendre que cette procédure constitue une vérification officielle de l'identité civile. Ne pas déduire automatiquement le genre d'une personne à partir de sa voix.

Les photographies et enregistrements de vérification doivent être protégés, accessibles uniquement aux personnes autorisées et soumis à une politique de conservation et de suppression précise.

# 8. Découverte des profils

La découverte constitue une fonctionnalité centrale de l'application.

L'utilisateur doit pouvoir parcourir les profils et découvrir de nouvelles personnes.

### Fonctionnalités

- Affichage des profils sous forme de cartes.
- Consultation d'un profil détaillé.
- Action « J'aime ».
- Action « Passer ».
- Affichage du badge de vérification.
- Suggestions de profils.
- Filtres de recherche.
- Gestion des préférences de découverte.

### Filtres

- Tranche d'âge.
- Genre.
- Ville.
- Distance approximative, si la localisation est autorisée.
- Centres d'intérêt.
- Langues.
- Type de relation recherchée.
- Profils vérifiés.
- Activité récente.

La localisation doit rester facultative. La plateforme ne doit jamais afficher la position GPS exacte d'un utilisateur aux autres membres.

Les suggestions doivent prendre en compte les préférences déclarées et les centres d'intérêt communs, sans promettre une compatibilité parfaite.

# 9. Likes et Matchs

Le système de correspondance fonctionne sur la base de l'intérêt mutuel.

### Fonctionnement

1. Un utilisateur consulte un profil.
2. Il peut aimer ou passer.
3. Si deux utilisateurs s'aiment mutuellement, un match est créé.
4. Les deux utilisateurs sont informés.
5. Une conversation devient disponible.

Prévoir :

- Historique des likes.
- Liste des matchs.
- Suppression d'un match.
- Notifications de nouveaux matchs.
- Gestion des profils bloqués.

# 10. Messagerie

Les utilisateurs ayant établi un match peuvent communiquer.

### Fonctionnalités

- Messages texte.
- Envoi de photographies.
- Messages vocaux.
- Réactions.
- Réponse à un message.
- Indicateur de saisie.
- Statut de lecture.
- Notifications.
- Suppression de conversation selon les règles applicables.
- Blocage et signalement.

Les appels audio et vidéo ne sont pas prioritaires pour la première version.

Ils pourront être ajoutés ultérieurement.

# 11. Modèle économique

Anonyme Pro adopte un modèle Freemium.

Une partie importante des fonctionnalités reste accessible gratuitement afin de favoriser l'acquisition et la croissance de la communauté.

## Offre gratuite

- Création de compte.
- Création et modification du profil.
- Ajout de photographies.
- Découverte des profils.
- Likes limités.
- Passer un profil.
- Matchs.
- Messagerie avec les personnes avec lesquelles un match existe.
- Notifications essentielles.
- Paramètres du compte.

## Offre Premium

**Prix cible : 500 FCFA par mois.**

Une seule formule Premium est prévue au lancement.

Elle donne accès à :

- Likes illimités.
- Consultation de toutes les personnes ayant aimé le profil.
- Filtres avancés.
- Mode incognito.
- Consultation des visiteurs du profil.
- Annulation d'un passage.
- Boost de visibilité.
- Priorité dans certaines recommandations.
- Statistiques du profil.
- Suggestions avancées.
- Contrôles supplémentaires de visibilité.

Les fonctionnalités Premium ne doivent jamais permettre de contourner un blocage, un signalement ou une mesure de sécurité.

### Paiements

Sur le web, prévoir une intégration permettant notamment les paiements par :

- Wave.
- Orange Money.

Le fournisseur de paiement définitif sera choisi après comparaison des coûts, de la fiabilité et de la documentation technique.

Sur iOS, les fonctionnalités numériques et abonnements devront respecter les règles de paiement de l'App Store, notamment StoreKit lorsque requis.

Le backend doit vérifier les transactions côté serveur, gérer les notifications de paiement et synchroniser les droits Premium entre les plateformes lorsque les règles applicables le permettent.

Prévoir les statuts :

- En attente.
- Payé.
- Échoué.
- Expiré.
- Remboursé.
- Annulé.

Ne jamais activer un abonnement uniquement sur la base d'une réponse client non vérifiée.

# 12. Notifications

Prévoir les notifications suivantes :

- Nouveau like.
- Nouveau match.
- Nouveau message.
- Résultat de vérification.
- Activité liée au compte.
- Paiement confirmé.
- Renouvellement.
- Expiration Premium.
- Alertes de sécurité.

L'utilisateur doit pouvoir gérer ses préférences de notifications.

Prévoir les notifications push sur iOS et les notifications web lorsque le navigateur les prend en charge.

# 13. Administration et accès aux données

Cette partie est une décision importante du projet.

**L'administration d'Anonyme Pro n'est pas anonymisée vis-à-vis des données des utilisateurs.**

L'administrateur principal doit disposer d'une interface lui permettant de consulter les données personnelles nécessaires à la gestion et à l'exploitation de la plateforme, dans le respect des finalités annoncées et des obligations légales.

Les utilisateurs seront informés explicitement de cette réalité avant leur inscription et devront accepter les documents contractuels et la politique de confidentialité applicables.

### Accès administrateur

Selon les autorisations attribuées, l'administration pourra notamment consulter :

- Informations des comptes.
- Informations des profils.
- Photographies.
- Informations de vérification.
- Enregistrements vocaux de vérification.
- Historique des matchs.
- Interactions.
- Messages, lorsque cela est nécessaire et justifié pour la modération, la sécurité ou le traitement d'un signalement.
- Données d'activité.
- Historique des paiements et abonnements.
- Signalements et sanctions.
- Statistiques d'utilisation.

L'accès ne signifie pas que chaque membre de l'équipe peut consulter toutes les données sans restriction.

Prévoir un système de rôles et permissions, un contrôle des accès et un journal d'audit permettant de savoir qui a consulté ou modifié des informations sensibles.

### Rôles administratifs

- Super administrateur.
- Administrateur.
- Modérateur.
- Responsable des vérifications.
- Responsable support.
- Analyste.

Le super administrateur peut gérer les rôles et permissions.

# 14. Exploitation des données et marketing

Les données constituent également une ressource stratégique pour comprendre le fonctionnement du produit, améliorer ses performances et développer son activité commerciale.

Trois grandes finalités sont prévues.

### A. Amélioration de l'application

Analyser les données d'utilisation pour :

- Comprendre les fonctionnalités les plus utilisées.
- Identifier les difficultés rencontrées.
- Améliorer les recommandations.
- Optimiser les parcours d'inscription.
- Améliorer le taux de conversion.
- Comprendre les comportements de découverte.
- Améliorer l'expérience utilisateur.
- Détecter les anomalies et les abus.

### B. Analyse statistique et commerciale

Produire des analyses concernant :

- Répartition des utilisateurs.
- Répartition géographique.
- Tranches d'âge.
- Profils actifs.
- Taux de vérification.
- Likes et matchs.
- Conversations.
- Taux de réponse.
- Abonnements.
- Revenus.
- Renouvellements.
- Résiliations.
- Rétention.
- Engagement.
- Utilisation des fonctionnalités.

### C. Marketing

Anonyme Pro pourra exploiter les données autorisées pour :

- Comprendre les audiences.
- Identifier des segments d'utilisateurs.
- Personnaliser les offres.
- Réaliser des campagnes commerciales.
- Promouvoir les services de la plateforme.
- Mesurer l'efficacité des campagnes.
- Développer des stratégies d'acquisition et de fidélisation.

Les usages marketing nécessitant un consentement doivent faire l'objet d'un consentement distinct, explicite et révocable.

Le refus du marketing ne doit pas empêcher l'accès aux fonctionnalités essentielles de l'application.

Ne pas considérer l'acceptation générale des conditions d'utilisation comme une autorisation illimitée pour tous les usages commerciaux.

Les données sensibles, les photographies et les enregistrements vocaux de vérification ne doivent pas être utilisés dans des campagnes marketing sans base juridique et consentement spécifiques appropriés.

La vente ou la communication de données personnelles à des tiers à des fins commerciales ne fait pas partie du périmètre autorisé par défaut.

# 15. Sécurité, modération et protection des utilisateurs

La plateforme doit intégrer des mécanismes de sécurité dès sa conception.

### Fonctionnalités

- Signaler un utilisateur.
- Bloquer un utilisateur.
- Modérer les photographies.
- Modérer les descriptions.
- Traiter les signalements.
- Suspendre un compte.
- Bannir un compte.
- Historique des sanctions.
- Gestion des appels et contestations.
- Détection des comportements suspects.
- Protection contre le spam.
- Limitation des tentatives abusives.

### Contenus et comportements interdits

- Faux profils.
- Usurpation d'identité.
- Arnaques.
- Harcèlement.
- Menaces.
- Exploitation sexuelle.
- Contenus non consentis.
- Contenus impliquant des mineurs.
- Discrimination.
- Violence.
- Spam et sollicitations frauduleuses.

Prévoir un système de modération accessible depuis l'administration.

Les signalements doivent pouvoir être traités rapidement et les utilisateurs doivent être informés des mesures importantes qui les concernent.

# 16. Tableau de bord analytique

L'administration doit disposer d'un tableau de bord permettant de piloter l'activité de la plateforme.

### Indicateurs utilisateurs

- Nombre total d'inscrits.
- Nouveaux inscrits.
- Utilisateurs actifs quotidiens (DAU).
- Utilisateurs actifs hebdomadaires (WAU).
- Utilisateurs actifs mensuels (MAU).
- Répartition hommes/femmes.
- Répartition par ville.
- Répartition par âge.
- Utilisateurs vérifiés.
- Utilisateurs Premium.

### Indicateurs d'engagement

- Profils consultés.
- Likes envoyés.
- Likes reçus.
- Matchs créés.
- Messages envoyés.
- Conversations actives.
- Taux de réponse.
- Temps moyen de réponse.
- Rétention J1, J7 et J30.

### Indicateurs financiers

- Chiffre d'affaires.
- Revenus par période.
- Abonnements actifs.
- Paiements réussis.
- Paiements échoués.
- Renouvellements.
- Résiliations.
- Conversion gratuit vers Premium.
- Revenu moyen par utilisateur.

### Indicateurs de sécurité

- Signalements reçus.
- Signalements traités.
- Comptes suspendus.
- Comptes bannis.
- Vérifications rejetées.
- Faux profils détectés.
- Temps moyen de traitement des signalements.

Les indicateurs doivent être filtrables par période et, lorsque cela est pertinent, par zone géographique et type d'utilisateur.

# 17. Architecture technique recommandée

L'architecture doit être centralisée autour d'un backend commun.

### Frontend Web

- React.
- TypeScript.
- Vite ou Next.js selon les besoins SEO et de rendu.
- React Router si Vite.
- Tailwind CSS ou système de design équivalent.
- Lucide Icons.
- Gestion centralisée des états.
- Interface responsive.
- PWA lorsque pertinent.

### Application iOS

- Swift.
- SwiftUI.
- Architecture MVVM.
- URLSession pour les appels API.
- Keychain pour les informations sensibles.
- StoreKit pour les achats intégrés.
- APNs pour les notifications push.

### Backend

- Node.js.
- NestJS.
- API REST.
- WebSockets pour la messagerie et les événements temps réel.
- Authentification sécurisée.
- Validation des entrées.
- Gestion des rôles et permissions.

### Base de données

- PostgreSQL.
- PostGIS pour les fonctionnalités géographiques.
- Prisma ORM ou solution équivalente.
- Redis pour le cache, les sessions temporaires et les mécanismes temps réel lorsque nécessaire.

### Stockage des fichiers

Prévoir un stockage compatible S3 pour :

- Photos de profil.
- Pièces médias nécessaires à la vérification.
- Images envoyées dans les conversations.
- Fichiers temporaires.

Les médias privés doivent être servis au moyen d'autorisations et d'URL temporaires, jamais par des liens publics permanents.

### Infrastructure

- Docker.
- Nginx.
- HTTPS.
- Variables d'environnement.
- CI/CD.
- Sauvegardes automatiques.
- Surveillance des services.
- Journalisation.
- Gestion des erreurs.
- Environnements développement, staging et production.

L'ensemble doit être compatible avec un environnement de développement sur MacBook Apple Silicon.

# 18. Principales entités de données

Prévoir au minimum les entités suivantes :

- users
- user_sessions
- profiles
- profile_photos
- interests
- user_interests
- intentions
- verification_requests
- verification_media
- verification_results
- likes
- passes
- matches
- conversations
- messages
- message_attachments
- blocks
- reports
- moderation_actions
- subscriptions
- payments
- payment_webhooks
- notifications
- notification_preferences
- privacy_preferences
- marketing_consents
- analytics_events
- admin_users
- admin_roles
- admin_permissions
- audit_logs

La structure exacte sera affinée pendant la conception de la base de données.

Prévoir des relations cohérentes, des index adaptés, des contraintes d'intégrité et des migrations versionnées.

# 19. Confidentialité et conformité juridique

Le projet doit tenir compte de la législation sénégalaise relative à la protection des données personnelles, notamment la loi n° 2008-12 et les textes associés.

Avant le lancement, il faudra vérifier auprès de la Commission de Protection des Données Personnelles (CDP) les formalités applicables au traitement envisagé.

Prévoir :

- Une politique de confidentialité claire.
- Des conditions générales d'utilisation.
- Une information détaillée sur les finalités des traitements.
- Une base juridique adaptée à chaque finalité.
- Des consentements distincts lorsque nécessaires.
- La possibilité d'exercer les droits applicables.
- Une politique de conservation.
- Une procédure de suppression des données.
- Une protection renforcée des photos, voix et données de localisation.
- Une gestion des accès administratifs.
- Une documentation des sous-traitants.
- Une analyse des transferts de données hors du Sénégal.

Les conditions contractuelles doivent expliquer clairement les accès administratifs et les usages prévus des données.

L'utilisateur doit pouvoir accepter ou refuser les conditions avant de créer son compte. Les consentements facultatifs, notamment marketing, doivent être séparés des conditions indispensables au fonctionnement du service.

La suppression du compte doit être prévue dans le produit, y compris dans l'application iOS, conformément aux règles applicables de l'App Store.

# 20. Périmètre de la première version (MVP)

La première version doit inclure :

1. Application web responsive.
2. Backend centralisé.
3. Authentification.
4. Gestion des profils.
5. Ajout de photos.
6. Vérification par selfies et voix.
7. Découverte des profils.
8. Filtres.
9. Likes et Pass.
10. Matchs.
11. Messagerie texte.
12. Envoi de photos et messages vocaux.
13. Notifications.
14. Offre gratuite.
15. Abonnement Premium.
16. Paiements web.
17. Préparation des achats intégrés iOS.
18. Interface d'administration.
19. Gestion des utilisateurs.
20. Gestion des vérifications.
21. Modération.
22. Gestion des paiements.
23. Tableau de bord analytique.
24. Gestion des consentements.
25. Gestion de la confidentialité.
26. Suppression des comptes.
27. Journalisation et surveillance technique.

L'application iOS sera développée dans le périmètre de lancement suivant la mise en place du socle backend et web.

# 21. Fonctionnalités reportées

Ne pas intégrer inutilement les fonctionnalités suivantes dans le premier MVP :

- Appels vidéo.
- Appels audio en direct.
- Événements physiques.
- Groupes communautaires.
- Fonctionnalités complexes de gamification.
- Système de points.
- Marketplace.
- Expansion Android.
- Intelligence artificielle de compatibilité avancée.

Ces fonctionnalités pourront être envisagées après validation du produit auprès des premiers utilisateurs.

# 22. Feuille de route

### Étape 1 — Conception

- Finaliser les spécifications.
- Définir les parcours utilisateurs.
- Définir l'architecture.
- Concevoir la base de données.
- Définir les API.
- Concevoir le système de design.

### Étape 2 — Backend

- Authentification.
- Profils.
- Vérification.
- Découverte.
- Likes et matchs.
- Messagerie.
- Paiements.
- Notifications.
- Administration.
- Analytics.

### Étape 3 — Web

- Interface publique.
- Inscription.
- Profils.
- Découverte.
- Messagerie.
- Abonnements.
- Paramètres.

### Étape 4 — Administration

- Dashboard.
- Utilisateurs.
- Vérifications.
- Modération.
- Paiements.
- Statistiques.
- Gestion des rôles et permissions.
- Audit.

### Étape 5 — iOS

- Application SwiftUI.
- Authentification.
- Profils.
- Découverte.
- Messagerie.
- Notifications.
- StoreKit.
- Préparation App Store.

### Étape 6 — Tests et lancement

- Tests fonctionnels.
- Tests de sécurité.
- Tests de paiement.
- Tests de performance.
- Tests de modération.
- Tests de suppression des comptes.
- Bêta privée à Dakar.
- Corrections.
- Lancement public au Sénégal.

# 23. Instructions permanentes à l'agent IA

Tu interviens comme architecte logiciel, développeur full-stack senior et conseiller technique du projet Anonyme Pro.

Tu dois respecter les consignes suivantes :

1. Considérer ce document comme la référence fonctionnelle du projet.
2. Ne pas modifier les décisions produit sans justification.
3. Ne pas inventer de fonctionnalités inutiles.
4. Éviter le surdéveloppement et la complexité prématurée.
5. Construire une architecture propre, maintenable et évolutive.
6. Privilégier la sécurité dès la conception.
7. Respecter les règles Apple pour la future application iOS.
8. Ne jamais exposer les données privées d'un utilisateur à un autre utilisateur.
9. Mettre en place des rôles et permissions stricts pour l'administration.
10. Prévoir la journalisation des accès sensibles.
11. Ne jamais activer un paiement sans vérification serveur.
12. Ne pas confondre consentement aux conditions d'utilisation et consentement marketing.
13. Préserver la cohérence entre le web et iOS grâce au backend central.
14. Garder une interface minimaliste et premium.
15. Utiliser des composants réutilisables.
16. Documenter les API et les choix techniques importants.
17. Écrire du code lisible, structuré et testable.
18. Ne pas ajouter Android au périmètre initial.
19. Ne pas développer les appels vidéo et les fonctionnalités secondaires avant le MVP.
20. Signaler toute contrainte juridique, technique ou App Store avant de prendre une décision qui pourrait compromettre le lancement.

## Méthode de travail attendue

Ne commence pas à coder toutes les fonctionnalités simultanément.

Procède dans cet ordre :

1. Analyse le présent document.
2. Établis une architecture technique détaillée.
3. Propose le schéma complet de la base de données.
4. Définis les modules backend et leurs responsabilités.
5. Définis les endpoints API.
6. Définis les rôles et permissions.
7. Établis les parcours utilisateurs et les écrans.
8. Définis les règles métier.
9. Présente un plan d'implémentation par lots.
10. Commence le développement progressivement, en validant chaque lot.

Chaque étape doit produire un résultat concret et exploitable.

En cas d'ambiguïté mineure, choisis la solution la plus simple, cohérente, sécurisée et évolutive, sans interrompre inutilement le travail pour demander une validation.

---

# Vision finale

Anonyme Pro doit devenir une plateforme de rencontres sociales fiable, accessible, moderne et économiquement viable, construite d'abord pour le marché sénégalais.

Le produit doit être simple pour les utilisateurs, puissant pour l'administration et suffisamment solide techniquement pour évoluer vers plusieurs marchés et plateformes.

**La priorité est de construire un excellent MVP, de le lancer, de mesurer son adoption et de l'améliorer à partir des données et des retours réels.**

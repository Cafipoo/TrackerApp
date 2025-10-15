# 🎯 TrackerApp - Application de Suivi d'Habitudes

## 📋 Description du Projet

TrackerApp est une application web moderne et intuitive conçue pour aider les utilisateurs à créer, suivre et maintenir leurs habitudes quotidiennes. L'application offre un système de gamification avec des streaks, des statistiques visuelles et une interface utilisateur attrayante pour motiver les utilisateurs dans leur parcours de développement personnel.

## 🚀 Fonctionnalités Principales

### 🔐 Gestion des Utilisateurs

#### US 1 - Inscription
**En tant qu'utilisateur, je veux pouvoir créer un compte afin d'accéder à mes habitudes personnelles.**

**Critères d'acceptation :**
- [ ] Formulaire d'inscription avec validation
- [ ] Champs obligatoires : nom, email, mot de passe
- [ ] Validation de l'email (confirmation par email)
- [ ] Vérification de la force du mot de passe
- [ ] Sauvegarde sécurisée des données utilisateur
- [ ] Message de confirmation d'inscription

**Fonctionnalités étendues :**
- Inscription via OAuth (Google, GitHub)
- Vérification CAPTCHA anti-spam
- Conditions d'utilisation et politique de confidentialité

#### US 2 - Connexion
**En tant qu'utilisateur, je veux me connecter à mon compte pour accéder à mes données personnelles.**

**Critères d'acceptation :**
- [ ] Formulaire de connexion (email/mot de passe)
- [ ] Authentification sécurisée avec NextAuth.js
- [ ] Gestion des sessions utilisateur
- [ ] Connexion persistante (remember me)
- [ ] Redirection vers le dashboard après connexion
- [ ] Gestion des erreurs de connexion

**Fonctionnalités étendues :**
- Connexion via OAuth (Google, GitHub)
- Authentification à deux facteurs (2FA)
- Réinitialisation de mot de passe

#### US 3 - Déconnexion
**En tant qu'utilisateur, je veux me déconnecter pour protéger mes données personnelles.**

**Critères d'acceptation :**
- [ ] Bouton de déconnexion accessible
- [ ] Suppression sécurisée de la session
- [ ] Redirection vers la page d'accueil
- [ ] Confirmation de déconnexion
- [ ] Nettoyage des données locales

---

### 📝 Gestion des Habitudes

#### US 4 - Créer une Habitude
**En tant qu'utilisateur, je veux ajouter une nouvelle habitude pour commencer à la suivre.**

**Critères d'acceptation :**
- [ ] Formulaire de création d'habitude
- [ ] Champs : nom, description, fréquence, catégorie
- [ ] Validation des données côté client et serveur
- [ ] Sauvegarde en base de données avec Prisma
- [ ] Confirmation de création avec message de succès
- [ ] Redirection vers la liste des habitudes

**Fonctionnalités étendues :**
- Templates d'habitudes prédéfinies
- Suggestions d'habitudes populaires
- Configuration de rappels automatiques

#### US 5 - Marquer une Habitude comme Faite
**En tant qu'utilisateur, je veux marquer une habitude comme complétée pour la journée en cours.**

**Critères d'acceptation :**
- [ ] Bouton de validation pour chaque habitude
- [ ] Enregistrement de la date et heure de validation
- [ ] Mise à jour des statistiques en temps réel
- [ ] Animation de confirmation visuelle
- [ ] Possibilité d'annuler une validation récente
- [ ] Mise à jour du streak automatique

**Fonctionnalités étendues :**
- Validation partielle (pourcentage d'accomplissement)
- Validation en lot pour plusieurs habitudes
- Historique des validations

#### US 6 - Afficher l'Habitude
**En tant qu'utilisateur, je veux voir les détails d'une habitude spécifique.**

**Critères d'acceptation :**
- [ ] Page de détail de l'habitude
- [ ] Affichage des informations complètes
- [ ] Historique des validations
- [ ] Statistiques de progression
- [ ] Graphiques de performance
- [ ] Actions disponibles (modifier, supprimer)

**Fonctionnalités étendues :**
- Vue calendrier des validations
- Comparaison avec les périodes précédentes
- Notes et commentaires sur l'habitude

#### US 7 - Modifier l'Habitude
**En tant qu'utilisateur, je veux modifier une habitude existante pour ajuster ses paramètres.**

**Critères d'acceptation :**
- [ ] Formulaire d'édition pré-rempli
- [ ] Modification de tous les champs
- [ ] Validation des nouvelles données
- [ ] Sauvegarde des modifications
- [ ] Confirmation de mise à jour
- [ ] Historique des modifications

**Fonctionnalités étendues :**
- Modification en masse de plusieurs habitudes
- Système de versions pour les habitudes
- Rollback des modifications

#### US 8 - Supprimer l'Habitude
**En tant qu'utilisateur, je veux supprimer une habitude pour la retirer de ma liste.**

**Critères d'acceptation :**
- [ ] Bouton de suppression avec confirmation
- [ ] Modal de confirmation avec détails
- [ ] Suppression définitive ou archivage
- [ ] Sauvegarde des données historiques
- [ ] Mise à jour de l'interface
- [ ] Message de confirmation

**Fonctionnalités étendues :**
- Suppression en lot avec confirmation
- Archivage temporaire avant suppression
- Export des données avant suppression

#### US 9 - Lister les Habitudes
**En tant qu'utilisateur, je veux voir la liste de toutes mes habitudes actives.**

**Critères d'acceptation :**
- [ ] Affichage de toutes les habitudes actives
- [ ] Informations essentielles : nom, statut, streak
- [ ] Actions rapides : valider, modifier, supprimer
- [ ] Indicateurs visuels de progression
- [ ] Pagination si nécessaire
- [ ] Recherche et filtrage

**Fonctionnalités étendues :**
- Vue en grille et en liste
- Filtres avancés (catégorie, statut, date)
- Tri personnalisé
- Dashboard avec widgets

#### US 10 - Trier les Habitudes
**En tant qu'utilisateur, je veux trier mes habitudes (par nom, date, fréquence, statut) pour mieux les organiser.**

**Critères d'acceptation :**
- [ ] Options de tri : nom, date de création, fréquence, statut
- [ ] Tri ascendant et descendant
- [ ] Tri multiple (critères combinés)
- [ ] Sauvegarde des préférences de tri
- [ ] Mise à jour en temps réel
- [ ] Indicateurs visuels du tri actif

**Fonctionnalités étendues :**
- Tri personnalisé par l'utilisateur
- Filtres combinés avec le tri
- Tri intelligent basé sur les habitudes

---

### 👤 Gestion du Profil

#### US 11 - Consultation du Profil
**En tant qu'utilisateur, je veux voir mes informations de profil (nom, email).**

**Critères d'acceptation :**
- [ ] Page de profil utilisateur
- [ ] Affichage des informations : nom, email, date d'inscription
- [ ] Statistiques personnelles
- [ ] Actions disponibles (modifier, changer mot de passe)
- [ ] Interface claire et organisée

**Fonctionnalités étendues :**
- Photo de profil
- Statistiques détaillées
- Historique des activités

#### US 12 - Modification du Profil
**En tant qu'utilisateur, je veux modifier mes informations personnelles.**

**Critères d'acceptation :**
- [ ] Formulaire d'édition du profil
- [ ] Modification du nom et email
- [ ] Validation des données
- [ ] Confirmation par email si changement d'email
- [ ] Sauvegarde des modifications
- [ ] Message de confirmation

**Fonctionnalités étendues :**
- Upload de photo de profil
- Changement de mot de passe
- Paramètres de confidentialité

---

### 📊 Visualisation et Analytics

#### US 13 - Vue par Jour/Semaine/Mois
**En tant qu'utilisateur, je veux changer la période de visualisation de mes habitudes.**

**Critères d'acceptation :**
- [ ] Sélecteur de période (jour, semaine, mois)
- [ ] Mise à jour automatique des données
- [ ] Affichage adapté selon la période
- [ ] Navigation entre les périodes
- [ ] Sauvegarde de la préférence
- [ ] Indicateurs de progression par période

**Fonctionnalités étendues :**
- Vue personnalisée (période libre)
- Comparaison entre périodes
- Export des données par période

#### US 14 - Voir son Évolution sous Forme de Graphiques (ApexCharts)
**En tant qu'utilisateur, je veux voir mes progrès sous forme de graphiques.**

**Critères d'acceptation :**
- [ ] Intégration d'ApexCharts
- [ ] Graphiques de progression temporelle
- [ ] Graphiques de fréquence d'accomplissement
- [ ] Graphiques de streaks
- [ ] Graphiques interactifs
- [ ] Export des graphiques

**Fonctionnalités étendues :**
- Graphiques de corrélation entre habitudes
- Prédictions basées sur les données
- Graphiques personnalisables
- Rapports automatisés

#### US 15 - Affichage des Séries de Réussite (Streaks)
**En tant qu'utilisateur, je veux voir mes séries de jours consécutifs réussis.**

**Critères d'acceptation :**
- [ ] Calcul automatique des streaks
- [ ] Affichage du streak actuel
- [ ] Affichage du meilleur streak
- [ ] Indicateurs visuels de progression
- [ ] Notifications de records personnels
- [ ] Historique des streaks

**Fonctionnalités étendues :**
- Système de badges pour les streaks
- Défis de streaks
- Comparaison avec d'autres utilisateurs

---

### 🔄 Import/Export et Notifications

#### US 16 - Export/Import des Habitudes
**En tant qu'utilisateur, je veux exporter mes habitudes (JSON, CSV) et les réimporter si besoin.**

**Critères d'acceptation :**
- [ ] Export en format JSON
- [ ] Export en format CSV
- [ ] Import depuis JSON/CSV
- [ ] Validation des données importées
- [ ] Confirmation avant import
- [ ] Gestion des erreurs d'import

**Fonctionnalités étendues :**
- Export avec historique complet
- Import avec résolution de conflits
- Templates d'export personnalisés

#### US 17 - Notifications
**En tant qu'utilisateur, je veux recevoir des notifications pour ne pas oublier mes habitudes.**

**Critères d'acceptation :**
- [ ] Notifications push configurables
- [ ] Rappels par email personnalisés
- [ ] Gestion des préférences de notification
- [ ] Notifications de rappels d'habitudes
- [ ] Notifications de streaks et records
- [ ] Désactivation des notifications

**Fonctionnalités étendues :**
- Notifications SMS (optionnel)
- Notifications intelligentes basées sur les habitudes
- Notifications de motivation personnalisées

## 🛠️ Stack Technique

### Frontend & Backend (Full-Stack Next.js)
- **Framework :** Next.js 14+ avec App Router
- **Language :** TypeScript
- **UI Library :** Tailwind CSS + shadcn/ui ou Chakra UI
- **Charts :** ApexCharts (comme demandé)
- **State Management :** Zustand ou React Context
- **Forms :** React Hook Form + Zod validation
- **PWA :** Next.js PWA plugin

### Base de Données & ORM
- **Base de données :** PostgreSQL (Vercel Postgres ou Supabase)
- **ORM :** Prisma
- **Migrations :** Prisma Migrate
- **Cache :** Vercel KV (Redis) ou Upstash

### Authentification & Sécurité
- **Auth :** NextAuth.js v5 (Auth.js)
- **Providers :** Google, GitHub, Email/Password
- **Sessions :** JWT avec refresh tokens
- **Security :** CSRF protection, rate limiting

### Déploiement & DevOps
- **Hosting :** Vercel (frontend + API routes)
- **Database :** Vercel Postgres ou Supabase
- **Storage :** Vercel Blob ou Cloudinary
- **CI/CD :** Vercel Git Integration
- **Monitoring :** Vercel Analytics + Sentry
- **Domain :** Vercel Domains

## 📁 Structure du Projet Next.js

```
TrackerApp/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── (auth)/            # Route groups
│   │   │   ├── login/         # Page de connexion
│   │   │   └── register/      # Page d'inscription
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── habits/            # Gestion des habitudes
│   │   ├── analytics/         # Graphiques et statistiques
│   │   ├── profile/           # Profil utilisateur
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentification
│   │   │   ├── habits/        # CRUD habitudes
│   │   │   ├── analytics/     # Données pour graphiques
│   │   │   └── users/         # Gestion utilisateurs
│   │   ├── globals.css        # Styles globaux
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Page d'accueil
│   ├── components/            # Composants réutilisables
│   │   ├── ui/               # Composants UI de base
│   │   ├── charts/           # Composants de graphiques
│   │   ├── forms/            # Formulaires
│   │   └── layout/           # Composants de layout
│   ├── lib/                  # Utilitaires et configuration
│   │   ├── auth.ts           # Configuration NextAuth
│   │   ├── db.ts             # Configuration Prisma
│   │   ├── utils.ts          # Fonctions utilitaires
│   │   └── validations.ts    # Schémas Zod
│   ├── hooks/                # Hooks personnalisés
│   ├── store/                # Gestion d'état (Zustand)
│   └── types/                # Types TypeScript
├── prisma/
│   ├── schema.prisma         # Schéma de base de données
│   ├── migrations/           # Migrations Prisma
│   └── seed.ts              # Données de test
├── public/                   # Assets statiques
├── docs/                     # Documentation
├── tests/                    # Tests automatisés
├── .env.local               # Variables d'environnement
├── .env.example             # Exemple de configuration
├── next.config.js           # Configuration Next.js
├── tailwind.config.js       # Configuration Tailwind
├── tsconfig.json            # Configuration TypeScript
├── package.json             # Dépendances
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- Git
- Compte Vercel (pour le déploiement)
- Base de données PostgreSQL (Vercel Postgres, Supabase, ou locale)

### Installation Locale
```bash
# Cloner le repository
git clone https://github.com/votre-username/TrackerApp.git
cd TrackerApp

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos configurations

# Configurer la base de données
npx prisma migrate dev
npx prisma generate
npx prisma db seed

# Démarrer l'application en mode développement
npm run dev
```

### Configuration des Variables d'Environnement
```bash
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/trackerapp"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Providers OAuth (optionnel)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Vercel (pour le déploiement)
VERCEL_URL="your-app.vercel.app"
```

### Déploiement sur Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Configurer la base de données Vercel Postgres
vercel env add DATABASE_URL
```

## 📋 Roadmap de Développement

### Phase 1 - MVP Next.js (4-6 semaines)
- [ ] Configuration Next.js 14 + TypeScript + Tailwind
- [ ] Setup Prisma + PostgreSQL + NextAuth.js
- [ ] US 1-3 (Gestion des utilisateurs : inscription, connexion, déconnexion)
- [ ] US 4-9 (Gestion des habitudes : CRUD complet)
- [ ] Interface utilisateur responsive avec shadcn/ui
- [ ] Déploiement Vercel + Vercel Postgres
- [ ] Tests unitaires avec Jest + Testing Library

### Phase 2 - Fonctionnalités Avancées (6-8 semaines)
- [ ] US 10-12 (Tri des habitudes et gestion du profil)
- [ ] US 13-15 (Visualisation et analytics avec ApexCharts)
- [ ] Intégration ApexCharts pour les graphiques
- [ ] Optimisations Next.js (SSR, ISR, Image optimization)
- [ ] PWA avec Next.js PWA plugin
- [ ] Tests d'intégration avec Playwright

### Phase 3 - Import/Export et Notifications (4-6 semaines)
- [ ] US 16-17 (Export/Import et notifications)
- [ ] Système de notifications push et email
- [ ] Analytics avancées avec Vercel Analytics
- [ ] API Routes optimisées
- [ ] Tests end-to-end complets

### Phase 4 - Production et Maintenance (2-4 semaines)
- [ ] Optimisations de performance
- [ ] Monitoring avec Sentry
- [ ] Performance monitoring Vercel
- [ ] Documentation complète
- [ ] Tests de charge et sécurité

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez lire notre guide de contribution et créer une issue avant de soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur GitHub ou nous contacter à support@trackerapp.com.

---

*Développé avec ❤️ pour vous aider à construire de meilleures habitudes*

# Mémoire du projet Siryia

> Fichier vivant, contextuel et évolutif.
> Mis à jour à chaque étape importante : décisions, architecture, problèmes rencontrés et résolutions, leçons apprises, conventions, contacts, accès, choix techniques.
> **Règle** : si une info pourrait servir dans 6 mois quand on aura tout oublié → on la note ici.

---

## 0. Identité du projet

| Champ | Valeur |
|-------|--------|
| Nom | **Siryia** |
| Nature | Plateforme SaaS multifonctionnelle (web + mobile) |
| Pitch | Hub africain du commerce et des services en ligne (« Amazon des services + commerce + recrutement + véhicules + pub ») |
| Cible | Particuliers, freelances/artisans solos, entreprises |
| Marché initial | Togo |
| Roadmap géographique | Togo → Afrique de l'Ouest → Afrique → Monde |
| Documents racine | Dans le dossier `docs/` : `cahier-des-charges.md`, `sprint.md`, `memoire.md`, `ct.txt`. À la racine : `implementation_plan.md` |
| Dépôt local | `d:\zen\projets\Doc` (racine monorepo Turborepo) |
| Emplacement frontend | `apps/frontend/` |

---

## 1. Décisions structurantes (Architecture Decision Records — synthèse)

> Chaque décision majeure doit être consignée ici (même format que ADR).

### ADR-001 — Nom du projet
- **Décision** : Siryia.
- **Contexte** : besoin d'un nom court, mémorable, panafricain, brandable.
- **Alternatives écartées** : AfriHub, Karaa, Sokoni, Tofa, Nzuri, AkwabaPlace.
- **Statut** : Accepté.

### ADR-002 — Base de données : PostgreSQL (vs MongoDB)
- **Décision** : PostgreSQL.
- **Justification** : ACID natif (paiements, escrow), données fortement relationnelles, écosystème Supabase, audit/reporting SQL puissant, scalabilité éprouvée.
- **Statut** : Accepté.

### ADR-003 — Stratégie d'hébergement BDD : Supabase managé → Postgres Docker self-hosted sur VPS Hostinger
- **Décision** :
  - Phase 1 (MVP) : **Supabase managé** (Postgres + Auth + Storage + Realtime + Edge Functions + RLS + Studio).
  - Phase 2 (croissance) : migration vers **PostgreSQL en image Docker officielle** sur VPS Hostinger via `pg_dump` / `psql`. Postgres jamais installé "à la main" sur l'OS.
- **Option B documentée** : Supabase self-hosted complet via le `docker-compose` officiel (à arbitrer au moment de la migration).
- **Services à recréer** côté self-hosted :
  - Auth → NestJS maison ou Keycloak (recommandation Keycloak).
  - Storage → MinIO.
  - Realtime → Socket.io NestJS (déjà notre stack).
  - Edge Functions → endpoints NestJS.
- **Statut** : Accepté.

### ADR-004 — Stack technique
- **Frontend web** : Next.js 14+ (App Router) + TailwindCSS + shadcn/ui + TanStack Query + Zustand + next-intl + next-pwa.
- **Mobile** : React Native + Expo (un seul code Android + iOS, EAS Build cloud ; Android Studio local non requis).
- **Backend** : NestJS (TypeScript strict), monolithe modulaire au début → microservices plus tard.
- **API** : REST (public, OpenAPI) + GraphQL (interne) + WebSocket (Socket.io).
- **ORM** : à arbitrer définitivement au Sprint 1.1 — **recommandation Prisma** (maturité, écosystème).
- **Cache / queues** : Redis + BullMQ.
- **Recherche** : Meilisearch ou Typesense au lancement, Elasticsearch/OpenSearch à grande échelle.
- **Stockage fichiers** : Supabase Storage → MinIO + Cloudflare R2 / B2 + CDN.
- **Temps réel** : Socket.io + Supabase Realtime.
- **IA** : Groq au lancement (clé active), fallback OpenRouter `:free` / Cloudflare Workers AI, Mistral activé dès validation billing ; stack RAG LangChain + pgvector + Whisper.
- **Conteneurisation** : Docker partout, Compose au début, k3s ensuite.
- **CI/CD** : GitHub Actions (dont workflow mobile déclenchant `eas build` non interactif et récupération des artefacts APK/AAB/IPA).
- **CDN/WAF/DDoS** : Cloudflare.
- **Monitoring** : Sentry + Grafana + Prometheus + Loki + Better Stack.
- **Hébergement initial** : **Vercel** (frontend) + Supabase (backend/DB) + Expo EAS (mobile).
- **Reference role par techno** : matrice detaillee tenue a jour dans le cahier des charges, section 14.2 "Matrice explicite des technologies et de leur role".
- **Statut** : Accepté.

### ADR-005 — Plateformes cibles
- Web responsive + PWA + mode hors-ligne partiel + App mobile hybride (Android + iOS).
- **Statut** : Accepté.

### ADR-006 — Règle d'or « Tout se passe sur la plateforme »
- Tous les paiements, échanges, contrats transitent par Siryia.
- Filtrage automatique des coordonnées personnelles dans la messagerie tant qu'une mission n'est pas validée.
- Hors plateforme = **Siryia décline toute responsabilité**.
- Sanctions graduées contre le contournement.
- **Statut** : Accepté.

### ADR-007 — Inscription soft + KYC strict
- Inscription rapide et sans friction.
- Vérification d'identité stricte par paliers selon le rôle (cf. cahier des charges § 4.3).
- 2FA obligatoire après KYC.
- **Statut** : Accepté.

### ADR-008 — Pas de wallet interne au lancement
- Reversement direct vers Mobile Money / banque du bénéficiaire après libération de l'escrow.
- Décision réévaluable plus tard.
- **Statut** : Accepté.

### ADR-009 — Modèle économique
- 3 sources principales : commissions + abonnements (Free / Pro / Business / Enterprise) + publicité.
- 6 sources additionnelles (livraison, premium one-shot, leads, formations, white-label, data anonymisée).
- Tarifs indicatifs, ajustables.
- **Statut** : Accepté.

### ADR-010 — Pas de durée temporelle dans la roadmap
- On avance par **Definition of Done** des sprints, en mode intensif.
- **Statut** : Accepté.

### ADR-011 — Sécurité, posture et exigences
- Cible : **OWASP ASVS L2** minimum, OWASP Top 10 systématiquement vérifié.
- Argon2id pour les mots de passe (pas bcrypt).
- JWT EdDSA/Ed25519 ou RS256 (jamais HS256 partagé).
- 2FA obligatoire pour rôles internes.
- SAST + DAST + audit deps + signed commits + branch protection.
- Pentests, threat modeling, bug bounty (à terme).
- **Statut** : Accepté.

### ADR-012 — Back-office Admin complet + KPI temps réel
- **Décision** : console d'administration dédiée (`admin.siryia.com`) permettant à l'équipe Siryia de **gérer 100 % de la plateforme sans toucher à la DB**.
- **Périmètre** : utilisateurs, KYC, modération (contenus, pubs, avis, signalements), litiges & arbitrage, finance & réconciliation, catalogue, CMS, abonnements, codes promo, parrainage, pub managée, coursiers, partenaires, communication multi-canal, paramètres multi-pays, feature flags, audit log, gestion équipe interne avec **sous-rôles fins** (Super Admin, Admin Pays, Modérateur Contenu, Modérateur KYC, Financier, Support N1/N2, Commercial, Lecture seule).
- **KPI temps réel** : tableau exécutif + KPI par module (Marketplace, Services, Annuaire, Véhicules, Pub, Coursiers, Paiements, Support/IA, Sécurité, SRE) — GMV, take rate, MAU/DAU, ARPU, LTV, CAC, MRR, conversion funnel, NPS, etc.
- **Sécurité** : 2FA obligatoire (FIDO2 pour Super Admin), IP allowlist optionnelle, sessions courtes, audit immuable, principle of least privilege, **4-eyes** sur actions critiques, détection d'anomalie comportementale.
- **Statut** : Accepté.

### ADR-013 — Stratégie IA : Groq (primaire immédiat) + OpenRouter/Cloudflare (fallback gratuit) + Mistral (dès billing actif) → payant à la croissance → self-hosted au scale
- **Contexte** : pas de GPU disponible → pas d'hébergement local. Budget IA initial = 0 €.
- **Décision finale** :
  - **Provider primaire immédiat** : **Groq** (clé obtenue, LPU dédiés, ultra-rapide, quota gratuit généreux).
  - **Fallback gratuit** : **OpenRouter `:free`** puis **Cloudflare Workers AI**.
  - **Mistral La Plateforme** : provider prioritaire conformité RGPD, activé dès que le plan de facturation/projet est validé.
  - Tous ces providers sont OpenAI-compatibles → **zéro différence de code** (switch par variables d'environnement).
- **Progression** :
  1. Dev + démos + beta → Groq gratuit + OpenRouter/Cloudflare gratuits. **0 €**.
  2. MVP trafic croissant → activation Mistral Small payant (~0,20 $/1M tokens). ~5–80 $/mois.
  3. Croissance → API Mistral + agrégateurs. ~500–800 $/mois pour 1 M conversations.
  4. Scale → vLLM self-hosted GPU seulement si > 1-2 M conv/mois.
- **Implication code** : **abstraction provider IA** obligatoire dès Sprint 1.12 — interface commune, URL + clé API en variables d'environnement, switch provider = 2 variables, zéro réécriture.
- **Composants annexes open source** : embeddings `bge-m3` / `multilingual-e5-large`, pgvector, Whisper large-v3, LangChain/LlamaIndex.
- **Justification** : Blocage Mistral côté plan de facturation au moment du setup ; Groq permet de démarrer immédiatement sans coût, puis bascule Mistral dès activation billing pour renforcer la conformité régionale.
- **Statut** : Accepté (décision définitive pour le lancement).

### ADR-014 — Structure du dépôt (Monorepo)
- **Décision** : Utilisation d'un seul dépôt (Monorepo) contenant `frontend` (Web), `backend` (API) et `mobile` (App).
- **Justification** : Simplifie drastiquement le partage de code (types TypeScript, validation) entre l'API NestJS et les interfaces Next.js/React Native. Permet au projet d'évoluer de manière synchrone.
- **Statut** : Accepté.

### ADR-015 — Règle de collaboration et "Garde-fou"
- **Décision** : Le LLM a l'obligation absolue d'alerter, de contredire et de recadrer l'utilisateur si ce dernier propose une architecture, un outil ou une méthode qui va à l'encontre des bonnes pratiques d'ingénierie et de scalabilité.
- **Justification** : C'est la seule façon de garantir la survie et la maintenabilité d'un projet "gigantesque" à long terme. L'utilisateur veut un expert, pas un exécutant aveugle.
- **Statut** : Accepté.

### ADR-016 — Identité Visuelle et Charte Graphique (V2 - Pro/Organique)
- **Décision** : Adoption d'un thème "Light mode" clair, solide et institutionnel, abandonnant le Glassmorphism sombre initial (Sprint 1.6 / Refonte).
- **Palette & Typo** : Fond blanc (`#ffffff`), Bleu profond corporate (`#17519B`), accent Or/Moutarde (`#D49A25`). Texte principal gris ardoise (`#1e293b`). Typographie principale : **Outfit**.
- **Justification** : L'objectif est de rassurer les entreprises et artisans avec un design plus organique, pro et classique. L'accent Orange est utilisé de manière chirurgicale (hover, Call-to-Action principaux, badges) pour dynamiser l'interface sans la surcharger. Le style précédent faisait "trop IA" et n'inspirait pas la confiance requise pour du B2B.
- **Statut** : Accepté (Refonte intégrée au Frontend).

---

## 2. État d'avancement

> Dernière mise à jour : **2026-06-28**

| Phase | Sprint | Statut | Notes |
|-------|--------|--------|-------|
| 0 | 0.1 Cadrage produit & juridique | Non démarré | — |
| 0 | 0.2 Identité visuelle & design system | **Terminé** | Landing page créée, design system posé (voir § 2.1) |
| 0 | 0.3 Infra dev | **Terminé** | CI GitHub, Husky, Linting, Docker Compose |
| 1 | 1.1 Backend (Squelette) | **Terminé** | NestJS, Prisma, Swagger, Validation |
| 1 | 1.2 Authentification | **Terminé** | Argon2, JWT, Passport, Guards |
| 1 | 1.3 Modélisation BDD (Prisma) | **Terminé** | Schéma de données complet validé et déployé sur Supabase Cloud |
| 1 | 1.4 KYC | **Terminé** | Abstraction Smile Identity, Supabase Storage, Modération RBAC |
| 1 | 1.5 Frontend Web complet | **Terminé** | Next.js, Refonte claire, Formulaire KYC Drag & Drop |
| 1 | 1.6 Mobile Sync (Parité) | **Terminé** | React Native Expo, Navigation, Auth, KYC, Paiements |
| 1 | 1.7 Paiements & Escrow | **Terminé** | Architecture Hexagonale, MockProvider, Séquestre, Payout auto |
| 1 | 1.8 Profils Entreprises (RCCM) | **Terminé** | Annuaire B2B/Solos, Gestion d'Équipe, Vérification KYB |
| 1 | 1.10 Recrutement & Services | **Terminé** | Lifecycle complet, Notation, Contrats, Chat de mission |
| 1 | 1.11 Messagerie & Notifications | **Terminé** | WebSockets (Socket.io), In-App, Anti-contournement |
| 3 | 3.1 → 3.10 | Non démarré | — |

> Mettre à jour à la clôture de chaque sprint : statut, date, principaux livrables, problèmes notables.

### 2.1 Travail réalisé au 2026-06-15

#### Documentation
- [x] Lecture et assimilation complète de tous les fichiers du dossier `Doc/` (`ct.txt`, `cahier-des-charges.md`, `sprint.md`, `memoire.md`).
- [x] Initialisation du `memoire.md` avec toutes les ADR (001 → 015).
- [x] Création du fichier `implementation_plan.md` à la racine du projet (plan courant pour l'utilisateur).

#### Frontend Web (squelette)
- [x] Initialisation du projet Next.js 14+ dans `siryia-web/` (TypeScript strict, TailwindCSS v4, App Router, src directory, ESLint).
- [x] Installation de `framer-motion` (animations fluides) et `lucide-react` (icônes).
- [x] Configuration du **design system Siryia** (voir § 2.2).
- [x] Création d'une **landing page premium** atypique (page d'accueil) avec :
  - Fond noir profond (#050505) avec orbes lumineuses animées (bleu/violet).
  - Effets de glassmorphism sur les cartes et la navbar.
  - Micro-animations d'apparition (stagger) via Framer Motion.
  - Typographie Outfit (Google Fonts).
  - Scrollbar personnalisée.
  - Texte en dégradé (blanc → zinc, bleu → violet).
- [x] Serveur de développement fonctionnel (`npm run dev` → `http://localhost:3000`).

### 2.2 Travail réalisé au 2026-06-20 (Fondations & Sécurité Backend)

- **Renommage global** : Le projet "Zenda" a été officiellement rebaptisé **Siryia**.
- **Sprint 0.3 (Infra Dev)** :
  - Pipeline GitHub Actions configuré (`ci.yml`).
  - Validation des commits via Husky et Commitlint.
  - Outils de formatage partagés via `@siryia/eslint-config`.
  - Architecture locale Docker Compose (PostgreSQL, Redis).
- **Sprint 1.1 (Squelette API NestJS)** :
  - Création du monolithe `apps/backend/`.
  - Configuration de Prisma (ORM) et création du modèle `User` initial.
  - Swagger configuré sur `/api/docs`.
  - Health check endpoint `/api/health`.
- **Sprint 1.2 (Authentification & Sécurité)** :
  - Système JWT sécurisé (15 minutes d'expiration).
  - Hachage des mots de passe en **Argon2id** (standard OWASP).
  - Routes d'inscription (`POST /auth/register`) et de connexion (`POST /auth/login`).
  - Création des DTOs validés (class-validator) et du `JwtAuthGuard`.

### 2.3 Design system actuel (frontend / Charte graphique)

> Découle directement de l'ADR-016 et des spécifications visuelles du Sprint 0.2. Le design system fait office de charte graphique centralisée pour le projet.

| Élément | Choix | Fichier |
|---------|-------|---------|
| Police principale | **Outfit** (Google Fonts, variable) | `layout.tsx` |
| Fond | Blanc `#ffffff` | `globals.css` |
| Couleur primaire | Bleu Corporate `#17519B` (variables `--color-primary-*`) | `globals.css` |
| Accent | Or / Moutarde `#D49A25` | `globals.css` |
| Cartes | Fond blanc + border subtile + ombre portée légère | composant `Card.tsx` (classe `.pro-card`) |
| Texte | Gris ardoise `#1e293b` | `globals.css` |
| Animation orbes | `@keyframes blob` (7s infinite, translate + scale) | `globals.css` |
| Icônes | `lucide-react` | — |
| Animations UI | `framer-motion` (stagger, spring, viewport detection) | `page.tsx` |
| Mode | **Dark uniquement** pour l'instant (class `dark` sur `<html>`) | `layout.tsx` |

> **Philosophie esthétique** : l'utilisateur veut une interface **atypique, fluide et épurée**, qui ne "pue pas l'IA" et qui n'a aucun caractère générique. Chaque composant futur doit respecter cette ligne directrice.

### 2.4 Ce qui est en attente de validation

| Élément | Statut | Bloquant |
|---------|--------|----------|
| Sprint 1.3 : Modélisation complète Prisma | **Terminé** | Non |
| Sprint 1.5 : Frontend complet (auth + profil) | **Terminé** | Non |

### 2.5 Travail réalisé au 2026-06-25 (Modélisation DB Prisma & Cloud Supabase)

- **Sprint 1.3 (Modélisation complète de la Base de Données)** :
  - Traduction du cahier des charges en tables Prisma (`schema.prisma`).
  - Modélisation de l'écosystème complet (Utilisateurs, Entreprises, KYC, Marketplace, Services, Véhicules, Paiements, Escrow).
  - Validation stricte du schéma avec Prisma v7.
- **Migration vers le Cloud (Supabase)** :
  - Création du projet Supabase de développement (`siryia-dev`).
  - Configuration automatique des fichiers d'environnement (`.env` et `.env.local`) avec l'URL du projet, la clé `anon public` et la clé `service_role`.
  - Utilisation du **Session pooler** Supabase (port 5432) pour éviter les blocages IPv6 locaux.
  - Exécution réussie de `npx prisma migrate dev --name init_full_schema`. **La base de données en ligne est désormais opérationnelle.**

### 2.6 Travail réalisé au 2026-06-25 (Frontend Web & Authentification)

- **Sprint 1.5 (Design System & Composants UI Glassmorphism)** :
  - Création de composants UI sur-mesure (`GlassCard`, `Input`, `Button`) respectant l'esthétique atypique "glassmorphism sombre" avec gestion des états (focus lumineux, spinners de chargement, hover).
  - Intégration de `framer-motion` (v12.40.0) et de composants Lucide pour l'iconographie.
  - Fix de type TypeScript (`as const`) sur les variants de Framer Motion.
- **Authentification Sécurisée (Full-stack)** :
  - **Backend** : Activation de CORS dans NestJS (`main.ts`) et création de la route `GET /auth/profile` protégée par `JwtAuthGuard` pour renvoyer le profil de l'utilisateur.
  - **Frontend (Next.js 16)** : Implémentation des formulaires de Login et Signup via des **Server Actions** (`src/app/actions/auth.ts`).
  - **Sécurité (Token Storage)** : Lors de la connexion, le frontend récupère le token JWT du backend et le stocke dans un **Cookie `HttpOnly`** (protégé contre les attaques XSS).
- **Tableau de Bord protégé** :
  - Mise en place du `proxy.ts` (ex-middleware) dans Next.js pour vérifier la présence du cookie `siryia_token` sur chaque requête. Redirection vers `/login` si non connecté.
  - Création du layout du dashboard (Sidebar persistante) et de la page `/dashboard` qui consomme l'API `GET /auth/profile` avec l'en-tête `Authorization: Bearer <token>` de manière Server-Side Rendering (SSR).
  - Compilation (build) validée 100% avec succès sans erreurs de typage.

### 2.7 Travail réalisé au 2026-06-25 (KYC Backend)

- **Sprint 1.4 (Vérification d'identité KYC)** :
  - Implémentation du module `KycModule` dans le backend NestJS.
  - Création d'une abstraction pour le fournisseur KYC (Mock prêt à être remplacé par **Smile Identity**).
  - Intégration de **Supabase Storage** (bucket privé `kyc-documents`) pour stocker les pièces d'identité avec une sécurité maximale.
  - Endpoints d'upload de fichiers via `@nestjs/platform-express` (`multer`).
  - Mise en place du `RolesGuard` (RBAC) pour protéger les routes d'administration (`kyc-admin.controller.ts`) réservées aux modérateurs.

- **Sprint 1.5 (Frontend Web Complet - KYC)** :
  - Implémentation du formulaire de KYC (`KycUploadForm.tsx`) avec support du Drag & Drop et prévisualisation.
  - Utilisation des **Next.js Server Actions** (`actions/kyc.ts`) pour communiquer de manière sécurisée avec l'API en injectant le token JWT (cookies `HttpOnly`), empêchant toute attaque XSS.
  - Refonte totale du Dashboard vers le **nouveau thème clair corporate**.
- **Sprint 1.6 (Parité Mobile - React Native / Expo)** :
  - Installation de l'architecture de navigation via `@react-navigation` (AuthStack et MainTabs).
  - Synchronisation parfaite avec l'API via Axios et conservation sécurisée du JWT (`expo-secure-store`).
  - Développement des écrans natifs calqués sur le Web : `Login`, `Signup`, `Dashboard`, `KycScreen` (avec `expo-image-picker`), et `PaymentScreen`.
- **Sprint 1.7 (Paiements & Séquestre / Escrow Backend)** :
  - Mise en place d'une **Architecture Hexagonale** (Ports et Adaptateurs).
  - Création de l'interface `IPaymentProvider` définissant le standard pour tous les opérateurs (TMoney, Moov, CinetPay).
  - Implémentation du `MockPaymentService` simulable pour le développement local.
  - Création du `PaymentModule` NestJS gérant l'initiation des paiements avec **Escrow par défaut** (`isEscrowed: true`).
  - Implémentation de la logique de **Payout automatisé** (`releaseEscrow`), déclenchée uniquement par l'acheteur après confirmation de bonne réception.

### 2.8 Dépôt Git (2026-06-25)
- Code Web, Backend et Mobile entièrement synchronisé, commit ("feat(mobile): Sprint 1.1-1.7 Mobile Parity") et poussé vers `https://github.com/Profzen/siryia.git`.
- Résolution des problèmes de dépendances monorepo (lockfile et `expo/tsconfig.base`) en centralisant l'installation via `npm install` à la racine.

### 2.9 Travail réalisé au 2026-06-28 (Liaison Paiement & Annuaire Professionnel)

#### Liaison Commande ↔ Escrow
- **Intégration** : L'action de checkout panier Next.js requiert le choix du mode de paiement (`TMONEY` ou `MOOV`) et le numéro de téléphone.
- **Backend** : `OrdersService` enregistre la commande en BDD et appelle instantanément `initiateEscrowPayment` pour séquestrer les fonds.
- **Sécurité** : Correction de l'ID utilisateur dans les requêtes JWT (`user.sub` -> `user.id`), alignant tous les contrôleurs sur le payload fourni par la stratégie Passport.

#### Annuaire Professionnel & KYB
- **Base de données** : Nouvelle migration Prisma pour ajouter les profils d'entreprises formelles (RCCM, NIF, adresse) et informelles (collectifs libres, artisans sans RCCM). Retrait du modèle brouillon `Wallet`.
- **Espace Équipe** : Écran `/dashboard/company` permettant de créer une structure, éditer ses informations, et inviter des collaborateurs par email avec des rôles fins (`ADMIN` ou `EMPLOYEE`).
- **Recherche & Fiches Publiques** : 
  - Module public `/annuaire` pour rechercher et filtrer les structures et solos (les utilisateurs ayant le rôle `PROVIDER`).
  - Écrans vitrines publics `/annuaire/solo/[id]` et `/annuaire/company/[id]` présentant la bio, les infos de contact, l'équipe et les actions de mise en relation (chat, devis).
#### Correctifs de Build
- Remplacement de `ServiceWorkerGlobalScope` par `WorkerGlobalScope` dans `sw.ts` pour corriger les erreurs de compilation TypeScript Next.js.

### 2.10 Travail réalisé au 2026-06-28 (Sprint 1.10 - Recrutement & Services)

- **Modélisation Base de Données (Prisma)** :
  - Ajout du modèle `Contract` pour la génération et validation des contrats entre prestataire et client.
  - Ajout du modèle `Review` pour gérer la notation bilatérale en fin de mission.
  - Ajout du modèle `Message` avec flag `isFiltered` pour héberger le chat interne de la mission et préparer le filtrage anti-contournement.
  - Correction de `ServiceRequest` par l'ajout de `categoryId`.
- **Backend (API NestJS)** :
  - Ajout de `completeRequest` : passe le besoin en `COMPLETED` et appelle automatiquement le déblocage du séquestre (`releaseEscrow`).
  - Ajout de `cancelRequest` : permet d'annuler une mission non finalisée.
  - Ajout de `submitReview` : soumission de note et commentaire avec validation RBAC stricte (seul le client ou prestataire de la mission peut noter).
- **Validation** : Le code complet compile sans erreur (`npm run build`). Migration exécutée et Base de Données synchronisée.

---


### 2.11 Travail réalisé au 2026-06-28 (Sprint 1.14 - Sécurité & Préparation Vercel)

- **Hardening Backend (NestJS)** :
  - Installation et configuration de `helmet` pour la sécurité des en-têtes HTTP (anti-XSS, anti-sniffing).
  - Intégration de `@nestjs/throttler` pour le **Rate Limiting** global (anti-spam, 100 requêtes/minute/IP).
- **Adaptateur Serverless (Vercel)** :
  - Création de `apps/backend/api/index.ts` exportant l'instance NestJS en fonction serverless.
  - Ajout de `apps/backend/vercel.json` pour rediriger les requêtes vers la fonction serverless.
  - Le code original du `main.ts` (incluant les WebSockets) est conservé intact pour les environnements classiques et le dev local.
- **Fiabilisation des builds** :
  - Correction d'un bug TypeScript (`isHydrated`) dans le layout de l'administration (`apps/frontend/src/app/admin/layout.tsx`).
  - Validation du `npm run build` global via Turborepo avec 100% de succès.

### 2.12 Travail réalisé au 2026-06-28 (Sprint 1.6 - App Mobile MVP)

- **Architecture React Native / Expo** :
  - Mise en place complète du dossier `apps/mobile/src` avec séparation (api, components, navigation, screens, store, theme).
  - Configuration de **Zustand** pour l'état global et de **Axios** pour le client API.
- **Sécurité et Authentification** :
  - Intégration de `expo-secure-store` pour chiffrer le stockage du JWT.
  - Implémentation d'un intercepteur Axios pour injecter automatiquement le token dans les requêtes API.
- **Design System Natif** :
  - Création de composants natifs calqués sur la charte web (`Button`, `Input` avec gestion d'erreurs).
- **Navigation et Écrans** :
  - `RootNavigator` intelligent (Aiguillage Auth vs Main).
  - Écrans `LoginScreen` et `SignupScreen` connectés au backend.
  - Écran `ProfileScreen` avec bouton de déconnexion fonctionnel.


### 2.13 Travail réalisé au 2026-06-28 (Sprint 2.1 à 2.4 - Phase 2 Croissance)

- **Sprint 2.1 : Agendas et RDV en ligne** :
  - **Modélisation** : Ajout des modèles `Availability` et `Booking` dans le schéma Prisma pour la gestion des agendas des prestataires.
  - **Backend** : Création de `AppointmentsModule` (CRUD disponibilités, réservations, statuts CONFIRMED/CANCELLED/COMPLETED).
  - **Frontend** : Ajout du sélecteur de créneaux sur le profil indépendant public (`/annuaire/solo/[id]`) et de la console de gestion d'agenda dans le dashboard (`/dashboard/appointments`).
- **Sprint 2.2 : Téléconsultation et Appel Vidéo** :
  - **Modélisation & Backend** : Modèle `VideoSession` associé aux rendez-vous, avec simulation de jeton d'accès sécurisé dans `VideoModule`.
  - **Frontend** : Création d'une interface de visioconférence WebRTC simulée sur la route dynamique `/dashboard/video/[bookingId]` avec gestion locale de la caméra/micro et fermeture de session.
- **Sprint 2.3 & 2.4 : Location et Vente de Véhicules** :
  - **Modélisation** : Enrichissement du modèle `Vehicle` (`isForRent`, `isForSale`, `salePrice`, `status`) et création des modèles `Inspection` et `RentalContract`.
  - **Backend** : Création du module `VehiclesModule` gérant les locations (génération automatique de contrat de location PDF de séquestre) et l'achat direct de véhicules.
  - **Frontend** : Page de marketplace de véhicules (`/marketplace/vehicles`) permettant aux utilisateurs de lister leur véhicule, de filtrer les résultats et de louer ou d'acheter en direct avec processus de checkout.

## 3. Architecture cible (vue d'ensemble)

### 3.1 Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE (CDN/WAF/DDoS)                │
└─────────────────────┬───────────────────────────┬───────────────┘
                      │                           │
              ┌───────▼────────┐         ┌────────▼────────┐
              │   VERCEL/Web   │         │ Mobile (RN/Expo)│
              │   Next.js+PWA  │         │  Android + iOS  │
              └───────┬────────┘         └────────┬────────┘
                      │                           │
                      └─────────────┬─────────────┘
                                    │ HTTPS (REST + GraphQL + WS)
                            ┌───────▼────────┐
                            │   API Gateway  │
                            │  (NestJS)      │
                            └───────┬────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
   ┌────▼────┐                ┌─────▼─────┐                ┌────▼────┐
   │  Auth   │                │ Domain    │                │   IA    │
   │ Module  │                │ Modules   │                │ Module  │
   └────┬────┘                │ (mp/svc/  │                └────┬────┘
        │                     │  veh/ads/ │                     │
        │                     │  pay/...) │                     │
        │                     └─────┬─────┘                     │
        │                           │                           │
        └───────────┬───────────────┴────────────┬──────────────┘
                    │                            │
            ┌───────▼────────┐           ┌───────▼────────┐
            │  PostgreSQL    │           │     Redis      │
            │  (Supabase →   │           │ Cache + Queues │
            │  Docker VPS)   │           │  (BullMQ)      │
            └───────┬────────┘           └────────────────┘
                    │
            ┌───────▼────────┐           ┌────────────────┐
            │  Storage       │           │  Search        │
            │ Supabase →     │           │ Meilisearch /  │
            │ MinIO + R2     │           │ Typesense      │
            └────────────────┘           └────────────────┘
```

### 3.2 Structure Monorepo

```
d:\zen\projets\Doc\
├── apps/
│   ├── frontend/          # Next.js 14+ (App Router) — interface web
│   ├── backend/           # NestJS — Monolithe Modulaire (API REST + GraphQL + WS)
│   └── mobile/            # React Native + Expo — app Android & iOS
│
├── packages/
│   └── shared/            # Types TypeScript, schémas Zod, constantes partagés
│
├── docs/                  # Documentation projet
│   ├── cahier-des-charges.md
│   ├── sprint.md
│   ├── memoire.md
│   └── ct.txt
│
├── turbo.json             # Configuration Turborepo
├── package.json           # Workspace root (npm workspaces)
├── implementation_plan.md # Plan d'implémentation en cours
└── .gitignore
```

---

## 4. Modules et responsabilités

| Module | Rôle | Notes |
|--------|------|-------|
| auth | Inscription, login, 2FA, sessions, OAuth | — |
| users | Profils, rôles cumulés, préférences | — |
| companies | Comptes entreprise multi-utilisateurs | — |
| kyc | Vérification d'identité multi-niveaux | Provider à choisir : recommandation Smile Identity |
| marketplace | Produits, panier, commandes, livraisons | Panier multi-vendeurs |
| services | Recrutement, missions, contrats, devis | 3 modes de mise en relation |
| vehicles | Location + vente véhicules + état des lieux numérique | Tous types |
| ads | Siryia Ads Manager (self-service + managé) | Forfait privilégié |
| payments | Mobile Money + carte + escrow + reversements + commissions | PSP à choisir |
| notifications | Push + email + SMS + WhatsApp + in-app | Centre unique |
| messaging | Chat texte/voix/vidéo + filtrage anti-contournement | WebRTC à terme |
| ai | Assistant guide, RAG, modération, matching, anti-fraude | LangChain |
| admin | Dashboards, modération, support, finance | RBAC granulaire |
| audit | Logs immuables de toutes actions sensibles | Append-only |

---

## 5. Comptes & accès (à compléter au fur et à mesure)

> ⚠️ Ne JAMAIS mettre de mots de passe ou clés ici. Seulement les **références** vers le coffre-fort de secrets (Vault / Doppler / 1Password Teams).

| Service | URL / Ref | Owner | Notes |
|---------|-----------|-------|-------|
| GitHub Org | _à créer_ | — | — |
| Cloudflare | _à créer_ | — | — |
| Vercel | _à créer_ | — | — |
| Supabase (dev) | https://tzywvtwatwxsksrqismt.supabase.co | Utilisateur | Base de données principale, Auth et Storage |
| Supabase (staging) | _à créer_ | — | — |
| Supabase (prod) | _à créer_ | — | — |
| Expo EAS | _à créer_ | — | — |
| PSP (CinetPay/PayDunya/Flutterwave) | _à choisir_ | — | — |
| KYC (Smile Identity / autre) | _à choisir_ | — | — |
| Email (Resend/Postmark/Brevo) | _à choisir_ | — | — |
| SMS (Twilio / opérateurs locaux) | _à choisir_ | — | — |
| WhatsApp Business | _à activer_ | — | — |
| Domaines (siryia.tg / .com / .app) | _à acheter_ | — | — |
| Coffre-fort secrets | _à choisir (Doppler / Vault / 1Password)_ | — | — |
| Monitoring (Sentry, Better Stack) | _à créer_ | — | — |

---

## 6. Conventions de code

- **Langues** : tout en TypeScript strict (front + back + mobile).
- **Style** : ESLint + Prettier + Conventional Commits.
- **Branches** : `main` (prod) ← `develop` (staging) ← `feat/*`, `fix/*`, `chore/*`.
- **PR** : 1 reviewer minimum, CI verte, signed commits, description structurée (contexte / changements / tests / risques).
- **Commits** : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `security:`).
- **Naming DB** : `snake_case`, tables au pluriel.
- **Naming code** : `camelCase` (variables), `PascalCase` (classes/types), `UPPER_SNAKE` (constantes env).
- **i18n** : toutes les chaînes externalisées dès l'écriture.
- **Tests** : pas de PR sans tests (sauf typo doc).
- **Secrets** : jamais commités ; pre-commit hook `gitleaks`.

---

## 7. Politique de sécurité (synthèse)

(Détaillée dans `sprint.md` § Sécurité globale.)

- OWASP Top 10 + ASVS L2.
- HTTPS / TLS 1.3 partout.
- Argon2id passwords + HIBP check.
- 2FA obligatoire pour rôles internes ; option pour tous, obligatoire après KYC.
- JWT court + refresh rotatif révocable.
- Rate limiting + anti-bruteforce + WAF Cloudflare.
- Validation Zod / class-validator sur tous DTOs.
- RLS Postgres activée par défaut (deny-all puis policies).
- Logs sécurité immuables (append-only).
- Pentests trimestriels + bug bounty (phase 2+).
- DAST + SAST + scan deps + SBOM dans la CI.
- Threat modeling avant chaque feature majeure.
- Chiffrement AES-256 au repos pour KYC/contrats/factures.

---

## 8. Problèmes rencontrés & résolutions

> À remplir au fur et à mesure. Format :
> - **Date** : YYYY-MM-DD
> - **Problème** : description
> - **Cause** : analyse
> - **Solution** : ce qu'on a fait
> - **Leçon** : à retenir pour ne pas refaire l'erreur

- **Date** : 2026-06-25
- **Problème** : Erreur de validation Prisma : `The datasource property url is no longer supported in schema files`.
- **Cause** : Prisma version 7 a supprimé la propriété `url` dans le bloc `datasource` du fichier `schema.prisma`.
- **Solution** : Suppression de la ligne `url = env("DATABASE_URL")` dans `schema.prisma` et utilisation exclusive de `prisma.config.ts` qui s'appuie sur `dotenv`.
- **Leçon** : Toujours vérifier la documentation de la dernière version majeure (Prisma 7+) car les conventions changent (notamment la configuration du client).

- **Date** : 2026-06-25
- **Problème** : Erreur lors de la migration `npx prisma migrate dev` : `Can't reach database server at db.xxx.supabase.co:5432`.
- **Cause** : Supabase configure ses "Direct connections" en IPv6 uniquement. De nombreux FAI ou configurations locales Windows ne supportent pas bien l'IPv6.
- **Solution** : Utilisation du **Session pooler** de Supabase (`aws-0...pooler.supabase.com:5432`) qui résout vers une adresse IPv4 et permet les migrations Prisma.
- **Leçon** : Toujours privilégier l'URL du Pooler (Session ou Transaction) de Supabase pour éviter les blocages de connectivité locale sous Windows.

- **Date** : 2026-06-20
- **Problème** : Erreur `npm install` (`npm error Unsupported URL Type "workspace:": workspace:*`) lors de l'ajout de `@siryia/shared` au frontend.
- **Cause** : La syntaxe `workspace:*` est propre à `pnpm` ou `yarn`. L'outil natif `npm` ne la supporte pas et utilise simplement un numéro de version ou `*`.
- **Solution** : Remplacement de `"@siryia/shared": "workspace:*"` par `"@siryia/shared": "*"` dans `apps/frontend/package.json`.
- **Leçon** : Dans un monorepo géré avec npm pur (npm workspaces), toujours utiliser `"*"` pour lier les packages internes.

- **Date** : 2026-06-20
- **Problème** : Initialisation manquée de Prisma due à des séparateurs de commande incompatibles dans PowerShell.
- **Cause** : L'utilisation de `&&` est invalide en PowerShell natif, ce qui fait échouer les chaînes d'installation `npm install x && npm install y`.
- **Solution** : Utilisation du séparateur `;` propre à PowerShell, ou séparation en appels distincts.
- **Leçon** : Toujours utiliser des commandes compatibles Windows (`;`) ou multiplateformes lors de la manipulation du terminal de l'IDE sous Windows.

- **Date** : 2026-06-28
- **Problème** : Échec de la commande `npx prisma generate` avec l'erreur `EPERM: operation not permitted`.
- **Cause** : Le serveur de développement NestJS en watch mode tournait en arrière-plan et verrouillait le fichier de moteur de requête Prisma (.dll.node sous Windows).
- **Solution** : Arrêter temporairement le processus NestJS (`npm run dev`) pour libérer le fichier, puis exécuter `npx prisma generate`.
- **Leçon** : Avant de régénérer le client Prisma après des migrations de schéma, veiller à couper temporairement les serveurs actifs qui exploitent la base.

- **Date** : 2026-06-28
- **Problème** : Erreur de compilation `TS5103: Invalid value for '--ignoreDeprecations'` lors du lancement du serveur de dev NestJS.
- **Cause** : NestJS utilise un compilateur CLI ou une version globale de TypeScript qui ne reconnaît pas l'option `"ignoreDeprecations": "6.0"` ajoutée pour Jest.
- **Solution** : Suppression complète de `"baseUrl": "./"` et `"ignoreDeprecations": "6.0"` dans `apps/backend/tsconfig.json`. Comme le backend n'utilise pas de path mapping, `baseUrl` était inutile.
- **Leçon** : Éviter d'ajouter des drapeaux de contournement de dépréciation dans `tsconfig.json` si la cause sous-jacente (comme `baseUrl`) peut être simplement supprimée.

---

## 9. Glossaire

- **Escrow** : séquestre des paiements par Siryia jusqu'à validation de la livraison/prestation.
- **KYC** : Know Your Customer — vérification d'identité.
- **KYB** : Know Your Business — vérification entreprise.
- **AML** : Anti-Money Laundering.
- **PSP** : Payment Service Provider.
- **DPA** : Data Processing Agreement.
- **DPO** : Data Protection Officer.
- **PCA / PRA** : Plan de Continuité / Plan de Reprise d'Activité.
- **DoD** : Definition of Done.
- **ADR** : Architecture Decision Record.
- **RLS** : Row Level Security (Postgres/Supabase).
- **OWASP** : Open Web Application Security Project.
- **ASVS** : Application Security Verification Standard.
- **SAST / DAST** : Static / Dynamic Application Security Testing.
- **SBOM** : Software Bill Of Materials.
- **MVP** : Minimum Viable Product.
- **NPS** : Net Promoter Score.
- **SLO / SLA** : Service Level Objective / Agreement.
- **HPA** : Horizontal Pod Autoscaler (Kubernetes).
- **OTP** : One-Time Password.
- **PWA** : Progressive Web App.
- **OIDC / SSO** : OpenID Connect / Single Sign-On.

---

## 10. Liens utiles (à remplir)

- Repos : _à créer_
- Figma : _à créer_
- Tableau de projet (Linear/Jira) : _à créer_
- Doc interne (Notion/Slite) : _à créer_
- Statut public : _à créer_
- Centre d'aide : _à créer_

---

## 11. Notes libres / inspirations / idées en attente

- Étudier les modèles : Jumia, Glovo, Yango, Click&Collect Africa, Smile.com.ng, Kobo360, M-Pesa, Wave.
- Étudier les meilleures pratiques de Stripe pour le DX (developer experience) — viser le même niveau côté Siryia Ads & API publique.
- Penser dès le début à un mode "lite" très léger pour les téléphones bas de gamme et les zones à très faible bande passante (<200 ko initial bundle).
- Envisager un programme **ambassadeurs** locaux pour densifier le réseau coursiers + onboarding vendeurs/prestataires sur le terrain.
- Conserver la possibilité de réintroduire un wallet interne plus tard si la demande utilisateur le justifie.

---

## 12. Prochaines étapes immédiates

> Ordre chronologique strict. Chaque étape dépend de la précédente.

### Étape A — Validation du plan monorepo (TERMINÉ ✅)
- L'utilisateur a validé le `implementation_plan.md` (architecture Monolithe Modulaire + structure Monorepo Turborepo).

### Étape B — Restructuration en Monorepo (TERMINÉ ✅)
- Turborepo et npm workspaces initialisés à la racine.
- `siryia-web/` déplacé vers `apps/frontend/`.
- `apps/backend/` (squelette NestJS) initialisé.
- `apps/mobile/` (squelette Expo) initialisé.
- `packages/shared/` créé.
- Fichiers doc déplacés dans `docs/`.

### Étape C — Sprint 0.3 : Infra dev complète (TERMINÉ ✅)
- Configurer la CI GitHub Actions (lint, type-check, test, build, audit).
- Branch protection sur `main`.
- Conventional Commits + commitlint + husky.
- ESLint + Prettier + TypeScript strict partagés.
- Docker Compose local (Postgres + Redis).
- Scripts d'onboarding développeur.

### Étape D — Sprint 1.1 : Backend (squelette) (TERMINÉ ✅)
- Initialiser NestJS dans `apps/backend/` avec architecture modulaire.
- Connecter à Supabase (Postgres) via Prisma.
- Modèle User de test + génération du client.
- Health check, logger, config centralisée.
- Documentation Swagger auto-générée sur `/api/docs`.

### Étape E — Sprint 1.2 : Authentification (TERMINÉ ✅)
- Inscription email + mot de passe (hachage Argon2id).
- Connexion avec génération de JWT (15min par défaut).
- Protection des routes via `JwtAuthGuard` et Passport.
- Décorateur `@CurrentUser()`.
- Variables d'environnement pour la clé JWT secrète.

### Étape F — Sprint 1.3 : Modélisation Base de Données (Prisma) (TERMINÉ ✅)
- [x] Traduire le cahier des charges en tables Prisma (`schema.prisma`).
- [x] Modéliser les `Company`, `Role`, `Product`, `Order`, `Service`, `Vehicle`, `Ad`.
- [x] Remplacer le Docker local par la base Supabase Cloud (via Session pooler IPv4).
- [x] Générer la première vraie migration (`npx prisma migrate dev --name init_full_schema`).

### Étape G — Sprint 1.4 : KYC Backend (TERMINÉ ✅)
- [x] Module `KycModule` (upload, statut).
- [x] Abstraction Provider (MockSmileIdentity).
- [x] Storage Supabase (bucket privé protégé).
- [x] RBAC modérateur (`RolesGuard`).

### Étape H — Sprint 1.5 : Frontend Web Complet (TERMINÉ ✅)
- [x] Connexion du frontend Next.js à notre API locale.
- [x] Pages login, signup.
- [x] Dashboard utilisateur protégé par SSR (refonte thème clair).
- [x] Interface d'Upload KYC (Formulaire + Drag&Drop).
- [x] Server Actions pour sécurité maximale des transferts.
- [ ] Page de gestion du Profil.
- [ ] PWA + SEO (À peaufiner avant prod).

### Étape I — Sprint 1.6 : Parité Mobile (TERMINÉ ✅)
- [x] Installation React Navigation (Tabs + Stack).
- [x] Axios + Expo Secure Store (Authentification).
- [x] Ecrans Auth (Login / Signup).
- [x] Dashboard Mobile et Thème Corporate.
- [x] Upload KYC depuis le téléphone (`expo-image-picker`).
- [x] Écran testeur de Paiements et Escrow.

### Étape J — Sprint 1.7 : Paiements & Escrow Backend (TERMINÉ ✅)
- [x] Modélisation Prisma validée (`Payment`, `Order`).
- [x] Interface commune `IPaymentProvider`.
- [x] Adaptateur `MockPaymentService`.
- [x] Initiation de paiement et gestion du `isEscrowed`.
- [x] Endpoints webhooks de retour (T-Money/Moov factices).
- [x] Endpoint de `releaseEscrow` (Transfert vers le vendeur automatisé).

### Étape K — Sprint 1.8 : Profils Entreprises & Annuaire (TERMINÉ ✅)
- [x] Modèles Prisma pour Entreprises (KYB) avec vérification RCCM.
- [x] Espace équipe `/dashboard/company` pour gestion collaborative.
- [x] Vitrines publiques `/annuaire` (Recherche, filtres, pages Solos et Entreprises).

### Étape L — Sprint 1.10 : Recrutement & Services (TERMINÉ ✅)
- [x] Création des requêtes de services (ServiceRequest).
- [x] Gestion des contrats et de l'avancement (Lifecycle métier).
- [x] Implémentation du système de reviews bilatérales.
- [x] Logique de libération de l'escrow à la fin de la mission.

### Étape M — Sprint 1.11 : Messagerie & Notifications (TERMINÉ ✅)
- [x] Gateway WebSockets avec Socket.io (`apps/backend`).
- [x] Sécurisation temps réel via JWT & authentification.
- [x] Anti-contournement dynamique : regex détectant emails et téléphones pour censurer les coordonnées hors mission.
- [x] Frontend Next.js : Store `Zustand` pour persistance de l'instance Socket.io.
- [x] Interface `/dashboard/messages` (historique, envoi dynamique sans rechargement).
- [x] Système de notification in-app (`NotificationBell`) sur le Dashboard.

### Étape N — Sprint 1.12 : Support Client (Ticketing) (TERMINÉ ✅)
- [x] Modèles Prisma pour `Ticket`, `TicketMessage` et `KnowledgeArticle`.
- [x] API NestJS : `SupportModule` pour la création et gestion de tickets utilisateurs.
- [x] Frontend Next.js : Interfaces du chat Support `/dashboard/support/[id]`.
- [x] Base de connaissances : Page publique de FAQ `/faq`.

### Étape O — Sprint 1.13 : Console d'Administration Globale (TERMINÉ ✅)
- [x] Hyper-sécurisation du backend : Injection des rôles (ex: `ADMIN`) dans la stratégie JWT et le `RolesGuard`.
- [x] Layout hyper-sécurisé Next.js : Création du sous-domaine virtuel `/admin` accessible uniquement aux admins.
- [x] Dashboard KPI : Cartes globales (Volume d'Affaires GMV, Tickets ouverts, Inscriptions).
- [x] Gestion KYC & Utilisateurs : Tableaux de validation avec boutons d'approbation `PENDING` -> `VERIFIED`.
- [x] Modération de Litiges : Vue globale de la file d'attente des tickets d'urgence.
- [x] Supervision Financière : Tableaux de bord de l'Escrow global des commandes en cours, avec possibilité de forcer la libération.

> Les autres sprints (1.14 → 1.16 : Hardening Sécurité, Soft Launch) sont détaillés dans le fichier `sprint.md`.

---

## 13. Règles de fonctionnement du projet

### 13.1 Fichier `implementation_plan.md`
- Situé à la **racine du projet** (`d:\zen\projets\Doc\implementation_plan.md`).
- Contient le **plan d'implémentation en cours** (un seul à la fois).
- À chaque nouveau plan, l'ancien contenu est **vidé et remplacé**.
- Une **copie de secours** est conservée dans la mémoire dédiée de l'agent.

### 13.2 Fichier `memoire.md`
- Fichier **vivant et évolutif**, mis à jour **à chaque avancée significative**.
- Doit contenir **tout ce qui est nécessaire** pour qu'un nouvel agent (ou le même agent dans une nouvelle discussion) puisse reprendre le projet sans perte de contexte.
- Sert de **source de vérité** sur l'état du projet, les décisions prises, les conventions, et les prochaines étapes.

### 13.3 Règle du Garde-fou (ADR-015)
- L'agent doit **contredire et recadrer** l'utilisateur si une proposition va à l'encontre des bonnes pratiques.
- L'utilisateur veut un **expert**, pas un exécutant aveugle.

### 13.4 Contenu du MVP (rappel)
Le MVP (Phase 1, Sprints 1.1 → 1.16, Togo uniquement) comprend :
- **Marketplace** (catalogue, panier multi-vendeurs, commandes, livraisons).
- **Recrutement & Services** (3 modes de mise en relation, contrats, escrow).
- **Paiements** (TMoney, Moov, cartes, escrow complet).
- **Auth + Profils + KYC**.
- **Annuaire V1 (Lite)** : Profils enrichis, portfolio, bouton de contact (sans agenda).
- **Messagerie + Notifications multi-canal**.
- **Support client (Ticketing)**.
- **Back-office Admin complet + KPI temps réel**.

Modules **exclus** du MVP (Phase 2+) :
- **Assistant IA (RAG, Chatbot 24/7)**.
- Annuaire Phase 2 (Prise de RDV en ligne, agendas, téléconsultation vidéo).
- Location/Vente de véhicules.
- Espace publicitaire (Ads Manager).
- Expansion géographique.

---

### 13.5 État d'avancement (2026-06-28)
- **Marketplace & Paiement** : Liaison du checkout panier avec le module `payment` pour l'initiation automatique du paiement séquestre (TMoney / Moov Money) avec correctifs d'authentification (`user.sub` -> `user.id`).
- **Annuaire & Profils Professionnels** : Implémentation du module de recherche globale unifié d'indépendants solos (rôle `PROVIDER`) et de structures (entreprises formelles avec RCCM/NIF et collectifs informels).
- **Dashboard Équipe (KYB)** : Ajout de la page `/dashboard/company` pour enregistrer sa structure, gérer ses informations de contact, et inviter des collaborateurs par email.
- **Vitrines Publiques** : Création des pages de recherche d'artisans (`/annuaire`), et des fiches détaillées solos (`/annuaire/solo/[id]`) et entreprises (`/annuaire/company/[id]`) en V2 Pro/Organique.
- **Sprint 1.11 (Frontend Messagerie)** : Création d'un store Zustand persistant pour Socket.io (`useSocketStore.ts`), implémentation de l'interface complète de la messagerie (`/dashboard/messages`) avec historique et anti-contournement dynamique, et ajout d'un système de cloche de notifications temps réel en haut du Dashboard. Code validé et commité sur le dépôt.

---

_Dernière mise à jour : 2026-06-28 (Fin du Sprint 1.11 - Backend et Frontend Messagerie & Notifications)._

---

## 14. Bilan Global et Point de Reprise (POUR L'AGENT SUIVANT)

> **⚠️ À L'ATTENTION DU PROCHAIN AGENT IA** : Si vous reprenez ce projet dans une nouvelle session, voici l'état exact du système au **28 Juin 2026** :

1. **Phase 1 (MVP) 100% Fonctionnelle** : 
   - L'architecture Monorepo (Next.js, NestJS, Expo) est en place.
   - Les Sprints 1.1 à 1.13 ont été entièrement codés, testés et déployés sur l'environnement local/Supabase de dev.
   - Le système inclut la Messagerie WebSocket (1.11), le Ticketing/Support (1.12) et la Console d'Administration Globale (1.13).

2. **État de la Base de Données (Prisma / Supabase)** :
   - Tous les modèles (Utilisateurs, Commandes, Tickets, KYC, Entreprises, Messages) sont créés dans `schema.prisma`.
   - La migration a été appliquée sur Supabase (Pooler IPv4 utilisé).
   - *Note système : en cas de modification future du `schema.prisma`, arrêtez toujours le serveur backend (`npm run dev`) avant de faire `npx prisma generate` sur Windows pour éviter l'erreur EPERM.*

3. **État de l'Authentification** :
   - Protégé par JWT (Argon2id). Le JWT est stocké en Cookie HttpOnly côté Next.js (Server Actions) et SecureStore côté Expo.
   - **Important** : Le `RolesGuard` est actif côté backend. Pour tester la route `/admin`, l'utilisateur de test doit posséder le rôle `ADMIN` en base de données. Les requêtes JWT incluent `req.user.roles`.

4. **Prochaine Action (Sprint 1.14)** :
   - Le prochain sprint logique est le **Sprint 1.14 : Hardening Sécurité + Tests de charge + Pré-prod**.
   - Cela implique la vérification des middlewares de sécurité (Helmet, Rate Limiting), la configuration des logs (Winston), et les ajustements finaux avant un déploiement réel sur Vercel/VPS.

5. **Règles absolues** : 
   - Ne **JAMAIS** proposer de code "brouillon" ou bas de gamme.
   - Conservez le design system (Corporate Light Mode, Bleu #17519B et Or #D49A25).
   - Toujours mettre à jour `implementation_plan.md` avant de coder, et `memoire.md` après.

## 15. Correctifs Post-MVP et Améliorations Auth (Sprint 1.13b)
- **Correction des 404 de l'API** : Le préfixe global `api` était doublé dans les contrôleurs (Annuaire, Recrutement, Marketplace, etc.). Cela a été corrigé.
- **Support React 19** : Migration de `useFormState` vers `useActionState` dans les formulaires d'authentification.
- **UI/UX et Responsive** : Correction de la lisibilité de la page de connexion (Light Mode) et blocage du scroll horizontal sur mobile.
- **Authentification Numéro de Téléphone** : 
  - La base de données autorisait déjà `email` ou `phone` de manière optionnelle.
  - Mise à jour du backend (`auth.service`, `users.service`, DTOs) pour permettre la connexion ou l'inscription avec un email **OU** un numéro de téléphone via un champ unique nommé `identifier`.
  - Mise à jour des formulaires Frontend (Label "Email ou Téléphone", Type "text").
- **Page Services** : Création d'une page `apps/frontend/src/app/services/page.tsx` pour combler la 404 en attendant l'intégration complète du module de recrutement.

**Statut** : Le MVP est maintenant stabilisé, parfaitement fonctionnel de bout en bout, sans scroll horizontal, et supporte les numéros de téléphone. Prêt pour le **Sprint 1.14 (Sécurité & Pré-prod)**.

## 16. Stratégie de Déploiement (Pré-Prod vs Prod)
Suite à des échanges, voici la stratégie retenue :
- **Pré-Production / Démo** : Le Frontend et le Backend seront tous les deux hébergés sur **Vercel** pour avoir une démo en ligne rapidement présentable. Le backend NestJS nécessitera un adaptateur (fichier `api/index.ts` et `vercel.json`) pour tourner en mode "Serverless". La messagerie (WebSockets) ne fonctionnera pas en temps réel (fallback en HTTP/latence), mais ce n'est pas grave pour la démo.
- **Production finale** : Le frontend restera sur Vercel, mais le Backend migrera sur un serveur dédié ou un service PaaS permanent (Render/Railway) pour assurer le temps réel.

## 17. Point d'étape global et Décisions d'Hébergement

### Ce qui a été acté :
- **MVP Complété à 100%** : Le cycle complet des Sprints 1.1 à 1.13 est terminé. Les fonctionnalités critiques (Auth par téléphone, Paiements, Escrow, Messagerie temps réel, Back-office Admin, Recrutement) sont validées localement et la base de données (Supabase) est à jour.
- **Décision Vercel (Pré-production)** : Pour des besoins de présentation rapide, le projet complet (Frontend et Backend) pourra être déployé temporairement sur Vercel. 
  - **Avantage** : Gratuit, rapide, lien en ligne pour les démos.
  - **Inconvénient assumé** : La messagerie WebSockets perdra son temps réel pur (fallback HTTP dû au mode serverless de Vercel). Cela reste acceptable pour une démo.
- **Environnement Local** : Le développement local (`npm run dev`) continue de bénéficier de 100% de la puissance de Node.js et du temps réel WebSocket.

### Prochaine étape : Sprint 1.14 (Sécurisation et Préparation Vercel)
Pour assurer que l'application ne plante pas lors de sa mise en ligne, le prochain sprint sera dédié à :
1. **Adaptateur Vercel** : Création d'un point d'entrée serverless (`api/index.ts`) et d'un `vercel.json` pour que NestJS tourne sur l'infrastructure Vercel.
2. **Hardening (Sécurité API)** : Intégration de `helmet` (headers HTTP sécurisés), CORS strict, et limitation de requêtes (Rate Limiting) pour bloquer le spam (très important une fois en ligne).
3. **Tests de Build** : S'assurer que le monorepo compile sans la moindre erreur (`npm run build`).

# Sprint 1.5 - Frontend Web (Authentification et Profil)

Ce document décrit le plan pour connecter notre interface Next.js au backend NestJS et construire l'expérience utilisateur (UI/UX) pour l'authentification et le tableau de bord, tout en respectant l'esthétique atypique "glassmorphism sombre" de Siryia.

## Objectif

Permettre à un utilisateur de s'inscrire, de se connecter et d'accéder à son espace personnel sécurisé, en communiquant avec notre base de données Supabase via notre propre API NestJS.

## User Review Required

> [!IMPORTANT]
> **Validation du design system.** L'interface sera conçue exclusivement en mode "Dark", avec des effets de transparence (glass) et des orbes lumineuses en fond, comme décidé lors du Sprint 0.2. Voulez-vous utiliser des bibliothèques de composants bruts (comme shadcn/ui) ou préférez-vous que je code des composants sur-mesure pour garantir ce côté "atypique" ? (Je préconise le sur-mesure pour éviter le côté générique).

## Open Questions

> [!WARNING]
> - Pour le stockage du Token (JWT), préférez-vous qu'on utilise un simple cookie `httpOnly` (géré par le backend) ou qu'on le stocke côté client (LocalStorage/Zustand) pour ce MVP ?
> - Voudrez-vous la connexion par Google/Apple (OAuth) dès ce sprint, ou on se concentre uniquement sur Email/Mot de passe pour l'instant ?

## Proposed Changes

### Composant: Backend (API Gateway)

#### [MODIFY] [main.ts](file:///g:/zen/projets/Doc/apps/backend/src/main.ts)
- Ajout de `app.enableCors()` pour autoriser le port `3000` (Next.js) à faire des requêtes vers le port `3001` (NestJS) sans blocage de sécurité navigateur.

### Composant: Frontend (Next.js)

#### [NEW] Configuration et Dépendances
- Installation de `axios` pour les requêtes HTTP vers l'API.
- Installation de `zustand` pour la gestion d'état global (stocker l'utilisateur connecté).
- Installation de `@tanstack/react-query` pour gérer le cache et l'état des requêtes.

#### [NEW] Fichiers utilitaires
- `src/lib/api.ts` : Instance Axios préconfigurée (intercepteur pour ajouter automatiquement le token JWT à chaque requête).
- `src/store/useAuthStore.ts` : Store Zustand pour garder en mémoire si l'utilisateur est connecté.

#### [NEW] UI Components (Design System Siryia)
- `src/components/ui/Input.tsx` : Champ de texte stylisé avec bordures lumineuses au focus.
- `src/components/ui/Button.tsx` : Bouton avec effets de hover dynamiques et support de chargement (spinner).
- `src/components/ui/GlassCard.tsx` : Conteneur semi-transparent avec flou d'arrière-plan.

#### [NEW] Pages d'Authentification
- `src/app/(auth)/login/page.tsx` : Formulaire de connexion (Email + Password).
- `src/app/(auth)/signup/page.tsx` : Formulaire d'inscription (Email + Password + Nom).

#### [NEW] Espace Sécurisé
- `src/app/dashboard/layout.tsx` : Layout protégé qui vérifie si l'utilisateur est connecté, sinon redirection vers `/login`.
- `src/app/dashboard/page.tsx` : Tableau de bord de bienvenue affichant les informations du profil utilisateur récupérées depuis le backend.

## Verification Plan

### Automated Tests
- Vérification que `npm run build` passe sans erreurs TypeScript sur le frontend.

### Manual Verification
1. Démarrer le backend (`npm run start:dev` dans `apps/backend`).
2. Démarrer le frontend (`npm run dev` dans `apps/frontend`).
3. S'inscrire via l'interface web (création d'un nouvel utilisateur dans Supabase).
4. Se déconnecter puis se reconnecter avec succès.
5. Vérifier que la page `/dashboard` affiche bien les données personnelles du compte.

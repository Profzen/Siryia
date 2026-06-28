# Objectif : Sprint 1.11 — Messagerie & Notifications

L'objectif de ce sprint est de mettre en place une communication fluide et multicanal pour la plateforme Siryia, permettant aux utilisateurs d'échanger en temps réel de manière sécurisée (avec filtrage anti-contournement) et d'être notifiés des événements importants.

## User Review Required

> [!IMPORTANT]
> **Décision d'Architecture - Temps Réel**
> NestJS propose `@nestjs/websockets` avec `Socket.io` pour le temps réel. Est-ce que cette approche vous convient pour le Chat ? Nous utiliserons cela pour implémenter un Gateway WebSocket sécurisé par JWT.
> 
> **Décision d'Architecture - Notifications Push/Email**
> Pour le MVP de notification, nous allons créer les entités de BDD et le module de routage. Voulons-nous implémenter de vrais providers (ex: Resend pour email, Firebase pour Push) maintenant, ou utiliser un `MockNotificationProvider` dans un premier temps comme nous l'avons fait pour KYC et Paiement ?

## Proposed Changes

### Base de Données (Prisma)
- [MODIFY] `schema.prisma`
  - Ajout du modèle `Notification` (id, userId, title, body, type, isRead, actionUrl, createdAt).
  - Modification du modèle `Message` pour supporter les types de messages (TEXT, IMAGE, AUDIO) et les pièces jointes (URLs).
  - Ajout de la relation `notifications Notification[]` sur le modèle `User`.

### Backend (API NestJS)
- [NEW] `apps/backend/src/messaging/messaging.module.ts` (et ses contrôleurs/services associés).
  - Endpoint HTTP pour récupérer l'historique des conversations (`GET /messaging/conversations` et `GET /messaging/:userId/messages`).
  - Implémentation du service `AntiCircumventionService` (Filtrage regex pour masquer téléphones, emails, liens).
- [NEW] `apps/backend/src/messaging/messaging.gateway.ts`
  - Gateway WebSocket (`@WebSocketGateway()`) pour émettre et écouter des messages en temps réel.
  - Authentification via `WsJwtGuard` (vérification du token JWT lors de la connexion socket).
- [NEW] `apps/backend/src/notifications/notifications.module.ts`
  - Modélisation d'un `NotificationService` avec un gestionnaire multicanal (In-App, Email, Push).
  - Endpoints REST pour la gestion In-App (`GET /notifications`, `PATCH /notifications/:id/read`).

## Verification Plan

### Automated Tests
- Validation de la regex anti-contournement avec différents formats de téléphones africains, adresses emails, et RIB maquillés.
- Test unitaire des envois de notifications et du routage (In-App).

### Manual Verification
- Démarrer le serveur NestJS avec le module WebSockets actif.
- Se connecter avec un client test (ex: Postman WebSocket ou client front basique) et vérifier l'envoi, la réception, et la persistance des messages, ainsi que le masquage automatique des données de contact.

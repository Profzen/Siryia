# Sprint 1.10 - Recrutement & Services (Finalisation)

Suite à notre avancée sur la tâche 1.10, nous avons déjà mis en place la création de besoins (`ServiceRequest`), la soumission de devis (`Proposal`), et l'acceptation de devis avec séquestre automatique (`Escrow`). Il reste maintenant à finaliser le cycle de vie de la mission et à corriger quelques incohérences dans le schéma de la base de données.

## User Review Required

> [!IMPORTANT]
> **Modifications de la Base de Données (Prisma)** : Je dois modifier le schéma pour ajouter les éléments manquants pour cette tâche :
> 1. Ajouter le champ `categoryId` à `ServiceRequest` (actuellement dans le DTO mais manquant en base).
> 2. Ajouter un modèle `Review` pour gérer la **notation bilatérale** à la fin d'une mission.
> 3. Ajouter un modèle `Contract` pour la génération et signature de contrats.
> Êtes-vous d'accord pour que je lance ces modifications Prisma (`npx prisma migrate dev`) lors de la phase d'exécution ?

## Open Questions

> [!WARNING]
> - **Messagerie interne anti-contournement** : La tâche 1.10 mentionne une messagerie. Voulez-vous qu'on implémente dès maintenant un modèle `Message` pour le chat interne lié à une mission, ou préfère-t-on s'appuyer sur la messagerie globale prévue pour le Sprint 1.11 ?
> - **Génération PDF des contrats** : Pour le MVP, je propose de créer l'entité `Contract` en base et de simuler la signature électronique via un statut (ex: `SIGNED`), sans intégrer d'outil tiers payant type DocuSign tout de suite. Est-ce que cela vous convient ?

## Proposed Changes

### Schéma Base de Données (Prisma)

#### [MODIFY] [schema.prisma](file:///g:/zen/projets/Doc/apps/backend/prisma/schema.prisma)
- Ajouter `categoryId` et la relation `Category` sur le modèle `ServiceRequest`.
- Créer le modèle `Review` (id, reviewerId, targetId, serviceRequestId, rating, comment).
- Créer le modèle `Contract` (id, serviceRequestId, providerId, clientId, terms, status).

### Composant: Backend (API NestJS)

#### [MODIFY] [recrutement.service.ts](file:///g:/zen/projets/Doc/apps/backend/src/recrutement/recrutement.service.ts)
- Ajouter la méthode `completeRequest(clientId, requestId)` : passe le statut à `COMPLETED` et appelle `paymentService.releaseEscrow()` pour payer le prestataire.
- Ajouter la méthode `cancelRequest(clientId, requestId)` : annulation avant démarrage.
- Ajouter la méthode `submitReview(userId, requestId, dto)` : enregistrer la notation bilatérale en fin de mission.

#### [MODIFY] [recrutement.controller.ts](file:///g:/zen/projets/Doc/apps/backend/src/recrutement/recrutement.controller.ts)
- Exposer les nouvelles routes HTTP `PATCH /requests/:id/complete`, `PATCH /requests/:id/cancel` et `POST /requests/:id/reviews`.

#### [MODIFY] [recrutement.dto.ts](file:///g:/zen/projets/Doc/apps/backend/src/recrutement/dto/recrutement.dto.ts)
- Ajouter `SubmitReviewDto`.

## Verification Plan

### Automated Tests
- Le backend compile sans erreur TypeScript.

### Manual Verification
1. Lancer la migration Prisma.
2. Créer une `ServiceRequest` (qui acceptera désormais une `categoryId`).
3. Soumettre une `Proposal`, l'accepter (ce qui initie le paiement escrow et passe le statut à `IN_PROGRESS`).
4. Appeler la nouvelle route `complete` pour valider la fin de la mission et observer la libération automatique du paiement (`escrowReleasedAt` mis à jour).
5. Soumettre une notation (`Review`) pour tester le retour d'expérience.

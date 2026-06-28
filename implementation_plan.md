# Objectif : Sprint 1.11 — Messagerie & Notifications (Intégration Frontend)

Ce plan décrit l'intégration de la fonctionnalité de chat en temps réel et de la gestion des notifications sur l'interface Next.js (Frontend).

## User Review Required

> [!IMPORTANT]
> **Dépendance nécessaire**
> Je vais installer `socket.io-client` sur le frontend. Êtes-vous d'accord ?
> 
> **Architecture de l'État**
> Nous utiliserons le store global `Zustand` (déjà présent) pour maintenir la connexion active du socket à travers toute l'application (utile pour recevoir les notifs de n'importe où), et la page `/dashboard/messages` s'y abonnera pour l'interface du Chat. Cela vous convient-il ?

## Proposed Changes

### Configuration Globale
- **Installation** : Ajout de `socket.io-client`.
- [NEW] `apps/frontend/src/store/useSocketStore.ts` : Un store Zustand responsable de la création, du maintien et de la destruction de l'instance `Socket`. Il écoutera globalement l'événement `newMessage` et l'événement `newNotification`.
- [MODIFY] `apps/frontend/src/app/dashboard/layout.tsx` : Injection d'un composant de fond (ex: `<SocketProvider>`) pour initialiser le WebSocket dès que l'utilisateur est connecté et se trouve sur son tableau de bord.

### Interface Messagerie
- [NEW] `apps/frontend/src/app/dashboard/messages/page.tsx` : La vue principale regroupant la liste des contacts/conversations à gauche, et la fenêtre de chat à droite.
- [NEW] `apps/frontend/src/components/chat/ConversationList.tsx` : Affichage de la liste des conversations (triées par dernier message).
- [NEW] `apps/frontend/src/components/chat/ChatWindow.tsx` : Affichage dynamique des bulles de messages (`MessageBubble`) avec prise en charge des données filtrées par l'anti-contournement (ex: email masqué).
- [NEW] `apps/frontend/src/components/chat/ChatInput.tsx` : Champ de saisie avec le bouton "Envoyer".

### Interface Notifications (In-App)
- [NEW] `apps/frontend/src/components/notifications/NotificationBell.tsx` : Une cloche dans la barre de navigation du Dashboard qui affiche le compteur de notifications non lues.
- [NEW] `apps/frontend/src/components/notifications/NotificationDropdown.tsx` : Le menu déroulant pour afficher les notifications récentes et le bouton "Tout marquer comme lu".

## Verification Plan

### Manual Verification
- Ouvrir deux navigateurs différents (ou une session normale et une en mode privé).
- Connecter "Alice" sur le navigateur A et "Bob" sur le navigateur B.
- Entamer une discussion depuis l'onglet "Messagerie" : vérifier l'instantanéité de l'envoi/réception sans rechargement de page.
- Tester l'anti-contournement en tapant un numéro de téléphone africain ou un email et vérifier que la bulle s'affiche avec le texte masqué.
- Envoyer une notification système depuis le backend et vérifier que le compteur s'incrémente sur le frontend.

# Sprints du projet Siryia

> Document opérationnel — découpe complète du projet en sprints, du démarrage à la finalisation.
> **Pas de durée imposée** : chaque sprint est validé par sa **Definition of Done (DoD)**, pas par un calendrier.
> Mode intensif — on enchaîne dès qu'un sprint passe le DoD.

---

## Conventions

- **DoD (Definition of Done)** : critères objectifs qui valident la clôture d'un sprint.
- **Livrables** : artefacts concrets produits (code, doc, design, infra).
- **Sécurité** : exigences de sécurité spécifiques au sprint (en plus des règles transverses § Sécurité globale).
- **Tests** : exigences de tests minimales.
- **Mémoire** : ce qui doit être consigné dans `memoire.md` à la fin du sprint.

## Sécurité globale (s'applique à TOUS les sprints)

- HTTPS partout (TLS 1.3), HSTS preload.
- **OWASP Top 10** : XSS, CSRF, SQLi, SSRF, IDOR, Broken Auth, Security Misconfig, Vulnerable Components, Logging, Server-Side Request Forgery — vérifiés à chaque PR.
- **OWASP ASVS L2** comme référentiel cible.
- **Secrets** : jamais en clair dans le code, jamais commités. Stockés dans Vault / Doppler / variables d'env chiffrées.
- **Dépendances** : `npm audit`, `snyk`, Dependabot/Renovate activés, mise à jour hebdo, CVE bloquantes traitées sous 48 h.
- **SAST** (Semgrep, CodeQL) + **DAST** (OWASP ZAP) intégrés à la CI.
- **SBOM** généré à chaque release.
- **Rate limiting** et anti-bruteforce sur toutes les API publiques.
- **Validation stricte** des entrées (Zod côté front, class-validator côté back).
- **Logs sécurité centralisés** (auth, paiement, admin actions) — immuables, horodatés, tamper-evident.
- **2FA** obligatoire pour les rôles internes (Admin, Modérateur, Support) dès le sprint d'auth.
- **Chiffrement au repos** (AES-256) pour tout document sensible (KYC, contrats, factures).
- **Code review obligatoire** par un autre dev avant merge.
- **Branch protection** sur `main` : tests verts + review approuvée + signed commits.
- **Sécurité by design** : threat modeling rapide en début de chaque sprint majeur.
- **Audit trail** complet pour toutes les actions sensibles (qui, quoi, quand, depuis où).

---

# PHASE 0 — Préparation (avant code)

## Sprint 0.1 — Cadrage produit & juridique

**Objectif** : sécuriser les fondations non-techniques.

**Tâches**
- Créer la société (SAS togolaise) ou démarrer la procédure.
- Ouvrir un compte bancaire pro + comptes Mobile Money pro (TMoney, Moov).
- Acheter les domaines : `siryia.tg`, `siryia.com`, `siryia.app`, `siryia.africa`.
- Désigner DPO (Data Protection Officer).
- Sélectionner / contractualiser un juriste pour CGU/CGV/politiques.
- Rédiger une première version des documents juridiques (CGU, CGV, politiques de confidentialité, cookies, contenu interdit, charte de confiance, code de conduite, politique de remboursement, politique de signalement).
- Définir la grille tarifaire indicative (commissions, abonnements).

**Livrables**
- Statuts société + RCCM (ou récépissé en cours).
- Domaines réservés + DNS configuré chez Cloudflare.
- Documents juridiques v1 (PDF).
- Grille tarifaire v1.

**DoD** : domaines réservés, juriste mandaté, documents juridiques v1 disponibles.

**Mémoire** : noter immatriculations, DPO, contacts juridiques, identifiants des domaines.

---

## Sprint 0.2 — Identité visuelle & design system

**Objectif** : poser une base visuelle professionnelle et cohérente.

**Tâches**
- Logo Siryia (variantes : couleur, monochrome, favicon, app icon iOS/Android).
- Charte graphique (palette de couleurs, typographies, iconographie, illustrations).
- **Design system** dans Figma : composants atomiques (Button, Input, Card, Modal, Toast, Badge, Table, etc.) + tokens (couleur, espace, typo, radius, ombres).
- Maquettes haute fidélité des écrans clés du MVP : onboarding, login, profil, marketplace home, fiche produit, panier, checkout, annuaire, fiche prestataire, chat, dashboard utilisateur, dashboard admin.
- Maquettes responsive (desktop, tablette, mobile) + maquettes app mobile.
- Définition du **ton de marque** (verbal identity).

**Livrables**
- Fichier Figma complet avec design system + écrans.
- Brand guidelines PDF.
- Assets exportés (logo SVG/PNG, icônes).

**DoD** : design system validé + 100 % des écrans MVP maquettés et approuvés.

**Mémoire** : URL Figma, conventions de naming, palette finale, tokens.

---

## Sprint 0.3 — Mise en place de l'infrastructure de développement

**Objectif** : tout est prêt pour coder.

**Tâches**
- Création de l'**organisation GitHub** Siryia + repos :
  - `siryia-web` (Next.js)
  - `siryia-mobile` (React Native + Expo)
  - `siryia-api` (NestJS)
  - `siryia-shared` (types, schémas Zod, constantes partagés via npm package privé ou monorepo)
  - `siryia-infra` (Docker, k8s manifests, IaC à terme)
  - `siryia-docs` (cahier des charges, sprints, ADR, runbooks)
- **Décision monorepo vs polyrepo** : monorepo Turborepo recommandé (partage code TS, CI plus simple).
- Mise en place de la **CI GitHub Actions** : lint, type-check, test, build, audit deps, SAST.
- **Branch protection** sur `main` (review + tests verts + signed commits + linear history).
- **Conventional Commits** + commitlint + husky.
- Configuration **ESLint + Prettier + TypeScript strict** partagée.
- Création du projet **Supabase** (org Siryia, projet `siryia-dev`, projet `siryia-staging`).
- Création du compte **Vercel** + connexion au repo `siryia-web`.
- Création du compte **Cloudflare** + DNS, WAF de base, page d'attente.
- Création du compte **Expo EAS** pour le mobile.
- **Outils projet** : Linear / Jira pour le suivi, Notion / Slite pour la doc interne, Slack / Discord pour la communication.
- Templates de PR, d'issue, de release notes.
- **Environnements** : `local` (Docker Compose), `dev` (Supabase + Vercel preview), `staging` (Supabase + Vercel staging), `prod` (Vercel prod + Supabase prod).
- Scripts d'**onboarding développeur** (`setup.sh` qui installe tout).

**Livrables**
- Repos GitHub initialisés et protégés.
- CI verte sur un commit "hello world".
- README et CONTRIBUTING.md complets.
- Page d'attente Siryia accessible sur siryia.com.

**Sécurité**
- Secrets GitHub Actions configurés (jamais d'env en clair dans les workflows).
- Signed commits obligatoires (GPG ou Sigstore).
- Code Owners configurés.
- `.gitignore` strict (jamais de `.env`, `*.pem`, `*.key`).
- Scan des secrets historiques (gitleaks) sur premier commit.

**Tests**
- Job CI qui exécute lint + type-check + test (squelette) + audit.

**DoD** : un dev peut cloner et démarrer le projet en < 15 min ; CI verte ; page d'attente live.

**Mémoire** : noter URLs des services, comptes, conventions monorepo, structure des dossiers.

---

# PHASE 1 — MVP

## Sprint 1.1 — Architecture backend & base de données (squelette)

**Objectif** : poser les fondations techniques du backend.

**Tâches**
- Initialiser le projet **NestJS** (TypeScript strict, ESLint, Jest).
- Architecture modulaire : `auth/`, `users/`, `kyc/`, `marketplace/`, `services/`, `vehicles/`, `ads/`, `payments/`, `notifications/`, `messaging/`, `admin/`, `common/`.
- **Modèle de données initial** dans Supabase (PostgreSQL) :
  - `users`, `user_roles`, `user_profiles`, `companies`, `company_members`.
  - `kyc_documents`, `kyc_verifications`.
  - `addresses`, `phone_numbers`, `verifications` (OTP).
  - `audit_log`, `security_events`.
- **Migrations versionnées** (Prisma ou Drizzle ORM — choix arbitré dans ce sprint, **recommandation : Prisma** pour maturité, écosystème, support TS).
- **Row Level Security (RLS)** Supabase activée sur toutes les tables.
- Module **config** centralisé (variables d'env validées par Zod au boot).
- Module **logger** structuré (Pino) avec corrélation ID par requête.
- Module **health check** (`/health`, `/ready`).
- Documentation **OpenAPI / Swagger** auto-générée.
- Connexion à Supabase via Postgres + utilisation du client Supabase pour Auth/Storage.

**Sécurité**
- Helmet activé par défaut.
- CORS strict.
- Rate limiting global (express-rate-limit / @nestjs/throttler).
- Body size limit, parameter pollution protection.
- Validation Zod / class-validator sur tous les DTOs.
- RLS activée par défaut (deny-all puis policies explicites).

**Tests**
- Tests unitaires des services config, logger, health.
- Test d'intégration : connexion DB OK.

**Livrables** : backend NestJS qui démarre, expose `/health`, connecté à Supabase, schéma DB v1 migré.

**DoD** : `curl /health` répond 200 ; migration appliquée sur dev et staging ; CI verte.

**Mémoire** : choix Prisma vs Drizzle (et pourquoi), structure des modules, conventions de naming DB (snake_case), stratégie de migration.

---

### Sprint 1.5 : Intégration Frontend & Authentification Web - **[Terminé]**s sessions

**Objectif** : un utilisateur peut s'inscrire et se connecter de façon sécurisée.

**Tâches**
- Inscription par : email + mot de passe, téléphone + OTP SMS, Google, Facebook, Apple.
- Connexion + déconnexion + rafraîchissement de session.
- **2FA** (TOTP via app type Google Authenticator + SMS de secours).
- Récupération de mot de passe (email avec token signé, expiration courte).
- Vérification email (lien magique signé).
- Vérification téléphone (OTP 6 chiffres, expiration 5 min, 3 tentatives max).
- **Sessions** : JWT court + refresh token rotatif stocké en DB, révocation possible.
- Détection de connexion suspecte (nouvel appareil, nouvelle géoloc) → notification.
- **Endpoint admin** : forcer déconnexion d'un compte.

**Sécurité (critique)**
- Mots de passe hashés en **Argon2id** (pas bcrypt).
- Politique de mot de passe : min 10 caractères, vérification HIBP (Have I Been Pwned).
- Lockout progressif après échecs (exponential backoff).
- **Anti-bruteforce** sur login, OTP, password reset.
- Refresh token : rotation à chaque usage, détection de réutilisation = invalidation totale.
- JWT signés en **EdDSA (Ed25519)** ou RS256, jamais HS256 partagé.
- Cookies : `HttpOnly`, `Secure`, `SameSite=Lax/Strict`, `__Host-` prefix.
- Headers de sécurité : CSP stricte, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, Referrer-Policy.
- 2FA **obligatoire** pour Admin, Modérateur, Support dès création.
- Logs d'auth complets (login OK/KO, logout, password change, 2FA enable/disable).

**Tests**
- Tests unitaires + intégration sur tous les flows.
- Tests de sécurité : SQLi, XSS, CSRF, IDOR, brute force, replay token.

**Livrables** : APIs auth complètes documentées, suite de tests sécurité.

**DoD** : tous les flows d'auth fonctionnent ; pentest interne sur l'auth passé sans faille critique ; 2FA opérationnelle.

**Mémoire** : choix Argon2id, structure JWT, politique session, providers OAuth configurés (client IDs).

---

## Sprint 1.3 — Profils, rôles, comptes entreprise

**Objectif** : modéliser et gérer les utilisateurs avec cumul de rôles.

**Tâches**
- CRUD profil utilisateur (bio, photo, langues, adresse, préférences).
- Gestion **multi-rôles** : un utilisateur peut activer Acheteur, Vendeur, Prestataire, Loueur, Annonceur, Coursier.
- Activation d'un rôle = déclenche le KYC adapté (sprint suivant).
- **Comptes entreprise** : création, invitation de membres, rôles internes (gérant, RH, vendeur, comptable, admin société).
- Permissions fines (RBAC + ABAC pour cas avancés).
- Page profil publique (vue visiteur / vue propriétaire).
- Préférences de notification (centre unique).

**Sécurité**
- Vérification des permissions sur chaque endpoint (guards NestJS).
- IDOR : tester que A ne peut pas accéder/modifier les données de B.
- Audit log sur changements de rôle, invitations, suppressions.

**Tests** : tests E2E sur les parcours profil + invitations entreprise.

**DoD** : un utilisateur peut créer un compte, activer plusieurs rôles, créer une société et inviter des membres.

**Mémoire** : modèle RBAC choisi, matrice permissions par rôle.

---

## Sprint 1.4 — KYC / vérification d'identité

**Objectif** : valider l'identité des utilisateurs selon le niveau requis.

**Tâches**
- Upload sécurisé de documents (pièce ID, selfie, justificatifs, RCCM, diplômes…).
- Stockage chiffré (Supabase Storage avec RLS, AES-256 au repos).
- **Vérification automatique** : OCR (Tesseract ou service tiers comme Smile Identity, Onfido, Veriff) + matching selfie ↔ pièce + liveness.
- Workflow modérateur : queue de vérifs en attente, validation/refus avec motif, demande de complément.
- Statuts : `pending`, `verified`, `rejected`, `more_info_needed`.
- Niveaux de vérification (1 à 3+) selon le rôle (cf. § 4.3 cahier des charges).
- Badge "Vérifié" sur profil public après validation.
- Re-vérification périodique (cron annuel pour pros réglementés / loueurs).
- Notifications utilisateur à chaque changement de statut.

**Sécurité (critique — données sensibles)**
- Documents stockés dans bucket privé, jamais accessibles publiquement.
- Accès aux documents loggé (qui, quand, pourquoi).
- Suppression des documents possible (RGPD) ; conservation limitée selon obligation légale.
- Anti-fraude : détection de docs réutilisés, deepfakes, photoshop.
- Choix prestataire KYC à acter dans ce sprint (recommandation : **Smile Identity** — fort en Afrique).

**Tests** : E2E full KYC avec mocks du provider.

**DoD** : un utilisateur peut soumettre ses docs, un modérateur valide, le badge apparaît.

**Mémoire** : provider KYC retenu, structure du bucket, politique de rétention, coûts.

---

## Sprint 1.5 — Frontend web (squelette + auth + profil)

**Objectif** : application web Next.js fonctionnelle sur le périmètre auth/profil.

**Tâches**
- Initialisation Next.js 14+ (App Router, Server Components, Server Actions).
- TailwindCSS + shadcn/ui + design system Siryia (composants importés du Figma).
- Internationalisation **next-intl** (fr, en, ewe, kabye à minima).
- Auth : pages login, signup, forgot password, vérif email/phone, 2FA setup.
- Onboarding multi-étapes (choix rôles, profil de base, KYC si requis).
- Layout app : header, sidebar, footer, responsive parfait (mobile-first).
- Dashboard utilisateur (vide pour l'instant, structure prête).
- **PWA** : manifest, service worker, installable, mode hors-ligne basique (cache shell).
- SEO de base (metadata, sitemap, robots.txt, OG tags).
- Analytics privacy-friendly (Plausible ou Umami auto-hébergé).
- Accessibilité : audit Lighthouse > 95, WCAG 2.1 AA.

**Sécurité front**
- CSP stricte (nonces, pas d'`unsafe-inline`).
- Pas de stockage de tokens sensibles en localStorage (cookies HttpOnly).
- Sanitization des inputs.
- Détection XSS sur tout HTML rendu depuis du contenu utilisateur (DOMPurify).

**Déploiement** : Vercel preview sur chaque PR + Vercel staging sur `develop` + Vercel prod sur `main`.

**Tests** : Playwright (E2E) + Vitest (unit) + axe-core (a11y).

**DoD** : un visiteur peut s'inscrire, vérifier son compte, activer un rôle, soumettre un KYC, accéder à son dashboard. Tout en français + anglais. PWA installable. Lighthouse ≥ 95 partout.

**Mémoire** : structure des routes Next.js, conventions composants, pattern de fetch (TanStack Query).

---

## Sprint 1.6 — App mobile (squelette + auth + profil)

**Objectif** : app React Native/Expo fonctionnelle sur le périmètre auth/profil.

**Tâches**
- Init Expo SDK 50+, TypeScript strict.
- Navigation (React Navigation) : stack auth + stack app + bottom tabs.
- Réutilisation du design system (composants RN équivalents).
- Auth : tous les flows du sprint 1.5 portés en mobile (avec biométrie : Face ID, Touch ID, empreinte Android).
- Stockage sécurisé : **Expo SecureStore** pour les tokens (jamais AsyncStorage pour secrets).
- Notifications push (Expo Notifications + FCM/APNs) — squelette.
- Mode hors-ligne (MMKV pour cache, sync différée).
- i18n (i18next ou next-intl-compatible).
- **EAS Build cloud** configuré (Android **APK** + **AAB** + iOS IPA), sans dépendance Android Studio locale.
- Workflow **GitHub Actions** mobile configuré pour déclencher `eas build --non-interactive` et centraliser les artefacts de build.
- Distribution interne via TestFlight + Firebase App Distribution / Expo internal.

**Sécurité mobile**
- **Certificate pinning** sur les requêtes vers l'API Siryia.
- Détection root/jailbreak (rejet ou warning selon politique).
- Obfuscation du code release.
- Pas de logs sensibles en prod.
- Biométrie pour déverrouiller l'app (option utilisateur).
- Anti-screenshot sur écrans sensibles (paiement, KYC).

**Tests** : Detox ou Maestro pour E2E mobile.

**DoD** : APK + AAB + IPA générés via pipeline CI, installables/testables, parcours auth + profil + KYC opérationnels.

**Mémoire** : config EAS, certificats Apple, keystore Android, push tokens.

---

## Sprint 1.7 — Paiements (TMoney, Moov, carte) + Escrow

**Objectif** : encaisser et reverser de l'argent en toute sécurité.

**Tâches**
- Sélection finale du **PSP** (CinetPay vs PayDunya vs Flutterwave) — décision actée dans ce sprint avec critères : taux, support TMoney+Moov+carte, qualité API, conformité, support client.
- Intégration TMoney + Moov Money via le PSP (ou en direct si conditions plus avantageuses).
- Intégration cartes (Visa/Mastercard) via PSP, **3D Secure** obligatoire.
- **Module Escrow Siryia** : retenue des fonds, libération sur événement (confirmation acheteur, délai automatique, arbitrage).
- Reversement automatique vers Mobile Money / banque du bénéficiaire.
- Gestion des **commissions** (calcul, prélèvement, comptabilisation).
- **Webhooks PSP** sécurisés (signature vérifiée, idempotence, retry).
- Réconciliation comptable quotidienne.
- Génération de **factures et reçus** PDF (template branded, mentions fiscales).
- Historique transactions complet pour utilisateur et admin.
- Dashboard finance admin (revenus, commissions, en attente d'escrow, litiges, échecs).

**Sécurité (critique — argent)**
- **PCI-DSS SAQ A** minimum (jamais stocker de PAN, tout via PSP tokenisé).
- Idempotence sur tous les endpoints de paiement.
- Vérification de signature des webhooks (HMAC).
- Limites de transaction par niveau KYC.
- **Anti-fraude** : scoring (vélocité, géoloc impossible, BIN suspect, comportement anormal).
- Double validation pour les reversements > seuil (4-eyes principle).
- Audit log immuable (append-only) sur tous les événements financiers.
- Tests de chaos : que se passe-t-il si le PSP est down, si le webhook arrive 2 fois, si le réseau coupe en plein paiement ?

**Tests** : suite complète avec sandbox PSP + scénarios edge cases.

**DoD** : un acheteur peut payer (3 moyens), les fonds sont en escrow, libérés au vendeur après confirmation, factures générées.

**Mémoire** : PSP retenu (et pourquoi), structure des transactions, schéma escrow, taux et fees, contacts compte PSP.

---

## Sprint 1.8 — Marketplace (catalogue + recherche)

**Objectif** : afficher et rechercher des produits.

**Tâches**
- Modèle de données : `products`, `product_variants`, `categories`, `tags`, `inventory`, `shops`, `product_images`.
- Création/édition d'un produit (vendeur) : titre, description, images (upload, compression auto, conversion WebP/AVIF), prix, état (neuf/occasion + sous-état), catégorie, stock, modes de livraison activés.
- Modération préalable de chaque produit (auto + humaine si signalement).
- Liste produits interdits intégrée à la modération auto.
- **Recherche full-text** via Meilisearch / Typesense (multilingue, tolérance fautes, synonymes, géo, facettes).
- Page catégorie + filtres (prix, état, livraison, note, géoloc).
- Page produit complète + galerie + suggestions similaires.
- Boutique vendeur (vitrine).
- Favoris / wishlist.
- Comparateur (option).

**Sécurité**
- Validation stricte des images (anti-XSS via SVG, taille max, type MIME réel vérifié).
- Modération auto des images (NSFW, violence) via API (Sightengine, AWS Rekognition, ou modèle open source).
- Anti-spam annonces.

**Tests** : E2E création produit + recherche + filtres.

**DoD** : un vendeur peut publier ; un acheteur peut rechercher et trouver ; modération opérationnelle.

**Mémoire** : choix moteur recherche, schéma facettes, pipeline images.

---

## Sprint 1.9 — Marketplace (panier, commande, livraison)

**Objectif** : aller jusqu'à l'achat livré.

**Tâches**
- Panier multi-vendeurs (split automatique en sous-commandes).
- Calcul automatique frais de livraison selon mode + adresse.
- Checkout : adresse, mode de livraison par sous-commande, choix paiement.
- Paiement → escrow (sprint 1.7).
- États commande : `pending → confirmed → prepared → shipped → delivered → closed` (+ `cancelled`, `refunded`, `disputed`).
- Suivi temps réel par notification.
- Confirmation de réception par l'acheteur (libère l'escrow).
- Délai automatique de validation (ex. 7 jours après livraison).
- **Module retour / remboursement / litige** (workflow + arbitrage support).
- Notation bilatérale post-livraison.
- Génération factures.

**Sécurité**
- Vérif stock atomique (transaction DB) pour éviter overselling.
- Vérif que l'acheteur ne peut confirmer que ses propres commandes.

**DoD** : commande complète bout-en-bout fonctionnelle, escrow libéré correctement, litige arbitrable.

**Mémoire** : machine à états des commandes, règles d'escrow, SLA support.

---

## Sprint 1.10 — Recrutement & Services

**Objectif** : mise en relation client ↔ prestataire avec tout sur la plateforme.

**Tâches**
- Modèle : `service_categories`, `service_providers`, `service_listings`, `service_requests`, `proposals`, `contracts`, `missions`.
- Profil prestataire enrichi (services, tarifs, dispo, portfolio, langues).
- Trois modes de mise en relation :
  1. Publication d'un besoin (client) → propositions (prestataires).
  2. Recherche directe annuaire → contact.
  3. **Siryia Match** (algorithme : géoloc, note, dispo, prix, taux d'acceptation, historique).
- Tarification : fixe / devis / enchère inversée.
- Devis structurés (description, montant, délai, conditions).
- Acceptation → **contrat PDF généré et signé électroniquement** (DocuSign-like via solution open source ou intégration tiers).
- Paiement obligatoire via escrow.
- Messagerie interne **avec filtrage anti-contournement** (regex + ML pour détecter téléphones, emails, RIB, liens externes maquillés).
- Sanctions graduées si tentative de contournement.
- États mission + clôture + notation bilatérale.
- Génération de factures.

**Sécurité**
- Filtrage anti-contournement testé contre techniques d'évasion (espaces, unicode, images de texte).
- Détection comportements suspects (échanges hors plateforme, refus systématique du contrat).

**Tests** : E2E sur les 3 modes, scénarios de tentative de contournement.

**DoD** : un client peut publier un besoin, recevoir des propositions, signer un contrat, payer, valider la prestation, noter.

**Mémoire** : algo de matching v1, règles anti-contournement, choix outil signature électronique.

---

## Sprint 1.10b — Annuaire V1 (Lite)

**Objectif** : Création d'une vitrine publique pour les professionnels (sans réservation en ligne).

**Tâches**
- Pages profil publiques enrichies (bio complète, horaires indicatifs, galerie/portfolio, certifications).
- Génération et affichage d'un **QR code** unique par profil.
- Boutons d'action "Contacter" (redirige vers la messagerie interne MVP) et "Demander un devis" (redirige vers le module Recrutement MVP).
- Moteur de recherche dédié à l'annuaire (filtrage par métier, ville, langues, badge vérifié).

**DoD** : un professionnel a une belle page vitrine indexable ; un client peut le trouver dans l'annuaire et le contacter.

**Mémoire** : structure de l'URL profil (`/@nom`), intégration QR code.

---

## Sprint 1.11 — Messagerie + Notifications

**Objectif** : communication fluide et multi-canal.

**Tâches**
- Chat temps réel (WebSocket Socket.io + Supabase Realtime).
- Texte, images, fichiers, messages vocaux, indicateurs présence/lecture, recherche.
- Appels audio + vidéo intégrés (WebRTC, via service comme Daily.co, LiveKit ou self-hosted Janus).
- Traduction automatique (DeepL ou modèle local) à la demande.
- Filtrage anti-coordonnées personnelles (porté du sprint 1.10).
- Centre de notifications unique (in-app + cloche).
- Préférences fines par type d'événement et canal.
- Push (FCM + APNs), email (Postmark / Resend / Brevo), SMS (Twilio / opérateurs locaux), WhatsApp Business API (Meta direct ou via aggregator type 360dialog).
- Mode "Ne pas déranger".
- Notifications critiques non désactivables.
- Templates branded de tous les emails / SMS / WA.

**Sécurité**
- Chiffrement des messages au repos.
- Permissions strictes (un user ne voit que ses convs).
- Modération signalements messages.
- WhatsApp : opt-in vérifiable.
- Détection spam.

**DoD** : chat opérationnel, appels OK, toutes les notifications partent et arrivent sur tous les canaux.

**Mémoire** : provider WebRTC retenu, providers email/SMS/WA, coûts par canal.

---

## Sprint 1.12 — Support Client (Ticketing)

**Objectif** : Gestion des litiges, réclamations et ticketing (L'Assistant IA est repoussé à la Phase 2).

**Tâches**
- **Knowledge base** Siryia (toutes les FAQ, guides, politiques, structurés Markdown).
- Système de **tickets** support (création, assignation, historique, SLA).
- Dashboard support (queue, perfs, satisfaction).

**Sécurité Support**
- Limites d'usage (rate limit) pour éviter abus/spam de tickets.

**DoD** : un utilisateur ouvre un litige → création automatique de ticket support.

**Mémoire** : architecture du ticketing, outil utilisé (interne ou externe).

---

## Sprint 1.13 — Back-office Admin (pilotage complet de la plateforme + KPI)

**Objectif** : équiper l'équipe Siryia d'une **console d'administration complète** permettant de gérer **100 % de la plateforme** sans jamais toucher à la base de données, avec **tous les KPI métier en temps réel**.

### 1.13.A — Dashboards utilisateur (par rôle)
- **Acheteur** : commandes, suivi livraisons, favoris, RDV, contrats, factures, litiges en cours.
- **Vendeur** : produits, ventes, stock, commandes à traiter, gains, commissions, statistiques boutique, avis.
- **Prestataire** : missions, planning, gains, devis envoyés, taux d'acceptation, note moyenne.
- **Loueur véhicule** : flotte, réservations, états des lieux, gains, taux d'occupation.
- **Annonceur** : campagnes, dépenses, performances (impressions, clics, conversions, ROAS).
- **Coursier** : courses, gains, planning, notation.
- **Entreprise** : vue agrégée multi-utilisateurs, équipe, activité globale, facturation.

### 1.13.B — Back-office Admin Siryia (équipe interne)

#### Modules de gestion
- **Utilisateurs** : recherche, fiche complète, historique, KYC, rôles, sanctions, suspension, bannissement, suppression RGPD, impersonation (avec audit strict).
- **Modération KYC** : queue de vérifications, validation/refus avec motif, demande de complément, statistiques.
- **Modération contenu** : produits, annonces services, véhicules, profils, avis, messages signalés. Actions : approuver, masquer, supprimer, sanctionner. File priorisée + raccourcis clavier.
- **Modération publicités** : validation préalable des créations, refus avec motif.
- **Signalements** : centralisation de tous les signalements (contenus, comptes, comportements), workflow d'instruction.
- **Litiges & arbitrage** : dossiers ouverts, preuves (chat, contrats, états des lieux, paiements), décisions, libération/remboursement escrow.
- **Finance** :
  - Vue temps réel : volumes traités, commissions générées, escrow en cours, reversements en attente, échecs paiements, remboursements.
  - Réconciliation comptable (rapprochement PSP ↔ DB ↔ Mobile Money).
  - Export comptable (CSV, FEC, formats fiscaux locaux).
  - Gestion des fees, des taxes par pays.
  - Rapports financiers téléchargeables.
- **Gestion catalogue** : catégories, sous-catégories, attributs, taxonomie, traduction des libellés.
- **Gestion contenus** : pages CMS (À propos, FAQ, Aide, blog), bannières, pop-ups marketing, programme d'onboarding.
- **Gestion commerciale** : abonnements premium (paliers, tarifs, fonctionnalités gates), codes promo, parrainage, programme fidélité.
- **Gestion publicitaire (managé)** : pour les annonceurs Enterprise gérés par l'équipe commerciale.
- **Gestion coursiers / réseau livraison** : zones, tarifs, bonus, sanctions.
- **Gestion partenaires** (à terme) : intégrateurs, agences, revendeurs.
- **Communication** : envoi de campagnes email/SMS/WhatsApp/push à des segments d'utilisateurs (avec opt-in vérifié).
- **Notifications système** : bandeaux d'alerte, maintenance planifiée, messages broadcast.
- **Paramètres plateforme** : multi-pays, devises, taux de change, langues, modes de paiement actifs par pays, plafonds, taux de commission, politiques.
- **Feature flags** : activer/désactiver des fonctionnalités par segment, par pays, par % d'utilisateurs (canary releases).
- **Audit log** : journal immuable de **toutes les actions admin** (qui, quoi, quand, depuis quelle IP, ancien et nouvel état). Recherche, filtrage, export.
- **Gestion équipe interne** : création comptes admin/modérateur/support/financier, attribution de rôles fins (RBAC granulaire), 2FA obligatoire, IP allowlist optionnelle, sessions courtes.
- **Sous-rôles admin** :
  - **Super Admin** : tout.
  - **Admin Pays** : tout sur un pays donné.
  - **Modérateur Contenu** : modération uniquement.
  - **Modérateur KYC** : KYC uniquement.
  - **Financier** : finance + reporting, pas de modif utilisateurs.
  - **Support N1 / N2** : tickets, chat, lecture des dossiers.
  - **Commercial** : annonceurs, partenaires, abonnements.
  - **Lecture seule** (auditeur).

### 1.13.C — KPI temps réel (cœur du back-office)

Tableau de bord exécutif Siryia avec **rafraîchissement temps réel** ou quasi temps réel (≤ 1 min).

#### KPI globaux (vue C-level)
- **Utilisateurs** : total inscrits, MAU (Monthly Active Users), DAU (Daily Active Users), WAU, ratio DAU/MAU (stickiness), nouveaux inscrits/jour, taux de vérification KYC, taux d'activation (%) par rôle, taux de churn.
- **Croissance** : évolution inscriptions, courbe acquisition, sources (organique, ads, parrainage, app stores).
- **GMV** (Gross Merchandise Value) : volume total transigé / jour / semaine / mois, ventilé par module (marketplace, services, véhicules), par pays, par catégorie.
- **Revenus Siryia** : commissions, abonnements, publicité, autres — total et ventilé.
- **Take Rate** : revenus Siryia / GMV (en %).
- **ARPU** (Average Revenue Per User), **LTV** (Lifetime Value), **CAC** (Customer Acquisition Cost), **LTV/CAC**.
- **MRR** / **ARR** (abonnements premium).
- **Conversion** : visiteurs → inscrits → vérifiés → premier achat → acheteur récurrent (funnel complet).
- **Trésorerie** : escrow en cours, fonds disponibles, créances, dettes opérateurs.

#### KPI Marketplace
- Nombre de produits actifs, nouveaux produits/jour.
- Nombre de boutiques actives.
- Nombre de commandes (jour/semaine/mois), panier moyen, fréquence d'achat.
- Taux de conversion catalogue → commande.
- Top vendeurs, top produits, top catégories.
- Taux de retour, taux de litige, taux de remboursement.
- Délai moyen de livraison par mode et par zone.
- NPS acheteur / vendeur.

#### KPI Services / Recrutement
- Nombre de demandes publiées, propositions reçues par demande, taux de matching.
- Taux d'acceptation des devis.
- Délai moyen de mise en relation.
- Nombre de missions complétées.
- Note moyenne prestataires, top prestataires.
- Taux de tentative de contournement détectée.

#### KPI Annuaire
- Nombre de profils actifs, par catégorie, par ville.
- Vues de profils, contacts, RDV pris, conversions.
- Taux de conversion premium.

#### KPI Véhicules
- Nombre de véhicules actifs, taux d'occupation par véhicule.
- Réservations, durée moyenne de location, panier moyen.
- Litiges sur cautions.

#### KPI Publicité
- Annonceurs actifs, nouvelles campagnes, dépense totale.
- Inventaire (impressions disponibles), taux de remplissage.
- eCPM, CTR moyen, taux de conversion.
- Revenus pub par format / par pays.

#### KPI Coursiers / Livraison
- Coursiers actifs, en service / en pause / hors-ligne.
- Courses/jour, distance moyenne, durée moyenne.
- Taux de livraison réussie, retards, échecs.
- Gains moyens coursiers, satisfaction.

#### KPI Paiements
- Nombre de transactions / jour, montant total.
- Répartition par moyen de paiement (TMoney, Moov, carte, autres).
- Taux d'échec paiement, délai d'encaissement.
- Volume escrow, vélocité de libération.
- Fraudes détectées / tentatives bloquées.
- Chargebacks (cartes).

#### KPI Support & Assistant IA
- Tickets ouverts / résolus / en attente, délai moyen de résolution.
- CSAT, NPS support.
- Volume conversations IA, taux de résolution sans escalade, satisfaction IA.
- Top sujets de questions / réclamations.

#### KPI Sécurité
- Tentatives de connexion suspectes, comptes verrouillés.
- Comptes bannis / suspendus / signalés.
- Incidents de sécurité.
- Vulnérabilités ouvertes (par sévérité).
- Délai moyen de patch.

#### KPI Techniques (SRE)
- Disponibilité (uptime %).
- Latence API (p50, p95, p99).
- Taux d'erreur 4xx / 5xx.
- LCP, INP, CLS (Web Vitals) côté front.
- Cold start app mobile.
- Coûts infra par service.

### 1.13.D — Reporting & Exports
- **Rapports automatiques** quotidiens / hebdomadaires / mensuels envoyés par email aux dirigeants.
- **Exports** CSV / Excel / PDF de tous les tableaux.
- **API analytics interne** pour brancher des outils externes (Metabase / Superset / Looker Studio).
- **Vues personnalisables** par utilisateur admin (favoris, dashboards custom).
- **Alertes** configurables sur seuils (ex. taux d'échec paiement > 5 % → alerte Slack/SMS).

### 1.13.E — Sécurité du back-office (critique)
- **2FA obligatoire** pour tout compte admin (TOTP + clé hardware FIDO2 recommandée pour Super Admin).
- **IP allowlist** optionnelle par compte.
- **Sessions courtes** (timeout d'inactivité), réauthentification pour actions sensibles.
- **Toutes les actions loggées** (audit trail immuable, append-only, signature cryptographique).
- **Principle of least privilege** : sous-rôles fins, jamais de "tout admin" par défaut.
- **4-eyes principle** sur les actions critiques : suppression compte, remboursement > seuil, modification de configuration financière, attribution de rôle Super Admin.
- **Sandbox lecture seule** pour les nouveaux admins (formation).
- **Rotation des accès** : revue trimestrielle des comptes admin.
- **Détection d'anomalie** sur les comportements admin (volume d'actions inhabituel, horaires atypiques).
- **Notifications de sécurité** envoyées à tous les Super Admins en cas d'action critique.

### 1.13.F — Tests
- Tests E2E sur les workflows admin critiques (modération, KYC, litige, remboursement).
- Tests d'autorisation : aucun rôle ne peut faire au-delà de ses permissions.
- Tests de charge sur les dashboards KPI (les requêtes ne doivent pas plomber la prod → cache + read replicas).

### 1.13.G — Livrables
- Console admin web (sous-domaine sécurisé `admin.siryia.com`, séparé du front public).
- Dashboards KPI temps réel.
- Modules de gestion complets (utilisateurs, contenus, finance, modération, paramètres, équipe).
- Audit log consultable.
- Exports et rapports automatisés.
- Documentation interne d'utilisation du back-office (runbooks, guides modérateurs).

### 1.13.H — DoD
- L'équipe Siryia peut **gérer 100 % de la plateforme** depuis le back-office sans jamais toucher à la DB.
- **Tous les KPI** listés sont visibles et exportables.
- **Toutes les actions admin** sont auditées.
- **Sécurité** : 2FA obligatoire en place, sous-rôles fonctionnels, audit log testé.
- Zéro régression sur le front public.

**Mémoire** : matrice complète des permissions admin, liste exhaustive des KPI implémentés, choix outil BI (interne vs Metabase), seuils d'alerte définis.

---

## Sprint 1.14 — Hardening sécurité + Tests de charge + Pré-prod

**Objectif** : la plateforme est prête pour de vrais utilisateurs.

**Tâches**
- **Pentest interne** complet (équipe ou prestataire) sur tous les modules MVP.
- Correction de toutes les vulnérabilités HIGH/CRITICAL.
- **Tests de charge** (k6 / Locust) : 1k, 5k, 10k utilisateurs simultanés. Identification des bottlenecks.
- Optimisation : indexes DB, cache Redis, query N+1, lazy loading, code splitting.
- **Monitoring** prod : Sentry (erreurs front+back), Grafana + Prometheus + Loki (métriques + logs), Better Stack ou équivalent (uptime + alerting).
- **Alerting** : Slack/Discord/email/SMS sur incidents.
- **Backups** : dump PostgreSQL quotidien chiffré, restauration testée mensuellement.
- **Plan de reprise (PRA)** documenté.
- **Runbooks** : incidents fréquents, procédure d'escalade, contacts.
- **DPA** signés avec tous les sous-traitants (Vercel, Supabase, PSP, etc.).
- Bannière cookies conforme.
- Mentions légales en ligne.
- Page statut public (Better Stack / Atlassian Status).

**DoD** : 0 vuln critique, charge cible tenue, monitoring opérationnel, backups testés, docs prêtes.

**Mémoire** : résultats pentest, baselines de charge, contacts on-call, procédures incident.

---

## Sprint 1.15 — Soft launch MVP

**Objectif** : ouvrir aux premiers utilisateurs réels (Togo, beta privée).

**Tâches**
- Recrutement de **beta testeurs** (50-200 utilisateurs ciblés : vendeurs, prestataires, acheteurs représentatifs).
- Programme **early adopter** (premium offert, badge dédié).
- Onboarding personnalisé (formations, guides vidéo, support prioritaire).
- Collecte feedback structurée (in-app, interviews, questionnaires).
- Bug bash quotidien.
- Itérations rapides (correctifs, améliorations UX).
- Suivi des KPI : inscriptions, KYC validés, transactions, NPS, taux d'erreur, perfs.

**DoD** : 100+ comptes vérifiés actifs, 50+ transactions réussies, NPS > 30.

**Mémoire** : retours beta consolidés, top 10 frictions, top 10 demandes, leçons apprises.

---

## Sprint 1.16 — Lancement public MVP (Togo)

**Objectif** : ouverture grand public au Togo.

**Tâches**
- Communication / RP (presse togolaise, radios, influenceurs locaux).
- Campagne marketing lancement (réseaux sociaux, ads, partenariats).
- Stores : publication Google Play + App Store (ASO optimisé).
- Scaling infra anticipé.
- Support renforcé.
- Suivi quotidien des KPI.

**DoD** : app live sur les 2 stores, site public ouvert, premières transactions publiques.

**Mémoire** : URLs stores, métadonnées ASO, métriques de lancement.

---

# PHASE 2 — Extension

## Sprint 2.1 — Annuaire Phase 2 (Agendas et RDV en ligne)

**Tâches**
- Ajout de la gestion d'agendas sur les profils Annuaire V1.
- **Calendrier de RDV** intégré (créneaux configurables, sync Google/Outlook/iCal).
- Réservation client + acompte optionnel + rappels (push/SMS/email).
- Politique d'annulation/report.
- URL personnalisée `siryia.com/@nom`.
- QR code généré (carte de visite / vitrine).
- Statistiques pro (vues, contacts, conversions, comparaison sectorielle).
- Mini-site sous-domaine `@nom.siryia.com` (premium).

**DoD** : un spécialiste a une page complète avec RDV en ligne ; un client peut réserver.

---

## Sprint 2.2 — Téléconsultation / appel vidéo intégré

**Tâches**
- Intégration WebRTC dédié consultation (LiveKit recommandé).
- Chiffrement bout-en-bout, salle éphémère, lien sécurisé.
- Enregistrement optionnel avec **double consentement explicite**.
- Partage écran, partage de fichiers pendant l'appel, chat parallèle.
- Facturation auto à la fin de la session.
- Mode dégradé en réseau faible.

**Sécurité** : conformité confidentialité données médicales (équivalent HDS si possible) pour les médecins.

**DoD** : médecin et patient peuvent faire une téléconsultation, le pro est facturé, la session est archivée.

---

## Sprint 2.3 — Module Location de véhicules

**Tâches**
- Modèle : `vehicles`, `vehicle_listings`, `rental_periods`, `rental_contracts`, `vehicle_inspections`.
- Inscription véhicule + KYC véhicule (carte grise, assurance, permis chauffeur si applicable).
- Tous les types (voiture, moto, scooter, tricycle/zem, utilitaire, camion, vélo, trottinette, bateau/pirogue, engin de chantier).
- Modes : courte/longue durée, location avec/sans chauffeur.
- Calendrier de dispo + tarifs flexibles.
- Réservation + caution escrow + assurance partenaire optionnelle.
- **État des lieux numérique** avant/après (photos horodatées+géoloc, checklist, signature électronique, PDF).
- Contrat de location PDF signé.
- Notation bilatérale.
- Module flotte (gestion multi-véhicules pour pros).
- Géoloc temps réel (option flotte).

**DoD** : un loueur publie un véhicule, un locataire réserve, paye, fait l'état des lieux, conduit, retourne, état des lieux retour, caution libérée.

---

## Sprint 2.4 — Module Vente de véhicules

**Tâches**
- Annonce vente (neuf/occasion) avec carnet véhicule (kilométrage, entretien, sinistres déclarés).
- Demande d'essai en ligne.
- Réservation avec acompte escrow.
- Contrat de vente PDF + transfert administratif assisté.
- Vérification VIN / antécédents (selon disponibilité données).

**DoD** : vente d'un véhicule complète bout-en-bout via la plateforme.

---

## Sprint 2.5 — Réseau coursiers Siryia

**Tâches**
- Inscription publique coursier + KYC renforcé (permis, carte grise véhicule, assurance).
- App coursier dédiée (peut être un mode dans l'app principale ou app séparée — décision dans ce sprint).
- Acceptation / refus de courses, navigation GPS intégrée, optimisation tournée multi-livraisons.
- Preuve de livraison : photo + signature + OTP destinataire.
- Suivi gains, virements automatiques (Mobile Money).
- Notation bilatérale (coursier ↔ client ↔ vendeur).
- Gestion zones de livraison, disponibilité, statut (en service / pause / hors-ligne).
- Algo d'attribution courses (proximité, dispo, score).
- Tarification dynamique (zone, distance, urgence).
- Bonus + pourboires.

**Sécurité** : géoloc consentie, anti-fraude (preuves manipulées, courses fictives).

**DoD** : un livreur peut s'inscrire, recevoir des courses, livrer, être payé.

---

## Sprint 2.6 — Espace publicitaire (Siryia Ads Manager)

**Tâches**
- Interface self-service complète style "Ads Manager" : création campagne, audience, ciblage, format, budget, planning, créations, A/B testing.
- Tous les formats prévus (bannières, sponsorisés, push, vidéo, pop-up, email/SMS marketing, encart hyper-local).
- Modes facturation : forfait (privilégié), CPC, CPM, CPA.
- Modération préalable des créations (auto + humain).
- Tableau de bord temps réel : impressions, clics, CTR, conversions, ROAS.
- Recommandations d'optimisation.
- Facturation et historique.
- **Offre managée** : interface back-office pour l'équipe commerciale Siryia.

**Sécurité** : anti-clic frauduleux (filtrage IPs, bots, vélocité anormale).

**DoD** : un annonceur lance une campagne, voit ses stats, paye.

---

## Sprint 2.7 — Abonnements premium (Pro, Business, Enterprise)

**Tâches**
- Catalogue d'abonnements et fonctionnalités gates par palier.
- Paiement récurrent (Mobile Money récurrent si possible, sinon facture mensuelle, ou prélèvement carte).
- Gestion résiliation, upgrade, downgrade, prorata.
- Facturation auto.
- Page "Devenir Pro / Business / Enterprise" optimisée conversion.
- Onboarding spécifique premium.
- Crédits publicitaires offerts (intégration avec Ads).

**DoD** : un user passe Pro, payement OK, fonctionnalités débloquées.

---

## Sprint 2.8 — Migration Supabase → VPS Hostinger (PostgreSQL Docker)

**Objectif** : autonomiser l'infra et réduire les coûts à long terme.

**Tâches**
- Provisionnement VPS Hostinger (KVM, taille adaptée).
- Hardening serveur (SSH par clé uniquement, fail2ban, UFW, mises à jour auto sécurité).
- Installation Docker + Docker Compose.
- Stack auto-hébergée :
  - **PostgreSQL** (image officielle `postgres:16+`, volumes persistants, backups chiffrés off-site).
  - **Redis** officiel.
  - **MinIO** (S3-compatible, remplace Supabase Storage).
  - **Keycloak** (ou auth maison NestJS, choix arbitré ici, **recommandation Keycloak** pour OIDC/SSO).
  - **Meilisearch** ou **Typesense**.
  - Reverse proxy **Caddy** ou **Traefik** + Let's Encrypt auto.
  - **k3s** pour orchestration légère.
- Migration **PostgreSQL** : `pg_dump` Supabase → `psql` VPS.
- Migration **Storage** : script `mc mirror` Supabase → MinIO.
- Migration **Auth** : 2 options arbitrées dans ce sprint :
  - A. Auth maison NestJS (déjà construite en partie).
  - B. Keycloak avec import des users via API.
- Réécriture des **Edge Functions** Supabase → endpoints NestJS (déjà fait au fur et à mesure si bien architecturé).
- **Realtime** : déjà sur Socket.io NestJS, donc pas de migration.
- Tests de bascule sur staging avec cutover plan.
- Bascule prod en fenêtre de maintenance courte.

**Sécurité (critique — opération sensible)**
- Plan de rollback prêt.
- Tests d'intégrité post-migration (counts, hashes, checksums).
- Snapshots avant/après.
- Communication utilisateurs (maintenance planifiée).

**DoD** : prod tourne sur VPS, perfs égales ou meilleures, monitoring vert, Supabase peut être éteint (ou conservé en backup).

**Mémoire** : choix Auth (A ou B), procédure complète de migration, durée réelle, problèmes rencontrés.

---

# PHASE 3 — Croissance

## Sprint 3.1 — Internationalisation produit (multi-pays/multi-devises)

**Tâches**
- Modèle pays : devises, taxes, langues, modes de paiement locaux, réglementations.
- Multi-devises avec conversion temps réel (provider FX).
- Localisation contenus, formats date/heure/nombre.
- Politique de prix par pays.
- Gestion des taxes (TVA, etc.).
- Tests de bascule de pays.

---

## Sprint 3.2 — Lancement Bénin

Pack lancement type : étude marché, partenariats locaux, légal, marketing, support local. À répliquer pour chaque pays.

---

## Sprint 3.3 — Lancement Ghana
*(idem)*

## Sprint 3.4 — Lancement Côte d'Ivoire
*(idem)*

## Sprint 3.5 — Lancement Nigéria

Cas particulier : devise NGN très volatile, paiements (Paystack/Flutterwave), volumes potentiels énormes → infra à anticiper.

## Sprint 3.6 — Autres pays Afrique de l'Ouest (Burkina, Sénégal, etc.)

---

## Sprint 3.7 — API publique + offre Enterprise

**Tâches**
- API REST publique versionnée (`v1`), documentée OpenAPI, portail développeur.
- API Keys + OAuth 2.0 + scopes fins.
- Rate limiting par tier d'abonnement.
- Webhooks sortants (commande, paiement, message…).
- SDKs (Node, PHP, Python).
- Sandbox.
- Programme partenaires.

**Sécurité** : isolation tenant, audit logs API, anti-abus.

---

## Sprint 3.8 — Marque blanche (white-label)

**Tâches**
- Architecture multi-tenant (schémas Postgres séparés ou row-level tenancy).
- Personnalisation par tenant (logo, couleurs, domaine custom).
- Facturation B2B des tenants.

---

## Sprint 3.9 — Crypto (USDT, BTC) si pas activé en P1

Intégration via PSP crypto (BitPay, NowPayments, ou wallet custodial maison sous conditions strictes de licence).

---

## Sprint 3.10 — IA avancée

- Matching intelligent v2 (ML supervisé sur historique).
- Détection de fraude ML (transactions, comptes, contenus).
- Modération automatique avancée (texte, image, vidéo, audio).
- Recommandations personnalisées (produits, prestataires).
- Pricing intelligent (suggestion tarif vendeur).

---

# PHASE 4 — Scale

## Sprint 4.1 — Architecture microservices

Découpage du monolithe modulaire en microservices indépendants (auth-svc, marketplace-svc, services-svc, vehicles-svc, ads-svc, payments-svc, notifications-svc, messaging-svc, search-svc, ai-svc).

Communication via **gRPC** ou **Kafka / NATS** (event-driven).

---

## Sprint 4.2 — Multi-régions / Edge

- Déploiement multi-AZ + multi-régions Afrique (Lomé, Lagos, Nairobi, Le Cap…).
- Réplication DB géo-distribuée (Patroni, Citus ou managé).
- CDN edge (Cloudflare Workers).
- Stratégie active/active.

---

## Sprint 4.3 — Lancement Afrique entière (Centrale, Nord, Est, Australe)

Réplication du pack lancement par pays prioritaires.

---

## Sprint 4.4 — Programme partenaires

Intégrateurs, agences, revendeurs, certifications.

---

## Sprint 4.5 — International / Diaspora / Monde

Adaptation finale : fiscalité, paiements internationaux, langues additionnelles, conformité mondiale (RGPD, CCPA, LGPD, etc.).

---

# Sprints transverses (en continu, sur tout le projet)

## ST.1 — Sécurité continue
- Pentests trimestriels (équipe interne ou externe).
- Bug bounty (à ouvrir dès phase 2).
- Veille CVE quotidienne.
- Threat modeling sur chaque nouvelle feature majeure.
- Formation sécurité de l'équipe (annuelle).
- Revue annuelle des accès.
- Plan de réponse à incident testé.

## ST.2 — Qualité & tests
- Couverture tests > 80 % sur le backend, > 70 % sur le front.
- E2E sur les parcours critiques (auth, paiement, commande, KYC).
- Tests d'accessibilité (axe-core, manuel).
- Tests de perf (Lighthouse CI, k6).

## ST.3 — Documentation
- Doc utilisateur (centre d'aide).
- Doc développeur (API, architecture, runbooks).
- ADR (Architecture Decision Records) pour chaque décision structurante.
- Mise à jour continue de `memoire.md`.

## ST.4 — Conformité & juridique
- Veille réglementaire (RGPD, lois locales, fintech, Mobile Money, professions réglementées).
- Mise à jour CGU/CGV à chaque évolution majeure.
- Audits annuels.

## ST.5 — Support & succès client
- Tableau NPS suivi mensuellement.
- Programme onboarding amélioré itérativement.
- Webinars / formations / contenus pédagogiques.

---

# Récap : règle d'or

- **Pas de date dans ce document.** On avance par DoD.
- **Sécurité non-négociable** : aucune fonctionnalité ne sort en prod sans avoir passé les checks sécurité.
- **Mémoire vivante** : chaque sprint termine par un update de `memoire.md`.
- **Tout sur la plateforme** : hors plateforme = aucune responsabilité Siryia.
- **Vercel** comme aire de jeu et de démos pour les premières mises en ligne du frontend, en parallèle du localhost.

# Cahier des charges

> Document en cours de rédaction — sera complété au fur et à mesure des réponses.

## 1. Présentation du projet

### 1.1 Nom du projet
**Siryia** — plateforme SaaS panafricaine de commerce et de services.

### 1.2 Description générale
Plateforme **SaaS multifonctionnelle** disponible en **application web et mobile**, inspirée du modèle d'Amazon mais étendue à un écosystème complet de services. L'objectif est de devenir le **hub africain (Togo et au-delà)** du commerce et des services en ligne, en regroupant en un seul endroit la mise en relation, la vente, le recrutement et la publicité.

### 1.3 Objectif principal
Offrir un espace SaaS unique où **particuliers, professionnels en solo (freelances, artisans, indépendants) et entreprises** peuvent :
- Vendre et acheter des produits (marketplace).
- Recruter ou proposer leurs services (domestiques, cuisiniers, chauffeurs, coursiers, médecins, infirmiers/laborantins, artisans : maçons, plombiers, électriciens, carreleurs, etc.).
- Trouver des spécialistes professionnels via un annuaire intelligent.
- Acheter ou louer des espaces publicitaires.
- Louer ou acheter des véhicules (voitures, motos).

### 1.4 Cible
- **Particuliers** (acheteurs, locataires, demandeurs de services).
- **Professionnels en solo** (freelances, artisans, prestataires indépendants).
- **Entreprises** locales et internationales (recrutement, vente, publicité).

### 1.5 Périmètre géographique
Déploiement progressif en 4 phases :
1. **Phase 1 — Lancement :** Togo uniquement (MVP, validation marché).
2. **Phase 2 — Expansion régionale :** Afrique de l'Ouest (Bénin, Ghana, Côte d'Ivoire, Nigéria, Burkina Faso, Sénégal, etc.).
3. **Phase 3 — Expansion continentale :** Afrique entière (Afrique centrale, du Nord, de l'Est et australe).
4. **Phase 4 — International :** déploiement mondial (diaspora africaine puis grand public international).

### 1.6 Modules principaux
1. **Espace publicitaire** — vente d'espaces promotionnels aux entreprises.
2. **Recrutement & services** — mise en relation employeurs / prestataires.
3. **Marketplace** — vente en ligne (alimentaire, vêtements, équipements, etc.).
4. **Annuaire des spécialistes** — moteur de recherche de professionnels.
5. **Location / Achat de véhicules** — voitures et motos.

## 2. Utilisateurs et rôles

### 2.1 Types de comptes / rôles
| Code | Rôle | Description |
|------|------|-------------|
| A | **Visiteur** | Non inscrit ; peut parcourir le catalogue, l'annuaire et les annonces en lecture seule. |
| B | **Client / Acheteur** | Particulier qui achète, recrute, loue, contacte des prestataires. |
| C | **Vendeur** | Met en vente des produits sur la marketplace. |
| D | **Prestataire de services** | Artisans, domestiques, chauffeurs, coursiers, médecins, infirmiers, etc. |
| E | **Entreprise** | Compte société multi-utilisateurs (plusieurs collaborateurs sous un même compte avec rôles internes). |
| F | **Annonceur** | Achète et gère des espaces publicitaires sur la plateforme. |
| G | **Loueur / Vendeur de véhicules** | Propose à la location ou à la vente voitures et motos. |
| H | **Modérateur** | Équipe Siryia — modération des contenus, profils, avis, litiges. |
| I | **Administrateur** | Équipe Siryia — gestion globale (utilisateurs, paramètres, finances, sécurité). |
| J | **Support client** | Équipe Siryia — assistance utilisateurs, tickets, chat. |
| K | **Livreur / Coursier** | Gestion des livraisons intégrée à la plateforme. |

### 2.2 Cumul de rôles
Un même utilisateur **peut cumuler plusieurs rôles** sur un seul compte (ex. : acheteur + vendeur + prestataire). Le système doit gérer un **profil unique avec activation modulaire des rôles**, chaque rôle débloquant son propre tableau de bord et ses fonctionnalités.

### 2.3 Comptes Entreprise (multi-utilisateurs)
Le rôle **Entreprise** permet de créer plusieurs sous-comptes collaborateurs avec des permissions internes (ex. : gestionnaire RH, vendeur, comptable, admin société).

## 4. Inscription et vérification d'identité (KYC)

### 4.1 Principe général
- **Inscription = soft** : rapide, sans friction, accessible à tous.
- **Vérification = stricte** : déclenchée dès qu'un utilisateur veut **vendre, prester un service, louer un véhicule, recruter, publier une annonce, encaisser de l'argent ou représenter une entreprise**.
- Tant que la vérification n'est pas validée, le compte reste limité au mode **acheteur / visiteur enrichi**.

### 4.2 Méthodes d'inscription (toutes proposées)
- Email + mot de passe.
- Numéro de téléphone + OTP par SMS.
- Social login : Google, Facebook, Apple.
- Inscription via **Mobile Money** (numéro TMoney / Moov vérifié par OTP).
- Authentification à deux facteurs (2FA) optionnelle à l'inscription, **obligatoire après vérification KYC**.

### 4.3 Niveaux de vérification selon le rôle
| Rôle | Niveau | Documents / contrôles requis |
|------|--------|------------------------------|
| **Acheteur particulier** | Niveau 1 — Léger | Email **et/ou** téléphone vérifié (OTP). |
| **Vendeur (marketplace)** | Niveau 2 — KYC standard | Pièce d'identité officielle + selfie (liveness) + justificatif de domicile + numéro Mobile Money / IBAN pour encaissements. |
| **Prestataire de services** | Niveau 2 — KYC standard | Pièce d'identité + selfie + justificatif d'adresse + références/portfolio si disponible. |
| **Loueur / Vendeur de véhicules** | Niveau 2+ — KYC renforcé | KYC standard + carte grise du véhicule + assurance en cours de validité + permis de conduire (si location avec conducteur). |
| **Entreprise** | Niveau 3 — KYC business | RCCM / registre de commerce + NIF / numéro fiscal + statuts + pièce d'identité du gérant + justificatif de siège + RIB / Mobile Money pro. |
| **Professions réglementées** (médecins, infirmiers, laborantins, etc.) | Niveau 3+ — KYC professionnel | KYC standard + **diplôme** + **inscription à l'ordre professionnel** ou autorisation d'exercer + vérification manuelle par un modérateur Siryia. |
| **Annonceur** | Niveau 2 ou 3 | KYC standard (particulier) ou KYC business (entreprise). |
| **Livreur / Coursier** | Niveau 2+ | KYC standard + permis de conduire (si motorisé) + carte grise du véhicule utilisé. |
| **Modérateur / Admin / Support** | Interne | Création contrôlée par l'équipe Siryia (pas d'inscription publique). |

### 4.4 Processus de vérification
1. Soumission des documents depuis l'espace personnel (upload sécurisé, formats image/PDF).
2. **Vérification automatique** (OCR + matching selfie/pièce + détection de fraude) lorsque possible.
3. **Vérification manuelle** par un modérateur Siryia pour les cas complexes ou les professions réglementées.
4. Notification du statut : *en attente*, *validé*, *refusé* (avec motif) ou *complément demandé*.
5. **Badge "Vérifié"** affiché publiquement sur le profil après validation.
6. Re-vérification périodique possible (renouvellement annuel pour les professions réglementées et les loueurs).

### 4.5 Sécurité et conformité
- Stockage chiffré des documents d'identité (au repos et en transit).
- Conformité **RGPD** et lois locales sur la protection des données personnelles.
- Droit à la suppression / portabilité des données.
- Journalisation des accès aux documents sensibles.

## 6. Fonctionnalités clés (transversales)

- Profils utilisateurs vérifiés.
- Système de notation et d'avis.
- Paiement intégré : Mobile Money (TMoney, Moov), cartes bancaires, crypto (à étudier).
- Géolocalisation des produits et services.
- Multilingue : français, anglais, langues locales.

## 7. Module Marketplace (vente en ligne)

### 7.1 Catégories autorisées au lancement
- Alimentaire (frais, sec, boissons)
- Vêtements & mode
- Électronique & high-tech
- Maison & électroménager
- Beauté & cosmétique
- Bébé & enfants
- Bricolage & matériaux de construction
- Agriculture & élevage
- Produits artisanaux locaux
- Produits numériques (ebooks, formations, licences logicielles…)

L'arborescence complète des catégories/sous-catégories sera détaillée dans une annexe dédiée et pourra évoluer.

### 7.2 État des produits
- Produits **neufs** et **d'occasion** autorisés.
- L'état du produit (neuf, comme neuf, bon état, état moyen, à réparer) est **obligatoirement déclaré** par le vendeur sur chaque fiche produit.

### 7.3 Produits interdits
Liste non exhaustive — toute publication contraire entraîne la suppression et la sanction du compte :
- Armes, munitions, explosifs.
- Drogues, stupéfiants, substances illicites.
- Médicaments sur ordonnance et produits pharmaceutiques non autorisés.
- Contrefaçons et produits violant la propriété intellectuelle.
- Contenus à caractère sexuel, pornographique ou pédopornographique.
- Espèces animales protégées, ivoire, produits issus du braconnage.
- Produits dangereux ou non conformes aux normes locales.
- Tabac et alcool : **soumis à conditions** (vendeurs vérifiés, restriction d'âge, conformité légale du pays).
- Tout produit interdit par la loi du pays de l'acheteur ou du vendeur.

### 7.4 Modes de livraison (au choix du vendeur et de l'acheteur)
1. **Livraison Siryia** — assurée par le réseau de coursiers de la plateforme.
2. **Livraison par le vendeur** — le vendeur gère lui-même l'expédition.
3. **Retrait en point relais / boutique** — l'acheteur récupère sa commande à un point physique.

Le vendeur peut activer **un, deux ou les trois modes** par produit ou par boutique. L'acheteur choisit son mode au moment de la commande.

### 7.5 Réseau de coursiers Siryia
- **Inscription publique** : toute personne peut s'inscrire en tant que **coursier indépendant** sur la plateforme (rôle K — Livreur / Coursier).
- KYC obligatoire : pièce d'identité, selfie, permis de conduire (si motorisé), carte grise et assurance du véhicule utilisé.
- Application coursier dédiée (ou module dans l'app) : acceptation de courses, navigation GPS, preuve de livraison (photo + signature/OTP), suivi des gains.
- Rémunération à la course + bonus + pourboires.
- Système de notation des coursiers par les clients et les vendeurs.
- Gestion des zones de livraison et de la disponibilité.

### 7.6 Panier multi-vendeurs
- L'acheteur peut commander auprès de **plusieurs vendeurs en une seule transaction**.
- La commande est ensuite **scindée automatiquement** en sous-commandes par vendeur, chacune avec son propre suivi de livraison et son mode d'expédition.
- Paiement unique côté acheteur, répartition automatique côté vendeurs après validation de la livraison.

### 7.7 Gestion des commandes et litiges
- Suivi de commande en temps réel (statuts : en attente → confirmée → préparée → expédiée → livrée → clôturée).
- **Séquestre des paiements (escrow)** : les fonds sont retenus par Siryia et libérés au vendeur après confirmation de réception par l'acheteur (ou délai automatique).
- Procédure de **retour, remboursement et litige** intégrée, avec arbitrage par le support Siryia.

## 8. Module Recrutement & Services

### 8.1 Types de missions
Toutes les natures de missions sont supportées :
- **Mission ponctuelle** (ex. : un plombier pour 2 h, un coursier pour une livraison).
- **Mission récurrente** (ex. : femme de ménage 3×/semaine, jardinier mensuel).
- **CDD / CDI** (recrutement long terme par les entreprises et particuliers).
- **Mission urgente / à la demande** (ex. : médecin ou infirmier à domicile immédiatement, dépannage électrique en urgence) — avec marquage prioritaire et notifications push instantanées aux prestataires disponibles à proximité.

### 8.2 Modes de mise en relation
Les **trois modes** sont disponibles, le client choisit selon son besoin :
1. **Publication d'un besoin** — le client poste une demande (description, budget, lieu, délai), les prestataires éligibles **postulent / envoient un devis**.
2. **Recherche directe dans l'annuaire** — le client parcourt les profils (filtres : métier, géoloc, note, prix, disponibilité, langue, badge vérifié) et contacte directement.
3. **Matching automatique (Siryia Match)** — l'algorithme propose les **meilleurs prestataires** selon : géolocalisation, notation, disponibilité en temps réel, tarif, taux d'acceptation, historique de réussite, langues parlées.

### 8.3 Tarification
Au choix du prestataire pour chaque service / annonce :
- **Tarif fixe** affiché publiquement (au forfait, à l'heure, à la journée…).
- **Devis sur demande** (négociation au cas par cas).
- **Enchère inversée** : le client publie son besoin et son budget max, les prestataires proposent leur prix, le client choisit (pas forcément le moins cher).

### 8.4 Paiement et règle d'or
- **Tout se passe sur la plateforme** : prise de contact, négociation, contractualisation, paiement, évaluation.
- Le paiement transite **obligatoirement** par Siryia via le système d'**escrow** : les fonds sont retenus jusqu'à la validation de la prestation par le client (ou délai automatique).
- **Commission Siryia** prélevée sur chaque transaction (taux défini dans la grille tarifaire — section dédiée).
- **Interdiction stricte** d'échanger des coordonnées personnelles (téléphone, email, WhatsApp, RIB) avant la confirmation de la mission via la messagerie interne. La messagerie filtre/masque automatiquement ces informations tant que le contrat n'est pas validé.
- **Clause de non-responsabilité** : tout échange, accord ou paiement effectué **en dehors de la plateforme** se fait aux risques exclusifs des parties. Siryia **décline toute responsabilité** en cas de litige, fraude, non-paiement ou défaut de prestation hors plateforme et n'interviendra ni en médiation ni en remboursement.
- En cas de tentative répétée de contournement détectée, **sanctions graduées** : avertissement → suspension → bannissement définitif + perte des fonds en attente.

### 8.5 Contrat et traçabilité
- Génération automatique d'un **contrat de prestation** (PDF) signé électroniquement par les deux parties pour chaque mission acceptée.
- Historique complet (chat, devis, factures, preuves de réalisation) conservé et accessible aux deux parties + au support en cas de litige.
- Émission automatique de **factures conformes** (avec mentions fiscales selon le pays).

### 8.6 Évaluation post-mission
- Notation **bilatérale** (le client note le prestataire, le prestataire note le client).
- Commentaire écrit + critères (ponctualité, qualité, communication, rapport qualité/prix).
- Les notes alimentent le score de réputation et le matching automatique.

## 9. Module Annuaire des spécialistes

### 9.1 Distinction avec le module Recrutement
- **Annuaire** = **vitrine permanente** type « pages jaunes intelligentes ». Chaque professionnel dispose d'une **page profil publique et persistante** : on peut le trouver, consulter ses informations, ses horaires, prendre rendez-vous, le contacter directement.
- **Recrutement & Services** = **mise en relation transactionnelle** pour une mission précise (publication d'un besoin, devis, contrat, paiement encadré).
- Les deux modules sont **complémentaires et interconnectés** : depuis une page annuaire, on peut déclencher une mission qui bascule dans le module Recrutement (avec contrat, escrow, etc.).

### 9.2 Fonctionnalités de la page profil
- Bio détaillée, photo de profil, photo de couverture.
- Liste des services proposés avec **tarifs indicatifs**.
- **Horaires d'ouverture** et **disponibilités en temps réel**.
- Langues parlées, certifications, diplômes, années d'expérience.
- **Galerie de réalisations / portfolio** (photos, vidéos, études de cas).
- **Avis et notes** clients (issus des missions effectuées sur Siryia).
- **Géolocalisation** + itinéraire (intégration cartes).
- **QR code** unique du profil (à imprimer sur cartes de visite, devantures, flyers).
- Boutons d'action : **Appeler**, **Message**, **Prendre RDV**, **Demander un devis**.
- **URL personnalisée** : `siryia.com/@nom-du-pro`.
- Partage du profil sur réseaux sociaux.

### 9.3 Prise de rendez-vous en ligne
- **Calendrier intégré** avec créneaux configurables par le pro.
- Réservation en quelques clics par le client (avec ou sans acompte selon le choix du pro).
- **Rappels automatiques** par notification push, email et SMS.
- Synchronisation possible avec calendriers externes (Google Calendar, Outlook, iCal).
- Annulation / report selon politique définie par le pro.

### 9.4 Téléconsultation / appel vidéo intégré
- Module de **visioconférence sécurisée** intégré pour les professions adaptées (médecins, avocats, consultants, coachs, formateurs, etc.).
- Chiffrement de bout en bout.
- Enregistrement optionnel (avec consentement explicite des deux parties).
- Partage de documents et chat pendant l'appel.
- Facturation automatique de la consultation à la fin de la session.

### 9.5 Statistiques pour le professionnel
Tableau de bord analytique :
- Nombre de vues du profil (jour, semaine, mois).
- Origine du trafic (recherche, annuaire, réseaux sociaux, QR code).
- Nombre de contacts, demandes de devis, RDV pris, missions converties.
- Taux de conversion.
- Note moyenne et évolution.
- Comparaison avec la moyenne du secteur.

### 9.6 Modèle de référencement — **Freemium**
- **Profil de base 100 % gratuit** pour tout professionnel vérifié : page complète, contact, RDV, avis, géoloc, QR code.
- **Options premium payantes** (à la carte ou en abonnement) :
  - **Mise en avant** dans les résultats de recherche (top des listes, encart sponsorisé).
  - **Badge "Top Pro"** ou **"Pro Vérifié Premium"**.
  - Augmentation du nombre de photos / vidéos dans le portfolio.
  - Accès aux **statistiques avancées**.
  - **Bannière personnalisée** sur la page profil.
  - Désactivation des publicités concurrentes sur sa propre page.
  - Multi-localisations (plusieurs adresses pour un même pro).
  - Création d'un mini-site dédié sous sous-domaine `@nom.siryia.com`.
- Les abonnements premium sont détaillés dans la section **Modèle économique**.

## 10. Module Location / Achat de véhicules

### 10.1 Types de véhicules supportés
- **Voitures particulières** (citadines, berlines, SUV, 4×4, etc.).
- **Motos** et **scooters**.
- **Tricycles / motos-taxis (zem)**.
- **Utilitaires** et **camionnettes**.
- **Camions** (poids lourds, frigorifiques, bennes).
- **Vélos** et **trottinettes électriques**.
- **Bateaux** et **pirogues** (utiles en zones lacustres et côtières).
- **Engins de chantier** (pelleteuses, bulldozers, grues, bétonnières, etc.).

### 10.2 Modes proposés
- **Location courte durée** (à l'heure, demi-journée, journée).
- **Location longue durée** (semaine, mois, année — formule type leasing).
- **Vente** : véhicules **neufs** et **d'occasion**.
- **Location avec chauffeur** (type VTC, transport, déménagement, événementiel).
- **Location sans chauffeur** (auto-location classique).

Le loueur/vendeur configure pour chaque véhicule les modes activés et les tarifs associés.

### 10.3 Assurance et caution
- **Caution obligatoire** bloquée via escrow pendant toute la durée de la location, libérée après l'état des lieux de retour.
- **Assurance en cours de validité obligatoire** côté loueur (justificatif vérifié lors du KYC du véhicule).
- **Assurance partenaire Siryia optionnelle** proposée au locataire au moment de la réservation (couverture complémentaire : tous risques, vol, bris de glace, assistance).
- En cas de location avec chauffeur, le **permis de conduire valide** et l'**assurance professionnelle** du chauffeur sont obligatoires.

### 10.4 État des lieux numérique
- État des lieux **avant** et **après** location, **obligatoire**, réalisé dans l'application :
  - Photos / vidéos horodatées et géolocalisées du véhicule (extérieur, intérieur, compteur kilométrique, niveau de carburant).
  - Checklist standardisée (rayures, accessoires, documents de bord, équipements).
  - **Signature électronique** des deux parties.
  - PDF généré et archivé, accessible aux deux parties et au support.
- En cas de litige (dommages, kilométrage, carburant), l'arbitrage Siryia s'appuie sur ces états des lieux pour décider de la retenue sur caution.

### 10.5 Réservation et paiement
- Calendrier de disponibilité par véhicule.
- Réservation immédiate ou avec validation manuelle du loueur (au choix).
- Paiement via Siryia (escrow + commission) — règle d'or identique à la section Recrutement : **tout se passe sur la plateforme**.
- Génération automatique du **contrat de location** signé électroniquement.

### 10.6 Fonctionnalités avancées
- Géolocalisation en temps réel (option) pour les flottes professionnelles.
- Module **flotte** pour les loueurs gérant plusieurs véhicules (gestion centralisée, statistiques, planning).
- Notation bilatérale loueur ↔ locataire après chaque location.
- Historique d'entretien et carnet de bord numérique du véhicule.

## 11. Module Espace publicitaire

### 11.1 Formats publicitaires proposés
- **Bannières** sur les pages d'accueil, catégories et pages produits (web + mobile).
- **Annonces sponsorisées** dans les résultats de recherche (style Google Ads).
- **Produits sponsorisés** dans la marketplace (style Amazon Ads).
- **Posts sponsorisés** dans le fil d'actualité (si module social activé ultérieurement).
- **Notifications push sponsorisées** (usage encadré et limité pour ne pas saturer les utilisateurs).
- **Vidéos pre-roll / interstitielles** (avant lecture de contenu, entre deux pages).
- **Pop-ups** (autorisés mais déconseillés, plafonnés en fréquence).
- **Email / SMS marketing** : campagnes envoyées à la base d'utilisateurs via Siryia, **opt-in obligatoire** et désinscription en un clic.
- **Encart "À la une" hyper-local** : publicité ciblée par ville, quartier ou zone géographique.

### 11.2 Modèles de facturation
Les quatre modèles sont disponibles selon le format :
- **CPC** — coût par clic.
- **CPM** — coût par mille impressions.
- **CPA** — coût par action / conversion (achat, prise de RDV, inscription, etc.).
- **Forfait (pack hebdomadaire / mensuel)** — **modèle privilégié et le plus probable** dans le contexte du marché cible (simplicité, prévisibilité du budget pour les annonceurs locaux).

### 11.3 Mode de gestion des campagnes
**Hybride** :
- **Self-service par défaut** : interface complète style "Siryia Ads Manager" permettant à tout annonceur de créer, paramétrer, lancer, suivre et optimiser ses campagnes en autonomie (création visuels, sélection format, ciblage, budget, planning, A/B testing).
- **Offre managée** : pour les gros budgets, comptes stratégiques ou annonceurs souhaitant un accompagnement, l'équipe commerciale Siryia prend en charge la stratégie, la création et l'optimisation des campagnes.

### 11.4 Ciblage
Ciblage fin autorisé, dans le strict respect du RGPD et des lois locales :
- **Géolocalisation** (pays, région, ville, quartier, rayon autour d'un point).
- **Démographie** : âge, sexe, langue.
- **Centres d'intérêt** et catégories d'achat.
- **Historique d'achat et de navigation** (anonymisé).
- **Catégorie professionnelle** (B2B : ciblage par métier, secteur, taille d'entreprise).
- **Type de compte** (particulier, entreprise, prestataire, vendeur).
- **Comportement** : utilisateurs ayant abandonné un panier, vu un produit, etc. (retargeting).
- **Audiences personnalisées** (import de listes par l'annonceur, opt-in vérifié) et **audiences similaires** (lookalike).

### 11.5 Tableau de bord annonceur
- Statistiques en temps réel : impressions, clics, CTR, conversions, ROAS, dépense.
- Comparaison entre campagnes / formats / créations.
- Recommandations automatiques d'optimisation.
- Facturation et historique des paiements.

### 11.6 Modération des publicités
- **Validation préalable** de chaque création publicitaire par l'équipe Siryia (automatique + humaine si besoin).
- Refus systématique des publicités contraires à la charte (produits interdits, contenus trompeurs, discriminatoires, politiques sensibles, etc.).
- Possibilité pour les utilisateurs de **signaler** une publicité.

## 12. Paiements et finances

### 12.1 Moyens de paiement intégrés dès le lancement (Togo)
- **Mobile Money** : **TMoney** (Togocom) et **Moov Money / Flooz** (Moov Africa).
- **Cartes bancaires** Visa et Mastercard via un PSP partenaire (CinetPay, PayDunya, Flutterwave ou Stripe — choix final lors de la phase technique).
- **PayPal** (notamment pour la diaspora et les paiements internationaux).
- **Virement bancaire** (pour les gros montants et les transactions B2B).
- **Paiement à la livraison (cash)** : **autorisé**, encadré par des règles strictes pour limiter le risque (uniquement pour les acheteurs vérifiés, plafond par commande, possibilité pour le vendeur de l'activer/désactiver, signalement et blocage en cas d'abus).
- **Cryptomonnaies** (USDT, BTC, et stablecoins africains éventuels) : intégrés progressivement, possiblement dès la phase 1 selon faisabilité réglementaire, sinon en phase 2.

### 12.2 Devises
- **XOF (FCFA)** au lancement (Togo et UEMOA).
- **Multi-devises** activé progressivement avec l'expansion : GHS (Ghana), NGN (Nigéria), XAF (Afrique centrale), EUR, USD, GBP, etc.
- **Conversion automatique** au taux du jour avec marge transparente affichée.

### 12.3 Wallet
- **Pas de wallet interne** côté utilisateur dans la version initiale.
- Les fonds (gains vendeurs/prestataires, remboursements acheteurs) sont **directement reversés** vers le moyen de paiement de référence du bénéficiaire (Mobile Money, compte bancaire, etc.) après la libération de l'escrow.
- Cette décision pourra être réévaluée ultérieurement selon les retours utilisateurs et les contraintes réglementaires.

### 12.4 Escrow (séquestre)
- **Tous les paiements transitent obligatoirement par le système d'escrow Siryia** (cf. modules Marketplace, Recrutement et Véhicules).
- Les fonds sont retenus jusqu'à la **confirmation de la prestation / livraison** par l'acheteur, ou la fin du **délai automatique** de validation.
- En cas de litige, les fonds restent bloqués pendant la procédure d'arbitrage.

### 12.5 Reversements aux bénéficiaires
- Reversement automatique vers Mobile Money / banque après libération de l'escrow.
- **Délais** et **frais de reversement** transparents, affichés au moment du paiement.
- Historique complet des transactions consultable par chaque utilisateur.
- Génération automatique de **factures, reçus et relevés** conformes à la fiscalité locale.

### 12.6 Commissions Siryia
- Une **commission est prélevée** sur chaque transaction (marketplace, services, location/vente de véhicules) ainsi que sur les abonnements premium et la vente d'espaces publicitaires.
- **Taux à définir** dans une **grille tarifaire dédiée** (annexe du présent cahier des charges), différenciée selon :
  - Le type de transaction (vente produit, prestation de service, location véhicule, etc.).
  - Le statut du vendeur/prestataire (standard vs. premium — un abonnement premium pouvant inclure une commission réduite).
  - Le volume traité (paliers dégressifs pour les gros vendeurs).
  - La catégorie / le pays.

### 12.7 Sécurité financière
- Conformité **PCI-DSS** pour le traitement des cartes bancaires.
- **Lutte anti-fraude** (scoring des transactions, détection d'anomalies, 3D Secure).
- **Lutte contre le blanchiment (AML)** et **KYB / KYC** renforcés au-delà de certains seuils de transaction.
- Plafonds de transaction paramétrables par niveau de vérification.
- Journalisation complète et auditable de toutes les opérations financières.

## 13. Notifications et communication

### 13.1 Canaux de notification
Tous les canaux suivants sont activés et **paramétrables par l'utilisateur** :
- **Push mobile** (iOS, Android).
- **Push web** (navigateur).
- **Email** transactionnel et marketing (avec opt-in et désinscription en un clic pour le marketing).
- **SMS** (OTP, rappels RDV, livraisons, alertes urgentes).
- **WhatsApp Business API** (canal stratégique en Afrique : confirmations, suivi commande, support, rappels).
- **In-app** (cloche de notifications avec historique).

### 13.2 Centre de notifications et préférences
- **Centre unique** dans le profil utilisateur avec **préférences fines** : pour chaque type d'événement (commande, RDV, message, marketing, sécurité, paiement, etc.), l'utilisateur choisit **quel(s) canal(aux)** il souhaite recevoir.
- Mode **"Ne pas déranger"** avec plages horaires.
- Notifications critiques de sécurité (connexion suspecte, changement mot de passe, etc.) **non désactivables**.

### 13.3 Messagerie interne
Système de chat intégré entre utilisateurs (acheteur ↔ vendeur, client ↔ prestataire, locataire ↔ loueur, etc.) :
- **Chat texte** en temps réel.
- **Envoi d'images, vidéos et fichiers** (PDF, documents).
- **Messages vocaux** (très adaptés aux usages locaux et aux utilisateurs peu à l'aise avec l'écrit).
- **Appels audio et vidéo intégrés** (au-delà de la téléconsultation, disponibles entre tous les utilisateurs en relation contractuelle).
- **Traduction automatique** des messages (français ↔ anglais ↔ langues locales) pour fluidifier les échanges multilingues.
- **Filtrage automatique des coordonnées personnelles** (téléphone, email, RIB, liens externes) tant que la mission n'est pas validée — application de la règle d'or « tout sur la plateforme ».
- Indicateurs de présence (en ligne, vu, en train d'écrire), accusés de lecture.
- Recherche dans les conversations, archivage, signalement, blocage.
- Conservation chiffrée et accessible au support en cas de litige.

### 13.4 Assistant IA Siryia
Chatbot intelligent intégré, disponible **24h/24 et 7j/7** sur web et mobile :
- Répond aux **questions fréquentes** des utilisateurs (compte, paiement, livraison, vérification, fonctionnement des modules, etc.).
- Joue le rôle de **guide** : aide à la prise en main, tutoriels contextuels, suggestions selon le profil et l'historique.
- Aide à la **navigation** : trouve un produit, un prestataire, une catégorie, lance une action (créer une annonce, prendre RDV, suivre une commande).
- **Multilingue** (français, anglais, langues locales).
- **Escalade automatique** vers un agent humain du support en cas de question complexe, de litige ou d'insatisfaction détectée.
- Apprentissage continu à partir des interactions (avec respect strict de la confidentialité).
- Capable de comprendre le **texte et la voix** (input vocal pour l'accessibilité).

### 13.5 Support client humain
- Tickets, chat en direct, email, téléphone, WhatsApp.
- Horaires étendus, **support multilingue**.
- SLA différenciés selon le niveau de compte (standard / premium / business).

## 14. Spécifications techniques

### 14.1 Plateformes cibles
- **Application web responsive** (desktop, tablette, mobile navigateur).
- **Application mobile hybride** (Android et iOS via un code unique).
- **PWA (Progressive Web App)** en complément, pour une installation légère depuis le navigateur sans passer par les stores.
- **Mode hors-ligne partiel** : mise en cache intelligente pour permettre la consultation du catalogue, des profils consultés, des messages et des commandes en cours sans connexion ; synchronisation automatique au retour du réseau (essentiel pour les zones à connectivité faible ou intermittente).

### 14.2 Stack technique retenue

#### Frontend web
- **Framework** : **Next.js (React 18+)** — SSR/SSG/ISR pour SEO, performance et expérience instantanée.
- **Styling** : **TailwindCSS** + **shadcn/ui** pour un design system cohérent.
- **State management** : **TanStack Query** (server state) + **Zustand** (client state).
- **Internationalisation** : **next-intl** (FR, EN, langues locales).
- **PWA** : **next-pwa** (service worker, cache, mode hors-ligne).

#### Mobile (hybride, un seul code Android + iOS)
- **Framework** : **React Native + Expo** — partage maximal de code et de logique avec le frontend web, déploiement OTA, écosystème mature.
- **Navigation** : React Navigation.
- **Notifications** : Expo Notifications + FCM/APNs.
- **Storage offline** : MMKV / SQLite local + sync différée.
- **Build mobile** : **Expo EAS Build (cloud)**, piloté par **GitHub Actions** ; génération des artefacts Android (**APK** pour tests, **AAB** pour publication) sans dépendre d'Android Studio en local.

#### Backend
- **Framework** : **NestJS (Node.js + TypeScript)** — architecture modulaire, idéal pour découper en microservices au fil de la croissance.
- **API** : **REST** (public, documentée OpenAPI/Swagger) + **GraphQL** (interne / mobile, requêtes optimisées) + **WebSocket** (chat, notifications, suivi temps réel).
- **Architecture** : **modulaire monolithique au lancement** (rapide à livrer), **découpage progressif en microservices** module par module avec la croissance (auth, marketplace, services, véhicules, ads, paiements, notifications, etc.).
- **Queue / jobs asynchrones** : **BullMQ** (sur Redis) pour les emails, notifications, traitements lourds, génération PDF.

#### Base de données — **PostgreSQL** (choix arbitré)
**Choix retenu : PostgreSQL.** Justification face à MongoDB :
- **ACID natif** indispensable pour les transactions financières (escrow, paiements, commissions, reversements).
- Données **fortement relationnelles** (utilisateurs ↔ rôles ↔ commandes ↔ vendeurs ↔ produits ↔ livraisons ↔ avis ↔ paiements) : SQL est nettement plus performant.
- Conformité fiscale, audit, reporting analytique bien plus puissants en SQL standard.
- Scalabilité éprouvée (read replicas, partitioning, Citus, TimescaleDB pour les analytics).
- Écosystème **Supabase** = gain de plusieurs mois de développement.

**Stratégie de déploiement de la base :**
- **Phase 1 (lancement / MVP)** : utilisation de **Supabase managé** (Postgres + Auth + Storage + Realtime + Edge Functions + RLS + Studio) — gain de plusieurs mois de développement.
- **Phase 2 (croissance — migration vers VPS Hostinger)** : deux options possibles, **à arbitrer au moment de la migration** selon la complexité atteinte :
  - **Option A (recommandée par défaut) — PostgreSQL officiel en image Docker** (`postgres:16+`) sur le VPS :
    - Migration de la base via `pg_dump` (depuis Supabase) puis `psql` (sur le VPS) → réplique schéma, données, index, contraintes, policies RLS.
    - Réécriture / portage des services périphériques Supabase :
      - **Auth** → soit auth maison NestJS, soit **Keycloak**, soit **Lucia**.
      - **Storage** → **MinIO** (S3-compatible) + script de migration des fichiers.
      - **Realtime** → WebSocket NestJS (Socket.io) déjà prévu dans la stack.
      - **Edge Functions** → endpoints NestJS.
    - Avantages : maîtrise totale, légèreté, image Docker officielle reproductible (volumes, backups, mises à jour simples).
  - **Option B — Supabase self-hosted** sur le VPS via le `docker-compose` officiel Supabase :
    - On garde **tous les services Supabase** (Auth, Storage, Realtime, Edge Functions, Studio) sans rien réécrire.
    - Migration = dump SQL + copie des buckets Storage.
    - Avantages : continuité fonctionnelle parfaite. Inconvénient : stack plus lourde à opérer (plusieurs conteneurs interdépendants).
- Dans tous les cas, **PostgreSQL n'est jamais installé "à la main" sur le système Linux du VPS** : on utilise **toujours une image Docker officielle**, avec des **volumes persistants** pour les données et des **backups automatisés** (dumps quotidiens chiffrés et off-site).

#### Cache et recherche
- **Redis** : cache applicatif, sessions, files d'attente (BullMQ), rate limiting, pub/sub.
- **Meilisearch** ou **Typesense** au lancement (légers, rapides, faciles à self-host) ; migration possible vers **Elasticsearch / OpenSearch** à grande échelle pour la recherche full-text multilingue, le filtrage à facettes, la géo-recherche.

#### Stockage de fichiers
- **Supabase Storage** au lancement.
- Migration vers **MinIO** (S3-compatible, self-hosted sur VPS) ou **Cloudflare R2** / **Backblaze B2** à la croissance, avec CDN devant.

#### Temps réel
- **WebSocket** via **Socket.io** côté NestJS, **Supabase Realtime** côté DB pour les flux de données.

#### Intelligence artificielle
- **Stratégie "zéro budget" en quatre temps** — **opérationnelle au lancement** : primaire **Groq** (clé disponible) + fallback **OpenRouter `:free` / Cloudflare Workers AI** ; **Mistral La Plateforme** activé dès que le plan de facturation est ouvert. Pas de GPU, pas d'infra locale requise.
  1. **Dev + Démos + Beta (0 €)** — 2 providers gratuits, API OpenAI-compatible, interchangeables :
    - **Groq** ([console.groq.com](https://console.groq.com)) — LPU matériel dédié, **ultra rapide**, Llama 3 / Mixtral 8x7B, quota gratuit généreux. ✅ **Choix primaire immédiat.**
    - **OpenRouter** — modèles `:free` (fallback principal sans carte), puis **Cloudflare Workers AI** (10 k req/jour) en fallback secondaire.
    - **Mistral "La Plateforme"** ([console.mistral.ai](https://console.mistral.ai)) — activé dès que le plan de facturation/projet est validé ; données hébergées en **Europe (RGPD natif)**.
  2. **Lancement MVP / petits volumes (gratuit puis payant marginal)** — Groq + OpenRouter en gratuit tant que possible ; activation progressive de **Mistral payant** (~0,20 $/1M tokens input Mistral Small 3) quand il faut plus de stabilité/quota. Coût : **0 € au démarrage**, ~5–80 $/mois quand le trafic monte.
  3. **Croissance** — API payante Mistral (Small + Large pour cas complexes) combinée Groq, Together AI, Fireworks AI, OpenRouter. Coûts indicatifs : ~500–800 $/mois pour 1 M conversations.
  4. **Scale** — **Self-hosted vLLM** sur GPU dédié (Hostinger / OVH) **uniquement** quand le volume rend l'API plus chère qu'un GPU loué (> 1-2 M conversations/mois) ou pour souveraineté totale. Modèles : Mistral Small 3 → Mistral Large 2. Alternatives : Llama 3.3 70B, Qwen 2.5 72B.
- **Principe clé — abstraction provider** : tout le code utilise un client **OpenAI-compatible** avec URL + clé API configurables par variables d'environnement. Changer de provider = changer 2 variables. Zéro réécriture de code.
- **Estimation de coûts API** (modèle léger type Mistral Small ou GPT-4o-mini, ~2 500 tokens/conversation) : 10 k conv/mois → ~5–8 $ ; 100 k → ~50–80 $ ; 1 M → ~500–800 $ ; 10 M → ~5 000–8 000 $.
- **Composants annexes open source (gratuits, dès le départ)** :
  - Embeddings : **`bge-m3`** ou **`multilingual-e5-large`**.
  - Vector DB : **`pgvector`** (extension PostgreSQL — pas d'infra additionnelle).
  - Transcription vocale : **Whisper large-v3** (open source, multilingue) ou tier gratuit Deepgram/Groq.
  - Modération images : **LLaVA / CLIP** open source (ou API Sightengine au démarrage).
  - Orchestration : **LangChain** ou **LlamaIndex**.
- **Cas d'usage Siryia** : assistant guide 24/7 (RAG sur knowledge base), modération de contenu (texte + image), moteur de matching (Siryia Match), détection de fraude, recommandations personnalisées, suggestion de pricing.

#### Infrastructure et DevOps
- **Conteneurisation** : **Docker** pour tout, **Docker Compose** au début, **Kubernetes (k3s)** sur VPS quand le trafic justifie l'orchestration.
- **CI/CD** : **GitHub Actions** (tests, build, déploiement automatisés).
- **CI/CD mobile** : workflows GitHub Actions déclenchant `eas build` en mode non interactif, avec récupération centralisée des artefacts APK/AAB/IPA.
- **Reverse proxy** : **Caddy** ou **Nginx** + **Traefik** pour Kubernetes.
- **CDN** : **Cloudflare** (gratuit/abordable, excellent pour l'Afrique, DDoS protection, WAF inclus).
- **Monitoring** : **Grafana + Prometheus + Loki** (auto-hébergeable) ou **Better Stack** / **Sentry** (erreurs applicatives).
- **Backups** : sauvegardes PostgreSQL automatiques quotidiennes (chiffrées, off-site), tests de restauration réguliers.
- **Secrets** : Vault / Doppler / variables d'environnement chiffrées.

#### Matrice explicite des technologies et de leur role
| Technologie | Role principal dans Siryia |
|---|---|
| Next.js | Frontend web principal (SSR/SEO/performance) pour marketplace, services, annuaire, admin. |
| TailwindCSS + shadcn/ui | Design system unifie, composants reutilisables, coherence visuelle multi-modules. |
| TanStack Query + Zustand | Gestion d'etat: TanStack pour donnees serveur/cache, Zustand pour etat UI local. |
| next-intl | Internationalisation (FR/EN/langues locales) sur web. |
| next-pwa | Capacites PWA et offline partiel sur navigateur. |
| React Native + Expo | Application mobile unique Android/iOS avec partage de logique metier. |
| Expo EAS Build | Build cloud mobile (APK/AAB/IPA) sans Android Studio local. |
| NestJS | Backend principal modulaire (API, securite, regles metier, integrations). |
| REST + GraphQL + WebSocket | REST public documente, GraphQL optimise mobile/interne, WebSocket temps reel (chat/notifications/suivi). |
| PostgreSQL | Base transactionnelle ACID (escrow, paiements, commandes, audit, reporting). |
| Supabase (phase 1) | Acceleration MVP: Postgres manage + Auth + Storage + Realtime + RLS. |
| Prisma | ORM TypeScript et migrations schema/versioning DB. |
| Redis | Cache, sessions, rate limiting, pub/sub, support des files asynchrones. |
| BullMQ | Files de jobs (emails, notifications, traitements lourds, retries). |
| Meilisearch / Typesense | Recherche full-text/facettes rapide au lancement. |
| Elasticsearch / OpenSearch | Recherche a grande echelle quand le volume augmente. |
| Supabase Storage / MinIO / R2 / B2 | Stockage objet des fichiers (KYC, images, docs), evolutif selon phase. |
| Socket.io / Supabase Realtime | Synchronisation temps reel des messages, evenements et statuts. |
| Groq | Provider IA principal immediat (gratuit, rapide) pour assistant/support/moderation. |
| OpenRouter `:free` + Cloudflare Workers AI | Fallback IA gratuit pour continuite de service sans cout. |
| Mistral La Plateforme | Provider IA prioritaire conformite (Europe/RGPD) des que billing actif. |
| LangChain / LlamaIndex | Orchestration RAG, tools/function-calling, chaines IA. |
| pgvector | Recherche semantique (embeddings) directement dans PostgreSQL. |
| Whisper large-v3 | Transcription vocale multilingue pour support et accessibilite. |
| Docker / Compose / k3s | Standard d'execution: local, staging, prod scalable. |
| GitHub Actions | CI/CD securise (tests, quality gates, build, deployment). |
| Caddy / Nginx / Traefik | Reverse proxy, routage HTTPS, gestion du trafic entrant. |
| Cloudflare | CDN + WAF + anti-DDoS + acceleration reseau. |
| Grafana + Prometheus + Loki | Observabilite infra/app (metriques, logs, alerting). |
| Sentry / Better Stack | Monitoring erreurs applicatives et incidents en production. |
| Vault / Doppler | Gestion centralisee et securisee des secrets/cles API. |

### 14.3 Hébergement
- **Phase 1 — Lancement / MVP** : services managés (**Supabase**, **Vercel** pour le frontend Next.js, **Cloudflare** CDN, **Expo EAS** pour le mobile) — go-to-market rapide, peu d'ops.
- **Phase 2 — Croissance** : migration vers un ou plusieurs **VPS Hostinger** (KVM, dimensionnés selon la charge) avec :
  - PostgreSQL self-hosted (avec read replicas).
  - Redis self-hosted.
  - MinIO pour le stockage.
  - Kubernetes (k3s) pour l'orchestration des microservices.
  - Cloudflare conservé en CDN/WAF/DDoS.
- **Phase 3 — Multi-pays** : architecture multi-régions, edge nodes, possibilité de bascule vers un cloud hyperscaler (AWS / GCP) avec présence en Afrique si besoin.
- **Souveraineté des données** : objectif à terme d'héberger les données africaines dans des data centers africains (Togo, Sénégal, Afrique du Sud) selon disponibilité et conformité.

### 14.4 Performance et scalabilité
- **Objectif** : la plateforme doit rester **fluide, scalable et évolutive quel que soit le nombre d'utilisateurs**, sans signe de saturation.
- **Architecture nativement scalable horizontalement** dès la conception : services stateless, base découplée, cache, CDN, queues asynchrones, microservices à terme.
- **SLO cibles** (Service Level Objectives) :
  - Disponibilité : **≥ 99,9 %** (≤ 8 h d'indisponibilité par an).
  - Temps de réponse API : **p95 < 300 ms**, **p99 < 800 ms**.
  - Temps de chargement page web : **LCP < 2,5 s** sur 3G.
  - Temps de démarrage app mobile : **< 2 s** (cold start).
- **Auto-scaling** : Kubernetes HPA (horizontal pod autoscaler) selon CPU/RAM/req-per-sec.
- **Tests de charge** réguliers (k6, Locust) pour anticiper les pics (soldes, campagnes, fêtes).
- **Optimisations** : lazy loading, image optimization (Next/Image, AVIF/WebP), code splitting, server components, edge caching, requêtes SQL indexées et profilées.

### 14.5 Sécurité applicative
- HTTPS partout (TLS 1.3), HSTS.
- Protection **OWASP Top 10** (XSS, CSRF, SQLi, SSRF, etc.).
- **Rate limiting** et anti-bruteforce sur toutes les API sensibles.
- **WAF** Cloudflare en frontal.
- Audits de sécurité réguliers et **bug bounty** ouvert à terme.
- **2FA** disponible partout, obligatoire pour les rôles à risque.
- Chiffrement des données sensibles au repos (AES-256) et en transit (TLS).

## 15. Sécurité, légal et conformité

### 15.1 Documents juridiques à produire
- **Conditions Générales d'Utilisation (CGU)** — distinctes selon le rôle (acheteur, vendeur, prestataire, entreprise, annonceur, loueur, coursier).
- **Conditions Générales de Vente (CGV)** marketplace.
- **Conditions Générales de Service** (recrutement & services).
- **Conditions de location** (véhicules).
- **Politique de confidentialité** (RGPD-compliant).
- **Politique cookies** + bannière de consentement granulaire.
- **Politique de remboursement** et de litiges.
- **Politique de contenu interdit** (cf. § Marketplace 7.3).
- **Charte de confiance** et **code de conduite** des utilisateurs.
- **Politique de signalement** et grille de sanctions (avertissement → suspension → bannissement).
- **Mentions légales** complètes.
- **Charte des annonceurs** (publicités).
- **Charte des coursiers**.

> Rédaction par un **avocat / juriste spécialisé** (à recruter ou prestataire externe) — à intégrer comme poste budgétaire du projet.

### 15.2 Conformité réglementaire à respecter
- **RGPD** (Règlement Général sur la Protection des Données — UE) : utilisateurs européens, diaspora, équipes internationales.
- **Loi togolaise n° 2019-014** relative à la protection des données à caractère personnel.
- **Réglementation UEMOA / BCEAO** sur les paiements électroniques et la monnaie électronique.
- **Réglementation Mobile Money** (TMoney, Moov Money) et conventions avec les opérateurs.
- **Conformité PCI-DSS** pour le traitement des cartes bancaires.
- **Réglementation des professions réglementées** (santé : agrément du Ministère de la Santé togolais ; ordres professionnels : médecins, infirmiers, avocats, etc.).
- **Loi togolaise sur le commerce électronique** et la cybersécurité.
- **Lois locales** applicables dans chaque pays d'expansion (à étudier avant chaque lancement national).
- **Lutte contre le blanchiment (AML)** et **financement du terrorisme (CFT)** : KYC/KYB renforcés au-delà des seuils réglementaires.
- **Réglementation crypto** (selon évolution locale et internationale).

### 15.3 Statut juridique de Siryia
- **Société à créer** sous statut togolais.
- Forme privilégiée : **SAS togolaise** (souplesse de gouvernance, ouverture future à des investisseurs) — ou **SARL** selon le besoin initial.
- Inscription au **RCCM**, obtention du **NIF**, immatriculation **CNSS**, **patente**, etc.
- Création des entités locales nécessaires lors de l'expansion par pays.

### 15.4 Médiation et litiges
- **1er niveau — Service interne d'arbitrage Siryia** : équipe modération + support, basée sur les preuves (chat, contrats, états des lieux, paiements escrow).
- **2nd niveau — Médiation externe** : recours possible à un médiateur indépendant en cas d'échec du 1er niveau.
- **3ème niveau — Tribunaux compétents** : juridiction de **Lomé (Togo)** par défaut, avec adaptation par pays lors de l'expansion (clause attributive de compétence dans les CGU).

### 15.5 Politiques transversales obligatoires (à activer dès le lancement)
- Charte de confiance et code de conduite.
- Politique de signalement et sanctions graduées.
- Politique cookies (consentement granulaire).
- Politique de remboursement.
- Politique de contenu interdit.
- Politique de modération des avis (anti-faux avis, anti-diffamation).
- Politique de gestion des données (conservation, suppression, portabilité).
- Politique de notification des incidents de sécurité (≤ 72 h, conforme RGPD).
- Politique des mineurs (interdiction d'inscription < 18 ans, ou avec accord parental selon le module).

### 15.6 Sécurité opérationnelle
- DPO (Data Protection Officer) désigné.
- RSSI / référent sécurité interne (ou externalisé) à recruter en croissance.
- Plan de continuité d'activité (PCA) et plan de reprise d'activité (PRA).
- Tests d'intrusion (pentests) annuels.
- **Bug bounty** ouvert à terme.
- Formation sécurité de l'équipe.
- Procédure de gestion des incidents et de communication de crise.

## 16. Modèle économique

> Tous les tarifs ci-dessous sont **indicatifs** et seront **affinés** lors de la phase de validation marché et précisés dans une **grille tarifaire dédiée** (annexe).

### 16.1 Sources de revenus principales
1. **Commissions sur transactions** (marketplace, services, location/vente véhicules, livraisons).
2. **Abonnements premium** (4 paliers — voir § 16.3).
3. **Vente d'espaces publicitaires** (cf. module § 11).

### 16.2 Sources de revenus additionnelles
- **Commission sur livraison** : part prélevée par Siryia sur chaque course assurée par le réseau de coursiers.
- **Frais d'inscription premium one-shot** pour les professionnels à fort volume souhaitant un onboarding accéléré et un accompagnement initial.
- **Vente de leads qualifiés** aux entreprises (mise en relation avec acheteurs / prospects ciblés, dans le respect strict du consentement RGPD).
- **Formations et certifications payantes** pour les pros (ex. « Vendeur Certifié Siryia », « Coursier Certifié Siryia », formation à la vente en ligne, à la gestion de profil, au marketing) — avec délivrance de badge sur le profil.
- **Marque blanche (white-label)** : revente de la technologie Siryia à d'autres opérateurs (administrations, grandes entreprises, partenaires) pour leurs propres marketplaces internes.
- **Données anonymisées et études de marché** : vente d'**insights agrégés et anonymisés** (tendances de consommation, prix moyens par catégorie, volumes par zone) aux entreprises, instituts, ONG — dans le strict respect du RGPD et sans données personnelles identifiables.

### 16.3 Paliers d'abonnement
| Palier | Cible | Tarif indicatif | Avantages clés |
|--------|-------|-----------------|----------------|
| **Free** | Tout utilisateur | 0 FCFA | Fonctionnalités de base, profil vérifié, contact, RDV, vente/achat, commission standard. |
| **Pro** | Professionnels indépendants, freelances, artisans, vendeurs solo | ~5 000–10 000 FCFA / mois | Commission réduite, mise en avant dans les recherches, badge "Pro Vérifié", plus de photos/vidéos, statistiques avancées, support prioritaire, crédits publicitaires offerts. |
| **Business** | PME, commerces, agences | ~25 000–50 000 FCFA / mois | Tous les avantages Pro + multi-utilisateurs (équipe), boutique personnalisée, outils marketing (newsletter, codes promo, ventes flash), crédits pub majorés, support prioritaire renforcé, statistiques business. |
| **Enterprise** | Grandes entreprises, groupes, partenaires stratégiques | Sur devis | Tous les avantages Business + API d'intégration, SSO, account manager dédié, SLA renforcés, multi-localisations, marque blanche optionnelle, formations sur mesure. |

### 16.4 Avantages premium détaillés
- **Commission réduite** sur les transactions selon le palier (échelle dégressive).
- **Plus de photos, vidéos et caractères** par annonce / produit / fiche profil.
- **Mise en avant** dans les résultats de recherche (boost organique, encart sponsorisé inclus).
- **Badges** : "Pro Vérifié", "Top Pro", "Business", "Enterprise".
- **Statistiques avancées** (visites, conversions, comparatif sectoriel, ROI publicitaire).
- **Support prioritaire** (chat dédié, SLA réduit, account manager pour Business+).
- **Multi-utilisateurs** (Business et Enterprise) avec rôles internes.
- **API d'intégration** (Enterprise) pour connecter Siryia à un ERP / CRM / site existant.
- **Personnalisation visuelle** de la boutique (bannière, couleurs, logo, mini-site sous-domaine).
- **Crédits publicitaires** offerts chaque mois (proportionnels au palier).
- **Outils marketing** : campagnes email/SMS/WhatsApp via Siryia, codes promo, ventes flash, programme de fidélité, gestion d'avis assistée.
- **Multi-localisations** (plusieurs adresses pour un même pro).
- **Désactivation des publicités concurrentes** sur sa propre page.

### 16.5 Politique tarifaire et évolutions
- **Tarifs initiaux indicatifs**, **réajustables** après la phase MVP en fonction du marché et des retours utilisateurs.
- **Grille de commissions** différenciée par module, par palier d'abonnement, par volume et par catégorie (annexe à produire).
- **Promotions de lancement** envisagées (gratuité du premium pendant X mois pour les early adopters, parrainage, etc.).
- **Transparence totale** : tarifs et commissions toujours affichés clairement avant chaque transaction.

## 17. Roadmap (phases de développement)

> Aucun délai temporel n'est imposé. Le projet avance **étape par étape**, en mode intensif. La progression est pilotée par la **complétion des sprints** (cf. fichier `sprint.md`), pas par un calendrier.

### Phase 0 — Préparation (avant code)
- Création de la société (SAS togolaise), KYC bancaire, ouverture des comptes Mobile Money pro (TMoney, Moov).
- Recrutement de l'équipe noyau (lead dev, designer UX/UI, product owner, juriste/DPO).
- Identité visuelle complète (logo, charte graphique, design system Siryia).
- Wireframes et maquettes UX/UI haute fidélité (Figma).
- Achat des noms de domaine (siryia.tg, siryia.com, siryia.app, etc.).
- Rédaction des CGU/CGV et politiques par le juriste.
- Mise en place des outils : repo Git, CI/CD, gestion de projet, design system, environnements dev / staging / preview.

### Phase 1 — MVP
Modules livrés en priorité :
- **Auth + KYC + profils + rôles** (avec cumul de rôles, comptes entreprise multi-utilisateurs).
- **Annuaire V1 (Lite)** : Vitrine publique des professionnels avec portfolio et boutons de contact (sans prise de RDV).
- **Marketplace** (catalogue, panier multi-vendeurs, commande, escrow, livraison, retours).
- **Recrutement & Services** (publication besoin, annuaire, matching, devis, contrat, escrow).
- **Paiements** : TMoney, Moov, cartes bancaires (via PSP).
- **Messagerie + notifications** (push, email, SMS, WhatsApp, in-app, filtrage anti-contournement).
- **Support + assistant IA** (FAQ, guide, escalade humaine).
- **Plateformes** : Web responsive + PWA + App mobile (Android prioritaire, iOS en parallèle via React Native).
- **Hébergement initial** : Vercel (frontend) + Supabase (backend/DB) pour les premières mises en ligne et démos.

### Phase 2 — Extension
- **Annuaire des spécialistes** (RDV en ligne, téléconsultation vidéo).
- **Location / Vente de véhicules** (état des lieux numérique, escrow, contrats).
- **Espace publicitaire** (Siryia Ads Manager self-service + offre managée).
- **Réseau coursiers Siryia** complet (app coursier, géoloc, preuves de livraison).
- **Abonnements premium** (Pro, Business).
- **Migration progressive** Supabase → VPS Hostinger (PostgreSQL Docker officiel, MinIO, Redis, k3s).

### Phase 3 — Croissance
- **Expansion Afrique de l'Ouest** (Bénin, Ghana, Côte d'Ivoire, Nigéria, Burkina, Sénégal, etc.).
- **Multi-devises** (GHS, NGN, XAF, EUR, USD…).
- **API publique** + offre **Enterprise**.
- **Marque blanche** (white-label).
- **Crypto** (USDT, BTC) si pas encore activée en P1.
- **IA avancée** : matching intelligent, détection de fraude, modération automatique.

### Phase 4 — Scale
- **Afrique entière** (centrale, Nord, Est, australe).
- **Architecture microservices complète, multi-régions** (edge, CDN multi-points).
- **Programme partenaires** (intégrateurs, agences, revendeurs).
- **International** : diaspora africaine puis grand public mondial.



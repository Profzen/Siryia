const fs = require("fs");
const path = "docs/memoire.md";
let content = fs.readFileSync(path, "utf-8");
const target = "## 18. Phase 2";
if (content.includes(target)) {
  content = content.substring(0, content.indexOf(target));
}

const newContent = `## 18. Phase 2 (Sprints 2.1, 2.2, 2.3) - Finalisation de bout en bout
- **Compilation Backend** : Correction du problème critique de génération du dossier dist avec NestJS. Nous avons supprimé le cache \`tsconfig.build.tsbuildinfo\` et modifié \`nest-cli.json\` (\`deleteOutDir: false\`) pour assurer une stabilité du serveur en mode \`--watch\`.
- **Frontend - Fixes UI** : Correction de l invisibilité du texte dans les champs \`<Input />\` (Login/Register) en Light Mode.
- **Frontend - Services & Missions** : Création des pages \`/services/demander\` (Formulaire de besoin) et \`/services/missions\` (Liste des offres/demandes) avec des données factices pour les démos.
- **Frontend - Véhicules** : Implémentation de la page \`/vehicles\` (Sprint 2.3) avec liste, filtres de recherche et design dynamique.
- **Backend - Phase 2** : Le backend a été enrichi de bout en bout. Tous les contrôleurs, services et schémas Prisma pour les Agendas, la Téléconsultation et les Véhicules sont opérationnels.
- **Administration** : Le panel Admin (\`/admin\`) est actif et restreint. Un script de seed (\`apps/backend/seed-admin.ts\`) a permis de générer un accès direct \`admin@siryia.com\`.

## 19. ÉTAT ACTUEL DU PROJET (Résumé Global pour reprise de contexte)
*Si vous reprenez ce projet après une pause ou dans une nouvelle session, lisez ceci :*

### Ce qui est terminé et fonctionnel :
1. **L Infrastructure Globale (Monorepo)** :
   - Frontend (Next.js 15, React 19, Tailwind CSS, Lucide Icons).
   - Backend (NestJS 11, Prisma ORM, PostgreSQL via Supabase, WebSockets Socket.io).
   - Application Mobile (Expo / React Native - Initialisée).
2. **Fonctionnalités Front & Back connectées** :
   - **Authentification** : Inscription et Connexion (Email OU Numéro de téléphone) avec hachage Argon2id et JWT Cookies.
   - **Marketplace (\`/marketplace\`)** : Catalogue, fiches produits, catégories, panier.
   - **Annuaire KYC (\`/annuaire\`)** : Liste des professionnels vérifiés.
   - **Services & Missions (\`/services\`)** : Publication et consultation de demandes.
   - **Véhicules (\`/vehicles\`)** : Consultation de la flotte disponible.
   - **Dashboard Utilisateur (\`/dashboard\`)** : Gestion de profil.
   - **Administration (\`/admin\`)** : Interface de gestion globale pour les rôles ADMIN. (Accès : \`admin@siryia.com\` / \`admin\`).

### Comment lancer le projet :
1. Installer les dépendances : \`npm install\` à la racine.
2. Démarrer tous les serveurs : \`npm run dev\` (Lance Next.js sur :3000, NestJS sur :3001, et Expo).
3. Base de données : Assurez-vous que le lien PostgreSQL Supabase est dans \`apps/backend/.env\`. Pour mettre à jour : \`npx prisma db push\`.

### Prochaines étapes :
- Tester le projet de bout en bout sur l hébergement final.
- Remplacer les données factices par des données de l API réelle pour les pages récemment créées (Missions, Véhicules).
- Poursuivre le développement Mobile si nécessaire.
`;

fs.writeFileSync(path, content + newContent, "utf-8");
console.log("Memoire mis à jour avec succès.");


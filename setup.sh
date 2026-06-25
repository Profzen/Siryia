#!/bin/bash

echo -e "\033[1;36mInitialisation de l'environnement Siryia (Linux/Mac)...\033[0m"

# Copie du .env.example
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "\033[1;32m[x] Fichier .env créé à partir de .env.example\033[0m"
else
    echo -e "\033[1;33m[ ] Le fichier .env existe déjà, on ne l'écrase pas.\033[0m"
fi

# Installation des dépendances
echo -e "\n\033[1;36mInstallation des dépendances npm...\033[0m"
npm install

# Lancement des containers Docker
echo -e "\n\033[1;36mLancement des services Docker (PostgreSQL, Redis)...\033[0m"
docker-compose up -d

echo -e "\n\033[1;32mEnvironnement prêt ! Vous pouvez lancer 'npm run dev' pour démarrer le frontend.\033[0m"

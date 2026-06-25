Write-Host "Initialisation de l'environnement Siryia (Windows)..." -ForegroundColor Cyan

# Copie du .env.example
if (!(Test-Path -Path ".env")) {
    Copy-Item -Path ".env.example" -Destination ".env"
    Write-Host "[x] Fichier .env cree a partir de .env.example" -ForegroundColor Green
} else {
    Write-Host "[ ] Le fichier .env existe deja, on ne l'écrase pas." -ForegroundColor Yellow
}

# Installation des dependances
Write-Host "`nInstallation des dependances npm..." -ForegroundColor Cyan
npm install

# Lancement des containers Docker
Write-Host "`nLancement des services Docker (PostgreSQL, Redis)..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "`nEnvironnement pret ! Vous pouvez lancer 'npm run dev' pour demarrer le frontend." -ForegroundColor Green

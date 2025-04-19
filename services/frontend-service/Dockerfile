# Étape 1 : Build du projet
FROM node:18-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers essentiels pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances avec npm ci (plus rapide et fiable en CI/CD)
RUN npm ci

# Copier le reste du projet
COPY . .

# Construire le projet
RUN npm run build || (echo "Échec du build" && exit 1)

# Étape 2 : Image finale optimisée avec Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copier uniquement les fichiers buildés
COPY --from=builder /app/dist .

# Exposer le port standard de Nginx
EXPOSE 80

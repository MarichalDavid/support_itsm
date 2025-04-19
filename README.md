# Support Platform - Architecture SaaS

Cette plateforme est une application SaaS qui gère différents services via une architecture microservices. Chaque service est indépendant et communique avec les autres via une passerelle API centralisée. L'authentification et la gestion des utilisateurs sont sécurisées par des tokens JWT.

## Architecture du projet

L'architecture du projet est divisée en plusieurs services et composants, chacun ayant un rôle spécifique. Voici un aperçu de la structure du projet :

```
support-platform/
│── services/
│   ├── api-gateway/             # Passerelle API pour gérer le routage
│   ├── auth-service/            # Service d'authentification
│   ├── chatbot-service/         # Service chatbot
│   ├── cache-service/           # Service de cache
│   ├── knowledge-base-service/  # Base de connaissances
│   ├── ticketing-service/       # Gestion des tickets
│   ├── connector-service/       # Connexion aux outils externes
│   ├── logging-service/         # Centralisation des logs
│   ├── frontend/                # Frontend en Next.js
│── database/
│   ├── postgres/                # Configuration de PostgreSQL
│   ├── redis/                   # Configuration de Redis
│── docker-compose.yml           # Orchestration des services
│── .env                         # Variables d’environnement
│── README.md                    # Documentation du projet
```

### Services Backend

#### **1. API Gateway**
L'API Gateway est le point d'entrée unique pour toutes les requêtes externes. Il gère le routage des requêtes vers les services backend appropriés, applique des règles de sécurité (authentification, gestion des tokens), et garantit la communication entre les services.

- **Technologies** : NGINX, Kong, ou Traefik (selon vos préférences)
- **Fonctionnalités** : Routage, authentification, surveillance, agrégation d'API.

#### **2. Auth Service**

- **Technologies** : FastAPI, PostgreSQL
- **Fonctionnalités** : Gestion des utilisateurs, génération de tokens d’authentification.

#### **3. Chatbot Service**
Le service Chatbot gère les demandes des utilisateurs en s'appuyant sur un cache, une base de connaissances, ou un LLM (Large Language Model) comme TogetherAI. Ce service répond aux questions des utilisateurs en accédant aux données pertinentes.

- **Technologies** : FastAPI, Redis, TogetherAI API
- **Fonctionnalités** : Réponses automatiques, utilisation d'un cache pour les réponses fréquentes.

#### **4. Cache Service**
Le service de cache est utilisé pour stocker temporairement les réponses fréquentes du chatbot afin d'améliorer les performances de l'application et de réduire la latence.

- **Technologies** : Redis
- **Fonctionnalités** : Cache des données fréquemment consultées.

#### **5. Knowledge Base Service**
Ce service gère la base de connaissances et indexe les données sous forme de "chunks". Les utilisateurs peuvent consulter ces informations via le chatbot pour obtenir des réponses pertinentes.

- **Technologies** : Elasticsearch, MongoDB
- **Fonctionnalités** : Gestion de la base de données des connaissances, recherche et récupération de données.

#### **6. Ticketing Service**
Le service de gestion des tickets permet aux utilisateurs de soumettre et suivre des demandes. Les tickets peuvent être créés à partir des interactions avec le chatbot.

- **Technologies** : FastAPI, PostgreSQL
- **Fonctionnalités** : Création et gestion des tickets, intégration avec le service Connector pour envoyer des tickets vers des outils externes.

#### **7. Connector Service**
Le service Connector permet l'intégration avec des outils externes comme **GLPI**, **Jira**, **ServiceNow**, etc., pour la gestion des tickets.

- **Technologies** : FastAPI, API configurable
- **Fonctionnalités** : Envoi de tickets vers des outils externes, gestion des intégrations tierces.

#### **8. Logging & Monitoring**
Le service de centralisation des logs collecte les logs des services et les rend accessibles via un tableau de bord. Il surveille également la performance des services et génère des alertes en cas de problème.

- **Technologies** : ELK Stack (Elasticsearch, Logstash, Kibana), Prometheus
- **Fonctionnalités** : Collecte des logs, surveillance des services, génération d'alertes.

### Services Frontend

#### **Frontend (Next.js)**
Le frontend de l'application est une application client indépendante qui interagit avec l'API Gateway. Cette application est responsable de l'interface utilisateur et de l'authentification.

- **Technologies** : Next.js, React
- **Fonctionnalités** : Interface utilisateur, interactions avec l'API Gateway pour récupérer les données et afficher les résultats.

### Base de Données

#### **1. PostgreSQL**
Utilisé pour stocker les données des services (utilisateurs, tickets, etc.). Chaque service qui en a besoin a accès à une base de données PostgreSQL dédiée.

- **Technologies** : PostgreSQL
- **Fonctionnalités** : Stockage des données relationnelles, persistance des informations.

#### **2. Redis**
Utilisé pour le cache des réponses fréquentes et la gestion des sessions.

- **Technologies** : Redis
- **Fonctionnalités** : Cache des réponses fréquemment utilisées, gestion des sessions utilisateur.

---

### Configuration et Déploiement

#### **1. Docker Compose**
L’orchestration des services est gérée avec Docker Compose. Ce fichier permet de définir et de configurer tous les services dans un environnement local ou en production.

- **Commandes Docker Compose** :
  - `docker-compose up` : Démarre tous les services.
  - `docker-compose down` : Arrête et supprime les services en cours d'exécution.
  - `docker-compose build` : Reconstruit les images Docker des services.

#### **2. Variables d'Environnement**
Les variables d'environnement sont définies dans le fichier `.env`. Elles permettent de personnaliser la configuration des services (ex : bases de données, secrets API, etc.).

---

### Sécurisation et Authentification

- L'authentification des utilisateurs se fait via le **Auth Service**. Le frontend interagit avec ce service pour obtenir un **token JWT** qui est utilisé pour sécuriser les autres requêtes API.
- L'**API Gateway** applique une authentification sécurisée sur toutes les API et permet la gestion des rôles et des permissions via les tokens JWT.

---

### Conclusion

Cette architecture SaaS est basée sur des microservices et permet de gérer facilement la scalabilité et l’indépendance des services tout en maintenant une communication fluide grâce à l'API Gateway. Le frontend est un client indépendant qui interagit avec l'API Gateway pour obtenir les données nécessaires. Chaque service est responsable de ses propres données et de ses fonctionnalités, offrant ainsi une architecture modulaire et facile à maintenir.

---

### Instructions d'installation

1. **Clonez le dépôt** :
   ```
   git clone https://github.com/votre-utilisateur/support-platform.git
   cd support-platform
   ```

2. **Créez et configurez le fichier `.env`** avec les variables appropriées.

3. **Démarrez les services avec Docker Compose** :
   ```
   docker-compose up --build
   ```

4. **Accédez à l'application** :
   Le frontend sera accessible sur `http://localhost:3000`.

---

### Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

Ce fichier **README.md** présente de manière complète et structurée l'architecture du projet SaaS, les composants et leur interaction, ainsi que les instructions nécessaires pour le déployer et le maintenir.
```


Vous pouvez directement copier ce contenu et le sauvegarder dans un fichier `README.md` dans votre projet.
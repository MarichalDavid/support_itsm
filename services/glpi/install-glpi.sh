#!/bin/bash
set -e

# Variables de configuration
CONFIG_FILE="/var/www/html/glpi/config/config_db.php"

# Vérifie si GLPI est déjà installé
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Première installation de GLPI..."
  
  # Attendre que la base de données soit prête
  echo "Attente de la base de données..."
  for i in {1..30}; do
    if php -r "try { new PDO('mysql:host=${MARIADB_HOST};dbname=${MARIADB_DATABASE}', '${MARIADB_USER}', '${MARIADB_PASSWORD}'); echo 'OK'; } catch (PDOException \$e) { exit(1); }"; then
      echo "Base de données disponible !"
      break
    fi
    echo "Tentative $i/30: Base de données pas encore disponible, nouvelle tentative dans 5 secondes..."
    sleep 5
  done
  
  # Créer le fichier de configuration de la base de données manuellement
  mkdir -p /var/www/html/glpi/config
  
  cat > "$CONFIG_FILE" << EOF
<?php
class DB extends DBmysql {
   public \$dbhost = '$MARIADB_HOST';
   public \$dbuser = '$MARIADB_USER';
   public \$dbpassword = '$MARIADB_PASSWORD';
   public \$dbdefault = '$MARIADB_DATABASE';
}
EOF
  
  # Assurer que le fichier a les bons droits
  chown -R www-data:www-data /var/www/html/glpi/
  
  echo "Configuration de GLPI terminée avec succès!"
else
  echo "GLPI est déjà installé, démarrage normal..."
fi

# Activer le module rewrite si nécessaire
a2enmod rewrite

# Vérifier si le répertoire GLPI contient des fichiers
if [ ! "$(ls -A /var/www/html/glpi)" ]; then
  echo "ERREUR: Le répertoire GLPI est vide. Vérifiez vos volumes Docker."
  exit 1
fi

# Vérifier si le fichier index.php existe
if [ ! -f "/var/www/html/glpi/index.php" ]; then
  echo "ERREUR: index.php n'existe pas dans /var/www/html/glpi"
  echo "Contenu du répertoire:"
  ls -la /var/www/html/glpi
  exit 1
fi

# S'assurer que les sites sont bien activés
a2dissite 000-default.conf
a2ensite 000-default.conf

# Vérifier la configuration d'Apache
echo "Vérification de la configuration Apache..."
apache2ctl configtest

# Vérifier si Apache est déjà en cours d'exécution
if pgrep apache2 > /dev/null; then
  echo "Apache est déjà en cours d'exécution, redémarrage..."
  service apache2 stop
  sleep 2
fi

# Démarrer Apache en premier plan
echo "Démarrage d'Apache..."
exec apache2ctl -DFOREGROUND
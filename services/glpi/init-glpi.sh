#!/bin/bash
set -e

# Fix Apache warning "Could not reliably determine the server's fully qualified domain name"
echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Démarrer Apache temporairement pour permettre les commandes CLI
service apache2 start

cd /var/www/html/glpi

# Vérifie si la base GLPI contient des tables
TABLES_EXIST=$(mysql -h $MARIADB_HOST -u $MARIADB_USER -p$MARIADB_PASSWORD $MARIADB_DATABASE -e "SHOW TABLES;" | wc -l)

if [ "$TABLES_EXIST" -le 1 ]; then
  echo "📥 Base vide, installation automatique de GLPI en cours..."

  # Supprime config_db.php s'il existe (force la reconfiguration)
  rm -f /var/www/html/glpi/config/config_db.php

  # Installation automatique avec reconfigure
  php bin/console db:install \
    --db-host=$MARIADB_HOST \
    --db-user=$MARIADB_USER \
    --db-password=$MARIADB_PASSWORD \
    --db-name=$MARIADB_DATABASE \
    --default-language=fr_FR \
    --reconfigure \
    --force --no-interaction

  echo "✅ Installation GLPI terminée."

  # Charger les timezones MySQL et accorder les droits nécessaires
  echo "🔧 Configuration des timezones MySQL..."
  mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -h $MARIADB_HOST -u root -p$MARIADB_ROOT_PASSWORD mysql
  mysql -h $MARIADB_HOST -u root -p$MARIADB_ROOT_PASSWORD -e "GRANT SELECT ON mysql.time_zone_name TO '$MARIADB_USER'@'%'; FLUSH PRIVILEGES;"

  # Activer les timezones dans GLPI
  php bin/console database:enable_timezones

  echo "🕒 Timezones MySQL activées."

  # Supprimer install.php pour sécurité
  rm -f /var/www/html/glpi/install/install.php
else
  echo "🔍 La base GLPI contient déjà des données, aucune installation nécessaire."
fi

# Arrêter Apache temporaire lancé en arrière-plan
service apache2 stop

# Lancer Apache en mode foreground
exec apache2-foreground

FROM diouxx/glpi

# Installation de mysqladmin pour vérifier la disponibilité de la base de données
RUN apt-get update && apt-get install -y mariadb-client && apt-get clean

# Ajouter ServerName global pour supprimer l'avertissement
RUN echo "ServerName glpi.localhost" >> /etc/apache2/apache2.conf

# Copier la configuration Apache personnalisée
COPY apache-conf/000-default.conf /etc/apache2/sites-available/000-default.conf

# Créez un script de démarrage personnalisé
COPY install-glpi.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/install-glpi.sh

ENTRYPOINT ["/usr/local/bin/install-glpi.sh"]
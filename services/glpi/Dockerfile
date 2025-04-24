FROM diouxx/glpi

# Installer le client MySQL + modules PHP
RUN apt-get update && apt-get install -y mariadb-client php-intl php-curl php-gd php-mbstring php-xml php-zip php-bcmath php-mysql && \
    echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copier config + script
COPY config/config_db.php /var/www/html/glpi/config/config_db.php
COPY init-glpi.sh /init-glpi.sh
RUN chmod +x /init-glpi.sh

CMD ["/init-glpi.sh"]

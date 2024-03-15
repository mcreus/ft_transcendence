#!/bin/bash

# Nom du conteneur Elasticsearch
ES_CONTAINER_NAME=transcendence_elasticsearch_1
ENV_FILE="./.env"

# Démarrage d'Elasticsearch et récupération du mot de passe
PASSWORD=$(docker exec -it $ES_CONTAINER_NAME /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic -b)


# Vérification du .env
if [ ! -f "$ENV_FILE" ]; then
    echo "$ENV_FILE n'existe pas. Création du fichier..."
    echo "ELASTIC_PASSWORD=$PASSWORD" > $ENV_FILE
else
    # Vérifie si ELASTIC_PASSWORD est déjà dans le fichier .env
    if grep -q "ELASTIC_PASSWORD=" "$ENV_FILE"; then
        # Le mot de passe existe, mise à jour
        sed -i "s/ELASTIC_PASSWORD=.*/ELASTIC_PASSWORD=$PASSWORD/" $ENV_FILE
    else
        # Le mot de passe n'existe pas, ajout à la fin du fichier
        echo "ELASTIC_PASSWORD=$PASSWORD" >> $ENV_FILE
    fi
    echo "Le mot de passe Elasticsearch a été mis à jour dans $ENV_FILE."
fi

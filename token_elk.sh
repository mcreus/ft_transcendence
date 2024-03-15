#!/bin/bash

# Nom du conteneur Elasticsearch
ES_CONTAINER_NAME="transcendence_elasticsearch_1"
ENV_FILE="./.env"  # Chemin vers votre fichier .env

# Générer le jeton d'inscription pour Kibana
TOKEN=$(docker exec -it $ES_CONTAINER_NAME bin/elasticsearch-create-enrollment-token -s kibana | tr -d '\r')

# Vérifier si le TOKEN est récupéré
if [ -z "$TOKEN" ]; then
    echo "Erreur : Impossible de récupérer le jeton d'inscription."
    exit 1
fi

echo "Jeton d'inscription pour Kibana : $TOKEN"

# Vérifie si le fichier .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "$ENV_FILE n'existe pas. Création du fichier..."
    echo "KIBANA_ENROLLMENT_TOKEN=$TOKEN" > $ENV_FILE
else
    # Vérifie si KIBANA_ENROLLMENT_TOKEN est déjà dans le fichier .env
    if grep -q "KIBANA_ENROLLMENT_TOKEN=" "$ENV_FILE"; then
        # Le token existe, le mettre à jour
        sed -i "s/KIBANA_ENROLLMENT_TOKEN=.*/KIBANA_ENROLLMENT_TOKEN=$TOKEN/" $ENV_FILE
    else
        # Le token n'existe pas, ajout à la fin du fichier
        echo "KIBANA_ENROLLMENT_TOKEN=$TOKEN" >> $ENV_FILE
    fi
    echo "Le jeton d'inscription pour Kibana a été mis à jour dans $ENV_FILE."
fi

# Utiliser une image de base Python
FROM python:3.8

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Config pour envoyer les logs
RUN pip install django python-logstash

# Eviter le message d'erreur
RUN pip install --upgrade pip

# Copier le fichier des dépendances et installer les dépendances
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code de l'application dans le conteneur
COPY . /app/

# Exposer le port utilisé par l'application
EXPOSE 8000

RUN python3 -m pip install -U 'channels[daphne]'

# Commande pour lancer l'application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

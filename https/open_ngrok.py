# -*- coding: utf-8 -*-
import requests
import json
import subprocess
import platform

def get_ngrok_url():
    # Interroge l'API de Ngrok pour obtenir les tunnels
    try:
        ngrok_api = 'http://localhost:4040/api/tunnels'
        response = requests.get(ngrok_api)
        tunnels = json.loads(response.content)

        # Recherche l'URL HTTPS du premier tunnel
        for tunnel in tunnels['tunnels']:
            if tunnel['proto'] == 'https':
                return tunnel['public_url']
        return None
    except requests.exceptions.RequestException as e:
        print("Erreur lors de la connexion à l'API de Ngrok : {}".format(e))
        return None

def open_url_with_chrome(url):
    try:
        # Détecte le système d'exploitation
        os_type = platform.system()
        
        # Définit la commande en fonction du système d'exploitation
        if os_type == "Linux":
            chrome_command = 'flatpak run com.google.Chrome'
        elif os_type == "Darwin":  # Darwin indique un système macOS
            chrome_command = 'open -a "Google Chrome"'
        else:
            print(f"Système d'exploitation non pris en charge : {os_type}")
            return

        # Exécute la commande
        subprocess.run(f"{chrome_command} {url}", shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'ouverture de Chrome: {e}")

def main():
    url = get_ngrok_url()
    if url:
        print("Ouverture de : {}".format(url))
        open_url_with_chrome(url)
    else:
        print("Aucun tunnel Ngrok n'a été trouvé.")

if __name__ == "__main__":
    main()
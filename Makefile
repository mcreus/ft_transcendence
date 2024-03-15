.PHONY: start clean

start:
        @echo "\033[0;33m\nDEMARRAGE DES SERVICES"
        docker-compose up -d
        @echo "\033[1;32m\nNGINX DJANGO HASHICORP & MODSECURITY CREATED\n"
        @echo "\033[0;33m\nINITIALISATION DE VAULT"
        sleep 5
        bash ./vault_init_script.sh
        @echo "\033[1;32m\nVAULT INITIALIZED\n"

clean:
        @echo "\033[0;31m\nSTOPPING CONTAINERS!!!!\n"
        docker-compose down
        @echo "\033[1;32m\nCONTAINERS STOPPED!!!!!\n"

fclean: clean
        @echo "\033[0;31m\nCLEANING DOCKERS!!!!\n"
        docker system prune
        docker rmi vshn/modsecurity:latest hashicorp/vault:latest python:3.8 nginx:latest bitnami/kibana:latest bitnami/elasticsearch:latest bitnami/logstash:latest transcendence_django:latest
        docker volume rm $$(docker volume ls -q) || true
        @echo "\033[1;32m\nDOCKERS STOPPED!!!!!\n"

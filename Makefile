.PHONY: start clean

start:
	@echo "\033[0;33m\nDEMARRAGE DES SERVICES"
	docker-compose up -d
	@echo "\033[1;32m\nNGINX NGROK HASHICORP & MODSECURITY CREATED\n"
	@echo "\033[0;33m\nDEMARRAGE DU TUNNEL POUR LE HTTPS..."
	@sleep 15
	python3 https/open_ngrok.py

clean:
	@echo "\033[0;31m\nSTOPPING CONTAINERS!!!!\n"
	docker-compose down
	@echo "\033[1;32m\nCONTAINERS STOPPED!!!!!\n"

fclean:
	@echo "\033[0;31m\nCLEANING DOCKERS!!!!\n"
	docker system prune
	@echo "\033[1;32m\nDOCKERS STOPPED!!!!!\n"
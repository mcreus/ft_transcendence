.PHONY: start clean

start:
	@echo "\033[0;33m\nDEMARRAGE DES SERVICES"
	docker-compose up -d
	@echo "\033[1;32m\nNGINX NGROK HASHICORP & MODSECURITY CREATED\n"
	@echo "\033[0;33m\nDEMARRAGE DU TUNNEL POUR LE HTTPS..."
	@sleep 20
	python3 https/open_ngrok.py

clean:
	docker-compose down

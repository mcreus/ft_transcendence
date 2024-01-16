.PHONY: start clean

start:
	@echo "DEMARRAGE DES SERVICES"
	docker-compose up -d
	@echo "DEMARRAGE DES SERVICES..."
	@sleep 20
	python3 https/open_ngrok.py

clean:
	docker-compose down

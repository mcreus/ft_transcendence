.PHONY: start clean fclean

start:
		@echo "\033[0;33m\nPROJECT STARTING...."
		./start_project.sh
		@echo "\033[1;32m\nPROJECT STARTED\n"

clean:
		@echo "\033[0;31m\nSTOPPING PROJECT!!!!\n"
		./stop_project.sh
		@echo "\033[1;32m\nPROJECT STOPPED!!!!!\n"

fclean:
		@echo "\033[0;31m\nCLEANING DOCKERS!!!!\n"
		./remove_images.sh
		@echo "\033[1;32m\nDOCKERS CLEANED!!!!!\n"
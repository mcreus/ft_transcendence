#!/bin/bash

ssh daphne@159.203.46.231 << 'ENDSSH'
cd ~/transcendence
docker rmi hashicorp/vault:latest transcendence_django:latest nginx:latest vshn/modsecurity:latest python:3.8
ENDSSH
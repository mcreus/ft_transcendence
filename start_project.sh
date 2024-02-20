#!/bin/bash

ssh daphne@159.203.46.231 << 'ENDSSH'
cd ~/transcendence
make start
ENDSSH

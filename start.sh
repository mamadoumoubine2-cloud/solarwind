#!/bin/bash
# Installation au démarrage
sudo apt-get update && sudo apt-get install -y telegraf

# Lancement de Telegraf
telegraf --config telegraf.conf

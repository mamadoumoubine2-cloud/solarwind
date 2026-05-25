#!/bin/bash
apt-get update && apt-get install -y telegraf
telegraf --config telegraf.conf

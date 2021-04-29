#!/bin/bash
set -euo pipefail

PARTIES=$(yq r daml.yaml 'parties.*')
STATE_DIR=$1

for p in ${PARTIES[@]}; do
  pkill -F $STATE_DIR/$p.pid;
  rm -f $STATE_DIR/$p.pid $STATE_DIR/$p.log
done

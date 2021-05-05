#!/bin/bash
set -euo pipefail

PARTIES=$(yq r daml.yaml 'parties.*')
DAR=$1
STATE_DIR=$2

for p in ${PARTIES[@]}; do
  daml trigger --dar $DAR \
	  --trigger-name AutoApproval:autoApprovalTrigger \
	  --ledger-host localhost --ledger-port 6865 \
	  --ledger-party $p > $STATE_DIR/$p.log & echo "$!" > $STATE_DIR/$p.pid
done

#!/bin/bash
set -euo pipefail

parties=$(yq r daml.yaml 'parties.*')
state_dir=$1

for p in ${parties[@]}; do
  ./scripts/stop-trigger.sh "autoapproval_$p" $state_dir
done

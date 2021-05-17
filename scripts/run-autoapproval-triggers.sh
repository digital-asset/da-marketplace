#!/bin/bash
set -euo pipefail

parties=$(yq r daml.yaml 'parties.*')
dar=$1
state_dir=$2

for p in ${parties[@]}; do
	./run-trigger.sh $p $dar AutoApproval:autoApprovalTrigger "autoapproval_$p" $state_dir
done

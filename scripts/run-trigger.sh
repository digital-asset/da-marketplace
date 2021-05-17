#!/bin/bash
set -euo pipefail

party=$1
dar=$2
name=$3
file=$4
state_dir=$5

daml trigger --dar $dar \
  --trigger-name $name \
  --ledger-host localhost --ledger-port 6865 \
  --ledger-party $party > $state_dir/$file.log & echo "$!" > $state_dir/$file.pid

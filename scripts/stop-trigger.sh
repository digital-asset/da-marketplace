#!/bin/bash
set -euo pipefail

file=$1
state_dir=$2

pkill -F $state_dir/$file.pid;
rm -f $state_dir/$file.pid $state_dir/$file.log

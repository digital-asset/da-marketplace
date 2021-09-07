#!/bin/bash
set -euo pipefail

file=$1
state_dir=$2

LOG_FILE=$state_dir/$file.log
PID_FILE=$state_dir/$file.pid
PID=$(< $PID_FILE)

# Verify the process ID exists before attempting to kill
if ps -p $PID > /dev/null
then
    pkill -F $PID_FILE
fi

rm -f $PID_FILE $LOG_FILE

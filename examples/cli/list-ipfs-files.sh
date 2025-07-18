#!/bin/bash

#
# IPFS file lister
#
# This script lists files (excluding directories) from IPFS.
# It retrieves and displays only file entries, omitting any directories
# from the output.
#

for cid in $(ipfs pin ls --type recursive --quiet); do
  if ipfs cat -l 10 "$cid" >/dev/null 2>&1; then
    echo "$cid"
  fi
done
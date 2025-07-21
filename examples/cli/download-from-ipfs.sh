#!/bin/bash

#
# IPFS Files Downloader
#
# This script downloads all recursively pinned files from IPFS to a local directory.
# It iterates through all pinned CIDs (Content Identifiers) and downloads each one
# to a temporary directory, then displays the total size of the downloaded content,
# the corresponding batch depth, and the amount.
#

# Batch Depth Utilization
# Theoretical Volume | Effective Volume | Batch Depth | Utilization Rate
# 536.87 MB          | 41.56 kB         | 17          | 0.01%
# 1.07 GB            | 6.19 MB          | 18          | 0.57%
# 2.15 GB            | 104.18 MB        | 19          | 4.73%
# 4.29 GB            | 639.27 MB        | 20          | 14.54%
# 8.59 GB            | 2.41 GB          | 21          | 28.11%
# 17.18 GB           | 7.18 GB          | 22          | 41.79%
# 34.36 GB           | 18.54 GB         | 23          | 53.95%
# 68.72 GB           | 43.75 GB         | 24          | 63.66%
# 137.44 GB          | 98.09 GB         | 25          | 71.37%
# 274.88 GB          | 211.95 GB        | 26          | 77.11%
# 549.76 GB          | 443.16 GB        | 27          | 80.61%
# 1.10 TB            | 923.78 GB        | 28          | 82.16%
# 2.20 TB            | 1.90 TB          | 29          | 86.30%
# 4.40 TB            | 3.88 TB          | 30          | 88.14%
# 8.80 TB            | 7.86 TB          | 31          | 89.26%
# 17.59 TB           | 15.87 TB         | 32          | 90.21%
# 35.18 TB           | 31.94 TB         | 33          | 90.77%
# 70.37 TB           | 64.19 TB         | 34          | 91.22%
# 140.74 TB          | 128.80 TB        | 35          | 91.52%
# 281.47 TB          | 258.19 TB        | 36          | 91.73%
# 562.95 TB          | 517.23 TB        | 37          | 91.88%
# 1.13 PB            | 1.04 PB          | 38          | 91.95%
# 2.25 PB            | 2.07 PB          | 39          | 92.00%
# 4.50 PB            | 4.15 PB          | 40          | 92.15%
# 9.01 PB            | 8.30 PB          | 41          | 92.14%

declare batch_depth_to_effective_volume=(
  [17]=0.04
  [18]=6.19
  [19]=104.18
  [20]=639.27
  [21]=2469.76
  [22]=7347.52
  [23]=18989.44
  [24]=44800
  [25]=100480
  [26]=217421.44
  [27]=453632
  [28]=946252.16
  [29]=1945600
  [30]=3971072
  [31]=8052736
  [32]=16245760
  [33]=32722944
  [34]=65753088
  [35]=131891200
  [36]=264380416
  [37]=529285120
  [38]=1063256064
  [39]=2113929216
  [40]=4252016640
  [41]=8493465600
)

#
# Gets the batch depth for a given volume.
#
function get_batch_depth_for_volume() {
  local x="$1"
  for depth in "${!batch_depth_to_effective_volume[@]}"; do
    if (( $(echo "${batch_depth_to_effective_volume[$depth]} > $x" | bc -l) )); then
      DEPTH=$((depth + 0))
      return 0
    fi
  done
  DEPTH=42
  return 1
}

#
# Gets the amount for a given TTL in seconds.
#
function get_amount() {
  local x="$1"
  AMOUNT=$((x * 37304 / 5)) # stamp price of 37304 PLUR / chunk / block
  return 0
}

DOWNLOAD_DIR="./tmp_ipfs_download"
rm -rf "$DOWNLOAD_DIR"
mkdir -p "$DOWNLOAD_DIR"

echo "Download IPFS files to: $DOWNLOAD_DIR"
echo

# List all items in IPFS MFS root
ipfs files ls / | while read -r ITEM; do
  # Get CID and type for each item
  STAT=$(ipfs files stat "/$ITEM")
  CID=$(echo "$STAT" | head -n1)
  TYPE=$(echo "$STAT" | grep -i "Type:" | awk '{print $2}')

  TARGET="$DOWNLOAD_DIR/$ITEM"

  if [[ "$TYPE" == "directory" ]]; then
    echo "Downloading directory: $ITEM (CID: $CID)"
    mkdir -p "$TARGET"
    ipfs get "$CID" -o "$TARGET"
  else
    echo "Downloading file: $ITEM (CID: $CID)"
    ipfs get "$CID" -o "$TARGET"
  fi
done

echo "All files and directories downloaded to $DOWNLOAD_DIR"

SIZE=$(du -sm "$DOWNLOAD_DIR" | awk '{print $1}')

get_batch_depth_for_volume ${SIZE}

get_amount 31536000 # 1 year in seconds

echo
echo "Size: ${SIZE}M, Batch Depth: ${DEPTH}, Amount: ${AMOUNT} for 1 year"



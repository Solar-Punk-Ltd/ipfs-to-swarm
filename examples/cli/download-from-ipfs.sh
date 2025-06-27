#!/bin/bash

#
# IPFS Files Downloader
# 
# This script downloads all recursively pinned files from IPFS to a local directory.
# It iterates through all pinned CIDs (Content Identifiers) and downloads each one
# to a temporary directory, then displays the total size of downloaded content.
#

DOWNLOAD_DIR="./tmp_ipfs_download"
rm -rf "$DOWNLOAD_DIR"
mkdir -p "$DOWNLOAD_DIR"

echo "Download IPFS files to: $DOWNLOAD_DIR"
echo

ipfs pin ls --type=recursive | awk '{print $1}' | while read -r cid; do
  echo "Download: $cid"
  ipfs get "$cid" -o "$DOWNLOAD_DIR/$cid" >/dev/null 2>&1
done

echo
echo "Size:"
du -sh "$DOWNLOAD_DIR"

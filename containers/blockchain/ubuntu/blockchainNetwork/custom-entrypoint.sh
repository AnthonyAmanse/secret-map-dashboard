#!/bin/bash
echo "Running custom entrypoint..."


ls /shared/workdir/blockchainNetwork

# mkdir /orderer
cp -r /shared/workdir/blockchainNetwork/* /app/

node index.js
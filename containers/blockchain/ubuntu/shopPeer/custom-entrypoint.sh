#!/bin/bash
echo "Running custom entrypoint..."


ls /shared/workdir/shopPeer

# mkdir /orderer
cp -r /shared/workdir/shopPeer/crypto /peer

peer node start
#!/bin/bash
echo "Running custom entrypoint..."


ls /shared/workdir/fitcoinPeer

# mkdir /orderer
cp -r /shared/workdir/fitcoinPeer/crypto /peer

peer node start
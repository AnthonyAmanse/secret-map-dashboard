#!/bin/bash
echo "Running custom entrypoint..."


ls /shared/workdir/orderer

# mkdir /orderer
cp -r /shared/workdir/orderer/crypto /orderer

orderer start
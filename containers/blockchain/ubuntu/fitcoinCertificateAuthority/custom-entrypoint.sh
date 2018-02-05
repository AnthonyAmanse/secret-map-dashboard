#!/bin/bash
echo "Running custom entrypoint..."


ls /shared/workdir/fitcoinCertificateAuthority
# cp -r /shared/workdir/fitcoinCertificateAuthority /
cp -r /shared/workdir/fitcoinCertificateAuthority/tls /ca
cp -r /shared/workdir/fitcoinCertificateAuthority/ca /ca
fabric-ca-server start
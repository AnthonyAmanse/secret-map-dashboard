#!/bin/bash
echo "Running custom entrypoint..."


ls /shared/workdir/shopCertificateAuthority
# cp -r /shared/workdir/shopCertificateAuthority /
cp -r /shared/workdir/shopCertificateAuthority/tls /ca
cp -r /shared/workdir/shopCertificateAuthority/ca /ca
fabric-ca-server start
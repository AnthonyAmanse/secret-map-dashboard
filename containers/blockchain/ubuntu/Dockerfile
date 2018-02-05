FROM ubuntu:16.04

COPY ./configtxgen /workdir/
COPY ./configtx.yaml /workdir/
COPY ./cryptogen /workdir/
COPY ./crypto-config.yaml /workdir/
COPY ./generate-certs.sh /workdir/
COPY ./generate-cfgtx.sh /workdir/
COPY ./blockchainNetwork /workdir/blockchainNetwork/

RUN mkdir /workdir/orderer
RUN mkdir /workdir/shopPeer
RUN mkdir /workdir/fitcoinPeer
RUN mkdir /workdir/shopBackend
RUN mkdir /workdir/fitcoinBackend
RUN mkdir /workdir/shopCertificateAuthority
RUN mkdir /workdir/fitcoinCertificateAuthority


ENV FABRIC_CFG_PATH /workdir
# RUN mkdir /shared/cli
# RUN mkdir /shared/cli/peers
# RUN mkdir /shared/ordererOrganizations
# RUN mkdir /shared/peerOrganizations

WORKDIR /workdir

CMD ./generate-certs.sh
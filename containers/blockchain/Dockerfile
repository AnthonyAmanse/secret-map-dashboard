FROM ubuntu:16.04

COPY ./configtxgen /shared/
COPY ./configtx.yaml /shared/
COPY ./cryptogen /shared/
COPY ./crypto-config.yaml /shared/
COPY ./generate-certs.sh /shared/
COPY ./generate-cfgtx.sh /shared/

RUN mkdir /shared/cli
RUN mkdir /shared/cli/peers
RUN mkdir /shared/ordererOrganizations
RUN mkdir /shared/peerOrganizations

WORKDIR /shared

CMD ./shared/generate-certs.sh
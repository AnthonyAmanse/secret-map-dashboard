FROM docker.io/hyperledger/fabric-orderer:x86_64-1.0.2

# RUN mkdir /orderer
# COPY crypto /orderer/crypto

# below is new

COPY ./custom-entrypoint.sh /orderer/

ENTRYPOINT [ "./custom-entrypoint.sh" ]
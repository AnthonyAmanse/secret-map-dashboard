FROM docker.io/hyperledger/fabric-peer:x86_64-1.0.2

# RUN mkdir /peer
# COPY crypto /peer/crypto

# below is new

COPY ./custom-entrypoint.sh /peer/

ENTRYPOINT [ "./custom-entrypoint.sh" ]

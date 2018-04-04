```
cd containers/blockchain
export FABRIC_CFG_PATH=$(pwd)
./generate-certs.sh

export DOCKERHUB_USERNAME=<your-dockerhub-username>

docker build -t $DOCKERHUB_USERNAME/kubecon-orderer-peer:latest orderer/
docker build -t $DOCKERHUB_USERNAME/kubecon-shop-peer:latest shopPeer/
docker build -t $DOCKERHUB_USERNAME/kubecon-fitcoin-peer:latest fitcoinPeer/
docker build -t $DOCKERHUB_USERNAME/kubecon-shop-ca:latest shopCertificateAuthority/
docker build -t $DOCKERHUB_USERNAME/kubecon-fitcoin-ca:latest fitcoinCertificateAuthority/
docker build -t $DOCKERHUB_USERNAME/kubecon-blockchain-setup:latest blockchainNetwork/

docker push $DOCKERHUB_USERNAME/kubecon-orderer-peer:latest
docker push $DOCKERHUB_USERNAME/kubecon-shop-peer:latest
docker push $DOCKERHUB_USERNAME/kubecon-fitcoin-peer:latest
docker push $DOCKERHUB_USERNAME/kubecon-shop-ca:latest
docker push $DOCKERHUB_USERNAME/kubecon-fitcoin-ca:latest
docker push $DOCKERHUB_USERNAME/kubecon-blockchain-setup:latest
```

THEN edit yaml files in here to use your images

Encode `config.json` and `channel.tx`
```

cat configuration/config.json | base64

cat configuration/channel.tx | base64
```

Change directory

cd kube-configs

Create secrets

kubectl create -f secrets.yaml

kubectl apply -f shop-ca.yaml
kubectl apply -f fitcoin-ca.yaml

kubectl apply -f ca-datastore.yaml
kubectl apply -f fitcoin-statedb.yaml
kubectl apply -f shop-statedb.yaml

kubectl apply -f orderer0.yaml

kubectl apply -f shop-peer.yaml
kubectl apply -f fitcoin-peer.yaml

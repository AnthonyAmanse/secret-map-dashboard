
```
git clone https://github.com/IBM/secret-map-dashboard
cd containers/blockchain
export FABRIC_CFG_PATH=$(pwd)
./generate-certs.sh

export DOCKERHUB_USERNAME=<your-dockerhub-username>

docker build -t $DOCKERHUB_USERNAME/orderer-peer:latest orderer/
docker build -t $DOCKERHUB_USERNAME/shop-peer:latest shopPeer/
docker build -t $DOCKERHUB_USERNAME/fitcoin-peer:latest fitcoinPeer/
docker build -t $DOCKERHUB_USERNAME/shop-ca:latest shopCertificateAuthority/
docker build -t $DOCKERHUB_USERNAME/fitcoin-ca:latest fitcoinCertificateAuthority/
docker build -t $DOCKERHUB_USERNAME/blockchain-setup:latest blockchainNetwork/
docker build -t $DOCKERHUB_USERNAME/fitcoin-backend:latest fitcoinBackend/
docker build -t $DOCKERHUB_USERNAME/shop-backend:latest shopBackend/

docker push $DOCKERHUB_USERNAME/orderer-peer:latest
docker push $DOCKERHUB_USERNAME/shop-peer:latest
docker push $DOCKERHUB_USERNAME/fitcoin-peer:latest
docker push $DOCKERHUB_USERNAME/shop-ca:latest
docker push $DOCKERHUB_USERNAME/fitcoin-ca:latest
docker push $DOCKERHUB_USERNAME/blockchain-setup:latest
docker push $DOCKERHUB_USERNAME/fitcoin-backend:latest
docker push $DOCKERHUB_USERNAME/shop-backend:latest
```

**THEN edit yaml files in the kube-deployment to use your images**


* Encode `config.json` and `channel.tx`
```
cat configuration/config.json | base64

cat configuration/channel.tx | base64

```

Put the values in configuration/secrets.yaml
```
apiVersion: v1
kind: Secret
metadata:
  name: secret-files
data:
  config.json: ''
  channel.tx: ''
```


* Change directory

```
cd kube-deployment
```

* Create secrets

```
kubectl create secrets.yaml
```

* Create peer-base-env.yaml

```
kubectl apply -f peer-base-env.yaml
```

* Create redis, ca, couchdb, rabbitmq, and orderer

```
kubectl apply -f redis.yaml
kubectl apply -f shop-ca.yaml
kubectl apply -f fitcoin-ca.yaml

Wait for the Pods to run

kubectl apply -f couchdb0.yaml
kubectl apply -f couchdb1.yaml

Wait for the Pods to run

kubectl apply -f rabbitmq.yaml
kubectl apply -f orderer0.yaml

Wait for the Pods to run
```

* Create peer

```
kubectl apply -f shop-peer.yaml
kubectl apply -f fitcoin-peer.yaml

Wait for the Pods to run
```

* Create blockchain-setup

```
kubectl apply -f blockchain-setup.yaml
```
#!/bin/bash

CERTIFICATE_PERIOD=3650
POD_IDENTITY_SERVICE_NAME=pod-identity-webhook
POD_IDENTITY_SECRET_NAME=pod-identity-webhook
POD_IDENTITY_SERVICE_NAMESPACE=kube-system

rm -rf certs
mkdir -p certs

# Create certificate for pod-identity-webhook
openssl req \
        -x509 \
        -newkey rsa:4096 \
        -keyout certs/tls.key \
        -out certs/tls.crt \
        -days $CERTIFICATE_PERIOD -nodes -subj "/CN=$POD_IDENTITY_SERVICE_NAME.$POD_IDENTITY_SERVICE_NAMESPACE.svc"

# Create secret for pod-identity-webhook to get certificate
kubectl create secret generic $POD_IDENTITY_SECRET_NAME \
        --from-file=./certs/tls.crt \
        --from-file=./certs/tls.key \
        --namespace=$POD_IDENTITY_SERVICE_NAMESPACEg
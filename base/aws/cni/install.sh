#!/bin/bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-vpc-cni \
    --namespace kube-system \
    --values values.yaml \
    eks/aws-vpc-cni

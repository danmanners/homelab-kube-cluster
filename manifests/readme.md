# Manifests

This directory is broken into three main directories:

1. [Bootstrapping - Cloud](bootstrapping-cloud/)
1. [Bootstrapping - On-Prem](bootstrapping-onprem/)
2. [Services and Applications](workloads/)

## Bootstrapping

This directory homes the raw requirements to get the cluster up and operational. This includes (currently)

1. [Cilium](bootstrapping-onprem/01-cilium/)
2. [MetalLB](bootstrapping-onprem/02-metallb/)
3. [Cert-Manager](bootstrapping-onprem/03-cert-manager/)
4. [External-DNS](bootstrapping-onprem/04-external-dns/)
5. [Traefik Proxy](bootstrapping-onprem/05-traefik/)
6. [ArgoCD](bootstrapping-onprem/06-argocd/)
7. [The ArgoCD Project Manifests to self-update](07-bootstrapping-argoprojects/)

## Services and Applications

This directory homes the services and applications running in my cluster. Not everything in this directory is currently used, and fully deprecated directories have been entirely removed.
